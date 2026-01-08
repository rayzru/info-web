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

export async function Navigation() {
  const session = await auth();
  const userRoles = (session?.user?.roles ?? []) as UserRole[];
  const hasAdminAccess = isAdmin(userRoles);
  const rankConfig = getRankConfig(userRoles);

  return (
    <div className="mt-4 flex items-center justify-between">
      <NavLogo />

      {/* Desktop navigation - only show on larger screens */}
      <NavLinks />

      {/* Right side: user actions */}
      <div className="flex items-center gap-2">
        {!session && (
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
