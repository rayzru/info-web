import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

type SectionCardProps = {
  icon: LucideIcon;
  title: string;
  children: ReactNode;
};

export function SectionCard({ icon: Icon, title, children }: SectionCardProps) {
  return (
    <section className="bg-card rounded-xl border p-4">
      <div className="mb-3 flex items-center gap-2">
        <Icon className="text-muted-foreground h-4 w-4" />
        <h3 className="text-muted-foreground text-sm font-medium">{title}</h3>
      </div>
      {children}
    </section>
  );
}
