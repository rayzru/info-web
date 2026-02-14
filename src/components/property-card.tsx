"use client";

import { Car, Check, Home, X } from "lucide-react";
import Link from "next/link";

import { Card, CardContent } from "~/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "~/components/ui/tooltip";
import { cn } from "~/lib/utils";

// ============ Constants ============

const ROLE_LABELS: Record<string, string> = {
  ApartmentOwner: "Собственник",
  ApartmentResident: "Проживающий",
  ParkingOwner: "Собственник",
  ParkingResident: "Арендатор",
};

const STATUS_LABELS: Record<string, string> = {
  approved: "Одобрено",
  rejected: "Отклонено",
  pending: "Ожидает",
  review: "На рассмотрении",
};

// ============ Component ============

interface PropertyCardProps {
  type: "apartment" | "parking";
  propertyId: string;
  label: string;
  role: string;
  status: string;
  disableLink?: boolean;
  actionButtons?: React.ReactNode;
}

export function PropertyCard({
  type,
  propertyId,
  label,
  role,
  status,
  disableLink = false,
  actionButtons,
}: PropertyCardProps) {
  // Split label into lines: "кв. 209\nСтроение 2" -> ["кв. 209", "Строение 2"]
  const [propertyNumber, building] = label.split("\n");

  const cardContent = (
    <Card className="overflow-hidden">
      {/* Compact header with icon and number */}
      <div className="bg-muted relative flex h-24 items-center justify-center">
        {/* Background icon */}
        {type === "apartment" ? (
          <Home className="text-muted-foreground/10 absolute h-16 w-16" />
        ) : (
          <Car className="text-muted-foreground/10 absolute h-16 w-16" />
        )}

        {/* Property number */}
        <div className="relative z-10 text-center">
          <div className="text-3xl font-black">{propertyNumber}</div>
        </div>

        {/* Status badge (top-right) */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="absolute right-2 top-2">
                <div
                  className={cn(
                    "flex h-6 w-6 items-center justify-center rounded-full",
                    status === "approved" && "bg-green-500",
                    status === "rejected" && "bg-red-500",
                    status === "pending" && "bg-yellow-500",
                    status === "review" && "bg-blue-500"
                  )}
                >
                  {status === "approved" && <Check className="h-3.5 w-3.5 text-white" />}
                  {status === "rejected" && <X className="h-3.5 w-3.5 text-white" />}
                  {status === "pending" && (
                    <span className="text-[10px] font-bold text-white">...</span>
                  )}
                  {status === "review" && (
                    <span className="text-[10px] font-bold text-white">?</span>
                  )}
                </div>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{STATUS_LABELS[status] ?? status}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Compact content */}
      <CardContent className="relative space-y-1 p-3 text-center">
        <p className="text-sm font-medium">{building}</p>
        <p className="text-muted-foreground text-xs">{ROLE_LABELS[role]}</p>

        {/* Action buttons in bottom-right corner */}
        {actionButtons && <div className="absolute bottom-2 right-2">{actionButtons}</div>}
      </CardContent>
    </Card>
  );

  if (disableLink) {
    return cardContent;
  }

  return (
    <Link
      href={`/my/property/${type}/${propertyId}/history`}
      className="block transition-opacity hover:opacity-80"
    >
      {cardContent}
    </Link>
  );
}
