"use client";

import { useState } from "react";
import { Search, X } from "lucide-react";

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
    <div className="grid grid-cols-4 gap-2">
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
    <div className="grid grid-cols-4 gap-2">
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
  const [searchQuery, setSearchQuery] = useState("");

  const hasExistingClaim = (propertyId: string) => {
    if (type === "apartment") {
      return existingClaims.some((c) => c.apartmentId === propertyId);
    }
    return existingClaims.some((c) => c.parkingSpotId === propertyId);
  };

  if (type === "apartment") {
    // Flatten all apartments with their metadata
    const allApartments = building.entrances
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

    // Filter apartments by search query
    const apartments = searchQuery
      ? allApartments.filter((apt: any) => apt.number.includes(searchQuery))
      : allApartments;

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
      <div className="flex flex-col">
        {/* Search Input - sticky at the top */}
        <div className="border-primary relative mb-3 border-b-2 pb-3">
          <div className="relative flex items-center">
            <Search className="text-muted-foreground absolute left-3 h-4 w-4" />
            <input
              type="search"
              placeholder="Быстрый поиск..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={cn(
                "h-10 w-full border-0 bg-transparent py-2 pl-10 pr-10 text-center text-sm",
                "placeholder:text-muted-foreground/60",
                "focus-visible:outline-none",
                "disabled:cursor-not-allowed disabled:opacity-50"
              )}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="text-muted-foreground hover:text-foreground absolute right-3 transition-colors"
                aria-label="Очистить поиск"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Scrollable apartment list */}
        <div className="h-50 overflow-y-auto pr-1">
          <div className="space-y-4">
            {groups.map((group, idx) => (
              <div key={idx}>
                <div className="text-muted-foreground mb-2 text-xs font-semibold uppercase tracking-wide">
                  {group.label}
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {group.items.map((apt: any) => {
                    const isSelected = value === apt.id;
                    const isDisabled = apt.disabled;

                    return (
                      <button
                        key={apt.id}
                        type="button"
                        onClick={() => !isDisabled && onChange(apt.id)}
                        disabled={isDisabled}
                        title={isDisabled ? "Заявка уже подана на эту квартиру" : undefined}
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
      </div>
    );
  }

  // Parking
  const allParkingSpots =
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

  // Filter parking spots by search query
  const parkingSpots = searchQuery
    ? allParkingSpots.filter((spot: any) => spot.number.includes(searchQuery))
    : allParkingSpots;

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
    <div className="flex flex-col">
      {/* Search Input - sticky at the top */}
      <div className="border-primary relative mb-3 border-b-2 pb-3">
        <div className="relative flex items-center">
          <Search className="text-muted-foreground absolute left-3 h-4 w-4" />
          <input
            type="search"
            placeholder="Быстрый поиск..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={cn(
              "h-10 w-full border-0 bg-transparent py-2 pl-10 pr-10 text-center text-sm",
              "placeholder:text-muted-foreground/60",
              "focus-visible:outline-none",
              "disabled:cursor-not-allowed disabled:opacity-50"
            )}
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="text-muted-foreground hover:text-foreground absolute right-3 transition-colors"
              aria-label="Очистить поиск"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Scrollable parking list */}
      <div className="h-50 overflow-y-auto pr-1">
        <div className="space-y-4">
          {groups.map((group, idx) => (
            <div key={idx}>
              <div className="text-muted-foreground mb-2 text-xs font-semibold uppercase tracking-wide">
                {group.label}
              </div>
              <div className="grid grid-cols-4 gap-2">
                {group.items.map((spot: any) => {
                  const isSelected = value === spot.id;
                  const isDisabled = spot.disabled;

                  return (
                    <button
                      key={spot.id}
                      type="button"
                      onClick={() => !isDisabled && onChange(spot.id)}
                      disabled={isDisabled}
                      title={isDisabled ? "Заявка уже подана на это парковочное место" : undefined}
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
