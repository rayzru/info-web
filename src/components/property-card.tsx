"use client";

import { Building2, Car, ExternalLink, Home } from "lucide-react";
import Link from "next/link";

import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { cn } from "~/lib/utils";

// ============ Constants ============

const STATUS_LABELS: Record<string, string> = {
  pending: "Ожидает",
  review: "На рассмотрении",
  approved: "Одобрено",
  rejected: "Отклонено",
  documents_requested: "Запрос документов",
};

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
      {/* Header image placeholder with icon */}
      <div className="bg-muted relative aspect-video">
        <div className="flex h-full items-center justify-center">
          {type === "apartment" ? (
            <Home className="text-muted-foreground/20 h-16 w-16" />
          ) : (
            <Car className="text-muted-foreground/20 h-16 w-16" />
          )}
        </div>

        {/* Status badge (top-left) */}
        <div className="absolute left-2 top-2">
          <span
            className={cn(
              "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
              status === "approved" && "bg-green-100 text-green-800",
              status === "rejected" && "bg-red-100 text-red-800",
              status === "pending" && "bg-yellow-100 text-yellow-800",
              status === "review" && "bg-blue-100 text-blue-800"
            )}
          >
            {STATUS_LABELS[status]}
          </span>
        </div>

        {/* Property number badge (top-right) */}
        <div className="absolute right-2 top-2">
          <span className="inline-flex items-center rounded-full bg-gray-900/80 px-2.5 py-0.5 font-mono text-xs font-bold text-white">
            {propertyNumber}
          </span>
        </div>
      </div>

      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="line-clamp-1 text-base font-semibold leading-tight">
            {type === "apartment" ? "Квартира" : "Машиноместо"}
          </h3>
          <span className="text-muted-foreground shrink-0 text-sm">{ROLE_LABELS[role]}</span>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Address */}
        <div className="text-muted-foreground flex items-center gap-2 text-sm">
          <Building2 className="h-4 w-4 shrink-0" />
          <span className="line-clamp-1">{address}</span>
        </div>

        {/* History button */}
        <div className="border-t pt-3">
          <Link href={`/my/property/${type}/${propertyId}/history`} passHref>
            <Button variant="ghost" size="sm" className="-mx-2 h-9 w-full justify-between">
              <span className="text-sm">Показать историю</span>
              <ExternalLink className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
