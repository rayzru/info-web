"use client";

import { useState } from "react";
import {
  Check,
  X,
  Home,
  Car,
  History,
  AlertCircle,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { ScrollArea } from "~/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Textarea } from "~/components/ui/textarea";
import { UserPill } from "~/components/user-pill";
import { cn } from "~/lib/utils";

const STATUS_LABELS: Record<string, string> = {
  pending: "Ожидает",
  review: "На рассмотрении",
  approved: "Одобрено",
  rejected: "Отклонено",
  documents_requested: "Запрос документов",
};

const STATUS_DOT_COLORS: Record<string, string> = {
  pending: "bg-yellow-500",
  review: "bg-blue-500",
  approved: "bg-green-500",
  rejected: "bg-red-500",
  documents_requested: "bg-orange-500",
};

const STATUS_BADGE_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  review: "bg-blue-100 text-blue-800",
  approved: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
  documents_requested: "bg-orange-100 text-orange-800",
};

const ROLE_LABELS: Record<string, string> = {
  ApartmentOwner: "Собственник",
  ApartmentResident: "Проживающий",
  ParkingOwner: "Собственник",
  ParkingResident: "Арендатор",
};

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

type PropertyItem = {
  id: string;
  type: "apartment" | "parking";
  label: string;
  role: string;
  latestStatus: string;
  isConfirmed: boolean;
  hasPendingTenantClaims?: boolean;
};

