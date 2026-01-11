import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

type SectionCardProps = {
  icon: LucideIcon;
  title: string;
  children: ReactNode;
};

export function SectionCard({ icon: Icon, title, children }: SectionCardProps) {
  return (
    <section className="rounded-xl border bg-card p-4">
      <div className="mb-3 flex items-center gap-2">
        <Icon className="h-4 w-4 text-muted-foreground" />
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
      </div>
      {children}
    </section>
  );
}
