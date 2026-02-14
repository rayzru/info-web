import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { Button } from "./ui/button";

interface PageHeaderProps {
  title: string;
  description?: string;
  backHref?: string;
  icon?: React.ReactNode;
  children?: React.ReactNode;
}

export function PageHeader({ title, description, backHref, icon, children }: PageHeaderProps) {
  return (
    <div className="mb-6 mt-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      {/* Left: Back + Icon + Title */}
      <div className="flex items-center gap-3">
        {backHref && (
          <Link href={backHref}>
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
        )}
        {icon}
        <div>
          <h1 className="text-2xl font-bold">{title}</h1>
          {description && <p className="text-muted-foreground text-sm">{description}</p>}
        </div>
      </div>

      {/* Right: Optional children (filters, actions, etc.) */}
      {children && <div className="flex items-center gap-1">{children}</div>}
    </div>
  );
}
