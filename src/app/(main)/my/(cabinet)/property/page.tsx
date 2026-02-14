"use client";

import { useState } from "react";

import { Building2, Plus } from "lucide-react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

import { PageHeader } from "~/components/page-header";
import { PropertyCard } from "~/components/property-card";
import { PropertyWizard } from "~/components/property-wizard";
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
import { api } from "~/trpc/react";

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
      toast.success(variables.status === "approved" ? "Заявка подтверждена" : "Заявка отклонена");
    },
    onError: (error) => {
      toast.error("Не удалось обработать заявку", { description: error.message });
    },
  });

  const cancelClaimMutation = api.claims.cancel.useMutation({
    onSuccess: () => {
      utils.claims.my.invalidate();
      toast.success("Заявка отменена");
    },
    onError: (error) => {
      toast.error("Не удалось отменить заявку", { description: error.message });
    },
  });

  const createClaim = api.claims.create.useMutation({
    onSuccess: () => {
      toast.success("Заявка отправлена", {
        description: "Ваша заявка будет рассмотрена администрацией",
      });
      utils.claims.my.invalidate();
      utils.claims.availableProperties.invalidate();
      setShowAddDialog(false);
    },
    onError: (error) => {
      toast.error("Ошибка", { description: error.message });
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

  return (
    <div className="space-y-6">
      <PageHeader title="Недвижимость" description="Управление вашими объектами">
        <Button onClick={() => setShowAddDialog(true)} size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Добавить
        </Button>
      </PageHeader>

      {/* Property Cards Grid */}
      {claimsLoading ? (
        <div className="text-muted-foreground py-8 text-center text-sm">Загрузка...</div>
      ) : allProperties.length === 0 ? (
        <div className="bg-muted/30 rounded-xl border border-dashed p-12 text-center">
          <Building2 className="text-muted-foreground/30 mx-auto mb-4 h-12 w-12" />
          <p className="text-muted-foreground mb-4">У вас пока нет объектов</p>
          <Button onClick={() => setShowAddDialog(true)} variant="outline">
            <Plus className="mr-2 h-4 w-4" />
            Добавить первый объект
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {allProperties.map((property) => (
            <PropertyCard
              key={`${property.type}-${property.id}`}
              type={property.type}
              propertyId={property.id}
              label={property.label}
              role={property.role}
              status={property.latestStatus}
              isConfirmed={property.isConfirmed}
              currentUserId={currentUserId}
              onRevoke={() => setPropertyToRevoke(property)}
              onCancelClaim={(claimId) => cancelClaimMutation.mutate({ claimId })}
              onReviewTenantClaim={(claimId, action, userName) =>
                setClaimToReview({
                  id: claimId,
                  action,
                  userName,
                  propertyLabel: property.label,
                })
              }
            />
          ))}
        </div>
      )}

      {/* Add Property Dialog */}
      <PropertyWizard
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        buildings={buildings ?? []}
        existingClaims={
          myClaims?.map((c) => ({
            apartmentId: c.apartmentId ?? undefined,
            parkingSpotId: c.parkingSpotId ?? undefined,
          })) ?? []
        }
        onSubmit={async (data) => {
          const claimedRole = data.role as
            | "ApartmentOwner"
            | "ApartmentResident"
            | "ParkingOwner"
            | "ParkingResident";

          await createClaim.mutateAsync({
            claimType: data.type,
            claimedRole,
            apartmentId: data.type === "apartment" ? data.propertyId : undefined,
            parkingSpotId: data.type === "parking" ? data.propertyId : undefined,
          });
        }}
        isSubmitting={createClaim.isPending}
      />

      {/* Revoke Confirmation Dialog */}
      <Dialog open={!!propertyToRevoke} onOpenChange={() => setPropertyToRevoke(null)}>
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
              {claimToReview?.action === "approve" ? "Подтвердить заявку" : "Отклонить заявку"}
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
