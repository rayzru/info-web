"use client";

import { cn } from "~/lib/utils";

// ============ Form Wrapper ============

interface FormWrapperProps {
  isActive: boolean;
  children: React.ReactNode;
}

export function FormWrapper({ isActive, children }: FormWrapperProps) {
  if (!isActive) return null;

  return (
    <div
      className={cn(
        "my-2 rounded-lg border-2 p-4 transition-colors",
        isActive ? "border-primary" : "border-muted"
      )}
    >
      {children}
    </div>
  );
}

// ============ Type Form ============

interface TypeFormProps {
  value: "apartment" | "parking" | null;
  onChange: (value: "apartment" | "parking") => void;
}

export function TypeForm({ value, onChange }: TypeFormProps) {
  return (
    <div className="grid grid-cols-3 gap-2">
      <button
        type="button"
        onClick={() => onChange("apartment")}
        className={cn(
          "h-10 rounded-md px-3 text-sm font-medium transition-colors",
          "hover:bg-accent hover:text-accent-foreground",
          "focus-visible:ring-ring focus-visible:outline-none focus-visible:ring-2",
          value === "apartment" && "bg-primary text-primary-foreground"
        )}
      >
        Квартира
      </button>
      <button
        type="button"
        onClick={() => onChange("parking")}
        className={cn(
          "h-10 rounded-md px-3 text-sm font-medium transition-colors",
          "hover:bg-accent hover:text-accent-foreground",
          "focus-visible:ring-ring focus-visible:outline-none focus-visible:ring-2",
          value === "parking" && "bg-primary text-primary-foreground"
        )}
      >
        Парковка
      </button>
      <button
        type="button"
        disabled
        className={cn(
          "h-10 rounded-md px-3 text-sm font-medium transition-colors",
          "cursor-not-allowed opacity-40"
        )}
      >
        Коммерция
      </button>
    </div>
  );
}

// ============ Building Form ============

interface Building {
  id: string;
  number: number | null;
  title: string | null;
  liter: string | null;
}

interface BuildingFormProps {
  buildings: Building[];
  value: string;
  onChange: (value: string) => void;
}

export function BuildingForm({ buildings, value, onChange }: BuildingFormProps) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {buildings.map((building) => {
        const isSelected = value === building.id;

        return (
          <button
            key={building.id}
            type="button"
            onClick={() => onChange(building.id)}
            className={cn(
              "h-12 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              "hover:bg-accent hover:text-accent-foreground",
              "focus-visible:ring-ring focus-visible:outline-none focus-visible:ring-2",
              "flex items-center justify-center text-center",
              isSelected && "bg-primary text-primary-foreground"
            )}
          >
            {building.number}
          </button>
        );
      })}
    </div>
  );
}

// ============ Property Form ============

interface PropertyFormProps {
  type: "apartment" | "parking";
  building: any; // Full building object with entrances/parkings
  value: string;
  onChange: (value: string) => void;
  existingClaims: Array<{ apartmentId?: string; parkingSpotId?: string }>;
}

