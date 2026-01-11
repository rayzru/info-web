import Link from "next/link";

import { auth } from "~/server/auth";
import { isAdmin, type UserRole } from "~/server/auth/rbac";
import { getRankConfig } from "~/lib/ranks";
import { cn } from "~/lib/utils";

import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { NavLogo } from "./nav-logo";
import { MobileNav } from "./mobile-nav";
import { NavLinks } from "./nav-links";

// Pages where we don't show the login button (user is already on auth flow)
const AUTH_PAGES = ["/login", "/register", "/forgot-password", "/reset-password"];

interface NavigationProps {
  pathname?: string;
}

export async function Navigation({ pathname = "" }: NavigationProps) {
  const session = await auth();
  const userRoles = (session?.user?.roles ?? []) as UserRole[];
  const hasAdminAccess = isAdmin(userRoles);
  const rankConfig = getRankConfig(userRoles);

  return (
    <div className="mt-4 grid grid-cols-[1fr_auto_1fr] items-center gap-4 xl:gap-6">
      {/* Left side: Logo - aligned left */}
      <div className="flex items-center justify-start">
        <NavLogo />
      </div>

      {/* Center: Desktop navigation - truly centered */}
      <NavLinks />

      {/* Right side: user actions - aligned right */}
      <div className="flex items-center justify-end gap-2">
        {!session && !AUTH_PAGES.some((p) => pathname.startsWith(p)) && (
          <Link passHref href={"/login"} data-testid="nav-login">
            <Button>Войти</Button>
          </Link>
        )}

        {session && (
          <>
            {/* Desktop: user menu with role-colored ring, auto width up to sidebar width */}
            <div className="hidden xl:flex items-center justify-end max-w-64">
              <Link href="/my" passHref data-testid="nav-user-cabinet">
                <Button variant="ghost" size="sm" className="justify-start">
                  <Avatar className={cn(
                    "h-5 w-5 shrink-0 ring-2 ring-offset-1 ring-offset-background",
                    rankConfig.ringColor
                  )}>
                    <AvatarImage src={session.user.image ?? undefined} />
                    <AvatarFallback className="text-[10px]">
                      {session.user.name?.slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="truncate">{session.user.name ?? "Кабинет"}</span>
                </Button>
              </Link>
            </div>

            {/* Mobile/Tablet: only avatar with role ring */}
            <Link href="/my" passHref data-testid="nav-user-cabinet-mobile" className="xl:hidden">
              <Button variant="ghost" size="icon">
                <Avatar className={cn(
                  "h-6 w-6 ring-2 ring-offset-1 ring-offset-background",
                  rankConfig.ringColor
                )}>
                  <AvatarImage src={session.user.image ?? undefined} />
                  <AvatarFallback className="text-xs">
                    {session.user.name?.slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </Link>
          </>
        )}

        {/* Mobile: burger menu */}
        <MobileNav
          user={session?.user}
          isAdmin={hasAdminAccess}
        />
      </div>
    </div>
  );
}
