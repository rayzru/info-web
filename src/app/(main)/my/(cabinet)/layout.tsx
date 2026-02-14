"use client";

import {
  Bell,
  Building2,
  KeyRound,
  LayoutDashboard,
  LogOut,
  Megaphone,
  MessageSquare,
  Settings,
  Shield,
  User,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";

import { cn } from "~/lib/utils";
import { api } from "~/trpc/react";

interface NavigationItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  testId: string;
  showBadge?: boolean;
  disabled?: boolean;
  description?: string;
}

type NavigationEntry = NavigationItem | "separator";

const navigationItems: NavigationEntry[] = [
  {
    title: "Кабинет",
    href: "/my",
    icon: LayoutDashboard,
    testId: "nav-cabinet",
  },
  "separator",
  {
    title: "Профиль",
    href: "/my/profile",
    icon: User,
    testId: "nav-profile",
  },
  {
    title: "Безопасность",
    href: "/my/security",
    icon: KeyRound,
    testId: "nav-security",
  },
  {
    title: "Уведомления",
    href: "/my/notifications",
    icon: Bell,
    testId: "nav-notifications",
    showBadge: true,
  },
  {
    title: "Настройки",
    href: "/my/settings",
    icon: Settings,
    testId: "nav-settings",
  },
  "separator",
  {
    title: "Недвижимость",
    href: "/my/property",
    icon: Building2,
    testId: "nav-property",
  },
  {
    title: "Объявления",
    href: "/my/ads",
    icon: Megaphone,
    testId: "nav-ads",
  },
  {
    title: "Публикации",
    href: "/my/publications",
    icon: MessageSquare,
    testId: "nav-publications",
  },
];

export default function CabinetLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { data: unreadCount } = api.notifications.unreadCount.useQuery(
    undefined,
    {
      enabled: !!session?.user, // Only fetch if user is logged in
      refetchInterval: 30000, // Refetch every 30 seconds
    }
  );

  const isAdmin = session?.user?.isAdmin;

  return (
    <div className="py-6">
      <div className="flex gap-8">
        {/* Main Content */}
        <main className="min-w-0 flex-1">{children}</main>

        {/* Sidebar Navigation (Right side) */}
        <aside className="hidden w-64 shrink-0 md:block">
          <nav className="sticky top-6 space-y-1 pt-14">
            {navigationItems.map((entry, index) => {
              if (entry === "separator") {
                return <div key={`sep-${index}`} className="my-2 border-t" />;
              }

              const item = entry;
              const isActive = pathname === item.href;
              const Icon = item.icon;
              const showBadge = item.showBadge && unreadCount && unreadCount > 0;
              const isPrimaryHighlight = showBadge && !isActive;

              return (
                <Link
                  key={item.href}
                  href={item.disabled ? "#" : item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                    isActive
                      ? "bg-secondary text-primary font-medium"
                      : isPrimaryHighlight
                        ? "bg-primary text-primary-foreground hover:bg-primary/90 font-medium"
                        : item.disabled
                          ? "text-muted-foreground/50 cursor-not-allowed"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                  onClick={(e) => item.disabled && e.preventDefault()}
                  data-testid={item.testId}
                >
                  <div className="relative">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <div>{item.title}</div>
                    {item.disabled && <div className="text-xs opacity-60">{item.description}</div>}
                  </div>
                  {showBadge && (
                    <span
                      className={cn(
                        "flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[11px] font-medium",
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "bg-primary-foreground text-primary"
                      )}
                    >
                      {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                  )}
                </Link>
              );
            })}

            {/* Admin Link */}
            {isAdmin && (
              <>
                <div className="my-3 border-t" />
                <Link
                  href="/admin"
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                    "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                  data-testid="nav-admin"
                >
                  <Shield className="h-4 w-4" />
                  <div>Администрация</div>
                </Link>
              </>
            )}

            {/* Logout */}
            <div className="my-3 border-t" />
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className={cn(
                "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                "text-muted-foreground hover:text-destructive hover:bg-destructive/10"
              )}
              data-testid="nav-logout"
            >
              <LogOut className="h-4 w-4" />
              <div>Выйти</div>
            </button>
          </nav>
        </aside>
      </div>
    </div>
  );
}