export function PropertyForm({
  type,
  building,
  value,
  onChange,
  existingClaims,
}: PropertyFormProps) {
  const hasExistingClaim = (propertyId: string) => {
    if (type === "apartment") {
      return existingClaims.some((c) => c.apartmentId === propertyId);
    }
    return existingClaims.some((c) => c.parkingSpotId === propertyId);
  };

  if (type === "apartment") {
    // Check if building has any entrances with apartments
    const hasApartments =
      building.entrances?.length > 0 &&
      building.entrances.some((entrance: any) =>
        entrance.floors?.some((floor: any) => floor.apartments?.length > 0)
      );

    // Show placeholder if no apartments available
    if (!hasApartments) {
      return (
        <div className="border-muted-foreground/20 bg-muted/30 space-y-3 rounded-lg border-2 border-dashed p-6 text-center">
          <div className="text-muted-foreground">
            <svg
              className="mx-auto mb-3 h-12 w-12 opacity-40"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
            <p className="text-sm font-medium">Данные по квартирам недоступны</p>
            <p className="mx-auto mt-2 max-w-md text-xs">
              В системе пока нет точных данных о квартирах в этом строении. Регистрация квартир для
              данного строения временно недоступна.
            </p>
          </div>
        </div>
      );
    }

    // Flatten all apartments with their metadata
    const apartments = building.entrances
      .sort((a: any, b: any) => a.entranceNumber - b.entranceNumber)
      .flatMap((entrance: any) =>
        entrance.floors
          .sort((a: any, b: any) => a.floorNumber - b.floorNumber)
          .flatMap((floor: any) =>
            floor.apartments.map((apt: any) => ({
              id: apt.id,
              number: apt.number,
              entrance: entrance.entranceNumber,
              floor: floor.floorNumber,
              disabled: hasExistingClaim(apt.id),
            }))
          )
      )
      .sort((a: any, b: any) => {
        // Sort by entrance, then floor, then number
        if (a.entrance !== b.entrance) return a.entrance - b.entrance;
        if (a.floor !== b.floor) return a.floor - b.floor;
        return parseInt(a.number) - parseInt(b.number);
      });

    // Group by entrance and floor for display
    const groups: Array<{ label: string; items: any[] }> = [];
    apartments.forEach((apt: any) => {
      const label = `Подъезд ${apt.entrance}, Этаж ${apt.floor}`;
      let group = groups.find((g) => g.label === label);
      if (!group) {
        group = { label, items: [] };
        groups.push(group);
      }
      group.items.push(apt);
    });

    return (
      <div className="h-50 overflow-y-auto p-3">
        <div className="space-y-4">
          {groups.map((group, idx) => (
            <div key={idx}>
              <div className="text-muted-foreground mb-2 text-xs font-semibold uppercase tracking-wide">
                {group.label}
              </div>
              <div className="grid grid-cols-5 gap-2">
                {group.items.map((apt: any) => {
                  const isSelected = value === apt.id;
                  const isDisabled = apt.disabled;

                  return (
                    <button
                      key={apt.id}
                      type="button"
                      onClick={() => !isDisabled && onChange(apt.id)}
                      disabled={isDisabled}
                      className={cn(
                        "h-10 rounded-md px-2 text-sm font-medium transition-colors",
                        !isDisabled && "hover:bg-accent hover:text-accent-foreground",
                        "focus-visible:ring-ring focus-visible:outline-none focus-visible:ring-2",
                        isSelected && "bg-primary text-primary-foreground",
                        isDisabled && "cursor-not-allowed opacity-40"
                      )}
                    >
                      {apt.number}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Parking
  // Check if building has any parking spots
  const hasParkingSpots =
    building.parkings?.length > 0 &&
    building.parkings.some((parking: any) =>
      parking.floors?.some((floor: any) => floor.spots?.length > 0)
    );

  // Show placeholder if no parking spots available
  if (!hasParkingSpots) {
    return (
      <div className="border-muted-foreground/20 bg-muted/30 space-y-3 rounded-lg border-2 border-dashed p-6 text-center">
        <div className="text-muted-foreground">
          <svg
            className="mx-auto mb-3 h-12 w-12 opacity-40"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"
            />
          </svg>
          <p className="text-sm font-medium">Данные по парковке недоступны</p>
          <p className="mx-auto mt-2 max-w-md text-xs">
            В системе пока нет точных данных о парковочных местах в этом строении. Регистрация
            парковочных мест для данного строения временно недоступна.
          </p>
        </div>
      </div>
    );
  }

  const parkingSpots =
    building.parkings[0]?.floors
      ?.sort((a: any, b: any) => a.floorNumber - b.floorNumber)
      .flatMap((floor: any) =>
        floor.spots.map((spot: any) => ({
          id: spot.id,
          number: spot.number,
          floor: floor.floorNumber,
          disabled: hasExistingClaim(spot.id),
        }))
      )
      .sort((a: any, b: any) => {
        if (a.floor !== b.floor) return a.floor - b.floor;
        return parseInt(a.number) - parseInt(b.number);
      }) ?? [];

  // Group by floor
  const groups: Array<{ label: string; items: any[] }> = [];
  parkingSpots.forEach((spot: any) => {
    const label = `Этаж ${spot.floor}`;
    let group = groups.find((g) => g.label === label);
    if (!group) {
      group = { label, items: [] };
      groups.push(group);
    }
    group.items.push(spot);
  });

  return (
    <div className="h-50 overflow-y-auto p-3">
      <div className="space-y-4">
        {groups.map((group, idx) => (
          <div key={idx}>
            <div className="text-muted-foreground mb-2 text-xs font-semibold uppercase tracking-wide">
              {group.label}
            </div>
            <div className="grid grid-cols-5 gap-2">
              {group.items.map((spot: any) => {
                const isSelected = value === spot.id;
                const isDisabled = spot.disabled;

                return (
                  <button
                    key={spot.id}
                    type="button"
                    onClick={() => !isDisabled && onChange(spot.id)}
                    disabled={isDisabled}
                    className={cn(
                      "h-10 rounded-md px-2 text-sm font-medium transition-colors",
                      !isDisabled && "hover:bg-accent hover:text-accent-foreground",
                      "focus-visible:ring-ring focus-visible:outline-none focus-visible:ring-2",
                      isSelected && "bg-primary text-primary-foreground",
                      isDisabled && "cursor-not-allowed opacity-40"
                    )}
                  >
                    {spot.number}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============ Role Form ============

interface RoleFormProps {
  propertyType: "apartment" | "parking";
  value: string;
  onChange: (value: string) => void;
}

export function RoleForm({ propertyType, value, onChange }: RoleFormProps) {
  const roles =
    propertyType === "apartment"
      ? [
          { value: "ApartmentOwner", label: "Собственник" },
          { value: "ApartmentResident", label: "Проживающий" },
        ]
      : [
          { value: "ParkingOwner", label: "Собственник" },
          { value: "ParkingResident", label: "Арендатор" },
        ];

  return (
    <div className="grid grid-cols-2 gap-2">
      {roles.map((role) => (
        <button
          key={role.value}
          type="button"
          onClick={() => onChange(role.value)}
          className={cn(
            "h-10 rounded-md px-3 text-sm font-medium transition-colors",
            "hover:bg-accent hover:text-accent-foreground",
            "focus-visible:ring-ring focus-visible:outline-none focus-visible:ring-2",
            value === role.value && "bg-primary text-primary-foreground"
          )}
        >
          {role.label}
        </button>
      ))}
    </div>
  );
}
