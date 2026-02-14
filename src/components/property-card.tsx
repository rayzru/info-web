"use client";

import { useState } from "react";

import { Car, Check, ChevronDown, ChevronUp, Home, X } from "lucide-react";

import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
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

const ROLE_LABELS: Record<string, string> = {
  ApartmentOwner: "Собственник",
  ApartmentResident: "Проживающий",
  ParkingOwner: "Собственник",
  ParkingResident: "Арендатор",
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

interface PropertyCardProps {
  type: "apartment" | "parking";
  propertyId: string;
  label: string;
  role: string;
  status: string;
  isConfirmed: boolean;
  currentUserId?: string;
  onRevoke: () => void;
  onCancelClaim: (claimId: string) => void;
  onReviewTenantClaim: (claimId: string, action: "approve" | "reject", userName: string) => void;
}

export function PropertyCard({
  type,
  propertyId,
  label,
  role,
  status,
  isConfirmed,
  currentUserId,
  onRevoke,
  onCancelClaim,
  onReviewTenantClaim,
}: PropertyCardProps) {
  const [showTimeline, setShowTimeline] = useState(false);

  const { data: claims, isLoading } = api.claims.owner.propertyHistory.useQuery(
    {
      propertyType: type,
      propertyId,
    },
    { enabled: showTimeline }
  );

  const isOwner = role === "ApartmentOwner" || role === "ParkingOwner";

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

  const hasApprovedClaim = claims?.some(
    (c) => c.userId === currentUserId && c.status === "approved"
  );
  const canRevoke = hasApprovedClaim && isConfirmed;

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {type === "apartment" ? (
              <div className="bg-primary/10 rounded-lg p-2.5">
                <Home className="text-primary h-5 w-5" />
              </div>
            ) : (
              <div className="rounded-lg bg-blue-500/10 p-2.5">
                <Car className="h-5 w-5 text-blue-500" />
              </div>
            )}
            <div>
              <h3 className="text-base font-semibold leading-tight">{label}</h3>
              <p className="text-muted-foreground mt-0.5 text-sm">{ROLE_LABELS[role]}</p>
            </div>
          </div>
          <span
            className={cn(
              "shrink-0 rounded-full px-2.5 py-1 text-xs font-medium",
              status === "approved" && "bg-green-100 text-green-700",
              status === "rejected" && "bg-red-100 text-red-700",
              status === "pending" && "bg-yellow-100 text-yellow-700"
            )}
          >
            {STATUS_LABELS[status]}
          </span>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Toggle Timeline Button */}
        <Button
          variant="ghost"
          size="sm"
          className="-mx-2 h-9 w-full justify-between"
          onClick={() => setShowTimeline(!showTimeline)}
        >
          <span className="text-sm">{showTimeline ? "Скрыть историю" : "Показать историю"}</span>
          {showTimeline ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>

        {/* Timeline */}
        {showTimeline && (
          <div className="mt-4 border-t pt-4">
            {isLoading ? (
              <div className="text-muted-foreground py-4 text-center text-sm">Загрузка...</div>
            ) : timelineEvents.length === 0 ? (
              <div className="text-muted-foreground py-4 text-center text-sm">
                Нет истории заявок
              </div>
            ) : (
              <div className="relative pl-7">
                <div className="flex flex-col gap-8">
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
                          {(showRevokeButton || showCancelOwnButton || showOwnerReviewButtons) && (
                            <div className="mt-3 flex items-center gap-2">
                              {showRevokeButton && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-destructive hover:text-destructive h-8"
                                  onClick={onRevoke}
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
                                  onClick={() => onCancelClaim(event.claimId)}
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
                                      onReviewTenantClaim(event.claimId, "approve", event.actorName)
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
                                      onReviewTenantClaim(event.claimId, "reject", event.actorName)
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
          </div>
        )}
      </CardContent>
    </Card>
  );
}
