"use client";

import { useState } from "react";
import {
  Menu,
  Info,
  Map,
  Monitor,
  Moon,
  Sun,
  Tag,
  Users,
  LogOut,
  User,
  Shield,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Separator } from "./ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { cn } from "~/lib/utils";
import { useThemeStore, type Theme } from "~/stores/theme-store";
import { useTheme } from "next-themes";

const navigation = [
  {
    title: "Справочная",
    link: "/",
    icon: Info,
    testId: "nav-info",
  },
  {
    title: "Карта",
    link: "/map",
    icon: Map,
    testId: "nav-map",
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

  const isActive = (link: string) => {
    if (link === "/") return pathname === "/";
    return pathname.startsWith(link);
  };

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
    setNextTheme(newTheme);
  };

  const themeOptions = [
    { value: "system" as Theme, label: "Система", icon: Monitor },
    { value: "light" as Theme, label: "Светлая", icon: Sun },
    { value: "dark" as Theme, label: "Тёмная", icon: Moon },
  ];

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Меню</span>
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="w-full sm:w-[320px] p-0"
      >
        <div className="flex flex-col h-full">
          <SheetHeader className="p-4 pb-2">
            <SheetTitle>Меню</SheetTitle>
          </SheetHeader>

          {/* User section */}
          {user && (
            <>
              <div className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user.image ?? undefined} />
                    <AvatarFallback>
                      {user.name?.slice(0, 2) ?? "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="font-medium">{user.name ?? "Пользователь"}</span>
                    {isAdmin && (
                      <span className="text-xs text-muted-foreground">Администратор</span>
                    )}
                  </div>
                </div>
              </div>
              <Separator />
            </>
          )}

          {/* Main navigation */}
          <nav className="flex-1 overflow-auto p-2">
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
                        "w-full justify-start gap-3 h-12",
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
                <div className="flex flex-col gap-1">
                  <Link href="/my" onClick={() => setOpen(false)}>
                    <Button
                      variant={isActive("/my") ? "secondary" : "ghost"}
                      className={cn(
                        "w-full justify-start gap-3 h-12",
                        isActive("/my") && "bg-primary/10 text-primary font-medium"
                      )}
                    >
                      <User className="h-5 w-5" />
                      Мой кабинет
                    </Button>
                  </Link>
                </div>
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
                        "w-full justify-start gap-3 h-12",
                        isActive("/admin") && "bg-primary/10 text-primary font-medium"
                      )}
                    >
                      <Shield className="h-5 w-5" />
                      Админ-панель
                    </Button>
                  </Link>
                </div>
              </>
            )}
          </nav>

          {/* Theme selector */}
          <Separator />
          <div className="p-2">
            <div className="text-xs text-muted-foreground px-3 py-2">Тема</div>
            <div className="flex gap-1">
              {themeOptions.map((option) => {
                const Icon = option.icon;
                const isSelected = theme === option.value;
                return (
                  <Button
                    key={option.value}
                    variant={isSelected ? "secondary" : "ghost"}
                    size="sm"
                    className={cn(
                      "flex-1 gap-2",
                      isSelected && "bg-primary/10 text-primary"
                    )}
                    onClick={() => handleThemeChange(option.value)}
                  >
                    <Icon className="h-4 w-4" />
                    {option.label}
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Footer with logout */}
          {user && (
            <>
              <Separator />
              <div className="p-2">
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3 h-12 text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={() => signOut()}
                >
                  <LogOut className="h-5 w-5" />
                  Выйти
                </Button>
              </div>
            </>
          )}

          {/* Login button for non-authenticated users */}
          {!user && (
            <>
              <Separator />
              <div className="p-2">
                <Link href="/login" onClick={() => setOpen(false)}>
                  <Button className="w-full h-12">
                    Войти
                  </Button>
                </Link>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
