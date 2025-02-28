import { type PropsWithChildren } from "react";

export default function ResponsiveWrapper({
  children,
  className,
}: Readonly<PropsWithChildren & { className?: string }>) {
  return (
    <div className={`container overflow-y-auto mx-auto sm:max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl ${className}`}>
      <div className="flex flex-col">
        {children}
      </div>
    </div>
  );
} 
