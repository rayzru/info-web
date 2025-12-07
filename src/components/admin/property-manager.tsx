"use client";

import { useState } from "react";
import { AlertTriangle, Building2, Car, History, XCircle } from "lucide-react";

import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Label } from "~/components/ui/label";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { Textarea } from "~/components/ui/textarea";
import { api } from "~/trpc/react";

interface PropertyManagerProps {
  userId: string;
  userName: string | null;
}

type RevocationTemplate = "community_rules_violation" | "role_owner_change" | "custom";

const REVOCATION_TEMPLATES = {
  community_rules_violation: "Нарушение правил сообщества",
  role_owner_change: "Смена роли, смена владельца, изменение правового состояния",
  custom: "Другая причина (указать)",
};

export function PropertyManager({ userId, userName }: PropertyManagerProps) {
  const [revokeDialogOpen, setRevokeDialogOpen] = useState(false);
  const [historyDialogOpen, setHistoryDialogOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<{
    type: "apartment" | "parking";
    id: string;
    label: string;
  } | null>(null);
  const [revocationTemplate, setRevocationTemplate] = useState<RevocationTemplate>("community_rules_violation");
  const [customReason, setCustomReason] = useState("");

  const { data: properties, isLoading, refetch } = api.admin.users.getProperties.useQuery({
    userId,
  });

  const { data: revocationHistory } = api.admin.users.getRevocationHistory.useQuery({
    userId,
  });

  const revokeApartment = api.admin.users.revokeApartment.useMutation({
    onSuccess: () => {
      refetch();
      setRevokeDialogOpen(false);
      setSelectedProperty(null);
      setCustomReason("");
    },
  });

  const revokeParkingSpot = api.admin.users.revokeParkingSpot.useMutation({
    onSuccess: () => {
      refetch();
      setRevokeDialogOpen(false);
      setSelectedProperty(null);
      setCustomReason("");
    },
  });

  const handleOpenRevokeDialog = (type: "apartment" | "parking", id: string, label: string) => {
    setSelectedProperty({ type, id, label });
    setRevocationTemplate("community_rules_violation");
    setCustomReason("");
    setRevokeDialogOpen(true);
  };

  const handleRevoke = async () => {
    if (!selectedProperty) return;

    if (selectedProperty.type === "apartment") {
      await revokeApartment.mutateAsync({
        userId,
        apartmentId: selectedProperty.id,
        revocationTemplate,
        customReason: revocationTemplate === "custom" ? customReason : undefined,
      });
    } else {
      await revokeParkingSpot.mutateAsync({
        userId,
        parkingSpotId: selectedProperty.id,
        revocationTemplate,
        customReason: revocationTemplate === "custom" ? customReason : undefined,
      });
    }
  };

  const formatApartmentLabel = (apartment: {
    number: string;
    floor?: { floorNumber: number; entrance?: { entranceNumber: number; building?: { number: number | null } | null } | null } | null;
  }) => {
    const building = apartment.floor?.entrance?.building?.number;
    const entrance = apartment.floor?.entrance?.entranceNumber;
    const floor = apartment.floor?.floorNumber;
    return `Д.${building} / П.${entrance} / Эт.${floor} / Кв.${apartment.number}`;
  };

  const formatParkingLabel = (spot: {
    number: string;
    floor?: { floorNumber: number; parking?: { building?: { number: number | null } | null } | null } | null;
  }) => {
    const building = spot.floor?.parking?.building?.number;
    const floor = spot.floor?.floorNumber;
    return `Д.${building} / Эт.${floor} / М.${spot.number}`;
  };

  if (isLoading) {
    return <div className="text-muted-foreground">Загрузка...</div>;
  }

  const hasProperties =
    (properties?.apartments?.length ?? 0) > 0 ||
    (properties?.parkingSpots?.length ?? 0) > 0;

  const hasRevocationHistory =
    (revocationHistory?.apartments?.length ?? 0) > 0 ||
    (revocationHistory?.parkingSpots?.length ?? 0) > 0;

  return (
    <div className="space-y-6">
      {/* Active Properties */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Активные привязки
          </CardTitle>
          <CardDescription>
            Собственность пользователя {userName ?? ""}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!hasProperties ? (
            <p className="text-sm text-muted-foreground">
              У пользователя нет привязанной собственности
            </p>
          ) : (
            <div className="space-y-4">
              {/* Apartments */}
              {properties?.apartments && properties.apartments.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-muted-foreground">Квартиры</h4>
                  <div className="space-y-2">
                    {properties.apartments.map((binding) => (
                      <div
                        key={binding.apartmentId}
                        className="flex items-center justify-between rounded-lg border p-3"
                      >
                        <div className="flex items-center gap-3">
                          <Building2 className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="font-medium">
                              {formatApartmentLabel(binding.apartment)}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Роль: {binding.role} | Статус: {binding.status}
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() =>
                            handleOpenRevokeDialog(
                              "apartment",
                              binding.apartmentId,
                              formatApartmentLabel(binding.apartment)
                            )
                          }
                        >
                          <XCircle className="mr-2 h-4 w-4" />
                          Отозвать
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Parking Spots */}
              {properties?.parkingSpots && properties.parkingSpots.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-muted-foreground">Паркоместа</h4>
                  <div className="space-y-2">
                    {properties.parkingSpots.map((binding) => (
                      <div
                        key={binding.parkingSpotId}
                        className="flex items-center justify-between rounded-lg border p-3"
                      >
                        <div className="flex items-center gap-3">
                          <Car className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="font-medium">
                              {formatParkingLabel(binding.parkingSpot)}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Роль: {binding.role} | Статус: {binding.status}
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() =>
                            handleOpenRevokeDialog(
                              "parking",
                              binding.parkingSpotId,
                              formatParkingLabel(binding.parkingSpot)
                            )
                          }
                        >
                          <XCircle className="mr-2 h-4 w-4" />
                          Отозвать
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Revocation History */}
      {hasRevocationHistory && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="h-5 w-5" />
              История отзыва прав
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Revoked Apartments */}
              {revocationHistory?.apartments && revocationHistory.apartments.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-muted-foreground">Квартиры</h4>
                  <div className="space-y-2">
                    {revocationHistory.apartments.map((binding, idx) => (
                      <div
                        key={`apt-${idx}`}
                        className="rounded-lg border border-destructive/20 bg-destructive/5 p-3"
                      >
                        <div className="flex items-start gap-3">
                          <AlertTriangle className="mt-0.5 h-4 w-4 text-destructive" />
                          <div className="flex-1">
                            <p className="font-medium text-destructive">
                              {formatApartmentLabel(binding.apartment)}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Причина: {binding.revocationReason}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Отозвано: {binding.revokedAt?.toLocaleDateString("ru-RU")}
                              {binding.revokedByUser && ` пользователем ${binding.revokedByUser.name ?? binding.revokedByUser.email}`}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Revoked Parking Spots */}
              {revocationHistory?.parkingSpots && revocationHistory.parkingSpots.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-muted-foreground">Паркоместа</h4>
                  <div className="space-y-2">
                    {revocationHistory.parkingSpots.map((binding, idx) => (
                      <div
                        key={`park-${idx}`}
                        className="rounded-lg border border-destructive/20 bg-destructive/5 p-3"
                      >
                        <div className="flex items-start gap-3">
                          <AlertTriangle className="mt-0.5 h-4 w-4 text-destructive" />
                          <div className="flex-1">
                            <p className="font-medium text-destructive">
                              {formatParkingLabel(binding.parkingSpot)}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Причина: {binding.revocationReason}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Отозвано: {binding.revokedAt?.toLocaleDateString("ru-RU")}
                              {binding.revokedByUser && ` пользователем ${binding.revokedByUser.name ?? binding.revokedByUser.email}`}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Revoke Dialog */}
      <Dialog open={revokeDialogOpen} onOpenChange={setRevokeDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Отзыв прав на собственность
            </DialogTitle>
            <DialogDescription>
              Вы собираетесь отозвать права на: {selectedProperty?.label}
              <br />
              Все связанные объявления будут архивированы.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-3">
              <Label>Причина отзыва</Label>
              <RadioGroup
                value={revocationTemplate}
                onValueChange={(v) => setRevocationTemplate(v as RevocationTemplate)}
              >
                {Object.entries(REVOCATION_TEMPLATES).map(([value, label]) => (
                  <div key={value} className="flex items-center space-x-2">
                    <RadioGroupItem value={value} id={value} />
                    <Label htmlFor={value} className="font-normal cursor-pointer">
                      {label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {revocationTemplate === "custom" && (
              <div className="space-y-2">
                <Label htmlFor="customReason">Укажите причину</Label>
                <Textarea
                  id="customReason"
                  value={customReason}
                  onChange={(e) => setCustomReason(e.target.value)}
                  placeholder="Введите причину отзыва прав..."
                  rows={3}
                />
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setRevokeDialogOpen(false)}>
              Отмена
            </Button>
            <Button
              variant="destructive"
              onClick={handleRevoke}
              disabled={
                revokeApartment.isPending ||
                revokeParkingSpot.isPending ||
                (revocationTemplate === "custom" && !customReason.trim())
              }
            >
              {revokeApartment.isPending || revokeParkingSpot.isPending
                ? "Отзыв..."
                : "Отозвать права"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
