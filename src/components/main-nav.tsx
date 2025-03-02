import { Info, ParkingCircle, Users } from "lucide-react";

import { cn } from "~/lib/utils";

import { MainNavItem } from "./main-nav-item";

export function MainNav({
  className,
  ...props
}: Readonly<React.HTMLAttributes<HTMLElement>>) {
  return (
    <nav
      className={cn("flex items-center space-x-4 lg:space-x-6", className)}
      {...props}
    >
      <MainNavItem title="Справочная" link="/info" icon={<Info />} />
      <MainNavItem title="Паркинг" link="/parking" icon={<ParkingCircle />} />
      <MainNavItem title="Сообщество" link="/community" icon={<Users />} />
      {/* <MainNavItem title="Admin" link="/admin" icon={<Wrench />} /> */}
    </nav>
  );
}
