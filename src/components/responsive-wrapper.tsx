import { type PropsWithChildren } from "react";

import { cn } from "~/lib/utils";

export default function ResponsiveWrapper({
  children,
  className,
}: Readonly<PropsWithChildren & { className?: string }>) {
  return (
    <div className={cn(`min-w-xs container mx-auto max-w-7xl`, className)}>
      <div className="flex flex-col">{children}</div>
    </div>
  );
}
