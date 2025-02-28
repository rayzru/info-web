"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import ResponsiveWrapper from "./responsive-wrapper";

const weCategories = [
  {
    name: "Чаты",
    slug: "chats",
  },
  {
    name: "Правила сообщества",
    slug: "rules",
  },
];

export function CommunityNav() {
  const pathname = usePathname();

  return (
    <ResponsiveWrapper>
      <ScrollArea className="flex flex-col gap-2 my-6 ">
        <div className="flex items-center">
          <CommunityNavLink
            category={{ name: "О проекте", slug: "" }}
            isActive={pathname === "/community"}
          />
          {weCategories.map((category) => (
            <CommunityNavLink
              key={category.slug}
              category={category}
              isActive={pathname === `/community/${category.slug}`}
            />
          ))}
        </div>
        <ScrollBar orientation="horizontal" className="invisible" />
      </ScrollArea>
    </ResponsiveWrapper>
  );
}

function CommunityNavLink({
  category,
  isActive,
}: {
  category: (typeof weCategories)[number];
  isActive: boolean;
}) {
  return (
    <Link
      href={`/community/${category.slug}`}
      key={category.slug}
      className="flex h-7 shrink-0 items-center justify-center whitespace-nowrap rounded-full px-4 text-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground data-[active=true]:bg-muted data-[active=true]:text-foreground"
      data-active={isActive}
    >
      {category.name}
    </Link>
  );
}
