import Link from "next/link";

import { auth, signOut } from "~/server/auth";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "./ui/navigation-menu";
import { Logo } from "./logo";
import { MainNav } from "./main-nav";
import ResponsiveWrapper from "./responsive-wrapper";
import { ThemeToggle } from "./theme-toggle";
import { UserNav } from "./user-nav";

export async function Navigation() {
  const session = await auth();
  const userName = session?.user?.name ?? "Я";
  const userEmail = session?.user?.email ?? "";
  const userImage = session?.user?.image ?? "";

  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuLink href="/">
            <Logo />
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="/info">Справочная</NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="/">Объявления</NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="/community">Сообщество</NavigationMenuLink>
        </NavigationMenuItem>

        {!session && (
          <NavigationMenuItem>
            <NavigationMenuLink href="/login">Кабинет</NavigationMenuLink>
          </NavigationMenuItem>
        )}
        {session && (
          <NavigationMenuItem>
            <NavigationMenuTrigger>Кабинет</NavigationMenuTrigger>
            <NavigationMenuContent>
              <NavigationMenuLink href="/my">Кабинет</NavigationMenuLink>

              <form
                action={async () => {
                  "use server";
                  await signOut();
                }}
              >
                <NavigationMenuLink asChild>
                  <button className="w-full text-left" type="submit">
                    Выйти
                  </button>
                </NavigationMenuLink>
              </form>
            </NavigationMenuContent>
          </NavigationMenuItem>
        )}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
