"use client";

import { useState } from "react";

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
  Menu,
  MessageSquare,
  Newspaper,
  ScrollText,
  Send,
  Settings,
  Users,
  UserX,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
import { Separator } from "~/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="sticky top-0 z-50 border-b bg-card">
      <div className="container mx-auto flex h-14 items-center justify-between gap-4 px-4 md:px-6">
        {/* Logo / Dashboard Link */}
        <Link
          href="/admin"
          className="flex items-center gap-2 font-semibold"
          data-testid="admin-nav-dashboard"
        >
          <LayoutDashboard className="h-5 w-5" />
          <span className="hidden sm:inline">Админ</span>
        </Link>

        {/* Desktop Navigation Menu - hidden on mobile */}
        <NavigationMenu className="hidden flex-1 md:flex">
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
                      const active = isActive(item.href);
                      const testId = `admin-nav-${item.href.split("/").pop() ?? "item"}`;

                      return (
                        <li key={item.href}>
                          <NavigationMenuLink asChild>
                            <Link
                              href={item.href}
                              className={cn(
                                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                                active && "bg-accent text-accent-foreground"
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

        {/* Telegram Group Link - hidden on small mobile */}
        <a
          href={tgUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden h-9 items-center gap-2 rounded-md px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground sm:flex"
          data-testid="admin-nav-telegram"
        >
          <Send className="h-4 w-4" />
          <span className="hidden lg:inline">Чат админов</span>
          <ExternalLink className="h-3 w-3 opacity-50" />
        </a>

        {/* Desktop User Menu - hidden on mobile */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="hidden h-9 items-center gap-2 px-2 md:flex"
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

        {/* Mobile Menu Button */}
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Меню</span>
            </Button>
          </SheetTrigger>
          <SheetContent
            side="right"
            className="w-full sm:w-[320px] p-0 gap-0! overflow-hidden"
          >
            <div className="flex h-dvh max-h-full flex-col overflow-hidden">
              <SheetHeader className="shrink-0 p-4 pb-2">
                <SheetTitle>Админ-панель</SheetTitle>
              </SheetHeader>

              {/* User info */}
              <div className="shrink-0">
                <div className="flex items-center gap-3 px-4 py-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user.image ?? undefined} />
                    <AvatarFallback>
                      {user.name?.slice(0, 2).toUpperCase() ?? "AD"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="font-medium">{user.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {user.email}
                    </span>
                  </div>
                </div>
                <Separator />
              </div>

              {/* Navigation - scrollable */}
              <nav className="min-h-0 flex-1 overflow-y-auto p-2">
                {/* Dashboard link */}
                <Link
                  href="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Button
                    variant={pathname === "/admin" ? "secondary" : "ghost"}
                    className={cn(
                      "mb-2 h-11 w-full justify-start gap-3",
                      pathname === "/admin" && "bg-primary/10 font-medium text-primary"
                    )}
                  >
                    <LayoutDashboard className="h-5 w-5" />
                    Дашборд
                  </Button>
                </Link>

                {/* Nav groups */}
                {navGroups.map((group) => (
                  <div key={group.title} className="mb-4">
                    <div className="mb-1 px-3 text-xs font-medium text-muted-foreground">
                      {group.title}
                    </div>
                    <div className="flex flex-col gap-1">
                      {group.items.map((item) => {
                        const Icon = iconMap[item.icon];
                        const active = isActive(item.href);

                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            <Button
                              variant={active ? "secondary" : "ghost"}
                              className={cn(
                                "h-11 w-full justify-start gap-3",
                                active && "bg-primary/10 font-medium text-primary"
                              )}
                            >
                              {Icon && <Icon className="h-5 w-5" />}
                              {item.title}
                            </Button>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                ))}

                <Separator className="my-2" />

                {/* Additional links */}
                <div className="flex flex-col gap-1">
                  <a
                    href={tgUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-11 items-center gap-3 rounded-md px-4 text-sm font-medium transition-colors hover:bg-accent"
                  >
                    <Send className="h-5 w-5" />
                    Чат админов
                    <ExternalLink className="ml-auto h-4 w-4 opacity-50" />
                  </a>
                  <Link
                    href="/my"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Button
                      variant="ghost"
                      className="h-11 w-full justify-start gap-3"
                    >
                      <LayoutDashboard className="h-5 w-5" />
                      Кабинет
                    </Button>
                  </Link>
                </div>
              </nav>

              {/* Logout button - fixed at bottom */}
              <div className="shrink-0">
                <Separator />
                <div className="p-2">
                  <Button
                    variant="ghost"
                    className="h-12 w-full justify-start gap-3 text-destructive hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => signOut({ callbackUrl: "/" })}
                  >
                    <LogOut className="h-5 w-5" />
                    Выйти
                  </Button>
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