export default function ClaimsPage() {
  const utils = api.useUtils();
  const { data: session } = useSession();
  const currentUserId = session?.user?.id;

  // Fetch user's confirmed properties (for ownership actions)
  const { data: myProperties } = api.claims.owner.myProperties.useQuery();

  // Fetch ALL user's claims (to show all objects with claims)
  const { data: myClaims, isLoading: claimsLoading } = api.claims.my.useQuery();

  // Fetch pending tenant claims
  const { data: pendingTenantClaims } =
    api.claims.owner.pendingTenantClaims.useQuery();

  // State
  const [selectedProperty, setSelectedProperty] = useState<PropertyItem | null>(
    null
  );
  const [propertyToRevoke, setPropertyToRevoke] = useState<PropertyItem | null>(
    null
  );
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
    },
  });

  const reviewTenantMutation = api.claims.owner.reviewTenantClaim.useMutation({
    onSuccess: () => {
      utils.claims.owner.pendingTenantClaims.invalidate();
      utils.claims.owner.myProperties.invalidate();
      utils.claims.owner.propertyHistory.invalidate();
      setClaimToReview(null);
      setRejectComment("");
    },
  });

  const cancelClaimMutation = api.claims.cancel.useMutation({
    onSuccess: () => {
      utils.claims.my.invalidate();
      utils.claims.owner.propertyHistory.invalidate();
    },
  });

  // Build properties list from ALL claims (not just confirmed)
  const confirmedApartmentIds = new Set(
    myProperties?.apartments?.map((a) => a.apartment?.id) ?? []
  );
  const confirmedParkingIds = new Set(
    myProperties?.parkingSpots?.map((p) => p.parkingSpot?.id) ?? []
  );

  // Group claims by property to get unique properties
  const propertyMap = new Map<string, PropertyItem>();

  myClaims?.forEach((claim) => {
    if (claim.apartment) {
      const key = `apartment-${claim.apartment.id}`;
      const existing = propertyMap.get(key);
      // Keep the one with latest/most relevant status
      if (
        !existing ||
        claim.status === "approved" ||
        (claim.status === "pending" && existing.latestStatus !== "approved")
      ) {
        propertyMap.set(key, {
          id: claim.apartment.id,
          type: "apartment",
          label: `Кв. ${claim.apartment.number}, стр. ${claim.apartment.floor?.entrance?.building?.number}`,
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
          label: `М/м ${claim.parkingSpot.number}, эт. ${claim.parkingSpot.floor?.floorNumber}, стр. ${claim.parkingSpot.floor?.parking?.building?.number}`,
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

  const isOwner =
    selectedProperty?.role === "ApartmentOwner" ||
    selectedProperty?.role === "ParkingOwner";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Заявки</h1>
        <p className="text-muted-foreground mt-1">
          Управление заявками на недвижимость
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Property Selector */}
        <div className="lg:col-span-1">
          <h2 className="text-sm font-medium text-muted-foreground mb-3">
            Объекты
          </h2>
          {claimsLoading ? (
            <div className="text-sm text-muted-foreground py-4">
              Загрузка...
            </div>
          ) : allProperties.length === 0 ? (
            <div className="text-sm text-muted-foreground py-4">
              Нет объектов с заявками
            </div>
          ) : (
            <ScrollArea className="h-[500px] pr-2">
              <div className="space-y-1">
                {allProperties.map((property) => (
                  <button
                    key={`${property.type}-${property.id}`}
                    className={cn(
                      "w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors",
                      selectedProperty?.id === property.id &&
                        selectedProperty?.type === property.type
                        ? "bg-primary/10"
                        : "hover:bg-muted"
                    )}
                    onClick={() => setSelectedProperty(property)}
                  >
                    {/* Icon */}
                    {property.type === "apartment" ? (
                      <Home className="h-4 w-4 text-muted-foreground shrink-0" />
                    ) : (
                      <Car className="h-4 w-4 text-muted-foreground shrink-0" />
                    )}

                    {/* Label */}
                    <div className="flex-1 min-w-0">
                      <div className="text-sm truncate">{property.label}</div>
                      <div className="text-xs text-muted-foreground">
                        {ROLE_LABELS[property.role]}
                      </div>
                    </div>

                    {/* Pending tenant claims indicator */}
                    {property.hasPendingTenantClaims && (
                      <AlertCircle className="h-4 w-4 text-yellow-500 shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>

        {/* Right Column - Timeline & Actions */}
        <div className="lg:col-span-2">
          <h2 className="text-sm font-medium text-muted-foreground mb-3">
            История
          </h2>
          {!selectedProperty ? (
            <div className="flex flex-col items-center justify-center h-[400px] text-muted-foreground">
              <History className="h-12 w-12 mb-4 opacity-20" />
              <p className="text-sm">Выберите объект слева</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Timeline */}
              <PropertyTimeline
                propertyType={selectedProperty.type}
                propertyId={selectedProperty.id}
                currentUserId={currentUserId}
                isConfirmed={selectedProperty.isConfirmed}
                isOwner={isOwner}
                onRevoke={() => setPropertyToRevoke(selectedProperty)}
                onCancelClaim={(claimId) => cancelClaimMutation.mutate({ claimId })}
                onReviewTenantClaim={(claimId, action, userName) =>
                  setClaimToReview({
                    id: claimId,
                    action,
                    userName,
                    propertyLabel: selectedProperty.label,
                  })
                }
              />
            </div>
          )}
        </div>
      </div>

      {/* Revoke Confirmation Dialog */}
      <Dialog
        open={!!propertyToRevoke}
        onOpenChange={() => setPropertyToRevoke(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Отозвать права</DialogTitle>
            <DialogDescription>
              Отозвать права на <strong>{propertyToRevoke?.label}</strong>?
              <br />
              <br />
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
              variant={
                claimToReview?.action === "approve" ? "default" : "destructive"
              }
              onClick={() =>
                claimToReview &&
                reviewTenantMutation.mutate({
                  claimId: claimToReview.id,
                  status:
                    claimToReview.action === "approve" ? "approved" : "rejected",
                  comment:
                    claimToReview.action === "reject"
                      ? rejectComment
                      : undefined,
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

// Timeline event type
type TimelineEvent = {
  id: string;
  claimId: string;
  date: Date | string;
  status: string;
  currentClaimStatus: string; // Current status of the claim (not the event status)
  actorName: string;
  actorId?: string;
  actorIsAdmin: boolean;
  comment?: string | null;
  isSubmission: boolean;
  claimUserId: string;
  claimedRole: string;
};

// Check if user has admin role (simplified check by name pattern or role)
function isAdminUser(userId: string | undefined, actorName: string): boolean {
  // Admin users typically have specific names or we detect by checking if actor !== claim owner
  // For now, we'll use a simple heuristic: if name contains "Admin" or is system action
  return actorName.toLowerCase().includes("admin") || actorName === "Система";
}

// Property Timeline Component
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
  onReviewTenantClaim: (claimId: string, action: "approve" | "reject", userName: string) => void;
}) {
  const { data: claims, isLoading } = api.claims.owner.propertyHistory.useQuery({
    propertyType,
    propertyId,
  });

  if (isLoading) {
    return (
      <div className="text-sm text-muted-foreground py-4">Загрузка...</div>
    );
  }

  if (!claims || claims.length === 0) {
    return (
      <div className="text-sm text-muted-foreground py-4">
        Нет истории заявок
      </div>
    );
  }

  // Build flat timeline from all claims and their history
  const timelineEvents: TimelineEvent[] = [];

  claims.forEach((claim) => {
    const claimUserName = claim.user?.name ?? "Пользователь";

    // Add initial submission event
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

    // Add history events (status changes)
    claim.history?.forEach((historyEntry) => {
      const changedByName = historyEntry.changedByUser?.name ?? "Система";
      // Actor is admin if they're not the claim owner
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

  // Sort by date descending (newest first)
  timelineEvents.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // Find if user has approved claim for revoke button
  const hasApprovedClaim = claims.some(
    (c) => c.userId === currentUserId && c.status === "approved"
  );
  const canRevoke = hasApprovedClaim && isConfirmed;

  return (
    <div className="relative ml-3">
      {/* Timeline line */}
      <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-border" />

      <div className="space-y-4 pl-6">
        {timelineEvents.map((event) => {
          const isOwnAction = event.actorId === currentUserId;
          const isOwnClaim = event.claimUserId === currentUserId;

          // Show revoke button for own approved claims
          const showRevokeButton =
            canRevoke &&
            event.currentClaimStatus === "approved" &&
            event.status === "approved" &&
            isOwnClaim;

          // Show cancel button for own pending claims
          const showCancelOwnButton =
            event.currentClaimStatus === "pending" &&
            event.isSubmission &&
            isOwnClaim;

          // Show approve/reject buttons for tenant claims on owner's property
          // (pending claims from others, if current user is owner)
          const isTenantClaim =
            event.claimedRole === "ApartmentResident" ||
            event.claimedRole === "ParkingResident";
          const showOwnerReviewButtons =
            isOwner &&
            event.currentClaimStatus === "pending" &&
            event.isSubmission &&
            !isOwnClaim &&
            isTenantClaim;

          return (
            <div key={event.id} className="relative">
              {/* Status dot - centered on the line */}
              <div
                className={cn(
                  "absolute -left-6 top-1 w-2.5 h-2.5 rounded-full -translate-x-1/2",
                  STATUS_DOT_COLORS[event.status] ?? "bg-gray-400"
                )}
              />

            <div className="space-y-1.5">
              {/* Main line: date + status badge + actor pill */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs text-muted-foreground min-w-[110px]">
                  {formatDate(event.date)}
                </span>
                <Badge
                  variant="outline"
                  className={cn(
                    "text-xs font-normal",
                    event.status === "approved" && "border-green-300 text-green-700",
                    event.status === "rejected" && "border-red-300 text-red-700",
                    event.status === "pending" && "border-yellow-300 text-yellow-700",
                    event.status === "review" && "border-blue-300 text-blue-700",
                    event.status === "documents_requested" && "border-orange-300 text-orange-700"
                  )}
                >
                  {event.isSubmission
                    ? "Подана заявка"
                    : STATUS_LABELS[event.status] ?? event.status}
                </Badge>
                <UserPill
                  name={event.actorName}
                  isAdmin={event.actorIsAdmin}
                  isCurrentUser={isOwnAction}
                />
              </div>

              {/* Resolution comment */}
              {event.comment && !event.isSubmission && (
                <div className="text-xs text-muted-foreground pl-[118px]">
                  {event.comment}
                </div>
              )}

              {/* User comment for submission */}
              {event.comment && event.isSubmission && (
                <div className="text-xs text-muted-foreground pl-[118px]">
                  Комментарий: {event.comment}
                </div>
              )}

              {/* Action buttons */}
              <div className="pl-[118px] flex items-center gap-2">
                {/* Revoke approved rights */}
                {showRevokeButton && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive h-7 px-2"
                    onClick={onRevoke}
                  >
                    <X className="h-3 w-3 mr-1" />
                    Отозвать права
                  </Button>
                )}

                {/* Cancel own pending claim */}
                {showCancelOwnButton && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground hover:text-destructive h-7 px-2"
                    onClick={() => onCancelClaim(event.claimId)}
                  >
                    <X className="h-3 w-3 mr-1" />
                    Отменить заявку
                  </Button>
                )}

                {/* Owner review tenant claim */}
                {showOwnerReviewButtons && (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-green-600 hover:text-green-700 h-7 px-2"
                      onClick={() => onReviewTenantClaim(event.claimId, "approve", event.actorName)}
                    >
                      <Check className="h-3 w-3 mr-1" />
                      Подтвердить
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive h-7 px-2"
                      onClick={() => onReviewTenantClaim(event.claimId, "reject", event.actorName)}
                    >
                      <X className="h-3 w-3 mr-1" />
                      Отклонить
                    </Button>
                  </>
                )}
              </div>
            </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
