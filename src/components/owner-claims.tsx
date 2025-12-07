"use client";

import { useState } from "react";
import { Check, X, Clock, Home, Car, History, User, ChevronDown, ChevronUp } from "lucide-react";
import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Textarea } from "~/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { cn } from "~/lib/utils";

const STATUS_LABELS: Record<string, string> = {
  pending: "Ожидает",
  review: "На рассмотрении",
  approved: "Одобрено",
  rejected: "Отклонено",
  documents_requested: "Запрос документов",
};

const STATUS_COLORS: Record<string, string> = {
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

function getPropertyLabel(claim: {
  apartment?: {
    number: string;
    floor?: {
      entrance?: {
        building?: { number: number | null } | null;
      } | null;
    } | null;
  } | null;
  parkingSpot?: {
    number: string;
    floor?: {
      floorNumber: number;
      parking?: {
        building?: { number: number | null } | null;
      } | null;
    } | null;
  } | null;
  claimedRole: string;
}): string {
  if (claim.apartment) {
    const building = claim.apartment.floor?.entrance?.building?.number;
    return `Кв. ${claim.apartment.number}, стр. ${building}`;
  }
  if (claim.parkingSpot) {
    const building = claim.parkingSpot.floor?.parking?.building?.number;
    const floor = claim.parkingSpot.floor?.floorNumber;
    return `М/м ${claim.parkingSpot.number}, эт. ${floor}, стр. ${building}`;
  }
  return "Неизвестно";
}

// Pending tenant claims component
export function PendingTenantClaims() {
  const utils = api.useUtils();
  const { data: claims, isLoading } = api.claims.owner.pendingTenantClaims.useQuery();
  const reviewMutation = api.claims.owner.reviewTenantClaim.useMutation({
    onSuccess: () => {
      utils.claims.owner.pendingTenantClaims.invalidate();
    },
  });

  const [selectedClaim, setSelectedClaim] = useState<string | null>(null);
  const [action, setAction] = useState<"approve" | "reject" | null>(null);
  const [rejectComment, setRejectComment] = useState("");

  const handleReview = (claimId: string, status: "approved" | "rejected") => {
    reviewMutation.mutate({
      claimId,
      status,
      comment: status === "rejected" ? rejectComment : undefined,
    });
    setSelectedClaim(null);
    setAction(null);
    setRejectComment("");
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Входящие заявки
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-muted-foreground text-sm">Загрузка...</div>
        </CardContent>
      </Card>
    );
  }

  if (!claims || claims.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Входящие заявки
          </CardTitle>
          <CardDescription>
            Заявки на объекты, которыми вы управляете
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-muted-foreground text-sm py-4 text-center">
            Нет ожидающих заявок
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Входящие заявки
            <Badge variant="secondary" className="ml-2">
              {claims.length}
            </Badge>
          </CardTitle>
          <CardDescription>
            Подтвердите или отклоните заявки на объекты, которыми вы управляете
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {claims.map((claim) => (
              <div
                key={claim.id}
                className="border rounded-lg p-4 space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      {claim.apartment ? (
                        <Home className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Car className="h-4 w-4 text-muted-foreground" />
                      )}
                      <span className="font-medium">
                        {getPropertyLabel(claim)}
                      </span>
                      <Badge className={STATUS_COLORS[claim.status]}>
                        {STATUS_LABELS[claim.status]}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <User className="h-3 w-3" />
                      <span>{claim.user?.name ?? "Пользователь"}</span>
                      <span className="text-muted-foreground/50">•</span>
                      <span>{ROLE_LABELS[claim.claimedRole]}</span>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {formatDate(claim.createdAt)}
                  </div>
                </div>

                {claim.userComment && (
                  <div className="text-sm bg-muted/50 p-2 rounded">
                    <span className="text-muted-foreground">Комментарий: </span>
                    {claim.userComment}
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  <Button
                    size="sm"
                    onClick={() => {
                      setSelectedClaim(claim.id);
                      setAction("approve");
                    }}
                    disabled={reviewMutation.isPending}
                  >
                    <Check className="h-4 w-4 mr-1" />
                    Подтвердить
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setSelectedClaim(claim.id);
                      setAction("reject");
                    }}
                    disabled={reviewMutation.isPending}
                  >
                    <X className="h-4 w-4 mr-1" />
                    Отклонить
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      <Dialog
        open={!!selectedClaim && !!action}
        onOpenChange={() => {
          setSelectedClaim(null);
          setAction(null);
          setRejectComment("");
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {action === "approve" ? "Подтвердить заявку" : "Отклонить заявку"}
            </DialogTitle>
            <DialogDescription>
              {action === "approve"
                ? "Вы уверены, что хотите подтвердить эту заявку? Пользователь получит доступ к вашей недвижимости."
                : "Укажите причину отклонения заявки."}
            </DialogDescription>
          </DialogHeader>

          {action === "reject" && (
            <Textarea
              placeholder="Причина отклонения (необязательно)"
              value={rejectComment}
              onChange={(e) => setRejectComment(e.target.value)}
            />
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setSelectedClaim(null);
                setAction(null);
                setRejectComment("");
              }}
            >
              Отмена
            </Button>
            <Button
              variant={action === "approve" ? "default" : "destructive"}
              onClick={() =>
                selectedClaim &&
                handleReview(
                  selectedClaim,
                  action === "approve" ? "approved" : "rejected"
                )
              }
              disabled={reviewMutation.isPending}
            >
              {action === "approve" ? "Подтвердить" : "Отклонить"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

// Property timeline component
export function PropertyTimeline({
  propertyType,
  propertyId,
  propertyLabel,
}: {
  propertyType: "apartment" | "parking";
  propertyId: string;
  propertyLabel: string;
}) {
  const { data: claims, isLoading } = api.claims.owner.propertyHistory.useQuery({
    propertyType,
    propertyId,
  });

  if (isLoading) {
    return <div className="text-sm text-muted-foreground">Загрузка истории...</div>;
  }

  if (!claims || claims.length === 0) {
    return (
      <div className="text-sm text-muted-foreground py-2">
        Нет истории заявок для этого объекта
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm font-medium">
        <History className="h-4 w-4" />
        История заявок: {propertyLabel}
      </div>
      <div className="relative pl-6 space-y-4">
        {/* Timeline line */}
        <div className="absolute left-2 top-2 bottom-2 w-px bg-border" />

        {claims.map((claim, idx) => (
          <div key={claim.id} className="relative">
            {/* Timeline dot */}
            <div
              className={cn(
                "absolute -left-4 top-1.5 w-3 h-3 rounded-full border-2 bg-background",
                claim.status === "approved"
                  ? "border-green-500"
                  : claim.status === "rejected"
                    ? "border-red-500"
                    : "border-yellow-500"
              )}
            />

            <div className="border rounded-lg p-3 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">
                    {claim.user?.name ?? "Пользователь"}
                  </span>
                  <Badge variant="outline" className="text-xs">
                    {ROLE_LABELS[claim.claimedRole]}
                  </Badge>
                  <Badge className={cn("text-xs", STATUS_COLORS[claim.status])}>
                    {STATUS_LABELS[claim.status]}
                  </Badge>
                </div>
                <span className="text-xs text-muted-foreground">
                  {formatDate(claim.createdAt)}
                </span>
              </div>

              {claim.userComment && (
                <div className="text-xs text-muted-foreground">
                  Комментарий: {claim.userComment}
                </div>
              )}

              {claim.adminComment && (
                <div className="text-xs">
                  <span className="text-muted-foreground">Решение: </span>
                  {claim.adminComment}
                </div>
              )}

              {/* History events */}
              {claim.history && claim.history.length > 0 && (
                <ClaimHistoryEvents history={claim.history} />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Collapsible claim history events
function ClaimHistoryEvents({
  history,
}: {
  history: Array<{
    id: string;
    fromStatus: string | null;
    toStatus: string;
    resolutionText: string | null;
    createdAt: Date;
    changedByUser?: { name: string | null } | null;
  }>;
}) {
  const [expanded, setExpanded] = useState(false);

  if (history.length <= 1) return null;

  return (
    <div className="pt-2 border-t mt-2">
      <button
        className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
        onClick={() => setExpanded(!expanded)}
      >
        {expanded ? (
          <ChevronUp className="h-3 w-3" />
        ) : (
          <ChevronDown className="h-3 w-3" />
        )}
        {history.length} событий
      </button>

      {expanded && (
        <div className="mt-2 space-y-1 pl-3 border-l">
          {history.map((event) => (
            <div key={event.id} className="text-xs">
              <span className="text-muted-foreground">
                {formatDate(event.createdAt)}
              </span>
              <span className="mx-1">•</span>
              {event.fromStatus && (
                <>
                  <Badge
                    variant="outline"
                    className={cn("text-[10px] px-1", STATUS_COLORS[event.fromStatus])}
                  >
                    {STATUS_LABELS[event.fromStatus]}
                  </Badge>
                  <span className="mx-1">→</span>
                </>
              )}
              <Badge
                variant="outline"
                className={cn("text-[10px] px-1", STATUS_COLORS[event.toStatus])}
              >
                {STATUS_LABELS[event.toStatus]}
              </Badge>
              {event.changedByUser?.name && (
                <span className="ml-1 text-muted-foreground">
                  ({event.changedByUser.name})
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// My Properties with Timeline
export function MyPropertiesWithTimeline() {
  const utils = api.useUtils();
  const { data: properties, isLoading } = api.claims.owner.myProperties.useQuery();
  const [expandedProperty, setExpandedProperty] = useState<string | null>(null);
  const [propertyToRevoke, setPropertyToRevoke] = useState<{
    type: "apartment" | "parking";
    id: string;
    label: string;
  } | null>(null);

  const revokeMutation = api.claims.revokeMyProperty.useMutation({
    onSuccess: () => {
      utils.claims.owner.myProperties.invalidate();
      utils.claims.my.invalidate();
      setPropertyToRevoke(null);
    },
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Home className="h-5 w-5" />
            Мои объекты
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-muted-foreground text-sm">Загрузка...</div>
        </CardContent>
      </Card>
    );
  }

  const hasProperties =
    (properties?.apartments?.length ?? 0) > 0 ||
    (properties?.parkingSpots?.length ?? 0) > 0;

  if (!hasProperties) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Home className="h-5 w-5" />
            Мои объекты
          </CardTitle>
          <CardDescription>
            Здесь будет отображаться ваша подтвержденная недвижимость
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-muted-foreground text-sm py-4 text-center">
            У вас пока нет подтвержденной недвижимости
          </div>
        </CardContent>
      </Card>
    );
  }

  const allProperties = [
    ...(properties?.apartments?.map((a) => ({
      id: a.apartment!.id,
      type: "apartment" as const,
      label: `Кв. ${a.apartment!.number}, стр. ${a.apartment!.floor?.entrance?.building?.number}`,
      role: a.role,
    })) ?? []),
    ...(properties?.parkingSpots?.map((p) => ({
      id: p.parkingSpot!.id,
      type: "parking" as const,
      label: `М/м ${p.parkingSpot!.number}, эт. ${p.parkingSpot!.floor?.floorNumber}, стр. ${p.parkingSpot!.floor?.parking?.building?.number}`,
      role: p.role,
    })) ?? []),
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Home className="h-5 w-5" />
          Мои объекты
        </CardTitle>
        <CardDescription>
          Нажмите на объект, чтобы посмотреть историю заявок
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {allProperties.map((property) => (
            <div key={`${property.type}-${property.id}`} className="border rounded-lg">
              <button
                className="w-full p-3 flex items-center justify-between hover:bg-muted/50 transition-colors"
                onClick={() =>
                  setExpandedProperty(
                    expandedProperty === `${property.type}-${property.id}`
                      ? null
                      : `${property.type}-${property.id}`
                  )
                }
              >
                <div className="flex items-center gap-2">
                  {property.type === "apartment" ? (
                    <Home className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Car className="h-4 w-4 text-muted-foreground" />
                  )}
                  <span className="font-medium">{property.label}</span>
                  <Badge variant="secondary" className="text-xs">
                    {ROLE_LABELS[property.role]}
                  </Badge>
                </div>
                {expandedProperty === `${property.type}-${property.id}` ? (
                  <ChevronUp className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                )}
              </button>

              {expandedProperty === `${property.type}-${property.id}` && (
                <div className="p-3 pt-0 border-t space-y-3">
                  <PropertyTimeline
                    propertyType={property.type}
                    propertyId={property.id}
                    propertyLabel={property.label}
                  />
                  <div className="pt-2 border-t">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      onClick={(e) => {
                        e.stopPropagation();
                        setPropertyToRevoke({
                          type: property.type,
                          id: property.id,
                          label: property.label,
                        });
                      }}
                    >
                      <X className="h-4 w-4 mr-1" />
                      Отозвать права
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>

      {/* Revoke Confirmation Dialog */}
      <Dialog
        open={!!propertyToRevoke}
        onOpenChange={() => setPropertyToRevoke(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Отозвать права на объект</DialogTitle>
            <DialogDescription>
              Вы уверены, что хотите отозвать свои права на{" "}
              <strong>{propertyToRevoke?.label}</strong>?
              {"\n\n"}
              Это действие необратимо. Если у вас нет других объектов с этой ролью,
              роль будет также удалена.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setPropertyToRevoke(null)}
            >
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
    </Card>
  );
}
