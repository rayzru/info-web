import { type LucideIcon } from "lucide-react";

import { Badge } from "~/components/ui/badge";
import { cn } from "~/lib/utils";

export interface StatusConfig {
  label: string;
  color: "green" | "yellow" | "red" | "gray" | "blue" | "purple" | "orange";
  icon?: LucideIcon;
}

export type StatusConfigMap<T extends string> = Record<T, StatusConfig>;

interface StatusBadgeProps<T extends string> {
  status: T;
  config: StatusConfigMap<T>;
  size?: "sm" | "md";
  className?: string;
}

const colorClasses: Record<StatusConfig["color"], string> = {
  green: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  yellow: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  red: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  gray: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400",
  blue: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  purple: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  orange: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
};

export function StatusBadge<T extends string>({
  status,
  config,
  size = "sm",
  className,
}: StatusBadgeProps<T>) {
  const statusConfig = config[status];
  if (!statusConfig) return null;

  const Icon = statusConfig.icon;

  return (
    <Badge
      variant="secondary"
      className={cn(
        "border-0 font-normal",
        colorClasses[statusConfig.color],
        size === "sm" && "text-xs px-2 py-0.5",
        size === "md" && "text-sm px-2.5 py-1",
        className
      )}
    >
      {Icon && <Icon className={cn("mr-1", size === "sm" ? "h-3 w-3" : "h-4 w-4")} />}
      {statusConfig.label}
    </Badge>
  );
}
