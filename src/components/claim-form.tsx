"use client";

import { useState } from "react";

import { HomeIcon, Loader2, ParkingCircleIcon, Store, X } from "lucide-react";
import { useRouter } from "next/navigation";

import { ClaimDocumentUploader, type UploadedDocument } from "~/components/claim-document-uploader";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Label } from "~/components/ui/label";
import { PropertyNumberGrid } from "~/components/ui/property-number-grid";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Textarea } from "~/components/ui/textarea";
import { useToast } from "~/hooks/use-toast";
import { api } from "~/trpc/react";

type ClaimType = "apartment" | "parking" | "commercial";

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

interface ExistingClaim {
  id: string;
  claimType: string;
  status: string;
  apartmentId: string | null;
  parkingSpotId: string | null;
}

interface ClaimFormProps {
  buildings: Building[];
  existingClaims: ExistingClaim[];
}

export function ClaimForm({ buildings, existingClaims }: ClaimFormProps) {
  const router = useRouter();
  const { toast } = useToast();

  const [claimType, setClaimType] = useState<ClaimType | null>(null);
  const [selectedBuildingId, setSelectedBuildingId] = useState<string>("");
  const [selectedEntranceId, setSelectedEntranceId] = useState<string>("");
  const [selectedFloorId, setSelectedFloorId] = useState<string>("");
  const [selectedApartmentId, setSelectedApartmentId] = useState<string>("");
  const [selectedParkingId, setSelectedParkingId] = useState<string>("");
  const [selectedParkingFloorId, setSelectedParkingFloorId] = useState<string>("");
  const [selectedParkingSpotId, setSelectedParkingSpotId] = useState<string>("");
  const [role, setRole] = useState<string>("");
  const [comment, setComment] = useState<string>("");
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
          toast({
            title: "Заявка отправлена",
            description: "Заявка создана, но некоторые документы не были прикреплены",
            variant: "destructive",
          });
          router.push("/my");
          router.refresh();
          return;
        }
      }

      toast({
        title: "Заявка отправлена",
        description: "Ваша заявка будет рассмотрена администрацией",
      });
      router.push("/my");
      router.refresh();
    },
    onError: (error) => {
      toast({
        title: "Ошибка",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Get selected building data
  const selectedBuilding = buildings.find((b) => b.id === selectedBuildingId);
  const selectedEntrance = selectedBuilding?.entrances.find((e) => e.id === selectedEntranceId);
  const selectedFloor = selectedEntrance?.floors.find((f) => f.id === selectedFloorId);
  const selectedParking = selectedBuilding?.parkings.find((p) => p.id === selectedParkingId);
  const selectedParkingFloor = selectedParking?.floors.find((f) => f.id === selectedParkingFloorId);

  // Check if property already has a claim
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
      | "ParkingResident"
      | "StoreOwner"
      | "StoreRepresenative";

    createClaim.mutate({
      claimType,
      claimedRole,
      apartmentId: claimType === "apartment" ? selectedApartmentId : undefined,
      parkingSpotId: claimType === "parking" ? selectedParkingSpotId : undefined,
      userComment: comment || undefined,
    });
  };

  const resetSelections = () => {
    setSelectedBuildingId("");
    setSelectedEntranceId("");
    setSelectedFloorId("");
    setSelectedApartmentId("");
    setSelectedParkingId("");
    setSelectedParkingFloorId("");
    setSelectedParkingSpotId("");
    setRole("");
    setComment("");
    setDocuments([]);
  };

  return (
    <div className="space-y-6">
      {/* Claim Type Selection */}
      {!claimType && (
        <div className="grid gap-4 md:grid-cols-3">
          <Card
            className="hover:border-primary/30 relative flex min-h-40 cursor-pointer flex-col overflow-hidden transition-all hover:shadow-md"
            onClick={() => setClaimType("apartment")}
          >
            <HomeIcon className="text-muted-foreground/10 absolute -bottom-6 -right-6 h-32 w-32" />
            <CardHeader className="relative z-10 flex-1">
              <CardTitle className="text-xl">Квартира</CardTitle>
              <CardDescription>Подать заявку на квартиру</CardDescription>
            </CardHeader>
          </Card>

          <Card
            className="hover:border-primary/30 relative flex min-h-40 cursor-pointer flex-col overflow-hidden transition-all hover:shadow-md"
            onClick={() => setClaimType("parking")}
          >
            <ParkingCircleIcon className="text-muted-foreground/10 absolute -bottom-6 -right-6 h-32 w-32" />
            <CardHeader className="relative z-10 flex-1">
              <CardTitle className="text-xl">Парковка</CardTitle>
              <CardDescription>Подать заявку на машиноместо</CardDescription>
            </CardHeader>
          </Card>

          <Card
            className="relative flex min-h-40 cursor-pointer flex-col overflow-hidden opacity-50"
            onClick={() =>
              toast({
                title: "Скоро",
                description: "Функция заявки на коммерцию в разработке",
              })
            }
          >
            <Store className="text-muted-foreground/10 absolute -bottom-6 -right-6 h-32 w-32" />
            <CardHeader className="relative z-10 flex-1">
              <CardTitle className="text-xl">Коммерция</CardTitle>
              <CardDescription>Подать заявку на коммерцию</CardDescription>
            </CardHeader>
          </Card>
        </div>
      )}

      {/* Apartment Claim Form */}
      {claimType === "apartment" && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 rounded-lg p-2">
                  <HomeIcon className="text-primary h-5 w-5" />
                </div>
                <div>
                  <CardTitle>Заявка на квартиру</CardTitle>
                  <CardDescription>Выберите строение и номер квартиры</CardDescription>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setClaimType(null);
                  resetSelections();
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Building Selection */}
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

            {/* Apartment Selection - Compact grid */}
            {selectedBuilding && (
              <div className="space-y-3">
                <Label>Квартира</Label>
                <PropertyNumberGrid
                  groups={selectedBuilding.entrances
                    .sort((a, b) => a.entranceNumber - b.entranceNumber)
                    .flatMap((entrance) =>
                      entrance.floors
                        .sort((a, b) => a.floorNumber - b.floorNumber)
                        .map((floor) => ({
                          label: `Подъезд ${entrance.entranceNumber}, Этаж ${floor.floorNumber}`,
                          items: floor.apartments
                            .map((apt) => ({
                              id: apt.id,
                              number: apt.number,
                              disabled: hasExistingClaim("apartment", apt.id),
                              disabledLabel: hasExistingClaim("apartment", apt.id)
                                ? "заявка подана"
                                : undefined,
                              entranceNumber: entrance.entranceNumber,
                              floorNumber: floor.floorNumber,
                            }))
                            .sort((a, b) => parseInt(a.number) - parseInt(b.number)),
                        }))
                    )}
                  value={selectedApartmentId}
                  onValueChange={setSelectedApartmentId}
                  itemsPerRow={5}
                  selectedLabel={
                    selectedApartmentId
                      ? (() => {
                          const selected = selectedBuilding.entrances
                            .flatMap((e) =>
                              e.floors.flatMap((f) =>
                                f.apartments.map((a) => ({
                                  ...a,
                                  entrance: e.entranceNumber,
                                  floor: f.floorNumber,
                                }))
                              )
                            )
                            .find((a) => a.id === selectedApartmentId);
                          return selected
                            ? `Подъезд ${selected.entrance}, Этаж ${selected.floor}, квартира №${selected.number}`
                            : undefined;
                        })()
                      : undefined
                  }
                  placeholder="Выберите квартиру"
                />
              </div>
            )}

            {/* Role Selection */}
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

            {/* Comment */}
            {role && (
              <div className="space-y-2">
                <Label>Комментарий (необязательно)</Label>
                <Textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Дополнительная информация для рассмотрения заявки"
                  rows={3}
                />
              </div>
            )}

            {/* Document Upload */}
            {role && (
              <ClaimDocumentUploader
                documents={documents}
                onChange={setDocuments}
                disabled={createClaim.isPending}
              />
            )}

            {/* Submit Button */}
            {role && (
              <div className="flex justify-end pt-4">
                <Button onClick={handleSubmit} disabled={createClaim.isPending}>
                  {createClaim.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Отправить заявку
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Parking Claim Form */}
      {claimType === "parking" && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-blue-500/10 p-2">
                  <ParkingCircleIcon className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <CardTitle>Заявка на парковку</CardTitle>
                  <CardDescription>Выберите ваше парковочное место</CardDescription>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setClaimType(null);
                  resetSelections();
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Building Selection - auto-selects the single parking and floor if only one */}
            <div className="space-y-2">
              <Label>Строение</Label>
              <Select
                value={selectedBuildingId}
                onValueChange={(value) => {
                  setSelectedBuildingId(value);
                  // Auto-select the single parking for this building
                  const building = buildings.find((b) => b.id === value);
                  if (building?.parkings.length === 1) {
                    const parking = building.parkings[0]!;
                    setSelectedParkingId(parking.id);
                    // Auto-select floor if only one level
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

            {/* Spot Selection - Compact grid with floor grouping */}
            {selectedParking && (
              <div className="space-y-3">
                <Label>Парковочное место</Label>
                <PropertyNumberGrid
                  groups={selectedParking.floors
                    .sort((a, b) => a.floorNumber - b.floorNumber)
                    .map((floor) => ({
                      label: `Этаж ${floor.floorNumber}`,
                      items: floor.spots
                        .map((spot) => ({
                          id: spot.id,
                          number: spot.number,
                          disabled: hasExistingClaim("parking", spot.id),
                          disabledLabel: hasExistingClaim("parking", spot.id)
                            ? "заявка подана"
                            : undefined,
                          floorNumber: floor.floorNumber,
                        }))
                        .sort((a, b) => parseInt(a.number) - parseInt(b.number)),
                    }))}
                  value={selectedParkingSpotId}
                  onValueChange={setSelectedParkingSpotId}
                  itemsPerRow={5}
                  selectedLabel={
                    selectedParkingSpotId
                      ? (() => {
                          const selected = selectedParking.floors
                            .flatMap((f) =>
                              f.spots.map((s) => ({
                                ...s,
                                floor: f.floorNumber,
                              }))
                            )
                            .find((s) => s.id === selectedParkingSpotId);
                          return selected
                            ? `Этаж ${selected.floor}, парковочное место №${selected.number}`
                            : undefined;
                        })()
                      : undefined
                  }
                  placeholder="Выберите парковочное место"
                />
              </div>
            )}

            {/* Role Selection */}
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

            {/* Comment */}
            {role && (
              <div className="space-y-2">
                <Label>Комментарий (необязательно)</Label>
                <Textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Дополнительная информация для рассмотрения заявки"
                  rows={3}
                />
              </div>
            )}

            {/* Document Upload */}
            {role && (
              <ClaimDocumentUploader
                documents={documents}
                onChange={setDocuments}
                disabled={createClaim.isPending}
              />
            )}

            {/* Submit Button */}
            {role && (
              <div className="flex justify-end pt-4">
                <Button onClick={handleSubmit} disabled={createClaim.isPending}>
                  {createClaim.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Отправить заявку
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Existing Claims */}
      {existingClaims.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Ваши заявки</CardTitle>
            <CardDescription>История поданных заявок</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {existingClaims.map((claim) => (
                <div key={claim.id} className="flex items-center gap-4 rounded-lg border p-3">
                  <div className="bg-muted rounded-lg p-2">
                    {claim.claimType === "apartment" ? (
                      <HomeIcon className="h-5 w-5" />
                    ) : claim.claimType === "parking" ? (
                      <ParkingCircleIcon className="h-5 w-5" />
                    ) : (
                      <Store className="h-5 w-5" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium capitalize">
                      {claim.claimType === "apartment"
                        ? "Квартира"
                        : claim.claimType === "parking"
                          ? "Парковка"
                          : "Коммерция"}
                    </p>
                  </div>
                  <span
                    className={`rounded px-2 py-1 text-xs ${
                      claim.status === "approved"
                        ? "bg-green-100 text-green-700"
                        : claim.status === "rejected"
                          ? "bg-red-100 text-red-700"
                          : claim.status === "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {claim.status === "approved"
                      ? "Одобрено"
                      : claim.status === "rejected"
                        ? "Отклонено"
                        : claim.status === "pending"
                          ? "На рассмотрении"
                          : "В обработке"}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
