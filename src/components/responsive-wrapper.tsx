import { type PropsWithChildren } from "react";

import { cn } from "~/lib/utils";

export default function ResponsiveWrapper({
  children,
  className,
}: Readonly<PropsWithChildren & { className?: string }>) {
  return (
    <div
      className={cn(
        `container mx-auto max-w-7xl min-w-xs px-[20px]`,
        className,
      )}
    >
      <div className="flex flex-col">{children}</div>
    </div>
  );
}
