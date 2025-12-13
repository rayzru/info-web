"use client";

import { Info, Tag, Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button } from "./ui/button";
import { cn } from "~/lib/utils";

const navigation = [
  {
    title: "Справочная",
    link: "/",
    icon: Info,
    testId: "nav-info",
  },
  {
    title: "Объявления",
    link: "/listings",
    icon: Tag,
    testId: "nav-listings",
  },
  {
    title: "Сообщество",
    link: "/community",
    icon: Users,
    testId: "nav-community",
  },
];

export function NavLinks() {
  const pathname = usePathname();

  const isActive = (link: string) => {
    if (link === "/") return pathname === "/";
    return pathname.startsWith(link);
  };

  return (
    <div className="hidden lg:flex items-center gap-1">
      {navigation.map((item) => {
        const active = isActive(item.link);
        return (
          <Link key={item.title} href={item.link} passHref data-testid={item.testId}>
            <Button
              variant={active ? "secondary" : "ghost"}
              size="sm"
              className={cn(
                active && "text-primary font-medium"
              )}
            >
              {item.title}
            </Button>
          </Link>
        );
      })}
    </div>
  );
}
