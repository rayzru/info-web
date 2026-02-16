"use client";

import { useState } from "react";

import { AlertCircle, Check, ChevronLeft, FileText, X } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

import { PropertyCard } from "~/components/property-card";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Textarea } from "~/components/ui/textarea";
import { cn } from "~/lib/utils";
import { api } from "~/trpc/react";

// ============ Constants ============

const STATUS_LABELS: Record<string, string> = {
  pending: "Ожидает",
  review: "На рассмотрении",
  approved: "Одобрено",
  rejected: "Отклонено",
  documents_requested: "Запрос документов",
};

const ROLE_LABELS: Record<string, string> = {
  ApartmentOwner: "Собственник",
  ApartmentResident: "Проживающий",
  ParkingOwner: "Собственник",
  ParkingResident: "Арендатор",
};

const ACTOR_TYPE_LABELS: Record<string, string> = {
  owner: "Собственник",
  resident: "Арендатор",
  admin: "Администрация",
};

// ============ Types ============

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

// ============ Component ============

export default function PropertyHistoryPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const utils = api.useUtils();

  const type = params.type as "apartment" | "parking";
  const propertyId = params.propertyId as string;
  const currentUserId = session?.user?.id;

  const [claimToCancel, setClaimToCancel] = useState<string | null>(null);
  const [claimToReview, setClaimToReview] = useState<{
    id: string;
    action: "approve" | "reject";
    userName: string;
  } | null>(null);
  const [rejectComment, setRejectComment] = useState("");

  const { data: claims, isLoading } = api.claims.owner.propertyHistory.useQuery({
    propertyType: type,
    propertyId,
  });

  const cancelClaimMutation = api.claims.cancel.useMutation({
    onSuccess: () => {
      utils.claims.owner.propertyHistory.invalidate();
      utils.claims.my.invalidate();
      setClaimToCancel(null);
      toast.success("Заявка отменена");
    },
    onError: (error) => {
      toast.error("Не удалось отменить заявку", { description: error.message });
    },
  });

  const reviewTenantMutation = api.claims.owner.reviewTenantClaim.useMutation({
    onSuccess: (_data, variables) => {
      utils.claims.owner.propertyHistory.invalidate();
      utils.claims.owner.pendingTenantClaims.invalidate();
      utils.claims.owner.myProperties.invalidate();
      setClaimToReview(null);
      setRejectComment("");
      toast.success(variables.status === "approved" ? "Заявка подтверждена" : "Заявка отклонена");
    },
    onError: (error) => {
      toast.error("Не удалось обработать заявку", { description: error.message });
    },
  });

  const revokeMutation = api.claims.revokeMyProperty.useMutation({
    onSuccess: () => {
      utils.claims.owner.propertyHistory.invalidate();
      utils.claims.owner.myProperties.invalidate();
      utils.claims.my.invalidate();
      toast.success("Права отозваны");
      router.push("/my/property");
    },
    onError: (error) => {
      toast.error("Не удалось отозвать права", { description: error.message });
    },
  });

  // Build timeline events
  const timelineEvents: TimelineEvent[] = [];

  if (claims) {
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
        // Check if changedBy user has admin role
        const changedByUserRoles = historyEntry.changedByUser?.roles?.map((r) => r.role) ?? [];
        const actorIsAdmin =
          changedByUserRoles.includes("Admin") ||
          changedByUserRoles.includes("SuperAdmin") ||
          changedByUserRoles.includes("Root");

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

    timelineEvents.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }

  const isOwner = claims?.some(
    (c) =>
      c.userId === currentUserId &&
      (c.claimedRole === "ApartmentOwner" || c.claimedRole === "ParkingOwner")
  );

  const hasApprovedClaim = claims?.some(
    (c) => c.userId === currentUserId && c.status === "approved"
  );

  // Get property details from first claim
  const firstClaim = claims?.[0];
  const buildingNum =
    type === "apartment"
      ? firstClaim?.apartment?.floor?.entrance?.building?.number
      : firstClaim?.parkingSpot?.floor?.parking?.building?.number;

  const propertyNumber =
    type === "apartment" ? firstClaim?.apartment?.number : firstClaim?.parkingSpot?.number;

  const floorNum = type === "parking" ? firstClaim?.parkingSpot?.floor?.floorNumber : undefined;
  const floorLabel = floorNum !== undefined ? ` (${floorNum} э)` : "";

  const propertyLabel =
    type === "apartment"
      ? `кв. ${propertyNumber ?? "?"}\nСтроение ${buildingNum ?? "?"}`
      : `м/м. ${propertyNumber ?? "?"}${floorLabel}\nСтроение ${buildingNum ?? "?"}`;

  const currentRole = firstClaim?.claimedRole ?? "";
  const currentStatus = firstClaim?.status ?? "pending";

  // Determine which action buttons to show on card
  const isOwnClaim = firstClaim?.userId === currentUserId;
  const isTenantClaim = currentRole === "ApartmentResident" || currentRole === "ParkingResident";

  const showRevokeButton = hasApprovedClaim && currentStatus === "approved" && isOwnClaim;
  const showCancelButton = currentStatus === "pending" && isOwnClaim;
  const showOwnerReviewButtons =
    isOwner && currentStatus === "pending" && !isOwnClaim && isTenantClaim;

  // Build action buttons for card
  const cardActionButtons = (
    <>
      {showRevokeButton && (
        <Button
          variant="outline"
          size="sm"
          className="text-destructive hover:text-destructive h-8"
          onClick={() =>
            revokeMutation.mutate({
              propertyType: type,
              propertyId,
            })
          }
          disabled={revokeMutation.isPending}
        >
          <X className="mr-1.5 h-3 w-3" />
          Отозвать
        </Button>
      )}

      {showCancelButton && (
        <Button
          variant="outline"
          size="sm"
          className="h-8"
          onClick={() => setClaimToCancel(firstClaim?.id ?? null)}
        >
          <X className="mr-1.5 h-3 w-3" />
          Отменить
        </Button>
      )}

      {showOwnerReviewButtons && (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-8 text-green-600 hover:bg-green-50 hover:text-green-700"
            onClick={() =>
              setClaimToReview({
                id: firstClaim?.id ?? "",
                action: "approve",
                userName: firstClaim?.user?.name ?? "Пользователь",
              })
            }
          >
            <Check className="mr-1.5 h-3 w-3" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-destructive hover:text-destructive h-8"
            onClick={() =>
              setClaimToReview({
                id: firstClaim?.id ?? "",
                action: "reject",
                userName: firstClaim?.user?.name ?? "Пользователь",
              })
            }
          >
            <X className="mr-1.5 h-3 w-3" />
          </Button>
        </div>
      )}
    </>
  );

  return (
    <div className="space-y-6">
      {/* Back button */}
      <div>
        <Button variant="ghost" size="sm" onClick={() => router.push("/my/property")}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Назад
        </Button>
      </div>

      {/* Property Card */}
      {firstClaim && (
        <PropertyCard
          type={type}
          propertyId={propertyId}
          label={propertyLabel}
          role={currentRole}
          status={currentStatus}
          disableLink={true}
          actionButtons={cardActionButtons}
        />
      )}

      {/* Missing documents alert */}
      {firstClaim?.status === "documents_requested" && (
        <Card className="border-amber-200 bg-amber-50 dark:border-amber-900/50 dark:bg-amber-950/20">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <AlertCircle className="h-6 w-6 shrink-0 text-amber-600 dark:text-amber-400" />
              <div className="flex-1 space-y-2">
                <p className="font-medium text-amber-900 dark:text-amber-100">
                  Требуются дополнительные документы
                </p>
                <p className="text-sm text-amber-700 dark:text-amber-300">
                  Администрация запросила подтверждающие документы для рассмотрения вашей заявки.
                  Пожалуйста, загрузите требуемые файлы для продолжения процесса рассмотрения.
                </p>
                <div className="flex items-center gap-2 pt-2">
                  <Button asChild variant="outline" size="sm">
                    <Link href="/my/property">
                      <FileText className="mr-2 h-4 w-4" />
                      Перейти к заявкам
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Document count indicator */}
      {firstClaim?.documents && firstClaim.documents.length > 0 && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <FileText className="h-4 w-4" />
          <span>Загружено документов: {firstClaim.documents.length}</span>
        </div>
      )}

      {/* History Table */}
      {isLoading ? (
        <div className="text-muted-foreground py-4 text-center text-sm">Загрузка...</div>
      ) : timelineEvents.length === 0 ? (
        <div className="text-muted-foreground py-4 text-center text-sm">Нет истории заявок</div>
      ) : (
        <div>
          <h3 className="mb-4 text-lg font-semibold">История изменений</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-45">Дата</TableHead>
                <TableHead className="w-45">Кто</TableHead>
                <TableHead>Данные</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {timelineEvents.map((event) => {
                // Determine actor type based on who performed the action
                let actorType: string;
                if (event.isSubmission) {
                  // For submissions, show the role of the person submitting
                  actorType =
                    event.claimedRole === "ApartmentOwner" || event.claimedRole === "ParkingOwner"
                      ? "owner"
                      : "resident";
                } else {
                  // For status changes, show who made the change
                  actorType = event.actorIsAdmin ? "admin" : "owner";
                }

                return (
                  <TableRow key={event.id}>
                    {/* Date */}
                    <TableCell className="text-sm">{formatDate(event.date)}</TableCell>

                    {/* Actor (Who) */}
                    <TableCell>
                      <div className="text-sm">{ACTOR_TYPE_LABELS[actorType] ?? actorType}</div>
                    </TableCell>

                    {/* Data (Comment) */}
                    <TableCell>
                      {event.comment ? (
                        <p className="text-muted-foreground text-sm">{event.comment}</p>
                      ) : (
                        <span className="text-muted-foreground text-sm">—</span>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Cancel Claim Dialog */}
      <Dialog open={!!claimToCancel} onOpenChange={() => setClaimToCancel(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Отменить заявку</DialogTitle>
            <DialogDescription>Вы уверены, что хотите отменить эту заявку?</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setClaimToCancel(null)}>
              Отмена
            </Button>
            <Button
              variant="destructive"
              onClick={() =>
                claimToCancel && cancelClaimMutation.mutate({ claimId: claimToCancel })
              }
              disabled={cancelClaimMutation.isPending}
            >
              Отменить заявку
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
              {claimToReview?.action === "approve" ? "Подтвердить заявку" : "Отклонить заявку"}
            </DialogTitle>
            <DialogDescription>
              {claimToReview?.action === "approve" ? (
                <>
                  Подтвердить права <strong>{claimToReview?.userName}</strong>?
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
