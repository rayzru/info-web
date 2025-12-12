import Link from "next/link";

import { auth, signOut } from "~/server/auth";
import { isAdmin, type UserRole } from "~/server/auth/rbac";

import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { NavLogo } from "./nav-logo";
import { MobileNav } from "./mobile-nav";
import { NavLinks } from "./nav-links";

export async function Navigation() {
  const session = await auth();
  const userRoles = (session?.user?.roles ?? []) as UserRole[];
  const hasAdminAccess = isAdmin(userRoles);

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
            {/* Desktop: user menu aligned with sidebar width (w-64 = 256px) */}
            <div className="hidden lg:flex items-center gap-2 w-64">
              <Link href="/my" passHref data-testid="nav-user-cabinet" className="flex-1 min-w-0">
                <Button variant="ghost" size="sm" className="w-full justify-start">
                  <Avatar className="h-4 w-4 shrink-0">
                    <AvatarImage src={session.user.image ?? undefined} />
                    <AvatarFallback>
                      {session.user.name?.slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="truncate">{session.user.name ?? "Кабинет"}</span>
                </Button>
              </Link>
              <form
                action={async () => {
                  "use server";
                  await signOut();
                }}
                className="shrink-0"
              >
                <Button variant="outline" size="sm" type="submit" data-testid="nav-logout">
                  Выйти
                </Button>
              </form>
            </div>

            {/* Mobile/Tablet: only avatar */}
            <Link href="/my" passHref data-testid="nav-user-cabinet-mobile" className="lg:hidden">
              <Button variant="ghost" size="icon">
                <Avatar className="h-6 w-6">
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
