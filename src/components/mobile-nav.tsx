"use client";

import { type MouseEvent, useState } from "react";

import {
  Bell,
  BookOpen,
  Building2,
  Info,
  KeyRound,
  LayoutDashboard,
  LogOut,
  Megaphone,
  Menu,
  MessageSquare,
  Monitor,
  Moon,
  Shield,
  Sun,
  Tag,
  User,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { useTheme } from "next-themes";

import { cn } from "~/lib/utils";
import { type Theme, useThemeStore } from "~/stores/theme-store";

import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import { useThemeTransition } from "./theme-transition";

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
    title: "Обратная связь",
    link: "/feedback",
    icon: MessageSquare,
    testId: "nav-feedback",
  },
];

interface MobileNavProps {
  user?: {
    name?: string | null;
    image?: string | null;
  } | null;
  isAdmin?: boolean;
}

export function MobileNav({ user, isAdmin }: MobileNavProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { theme, setTheme } = useThemeStore();
  const { setTheme: setNextTheme } = useTheme();
  const triggerTransition = useThemeTransition();

  const isActive = (link: string) => {
    if (link === "/") return pathname === "/";
    return pathname.startsWith(link);
  };

  const handleThemeChange = async (newTheme: Theme, e: MouseEvent) => {
    await triggerTransition(
      () => {
        setTheme(newTheme);
        setNextTheme(newTheme);
      },
      { x: e.clientX, y: e.clientY }
    );
  };

  const themeOptions = [
    { value: "system" as Theme, label: "Система", icon: Monitor },
    { value: "light" as Theme, label: "Светлая", icon: Sun },
    { value: "dark" as Theme, label: "Тёмная", icon: Moon },
  ];

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="xl:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Меню</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="gap-0! w-full overflow-hidden p-0 sm:w-[320px]">
        <div className="flex h-dvh max-h-full flex-col overflow-hidden">
          <SheetHeader className="shrink-0 p-4 pb-2">
            <SheetTitle>Меню</SheetTitle>
          </SheetHeader>

          {/* User section */}
          {user && (
            <div className="shrink-0">
              <div className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user.image ?? undefined} />
                    <AvatarFallback>{user.name?.slice(0, 2) ?? "U"}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="font-medium">{user.name ?? "Пользователь"}</span>
                    {isAdmin && (
                      <span className="text-muted-foreground text-xs">Администратор</span>
                    )}
                  </div>
                </div>
              </div>
              <Separator />
            </div>
          )}

          {/* Main navigation - scrollable area */}
          <nav className="min-h-0 flex-1 overflow-y-auto p-2">
            <div className="flex flex-col gap-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.link);
                return (
                  <Link
                    key={item.title}
                    href={item.link}
                    data-testid={item.testId}
                    onClick={() => setOpen(false)}
                  >
                    <Button
                      variant={active ? "secondary" : "ghost"}
                      className={cn(
                        "h-12 w-full justify-start gap-3",
                        active && "bg-primary/10 text-primary font-medium"
                      )}
                    >
                      <Icon className="h-5 w-5" />
                      {item.title}
                    </Button>
                  </Link>
                );
              })}
            </div>

            {/* User menu items */}
            {user && (
              <>
                <Separator className="my-2" />
                {/* Показываем подпункты только на страницах /my/* где сайдбар скрыт (md:hidden) */}
                {pathname.startsWith("/my") ? (
                  <>
                    <div className="flex flex-col gap-1">
                      <Link href="/my" onClick={() => setOpen(false)}>
                        <Button
                          variant={pathname === "/my" ? "secondary" : "ghost"}
                          className={cn(
                            "h-12 w-full justify-start gap-3",
                            pathname === "/my" && "bg-primary/10 text-primary font-medium"
                          )}
                        >
                          <LayoutDashboard className="h-5 w-5" />
                          Кабинет
                        </Button>
                      </Link>
                      <Link href="/my/profile" onClick={() => setOpen(false)}>
                        <Button
                          variant={pathname === "/my/profile" ? "secondary" : "ghost"}
                          className={cn(
                            "h-12 w-full justify-start gap-3",
                            pathname === "/my/profile" && "bg-primary/10 text-primary font-medium"
                          )}
                        >
                          <User className="h-5 w-5" />
                          Профиль
                        </Button>
                      </Link>
                      <Link href="/my/security" onClick={() => setOpen(false)}>
                        <Button
                          variant={pathname === "/my/security" ? "secondary" : "ghost"}
                          className={cn(
                            "h-12 w-full justify-start gap-3",
                            pathname === "/my/security" && "bg-primary/10 text-primary font-medium"
                          )}
                        >
                          <KeyRound className="h-5 w-5" />
                          Безопасность
                        </Button>
                      </Link>
                      <Link href="/my/notifications" onClick={() => setOpen(false)}>
                        <Button
                          variant={pathname === "/my/notifications" ? "secondary" : "ghost"}
                          className={cn(
                            "h-12 w-full justify-start gap-3",
                            pathname === "/my/notifications" &&
                              "bg-primary/10 text-primary font-medium"
                          )}
                        >
                          <Bell className="h-5 w-5" />
                          Уведомления
                        </Button>
                      </Link>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex flex-col gap-1">
                      <Link href="/my/property" onClick={() => setOpen(false)}>
                        <Button
                          variant={pathname === "/my/property" ? "secondary" : "ghost"}
                          className={cn(
                            "h-12 w-full justify-start gap-3",
                            pathname === "/my/property" && "bg-primary/10 text-primary font-medium"
                          )}
                        >
                          <Building2 className="h-5 w-5" />
                          Недвижимость
                        </Button>
                      </Link>
                      <Link href="/my/ads" onClick={() => setOpen(false)}>
                        <Button
                          variant={pathname === "/my/ads" ? "secondary" : "ghost"}
                          className={cn(
                            "h-12 w-full justify-start gap-3",
                            pathname === "/my/ads" && "bg-primary/10 text-primary font-medium"
                          )}
                        >
                          <Megaphone className="h-5 w-5" />
                          Объявления
                        </Button>
                      </Link>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col gap-1">
                    <Link href="/my" onClick={() => setOpen(false)}>
                      <Button variant="ghost" className="h-12 w-full justify-start gap-3">
                        <User className="h-5 w-5" />
                        Мой кабинет
                      </Button>
                    </Link>
                  </div>
                )}
              </>
            )}

            {/* Admin section */}
            {isAdmin && (
              <>
                <Separator className="my-2" />
                <div className="flex flex-col gap-1">
                  <Link href="/admin" onClick={() => setOpen(false)}>
                    <Button
                      variant={isActive("/admin") ? "secondary" : "ghost"}
                      className={cn(
                        "h-12 w-full justify-start gap-3",
                        isActive("/admin") && "bg-primary/10 text-primary font-medium"
                      )}
                    >
                      <Shield className="h-5 w-5" />
                      Админ
                    </Button>
                  </Link>
                </div>
              </>
            )}
          </nav>

          {/* Theme selector */}
          <div className="shrink-0">
            <Separator />
            <div className="p-2">
              <div className="text-muted-foreground px-3 py-2 text-xs">Тема</div>
              <div className="flex gap-1">
                {themeOptions.map((option) => {
                  const Icon = option.icon;
                  const isSelected = theme === option.value;
                  return (
                    <Button
                      key={option.value}
                      variant={isSelected ? "secondary" : "ghost"}
                      size="sm"
                      className={cn("flex-1 gap-2", isSelected && "bg-primary/10 text-primary")}
                      onClick={(e) => handleThemeChange(option.value, e)}
                    >
                      <Icon className="h-4 w-4" />
                      {option.label}
                    </Button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Footer with logout */}
          {user && (
            <div className="shrink-0">
              <Separator />
              <div className="p-2">
                <Button
                  variant="ghost"
                  className="text-destructive hover:text-destructive hover:bg-destructive/10 h-12 w-full justify-start gap-3"
                  onClick={() => signOut()}
                >
                  <LogOut className="h-5 w-5" />
                  Выйти
                </Button>
              </div>
            </div>
          )}

          {/* Login button for non-authenticated users (hidden on auth pages) */}
          {!user &&
            !pathname.startsWith("/login") &&
            !pathname.startsWith("/register") &&
            !pathname.startsWith("/forgot-password") &&
            !pathname.startsWith("/reset-password") && (
              <div className="shrink-0">
                <Separator />
                <div className="p-2">
                  <Link href="/login" onClick={() => setOpen(false)}>
                    <Button className="h-12 w-full">Войти</Button>
                  </Link>
                </div>
              </div>
            )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
