import { type LucideIcon } from "lucide-react";
import Link from "next/link";

import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { cn } from "~/lib/utils";

interface EmptyStateCardProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
    variant?: "default" | "outline" | "secondary";
  };
  className?: string;
  variant?: "default" | "warning" | "muted";
}

const variantClasses = {
  default: "",
  warning: "border-yellow-200 bg-yellow-50 dark:border-yellow-900 dark:bg-yellow-950/30",
  muted: "border-muted",
};

const iconVariantClasses = {
  default: "bg-muted text-muted-foreground",
  warning: "bg-yellow-500/20 text-yellow-600 dark:text-yellow-400",
  muted: "bg-muted text-muted-foreground",
};

export function EmptyStateCard({
  icon: Icon,
  title,
  description,
  action,
  className,
  variant = "default",
}: EmptyStateCardProps) {
  return (
    <Card className={cn(variantClasses[variant], className)}>
      <CardHeader className="text-center">
        {Icon && (
          <div
            className={cn(
              "mx-auto rounded-lg p-4 w-fit mb-2",
              iconVariantClasses[variant]
            )}
          >
            <Icon className="h-8 w-8" />
          </div>
        )}
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      {action && (
        <CardContent className="text-center">
          {action.href ? (
            <Button variant={action.variant ?? "default"} asChild>
              <Link href={action.href}>{action.label}</Link>
            </Button>
          ) : (
            <Button variant={action.variant ?? "default"} onClick={action.onClick}>
              {action.label}
            </Button>
          )}
        </CardContent>
      )}
    </Card>
  );
}
