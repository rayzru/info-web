"use client";

import { Phone } from "lucide-react";
import { cn } from "~/lib/utils";

interface EmergencyPhoneButtonProps {
  className?: string;
}

/**
 * Emergency phone button for UK dispatch service
 * Subtle inline design below search
 */
export function EmergencyPhoneButton({
  className,
}: EmergencyPhoneButtonProps) {
  const emergencyPhone = "+7 (960) 448-08-18"; // Диспетчерcкая УК
  const normalizedPhone = emergencyPhone.replace(/\D/g, "");
  const telLink = `tel:+${normalizedPhone}`;

  return (
    <a
      href={telLink}
      className={cn(
        "inline-flex items-center gap-2 rounded-md border border-border bg-muted/30 px-3 py-2 text-sm transition-colors hover:bg-muted/50 hover:border-red-500/30",
        className
      )}
    >
      <Phone className="h-4 w-4 text-muted-foreground" />
      <span className="text-muted-foreground">
        Аварийная диспетчерская:
      </span>
      <span className="font-mono font-medium text-foreground">
        {emergencyPhone}
      </span>
      <span className="ml-1 rounded bg-red-500/10 px-1.5 py-0.5 text-xs font-medium text-red-600 dark:text-red-400">
        24/7
      </span>
    </a>
  );
}
