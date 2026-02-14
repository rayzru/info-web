"use client";

import { Car, Check, Home, X } from "lucide-react";
import Link from "next/link";

import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { cn } from "~/lib/utils";

// ============ Constants ============

const ROLE_LABELS: Record<string, string> = {
  ApartmentOwner: "Собственник",
  ApartmentResident: "Проживающий",
  ParkingOwner: "Собственник",
  ParkingResident: "Арендатор",
};

// ============ Component ============

interface PropertyCardProps {
  type: "apartment" | "parking";
  propertyId: string;
  label: string;
  role: string;
  status: string;
}

export function PropertyCard({ type, propertyId, label, role, status }: PropertyCardProps) {
  // Split label into lines: "кв. 209\nЛарина 45/2" -> ["кв. 209", "Ларина 45/2"]
  const [propertyNumber, address] = label.split("\n");

  return (
    <Card className="overflow-hidden">
      {/* Header image placeholder with icon and large property number */}
      <div className="bg-muted relative aspect-video">
        <div className="flex h-full flex-col items-center justify-center gap-2">
          {/* Icon */}
          {type === "apartment" ? (
            <Home className="text-muted-foreground/20 h-12 w-12" />
          ) : (
            <Car className="text-muted-foreground/20 h-12 w-12" />
          )}

          {/* Large property number - MAIN FOCUS */}
          <div className="text-center">
            <div className="font-mono text-4xl font-bold">{propertyNumber}</div>
          </div>
        </div>

        {/* Status icon (top-left) */}
        <div className="absolute left-2 top-2">
          <div
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-full",
              status === "approved" && "bg-green-500",
              status === "rejected" && "bg-red-500",
              status === "pending" && "bg-yellow-500",
              status === "review" && "bg-blue-500"
            )}
          >
            {status === "approved" && <Check className="h-5 w-5 text-white" />}
            {status === "rejected" && <X className="h-5 w-5 text-white" />}
            {status === "pending" && <span className="text-xs font-bold text-white">...</span>}
            {status === "review" && <span className="text-xs font-bold text-white">?</span>}
          </div>
        </div>
      </div>

      <CardHeader className="pb-3">
        {/* Address */}
        <h3 className="text-base font-semibold leading-tight">{address}</h3>

        {/* Role below */}
        <p className="text-muted-foreground mt-1 text-sm">{ROLE_LABELS[role]}</p>
      </CardHeader>

      <CardContent className="pt-0">
        {/* History button - full width, small, no icon */}
        <Link href={`/my/property/${type}/${propertyId}/history`} className="block">
          <Button variant="ghost" size="sm" className="h-8 w-full text-xs">
            Показать историю
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
