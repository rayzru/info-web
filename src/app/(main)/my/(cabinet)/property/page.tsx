"use client";

import { useState } from "react";
import {
  AlertCircle,
  Building2,
  Car,
  Check,
  Home,
  Loader2,
  ParkingCircle,
  Plus,
  Store,
  X,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

import { api } from "~/trpc/react";
import {
  ClaimDocumentUploader,
  type UploadedDocument,
} from "~/components/claim-document-uploader";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Textarea } from "~/components/ui/textarea";
import { UserPill } from "~/components/user-pill";
import { cn } from "~/lib/utils";
import { PageHeader } from "~/components/page-header";
import { ScrollArea } from "~/components/ui/scroll-area";

// ============ Constants ============

const STATUS_LABELS: Record<string, string> = {
  pending: "Ожидает",
  review: "На рассмотрении",
  approved: "Одобрено",
  rejected: "Отклонено",
  documents_requested: "Запрос документов",
};

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-500",
  review: "bg-blue-500",
  approved: "bg-green-500",
  rejected: "bg-red-500",
  documents_requested: "bg-orange-500",
};

const ROLE_LABELS: Record<string, string> = {
  ApartmentOwner: "Собственник",
  ApartmentResident: "Проживающий",
  ParkingOwner: "Собственник",
  ParkingResident: "Арендатор",
};

// ============ Types ============

type PropertyItem = {
  id: string;
  type: "apartment" | "parking";
  label: string;
  role: string;
  latestStatus: string;
  isConfirmed: boolean;
  hasPendingTenantClaims?: boolean;
};

type ClaimType = "apartment" | "parking";

interface Building {
  id: string;
  number: number | null;
  title: string | null;
  liter: string | null;
  entrances: {
    id: string;
    entranceNumber: number;
    floors: {
      id: string;
      floorNumber: number;
      apartments: {
        id: string;
        number: string;
        type: string;
      }[];
    }[];
  }[];
  parkings: {
    id: string;
    name: string;
    floors: {
      id: string;
      floorNumber: number;
      spots: {
        id: string;
        number: string;
        type: string;
      }[];
    }[];
  }[];
}

// ============ Helpers ============

