"use client";

import { cn } from "~/lib/utils";

interface StepHeaderProps {
  /** Step number (1-4) */
  number: number;
  /** Step label (e.g., "Тип", "Строение") */
  label: string;
  /** Selected value to display as badge */
  value?: string;
  /** Whether this step is currently active */
  isActive: boolean;
  /** Whether this step is completed */
  isCompleted: boolean;
}

/**
 * Step header component showing number, label, and optional badge
 * ЛИНИЯ = НОМЕР / ПОДПИСЬ / ВЫБРАННОЕ ЗНАЧЕНИЕ
 */
export function StepHeader({ number, label, value, isActive, isCompleted }: StepHeaderProps) {
  return (
    <div className="grid min-h-10 grid-cols-[auto_1fr_auto] items-center gap-2 py-2">
      {/* Step number circle */}
      <div
        className={cn(
          "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-medium transition-all",
          isCompleted && "bg-primary text-primary-foreground",
          isActive && "bg-primary text-primary-foreground ring-primary/20 ring-2",
          !isCompleted && !isActive && "bg-muted text-muted-foreground"
        )}
      >
        {isCompleted ? "✓" : number}
      </div>

      {/* Step label */}
      <div
        className={cn(
          "text-sm font-medium",
          (isActive || isCompleted) && "text-foreground",
          !isActive && !isCompleted && "text-muted-foreground"
        )}
      >
        {label}
      </div>

      {/* Completed value badge */}
      <div className="flex items-center justify-end">
        {isCompleted && value && (
          <span className="bg-primary/10 text-primary inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium">
            {value}
          </span>
        )}
      </div>
    </div>
  );
}
