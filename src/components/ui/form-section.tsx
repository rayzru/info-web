import { type LucideIcon } from "lucide-react";

import { cn } from "~/lib/utils";

interface FormSectionProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  children: React.ReactNode;
  className?: string;
}

export function FormSection({
  title,
  description,
  icon: Icon,
  children,
  className,
}: FormSectionProps) {
  return (
    <section className={cn("space-y-6", className)}>
      <div className="border-b pb-3">
        <div className="flex items-center gap-2">
          {Icon && <Icon className="text-muted-foreground h-5 w-5" />}
          <h2 className="text-lg font-medium">{title}</h2>
        </div>
        {description && <p className="text-muted-foreground mt-1 text-sm">{description}</p>}
      </div>
      <div className="space-y-8">{children}</div>
    </section>
  );
}
