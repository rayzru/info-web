"use client";

import { Car, ExternalLink, Home } from "lucide-react";
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
              <h3 className="whitespace-pre-line text-base font-semibold leading-tight">{label}</h3>
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
        {/* Link to History Page */}
        <Link href={`/my/property/${type}/${propertyId}/history`} passHref>
          <Button variant="ghost" size="sm" className="-mx-2 h-9 w-full justify-between">
            <span className="text-sm">Показать историю</span>
            <ExternalLink className="h-4 w-4" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
