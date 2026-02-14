"use client";

import { useState } from "react";

import { Check, ChevronLeft, X } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

import { PageHeader } from "~/components/page-header";
import { Button } from "~/components/ui/button";
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
import { api } from "~/trpc/react";

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

  return (
    <div className="space-y-6">
      <PageHeader
        title="История заявок"
        description={`История заявок на ${type === "apartment" ? "квартиру" : "машиноместо"}`}
        backHref="/my/property"
        icon={
          <Button variant="ghost" size="icon" onClick={() => router.push("/my/property")}>
            <ChevronLeft className="h-5 w-5" />
          </Button>
        }
      />

      {/* Timeline */}
      {isLoading ? (
        <div className="text-muted-foreground py-4 text-center text-sm">Загрузка...</div>
      ) : timelineEvents.length === 0 ? (
        <div className="text-muted-foreground py-4 text-center text-sm">Нет истории заявок</div>
      ) : (
        <div className="relative pl-7">
          <div className="flex flex-col gap-8">
            {timelineEvents.map((event, index) => {
              const isOwnAction = event.actorId === currentUserId;
              const isOwnClaim = event.claimUserId === currentUserId;
              const isLast = index === timelineEvents.length - 1;

              const showRevokeButton =
                hasApprovedClaim &&
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
                  {/* Vertical line */}
                  {!isLast && (
                    <div
                      className="bg-border absolute left-[-20px] top-[10px] w-px"
                      style={{ height: "calc(100% + 32px - 10px)" }}
                    />
                  )}

                  {/* Status dot */}
                  <div
                    className={cn(
                      "absolute left-[-27px] top-[3px] z-10 h-[14px] w-[14px] rounded-full",
                      isCurrent
                        ? (STATUS_COLORS[event.status] ?? "bg-gray-400")
                        : isPast && event.status === "approved"
                          ? "bg-green-500"
                          : isPast && event.status === "rejected"
                            ? "bg-red-500"
                            : "bg-muted-foreground/30"
                    )}
                  />

                  {/* Content */}
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium leading-5">
                      {event.isSubmission
                        ? "Подана заявка"
                        : (STATUS_LABELS[event.status] ?? event.status)}
                    </div>

                    <div className="text-muted-foreground mt-1 text-xs">
                      {formatDate(event.date)}
                    </div>

                    <div className="mt-2">
                      <UserPill
                        name={event.actorName}
                        isAdmin={event.actorIsAdmin}
                        isCurrentUser={isOwnAction}
                      />
                    </div>

                    {event.comment && (
                      <p className="text-muted-foreground border-muted mt-2 border-l-2 pl-3 text-sm">
                        {event.comment}
                      </p>
                    )}

                    {/* Action buttons */}
                    {/* eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing */}
                    {(showRevokeButton || showCancelOwnButton || showOwnerReviewButtons) && (
                      <div className="mt-3 flex items-center gap-2">
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
                            Отозвать права
                          </Button>
                        )}

                        {showCancelOwnButton && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8"
                            onClick={() => setClaimToCancel(event.claimId)}
                          >
                            <X className="mr-1.5 h-3 w-3" />
                            Отменить заявку
                          </Button>
                        )}

                        {showOwnerReviewButtons && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 text-green-600 hover:bg-green-50 hover:text-green-700"
                              onClick={() =>
                                setClaimToReview({
                                  id: event.claimId,
                                  action: "approve",
                                  userName: event.actorName,
                                })
                              }
                            >
                              <Check className="mr-1.5 h-3 w-3" />
                              Подтвердить
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-destructive hover:text-destructive h-8"
                              onClick={() =>
                                setClaimToReview({
                                  id: event.claimId,
                                  action: "reject",
                                  userName: event.actorName,
                                })
                              }
                            >
                              <X className="mr-1.5 h-3 w-3" />
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
