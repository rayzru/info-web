"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  Building2,
  Calendar,
  ClipboardList,
  FileText,
  Image as ImageIcon,
  LayoutDashboard,
  LogOut,
  Megaphone,
  MessageSquare,
  Newspaper,
  ScrollText,
  Settings,
  Users,
  UserX,
} from "lucide-react";
import { signOut } from "next-auth/react";

import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
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

interface AdminNavigationProps {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
  navGroups: AdminNavGroup[];
}

export function AdminNavigation({ user, navGroups }: AdminNavigationProps) {
  const pathname = usePathname();

  return (
    <aside className="sticky top-4 flex h-[calc(100vh-2rem)] w-full flex-col rounded-lg border bg-card">
      {/* User Profile Section */}
      <div className="p-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user.image ?? undefined} />
            <AvatarFallback>
              {user.name?.slice(0, 2).toUpperCase() ?? "AD"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 overflow-hidden">
            <p className="truncate text-sm font-medium">{user.name}</p>
            <p className="truncate text-xs text-muted-foreground">
              {user.email}
            </p>
          </div>
        </div>

        <Link href="/my" className="mt-3 block" data-testid="admin-nav-cabinet">
          <Button variant="outline" size="sm" className="w-full">
            <LayoutDashboard className="mr-2 h-4 w-4" />
            Кабинет
          </Button>
        </Link>
      </div>

      <Separator />

      {/* Navigation Items - Grouped */}
      <nav className="flex-1 overflow-y-auto p-2">
        <div className="space-y-4">
          {navGroups.map((group) => (
            <div key={group.title}>
              <h3 className="mb-1.5 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">
                {group.title}
              </h3>
              <ul className="space-y-0.5">
                {group.items.map((item) => {
                  const Icon = iconMap[item.icon];
                  const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

                  // Generate testId from href: /admin/users -> admin-nav-users
                  const testId = `admin-nav-${item.href.split("/").pop() ?? "item"}`;

                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={cn(
                          "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                          isActive
                            ? "bg-accent text-accent-foreground"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground",
                        )}
                        data-testid={testId}
                      >
                        {Icon && <Icon className="h-4 w-4 opacity-60" />}
                        {item.title}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </nav>

      <Separator />

      {/* Logout Section */}
      <div className="p-2">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start text-muted-foreground hover:text-foreground"
          onClick={() => signOut({ callbackUrl: "/" })}
          data-testid="admin-nav-logout"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Выйти
        </Button>
      </div>
    </aside>
  );
}
