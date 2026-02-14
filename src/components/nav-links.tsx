"use client";

import { BookOpen, Info, MessageSquareText, Tag, Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "~/lib/utils";

import { Button } from "./ui/button";

const navigation = [
  {
    title: "Справочная",
    link: "/",
    icon: Info,
    testId: "nav-info",
  },
  {
    title: "Чего",
    link: "/howtos",
    icon: BookOpen,
    testId: "nav-howtos",
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
  {
    title: "Контакты",
    link: "/feedback",
    icon: MessageSquareText,
    testId: "nav-feedback",
  },
];

export function NavLinks() {
  const pathname = usePathname();

  const isActive = (link: string) => {
    if (link === "/") return pathname === "/";
    return pathname.startsWith(link);
  };

  return (
    <div className="hidden items-center gap-1 lg:flex">
      {navigation.map((item) => {
        const active = isActive(item.link);
        return (
          <Link key={item.title} href={item.link} passHref data-testid={item.testId}>
            <Button
              variant={active ? "secondary" : "ghost"}
              size="sm"
              className={cn(active && "text-primary font-medium")}
            >
              {item.title}
            </Button>
          </Link>
        );
      })}
    </div>
  );
}
