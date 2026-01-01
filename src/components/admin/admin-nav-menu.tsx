"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  Building2,
  Calendar,
  ChevronDown,
  ClipboardList,
  ExternalLink,
  FileText,
  Image as ImageIcon,
  LayoutDashboard,
  LogOut,
  Megaphone,
  MessageSquare,
  Newspaper,
  ScrollText,
  Send,
  Settings,
  Users,
  UserX,
} from "lucide-react";
import { signOut } from "next-auth/react";

import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "~/components/ui/navigation-menu";
import { cn } from "~/lib/utils";
import { type AdminNavGroup } from "~/server/auth/rbac";

// Icon mapping for dynamic rendering
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Users,
  Building2,
  ClipboardList,
  FileText,
  Settings,
  ScrollText,
  BookOpen,
  UserX,
  Megaphone,
  Newspaper,
  ImageIcon,
  Calendar,
  MessageSquare,
};

// Admin Telegram group URL
const ADMIN_TELEGRAM_GROUP = "https://t.me/+NjBCSUfUU7QyMDdi";

interface AdminNavMenuProps {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
  navGroups: AdminNavGroup[];
  telegramGroupUrl?: string;
}

export function AdminNavMenu({ user, navGroups, telegramGroupUrl }: AdminNavMenuProps) {
  const pathname = usePathname();
  const tgUrl = telegramGroupUrl ?? ADMIN_TELEGRAM_GROUP;

  return (
    <header className="sticky top-0 z-50 border-b bg-card">
      <div className="container mx-auto flex h-14 items-center justify-between gap-4 px-6">
        {/* Logo / Dashboard Link */}
        <Link
          href="/admin"
          className="flex items-center gap-2 font-semibold"
          data-testid="admin-nav-dashboard"
        >
          <LayoutDashboard className="h-5 w-5" />
          <span className="hidden sm:inline">Админ</span>
        </Link>

        {/* Navigation Menu */}
        <NavigationMenu className="flex-1">
          <NavigationMenuList>
            {navGroups.map((group) => (
              <NavigationMenuItem key={group.title} hasSubmenu>
                <NavigationMenuTrigger className="h-9">
                  {group.title}
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[300px] gap-1 p-2">
                    {group.items.map((item) => {
                      const Icon = iconMap[item.icon];
                      const isActive =
                        pathname === item.href ||
                        pathname.startsWith(`${item.href}/`);

                      // Generate testId from href: /admin/users -> admin-nav-users
                      const testId = `admin-nav-${item.href.split("/").pop() ?? "item"}`;

                      return (
                        <li key={item.href}>
                          <NavigationMenuLink asChild>
                            <Link
                              href={item.href}
                              className={cn(
                                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                                isActive && "bg-accent text-accent-foreground"
                              )}
                              data-testid={testId}
                            >
                              {Icon && (
                                <Icon className="h-4 w-4 shrink-0 opacity-60" />
                              )}
                              {item.title}
                            </Link>
                          </NavigationMenuLink>
                        </li>
                      );
                    })}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        {/* Telegram Group Link */}
        <a
          href={tgUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-9 items-center gap-2 rounded-md px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          data-testid="admin-nav-telegram"
        >
          <Send className="h-4 w-4" />
          <span className="hidden lg:inline">Чат админов</span>
          <ExternalLink className="h-3 w-3 opacity-50" />
        </a>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex h-9 items-center gap-2 px-2"
              data-testid="admin-nav-user-menu"
            >
              <Avatar className="h-7 w-7">
                <AvatarImage src={user.image ?? undefined} />
                <AvatarFallback className="text-xs">
                  {user.name?.slice(0, 2).toUpperCase() ?? "AD"}
                </AvatarFallback>
              </Avatar>
              <span className="hidden max-w-[120px] truncate text-sm font-medium sm:inline">
                {user.name}
              </span>
              <ChevronDown className="h-4 w-4 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="px-2 py-1.5">
              <p className="text-sm font-medium">{user.name}</p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/my" className="gap-2" data-testid="admin-nav-cabinet">
                <LayoutDashboard className="h-4 w-4" />
                Кабинет
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => signOut({ callbackUrl: "/" })}
              className="gap-2 text-destructive focus:text-destructive"
              data-testid="admin-nav-logout"
            >
              <LogOut className="h-4 w-4" />
              Выйти
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