function formatDate(date: Date | string | null): string {
  if (!date) return "";
  const d = new Date(date);
  return d.toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ============ Main Component ============

export default function PropertyPage() {
  const utils = api.useUtils();
  const { data: session } = useSession();
  const currentUserId = session?.user?.id;

  // Data fetching
  const { data: myProperties } = api.claims.owner.myProperties.useQuery();
  const { data: myClaims, isLoading: claimsLoading } = api.claims.my.useQuery();
  const { data: pendingTenantClaims } = api.claims.owner.pendingTenantClaims.useQuery();
  const { data: buildings } = api.claims.availableProperties.useQuery();

  // Dialog states
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<PropertyItem | null>(null);
  const [propertyToRevoke, setPropertyToRevoke] = useState<PropertyItem | null>(null);
  const [claimToReview, setClaimToReview] = useState<{
    id: string;
    action: "approve" | "reject";
    userName: string;
    propertyLabel: string;
  } | null>(null);
  const [rejectComment, setRejectComment] = useState("");

  // Mutations
  const revokeMutation = api.claims.revokeMyProperty.useMutation({
    onSuccess: () => {
      utils.claims.owner.myProperties.invalidate();
      utils.claims.my.invalidate();
      setPropertyToRevoke(null);
      setSelectedProperty(null);
      toast.success("Права отозваны");
    },
    onError: (error) => {
      toast.error("Не удалось отозвать права", { description: error.message });
    },
  });

  const reviewTenantMutation = api.claims.owner.reviewTenantClaim.useMutation({
    onSuccess: (_data, variables) => {
      utils.claims.owner.pendingTenantClaims.invalidate();
      utils.claims.owner.myProperties.invalidate();
      utils.claims.owner.propertyHistory.invalidate();
      setClaimToReview(null);
      setRejectComment("");
      toast.success(
        variables.status === "approved" ? "Заявка подтверждена" : "Заявка отклонена"
      );
    },
    onError: (error) => {
      toast.error("Не удалось обработать заявку", { description: error.message });
    },
  });

  const cancelClaimMutation = api.claims.cancel.useMutation({
    onSuccess: () => {
      utils.claims.my.invalidate();
      toast.success("Заявка отменена");
      setSelectedProperty(null);
    },
    onError: (error) => {
      toast.error("Не удалось отменить заявку", { description: error.message });
    },
  });

  // Build properties list
  const confirmedApartmentIds = new Set(
    myProperties?.apartments?.map((a) => a.apartment?.id) ?? []
  );
  const confirmedParkingIds = new Set(
    myProperties?.parkingSpots?.map((p) => p.parkingSpot?.id) ?? []
  );

  const propertyMap = new Map<string, PropertyItem>();

  myClaims?.forEach((claim) => {
    if (claim.apartment) {
      const key = `apartment-${claim.apartment.id}`;
      const existing = propertyMap.get(key);
      if (
        !existing ||
        claim.status === "approved" ||
        (claim.status === "pending" && existing.latestStatus !== "approved")
      ) {
        propertyMap.set(key, {
          id: claim.apartment.id,
          type: "apartment",
          label: `Квартира ${claim.apartment.number}, строение ${claim.apartment.floor?.entrance?.building?.number}`,
          role: claim.claimedRole,
          latestStatus: claim.status,
          isConfirmed: confirmedApartmentIds.has(claim.apartment.id),
          hasPendingTenantClaims: pendingTenantClaims?.some(
            (c) => c.apartmentId === claim.apartment?.id
          ),
        });
      }
    } else if (claim.parkingSpot) {
      const key = `parking-${claim.parkingSpot.id}`;
      const existing = propertyMap.get(key);
      if (
        !existing ||
        claim.status === "approved" ||
        (claim.status === "pending" && existing.latestStatus !== "approved")
      ) {
        propertyMap.set(key, {
          id: claim.parkingSpot.id,
          type: "parking",
          label: `Машиноместо ${claim.parkingSpot.number}, этаж ${claim.parkingSpot.floor?.floorNumber}, строение ${claim.parkingSpot.floor?.parking?.building?.number}`,
          role: claim.claimedRole,
          latestStatus: claim.status,
          isConfirmed: confirmedParkingIds.has(claim.parkingSpot.id),
          hasPendingTenantClaims: pendingTenantClaims?.some(
            (c) => c.parkingSpotId === claim.parkingSpot?.id
          ),
        });
      }
    }
  });

  const allProperties = Array.from(propertyMap.values());

  // Auto-select first property if none selected
  const effectiveSelected = selectedProperty ?? allProperties[0] ?? null;

  const isOwner =
    effectiveSelected?.role === "ApartmentOwner" ||
    effectiveSelected?.role === "ParkingOwner";

  return (
    <div className="space-y-6">
      <PageHeader
        title="Недвижимость"
        description="Управление вашими объектами"
      >
        <Button onClick={() => setShowAddDialog(true)} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Добавить
        </Button>
      </PageHeader>

      {/* Main Layout - Sidebar + Content */}
      {claimsLoading ? (
        <div className="text-sm text-muted-foreground py-8 text-center">
          Загрузка...
        </div>
      ) : allProperties.length === 0 ? (
        <div className="rounded-xl border border-dashed bg-muted/30 p-12 text-center">
          <Building2 className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
          <p className="text-muted-foreground mb-4">У вас пока нет объектов</p>
          <Button onClick={() => setShowAddDialog(true)} variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Добавить первый объект
          </Button>
        </div>
      ) : (
        <div className="flex rounded-xl border overflow-hidden bg-background">
          {/* Sidebar */}
          <aside className="w-72 shrink-0 border-r bg-muted/30">
            <ScrollArea className="h-[500px]">
              <div className="p-2">
                {allProperties.map((property) => {
                  const isSelected =
                    effectiveSelected?.id === property.id &&
                    effectiveSelected?.type === property.type;

                  return (
                    <button
                      key={`${property.type}-${property.id}`}
                      className={cn(
                        "w-full flex items-start gap-3 p-3 rounded-lg text-left transition-all mb-1",
                        isSelected
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-muted"
                      )}
                      onClick={() => setSelectedProperty(property)}
                    >
                      {property.type === "apartment" ? (
                        <Home className={cn(
                          "h-4 w-4 mt-0.5 shrink-0",
                          isSelected ? "text-primary-foreground" : "text-muted-foreground"
                        )} />
                      ) : (
                        <Car className={cn(
                          "h-4 w-4 mt-0.5 shrink-0",
                          isSelected ? "text-primary-foreground" : "text-muted-foreground"
                        )} />
                      )}

                      <div className="flex-1 min-w-0">
                        <div className={cn(
                          "text-sm font-medium truncate",
                          isSelected && "text-primary-foreground"
                        )}>
                          {property.label}
                        </div>
                        <div className={cn(
                          "text-xs mt-0.5",
                          isSelected ? "text-primary-foreground/70" : "text-muted-foreground"
                        )}>
                          {ROLE_LABELS[property.role]}
                        </div>
                      </div>

                      {/* Status indicator */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        {property.hasPendingTenantClaims && (
                          <AlertCircle className={cn(
                            "h-3.5 w-3.5",
                            isSelected ? "text-yellow-300" : "text-yellow-500"
                          )} />
                        )}
                        <span className={cn(
                          "w-2 h-2 rounded-full",
                          STATUS_COLORS[property.latestStatus] ?? "bg-gray-400"
                        )} />
                      </div>
                    </button>
                  );
                })}
              </div>
            </ScrollArea>
          </aside>

          {/* Content */}
          <main className="flex-1 p-6">
            {effectiveSelected ? (
              <div>
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-3">
                    {effectiveSelected.type === "apartment" ? (
                      <div className="rounded-lg bg-primary/10 p-2">
                        <Home className="h-5 w-5 text-primary" />
                      </div>
                    ) : (
                      <div className="rounded-lg bg-blue-500/10 p-2">
                        <Car className="h-5 w-5 text-blue-500" />
                      </div>
                    )}
                    <div>
                      <h2 className="text-lg font-semibold">{effectiveSelected.label}</h2>
                      <p className="text-sm text-muted-foreground">
                        {ROLE_LABELS[effectiveSelected.role]}
                      </p>
                    </div>
                  </div>
                  <span className={cn(
                    "text-xs px-2.5 py-1 rounded-full font-medium",
                    effectiveSelected.latestStatus === "approved" && "bg-green-100 text-green-700",
                    effectiveSelected.latestStatus === "rejected" && "bg-red-100 text-red-700",
                    effectiveSelected.latestStatus === "pending" && "bg-yellow-100 text-yellow-700"
                  )}>
                    {STATUS_LABELS[effectiveSelected.latestStatus]}
                  </span>
                </div>

                {/* Timeline */}
                <PropertyTimeline
                  propertyType={effectiveSelected.type}
                  propertyId={effectiveSelected.id}
                  currentUserId={currentUserId}
                  isConfirmed={effectiveSelected.isConfirmed}
                  isOwner={isOwner}
                  onRevoke={() => setPropertyToRevoke(effectiveSelected)}
                  onCancelClaim={(claimId) => cancelClaimMutation.mutate({ claimId })}
                  onReviewTenantClaim={(claimId, action, userName) =>
                    setClaimToReview({
                      id: claimId,
                      action,
                      userName,
                      propertyLabel: effectiveSelected.label,
                    })
                  }
                />
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                Выберите объект слева
              </div>
            )}
          </main>
        </div>
      )}

      {/* Add Property Dialog */}
      <AddPropertyDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        buildings={buildings ?? []}
        existingClaims={myClaims ?? []}
      />

      {/* Revoke Confirmation Dialog */}
      <Dialog open={!!propertyToRevoke} onOpenChange={() => setPropertyToRevoke(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Отозвать права</DialogTitle>
            <DialogDescription>
              Отозвать права на <strong>{propertyToRevoke?.label}</strong>?
              <br /><br />
              Если нет других объектов с этой ролью, роль будет удалена.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPropertyToRevoke(null)}>
              Отмена
            </Button>
            <Button
              variant="destructive"
              onClick={() =>
                propertyToRevoke &&
                revokeMutation.mutate({
                  propertyType: propertyToRevoke.type,
                  propertyId: propertyToRevoke.id,
                })
              }
              disabled={revokeMutation.isPending}
            >
              Отозвать
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Review Tenant Claim Dialog */}
      <Dialog
        open={!!claimToReview}
        onOpenChange={() => {
          setClaimToReview(null);
          setRejectComment("");
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {claimToReview?.action === "approve"
                ? "Подтвердить заявку"
                : "Отклонить заявку"}
            </DialogTitle>
            <DialogDescription>
              {claimToReview?.action === "approve" ? (
                <>
                  Подтвердить права <strong>{claimToReview?.userName}</strong> на{" "}
                  <strong>{claimToReview?.propertyLabel}</strong>?
                </>
              ) : (
                <>
                  Отклонить заявку от <strong>{claimToReview?.userName}</strong>?
                </>
              )}
            </DialogDescription>
          </DialogHeader>

          {claimToReview?.action === "reject" && (
            <Textarea
              placeholder="Причина (необязательно)"
              value={rejectComment}
              onChange={(e) => setRejectComment(e.target.value)}
            />
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setClaimToReview(null);
                setRejectComment("");
              }}
            >
              Отмена
            </Button>
            <Button
              variant={claimToReview?.action === "approve" ? "default" : "destructive"}
              onClick={() =>
                claimToReview &&
                reviewTenantMutation.mutate({
                  claimId: claimToReview.id,
                  status: claimToReview.action === "approve" ? "approved" : "rejected",
                  comment: claimToReview.action === "reject" ? rejectComment : undefined,
                })
              }
              disabled={reviewTenantMutation.isPending}
            >
              {claimToReview?.action === "approve" ? "Подтвердить" : "Отклонить"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ============ Property Timeline Component ============

type TimelineEvent = {
  id: string;
  claimId: string;
  date: Date | string;
  status: string;
  currentClaimStatus: string;
  actorName: string;
  actorId?: string;
  actorIsAdmin: boolean;
  comment?: string | null;
  isSubmission: boolean;
  claimUserId: string;
  claimedRole: string;
};

function PropertyTimeline({
  propertyType,
  propertyId,
  currentUserId,
  isConfirmed,
  isOwner,
  onRevoke,
  onCancelClaim,
  onReviewTenantClaim,
}: {
  propertyType: "apartment" | "parking";
  propertyId: string;
  currentUserId?: string;
  isConfirmed: boolean;
  isOwner: boolean;
  onRevoke: () => void;
  onCancelClaim: (claimId: string) => void;
  onReviewTenantClaim: (
    claimId: string,
    action: "approve" | "reject",
    userName: string
  ) => void;
}) {
  const { data: claims, isLoading } = api.claims.owner.propertyHistory.useQuery({
    propertyType,
    propertyId,
  });

  if (isLoading) {
    return <div className="text-sm text-muted-foreground py-4">Загрузка...</div>;
  }

  if (!claims || claims.length === 0) {
    return (
      <div className="text-sm text-muted-foreground py-8 text-center">
        Нет истории заявок
      </div>
    );
  }

  const timelineEvents: TimelineEvent[] = [];

  claims.forEach((claim) => {
    const claimUserName = claim.user?.name ?? "Пользователь";

    timelineEvents.push({
      id: `${claim.id}-submit`,
      claimId: claim.id,
      date: claim.createdAt,
      status: "pending",
      currentClaimStatus: claim.status,
      actorName: claimUserName,
      actorId: claim.userId,
      actorIsAdmin: false,
      comment: claim.userComment,
      isSubmission: true,
      claimUserId: claim.userId,
      claimedRole: claim.claimedRole,
    });

    claim.history?.forEach((historyEntry) => {
      const changedByName = historyEntry.changedByUser?.name ?? "Система";
      const actorIsAdmin = historyEntry.changedBy !== claim.userId;

      timelineEvents.push({
        id: historyEntry.id,
        claimId: claim.id,
        date: historyEntry.createdAt,
        status: historyEntry.toStatus,
        currentClaimStatus: claim.status,
        actorName: changedByName,
        actorId: historyEntry.changedBy ?? undefined,
        actorIsAdmin,
        comment: historyEntry.resolutionText,
        isSubmission: false,
        claimUserId: claim.userId,
        claimedRole: claim.claimedRole,
      });
    });
  });

  // Sort chronologically (oldest first for proper timeline flow)
  timelineEvents.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const hasApprovedClaim = claims.some(
    (c) => c.userId === currentUserId && c.status === "approved"
  );
  const canRevoke = hasApprovedClaim && isConfirmed;

  return (
    <div className="relative pl-7">
      <div className="flex flex-col gap-10">
        {timelineEvents.map((event, index) => {
          const isOwnAction = event.actorId === currentUserId;
          const isOwnClaim = event.claimUserId === currentUserId;
          const isLast = index === timelineEvents.length - 1;

          const showRevokeButton =
            canRevoke &&
            event.currentClaimStatus === "approved" &&
            event.status === "approved" &&
            isOwnClaim &&
            isLast;

          const showCancelOwnButton =
            event.currentClaimStatus === "pending" &&
            event.isSubmission &&
            isOwnClaim &&
            isLast;

          const isTenantClaim =
            event.claimedRole === "ApartmentResident" ||
            event.claimedRole === "ParkingResident";
          const showOwnerReviewButtons =
            isOwner &&
            event.currentClaimStatus === "pending" &&
            event.isSubmission &&
            !isOwnClaim &&
            isTenantClaim;

          const isCurrent = isLast;
          const isPast = !isLast;

          return (
            <div key={event.id} className="relative flex gap-4">
              {/* Vertical line segment - от текущей точки до следующей */}
              {!isLast && timelineEvents.length > 1 && (
                <div
                  className="absolute left-[-20px] top-[10px] w-px bg-border"
                  style={{ height: 'calc(100% + 40px - 10px)' }}
                />
              )}

              {/* Status dot - по центру первой строки */}
              <div
                className={cn(
                  "absolute left-[-27px] top-[3px] w-[14px] h-[14px] rounded-full z-10",
                  isCurrent
                    ? STATUS_COLORS[event.status] ?? "bg-gray-400"
                    : isPast && event.status === "approved"
                      ? "bg-green-500"
                      : isPast && event.status === "rejected"
                        ? "bg-red-500"
                        : "bg-muted-foreground/30"
                )}
              />

              {/* Content */}
              <div className="flex-1 min-w-0">
                {/* Status label */}
                <div className="font-medium text-sm leading-5">
                  {event.isSubmission
                    ? "Подана заявка"
                    : STATUS_LABELS[event.status] ?? event.status}
                </div>

                {/* Date */}
                <div className="text-xs text-muted-foreground mt-1">
                  {formatDate(event.date)}
                </div>

                {/* Actor */}
                <div className="mt-3">
                  <UserPill
                    name={event.actorName}
                    isAdmin={event.actorIsAdmin}
                    isCurrentUser={isOwnAction}
                  />
                </div>

                {/* Comment */}
                {event.comment && (
                  <p className="text-sm text-muted-foreground mt-3 border-l-2 border-muted pl-3">
                    {event.comment}
                  </p>
                )}

                {/* Action buttons */}
                {(showRevokeButton || showCancelOwnButton || showOwnerReviewButtons) && (
                  <div className="flex items-center gap-2 mt-4">
                    {showRevokeButton && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-destructive hover:text-destructive h-8"
                        onClick={onRevoke}
                      >
                        <X className="h-3 w-3 mr-1.5" />
                        Отозвать права
                      </Button>
                    )}

                    {showCancelOwnButton && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8"
                        onClick={() => onCancelClaim(event.claimId)}
                      >
                        <X className="h-3 w-3 mr-1.5" />
                        Отменить заявку
                      </Button>
                    )}

                    {showOwnerReviewButtons && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-green-600 hover:text-green-700 hover:bg-green-50 h-8"
                          onClick={() =>
                            onReviewTenantClaim(event.claimId, "approve", event.actorName)
                          }
                        >
                          <Check className="h-3 w-3 mr-1.5" />
                          Подтвердить
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-destructive hover:text-destructive h-8"
                          onClick={() =>
                            onReviewTenantClaim(event.claimId, "reject", event.actorName)
                          }
                        >
                          <X className="h-3 w-3 mr-1.5" />
                          Отклонить
                        </Button>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============ Add Property Dialog Component ============

interface ExistingClaim {
  id: string;
  claimType: string;
  status: string;
  apartmentId: string | null;
  parkingSpotId: string | null;
}

function AddPropertyDialog({
  open,
  onOpenChange,
  buildings,
  existingClaims,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  buildings: Building[];
  existingClaims: ExistingClaim[];
}) {
  const utils = api.useUtils();

  const [step, setStep] = useState<"type" | "form">("type");
  const [claimType, setClaimType] = useState<ClaimType | null>(null);

  // Form state
  const [selectedBuildingId, setSelectedBuildingId] = useState("");
  const [selectedApartmentId, setSelectedApartmentId] = useState("");
  const [selectedParkingId, setSelectedParkingId] = useState("");
  const [selectedParkingFloorId, setSelectedParkingFloorId] = useState("");
  const [selectedParkingSpotId, setSelectedParkingSpotId] = useState("");
  const [role, setRole] = useState("");
  const [comment, setComment] = useState("");
  const [documents, setDocuments] = useState<UploadedDocument[]>([]);

  const addDocument = api.claims.addDocument.useMutation();

  const createClaim = api.claims.create.useMutation({
    onSuccess: async (claim) => {
      // Add documents to the created claim
      if (documents.length > 0 && claim?.id) {
        try {
          await Promise.all(
            documents.map((doc) =>
              addDocument.mutateAsync({
                claimId: claim.id,
                documentType: doc.documentType,
                fileUrl: doc.fileUrl,
                fileName: doc.fileName,
                fileSize: doc.fileSize,
                mimeType: doc.mimeType,
                thumbnailUrl: doc.thumbnailUrl,
              })
            )
          );
        } catch {
          // Documents failed but claim was created
          toast.success("Заявка отправлена", {
            description: "Заявка создана, но некоторые документы не были прикреплены",
          });
          utils.claims.my.invalidate();
          utils.claims.availableProperties.invalidate();
          handleClose();
          return;
        }
      }

      toast.success("Заявка отправлена", {
        description: "Ваша заявка будет рассмотрена администрацией",
      });
      utils.claims.my.invalidate();
      utils.claims.availableProperties.invalidate();
      handleClose();
    },
    onError: (error) => {
      toast.error("Ошибка", { description: error.message });
    },
  });

  const handleClose = () => {
    onOpenChange(false);
    setTimeout(() => {
      setStep("type");
      setClaimType(null);
      resetForm();
    }, 200);
  };

  const resetForm = () => {
    setSelectedBuildingId("");
    setSelectedApartmentId("");
    setSelectedParkingId("");
    setSelectedParkingFloorId("");
    setSelectedParkingSpotId("");
    setRole("");
    setComment("");
    setDocuments([]);
  };

  // Only show document upload for owner roles
  const isOwnerRole = role === "ApartmentOwner" || role === "ParkingOwner";

  const handleSelectType = (type: ClaimType) => {
    setClaimType(type);
    setStep("form");
  };

  const handleBack = () => {
    setStep("type");
    setClaimType(null);
    resetForm();
  };

  const hasExistingClaim = (type: "apartment" | "parking", id: string) => {
    return existingClaims.some(
      (claim) =>
        claim.status === "pending" &&
        ((type === "apartment" && claim.apartmentId === id) ||
          (type === "parking" && claim.parkingSpotId === id))
    );
  };

  const handleSubmit = () => {
    if (!claimType || !role) return;

    const claimedRole = role as
      | "ApartmentOwner"
      | "ApartmentResident"
      | "ParkingOwner"
      | "ParkingResident";

    createClaim.mutate({
      claimType,
      claimedRole,
      apartmentId: claimType === "apartment" ? selectedApartmentId : undefined,
      parkingSpotId: claimType === "parking" ? selectedParkingSpotId : undefined,
      userComment: comment || undefined,
    });
  };

  const selectedBuilding = buildings.find((b) => b.id === selectedBuildingId);
  const selectedParking = selectedBuilding?.parkings.find(
    (p) => p.id === selectedParkingId
  );
  const selectedParkingFloor = selectedParking?.floors.find(
    (f) => f.id === selectedParkingFloorId
  );

  const canSubmit =
    (claimType === "apartment" && selectedApartmentId && role) ||
    (claimType === "parking" && selectedParkingSpotId && role);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {step === "type"
              ? "Добавить объект"
              : claimType === "apartment"
                ? "Заявка на квартиру"
                : "Заявка на парковку"}
          </DialogTitle>
          <DialogDescription>
            {step === "type"
              ? "Выберите тип объекта"
              : "Заполните данные для подачи заявки"}
          </DialogDescription>
        </DialogHeader>

        {step === "type" && (
          <div className="grid gap-3 py-4">
            <button
              className="flex items-center gap-4 p-4 rounded-lg border hover:border-primary/50 hover:bg-primary/5 transition-all text-left"
              onClick={() => handleSelectType("apartment")}
            >
              <div className="rounded-lg bg-primary/10 p-3">
                <Home className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="font-medium">Квартира</div>
                <div className="text-sm text-muted-foreground">
                  Подать заявку на квартиру
                </div>
              </div>
            </button>

            <button
              className="flex items-center gap-4 p-4 rounded-lg border hover:border-primary/50 hover:bg-primary/5 transition-all text-left"
              onClick={() => handleSelectType("parking")}
            >
              <div className="rounded-lg bg-blue-500/10 p-3">
                <ParkingCircle className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <div className="font-medium">Парковка</div>
                <div className="text-sm text-muted-foreground">
                  Подать заявку на машиноместо
                </div>
              </div>
            </button>

            <button
              className="flex items-center gap-4 p-4 rounded-lg border opacity-50 cursor-not-allowed text-left"
              disabled
            >
              <div className="rounded-lg bg-muted p-3">
                <Store className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <div className="font-medium">Коммерция</div>
                <div className="text-sm text-muted-foreground">Скоро</div>
              </div>
            </button>
          </div>
        )}

        {step === "form" && claimType === "apartment" && (
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Строение</Label>
              <Select
                value={selectedBuildingId}
                onValueChange={(value) => {
                  setSelectedBuildingId(value);
                  setSelectedApartmentId("");
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Выберите строение" />
                </SelectTrigger>
                <SelectContent>
                  {buildings.map((building) => (
                    <SelectItem key={building.id} value={building.id}>
                      {building.title ?? `Строение ${building.number}`}
                      {building.liter && ` (${building.liter})`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedBuilding && (
              <div className="space-y-2">
                <Label>Квартира</Label>
                <Select
                  value={selectedApartmentId}
                  onValueChange={setSelectedApartmentId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите квартиру" />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedBuilding.entrances
                      .flatMap((entrance) =>
                        entrance.floors.flatMap((floor) =>
                          floor.apartments.map((apt) => ({
                            ...apt,
                            entranceNumber: entrance.entranceNumber,
                            floorNumber: floor.floorNumber,
                          }))
                        )
                      )
                      .sort((a, b) => parseInt(a.number) - parseInt(b.number))
                      .map((apt) => (
                        <SelectItem
                          key={apt.id}
                          value={apt.id}
                          disabled={hasExistingClaim("apartment", apt.id)}
                        >
                          Квартира {apt.number}
                          {hasExistingClaim("apartment", apt.id) && " — заявка подана"}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {selectedApartmentId && (
              <div className="space-y-2">
                <Label>Ваша роль</Label>
                <Select value={role} onValueChange={setRole}>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите вашу роль" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ApartmentOwner">Собственник</SelectItem>
                    <SelectItem value="ApartmentResident">Проживающий</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {role && (
              <div className="space-y-2">
                <Label>Комментарий (необязательно)</Label>
                <Textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Дополнительная информация"
                  rows={2}
                />
              </div>
            )}

            {/* Document upload - only for owners */}
            {isOwnerRole && (
              <ClaimDocumentUploader
                documents={documents}
                onChange={setDocuments}
                disabled={createClaim.isPending}
              />
            )}
          </div>
        )}

        {step === "form" && claimType === "parking" && (
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Строение</Label>
              <Select
                value={selectedBuildingId}
                onValueChange={(value) => {
                  setSelectedBuildingId(value);
                  const building = buildings.find((b) => b.id === value);
                  if (building?.parkings.length === 1) {
                    const parking = building.parkings[0]!;
                    setSelectedParkingId(parking.id);
                    if (parking.floors.length === 1) {
                      setSelectedParkingFloorId(parking.floors[0]!.id);
                    } else {
                      setSelectedParkingFloorId("");
                    }
                  } else {
                    setSelectedParkingId("");
                    setSelectedParkingFloorId("");
                  }
                  setSelectedParkingSpotId("");
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Выберите строение" />
                </SelectTrigger>
                <SelectContent>
                  {buildings
                    .filter((b) => b.parkings.length > 0)
                    .map((building) => (
                      <SelectItem key={building.id} value={building.id}>
                        {building.title ?? `Строение ${building.number}`}
                        {building.liter && ` (${building.liter})`}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            {selectedParking && selectedParking.floors.length > 1 && (
              <div className="space-y-2">
                <Label>Уровень</Label>
                <Select
                  value={selectedParkingFloorId}
                  onValueChange={(value) => {
                    setSelectedParkingFloorId(value);
                    setSelectedParkingSpotId("");
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите уровень" />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedParking.floors.map((floor) => (
                      <SelectItem key={floor.id} value={floor.id}>
                        Уровень {floor.floorNumber}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {selectedParkingFloor && (
              <div className="space-y-2">
                <Label>Парковочное место</Label>
                <Select
                  value={selectedParkingSpotId}
                  onValueChange={setSelectedParkingSpotId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите место" />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedParkingFloor.spots.map((spot) => (
                      <SelectItem
                        key={spot.id}
                        value={spot.id}
                        disabled={hasExistingClaim("parking", spot.id)}
                      >
                        Место {spot.number}
                        {hasExistingClaim("parking", spot.id) && " — заявка подана"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {selectedParkingSpotId && (
              <div className="space-y-2">
                <Label>Ваша роль</Label>
                <Select value={role} onValueChange={setRole}>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите вашу роль" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ParkingOwner">Собственник</SelectItem>
                    <SelectItem value="ParkingResident">Арендатор</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {role && (
              <div className="space-y-2">
                <Label>Комментарий (необязательно)</Label>
                <Textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Дополнительная информация"
                  rows={2}
                />
              </div>
            )}

            {/* Document upload - only for owners */}
            {isOwnerRole && (
              <ClaimDocumentUploader
                documents={documents}
                onChange={setDocuments}
                disabled={createClaim.isPending}
              />
            )}
          </div>
        )}

        <DialogFooter>
          {step === "form" && (
            <Button variant="outline" onClick={handleBack}>
              Назад
            </Button>
          )}
          {step === "type" && (
            <Button variant="outline" onClick={handleClose}>
              Отмена
            </Button>
          )}
          {step === "form" && (
            <Button onClick={handleSubmit} disabled={!canSubmit || createClaim.isPending}>
              {createClaim.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Отправить заявку
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
