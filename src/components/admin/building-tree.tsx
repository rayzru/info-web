"use client";

import { useState } from "react";
import {
  Building2,
  ChevronDown,
  ChevronRight,
  DoorOpen,
  Layers,
  Home,
  Car,
  ParkingSquare,
} from "lucide-react";

import { cn } from "~/lib/utils";

// Types for the building hierarchy
interface Apartment {
  id: string;
  number: string;
  type: string;
  layoutCode: string | null;
}

interface Floor {
  id: string;
  floorNumber: number;
  apartments: Apartment[];
}

interface Entrance {
  id: string;
  entranceNumber: number;
  floors: Floor[];
}

interface ParkingSpot {
  id: string;
  number: string;
  type: string;
}

interface ParkingFloor {
  id: string;
  floorNumber: number;
  spots: ParkingSpot[];
}

interface Parking {
  id: string;
  name: string;
  floors: ParkingFloor[];
}

interface Building {
  id: string;
  number: number | null;
  title: string | null;
  liter: string | null;
  active: boolean | null;
  entrances: Entrance[];
  parkings: Parking[];
}

interface BuildingTreeProps {
  buildings: Building[];
}

// Expandable tree node component
function TreeNode({
  icon: Icon,
  label,
  sublabel,
  children,
  defaultExpanded = false,
  level = 0,
  count,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  sublabel?: string;
  children?: React.ReactNode;
  defaultExpanded?: boolean;
  level?: number;
  count?: number;
}) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const hasChildren = !!children;

  return (
    <div className="select-none">
      <button
        type="button"
        onClick={() => hasChildren && setIsExpanded(!isExpanded)}
        className={cn(
          "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm transition-colors",
          hasChildren
            ? "cursor-pointer hover:bg-muted"
            : "cursor-default",
          level === 0 && "font-medium",
        )}
        style={{ paddingLeft: `${level * 16 + 8}px` }}
      >
        {hasChildren ? (
          isExpanded ? (
            <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
          ) : (
            <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
          )
        ) : (
          <span className="w-4" />
        )}
        <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
        <span className="flex-1 truncate">{label}</span>
        {sublabel && (
          <span className="text-xs text-muted-foreground">{sublabel}</span>
        )}
        {count !== undefined && (
          <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
            {count}
          </span>
        )}
      </button>
      {hasChildren && isExpanded && <div>{children}</div>}
    </div>
  );
}

// Leaf node (no expansion)
function LeafNode({
  icon: Icon,
  label,
  sublabel,
  level = 0,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  sublabel?: string;
  level?: number;
}) {
  return (
    <div
      className="flex items-center gap-2 rounded-md px-2 py-1 text-sm"
      style={{ paddingLeft: `${level * 16 + 8 + 16}px` }}
    >
      <span className="w-4" />
      <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
      <span className="flex-1 truncate text-muted-foreground">{label}</span>
      {sublabel && (
        <span className="text-xs text-muted-foreground">{sublabel}</span>
      )}
    </div>
  );
}

export function BuildingTree({ buildings }: BuildingTreeProps) {
  if (buildings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Building2 className="mb-4 h-12 w-12 text-muted-foreground" />
        <p className="text-lg font-medium">Нет данных о зданиях</p>
        <p className="text-sm text-muted-foreground">
          Здания еще не добавлены в систему
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {buildings.map((building) => {
        const totalApartments = building.entrances.reduce(
          (sum, entrance) =>
            sum +
            entrance.floors.reduce(
              (floorSum, floor) => floorSum + floor.apartments.length,
              0,
            ),
          0,
        );
        const totalParkingSpots = building.parkings.reduce(
          (sum, parking) =>
            sum +
            parking.floors.reduce(
              (floorSum, floor) => floorSum + floor.spots.length,
              0,
            ),
          0,
        );

        return (
          <div
            key={building.id}
            className="rounded-lg border bg-card"
          >
            <TreeNode
              icon={Building2}
              label={`${building.title ?? `Здание ${building.number ?? "?"}`}${building.liter ? ` (${building.liter})` : ""}`}
              sublabel={building.active === false ? "Неактивно" : undefined}
              defaultExpanded
              count={totalApartments + totalParkingSpots}
            >
              {/* Entrances */}
              {building.entrances.length > 0 && (
                <div className="border-t">
                  {building.entrances.map((entrance) => {
                    const entranceApartments = entrance.floors.reduce(
                      (sum, floor) => sum + floor.apartments.length,
                      0,
                    );

                    return (
                      <TreeNode
                        key={entrance.id}
                        icon={DoorOpen}
                        label={`Подъезд ${entrance.entranceNumber}`}
                        level={1}
                        count={entranceApartments}
                      >
                        {entrance.floors.map((floor) => (
                          <TreeNode
                            key={floor.id}
                            icon={Layers}
                            label={`Этаж ${floor.floorNumber}`}
                            level={2}
                            count={floor.apartments.length}
                          >
                            {floor.apartments.map((apartment) => (
                              <LeafNode
                                key={apartment.id}
                                icon={Home}
                                label={`Квартира ${apartment.number}`}
                                sublabel={apartment.type}
                                level={3}
                              />
                            ))}
                          </TreeNode>
                        ))}
                      </TreeNode>
                    );
                  })}
                </div>
              )}

              {/* Parkings */}
              {building.parkings.length > 0 && (
                <div className="border-t">
                  {building.parkings.map((parking) => {
                    const parkingSpots = parking.floors.reduce(
                      (sum, floor) => sum + floor.spots.length,
                      0,
                    );

                    return (
                      <TreeNode
                        key={parking.id}
                        icon={ParkingSquare}
                        label={parking.name}
                        level={1}
                        count={parkingSpots}
                      >
                        {parking.floors.map((floor) => (
                          <TreeNode
                            key={floor.id}
                            icon={Layers}
                            label={`Уровень ${floor.floorNumber}`}
                            level={2}
                            count={floor.spots.length}
                          >
                            {floor.spots.map((spot) => (
                              <LeafNode
                                key={spot.id}
                                icon={Car}
                                label={`Место ${spot.number}`}
                                sublabel={spot.type}
                                level={3}
                              />
                            ))}
                          </TreeNode>
                        ))}
                      </TreeNode>
                    );
                  })}
                </div>
              )}
            </TreeNode>
          </div>
        );
      })}
    </div>
  );
}
