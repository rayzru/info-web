import Link from "next/link";

import { Logo } from "./logo";
import { MainNav } from "./main-nav";
import ResponsiveWrapper from "./responsive-wrapper";
import { SearchNav } from "./search-nav";
import { ThemeToggle } from "./theme-toggle";
import { UserNav } from "./user-nav";

export async function Navigation() {
  return (
    <div className="border-b">
      <ResponsiveWrapper>
        <div className="flex h-16 items-center gap-3">
          <Link href="/" passHref>
            <Logo />
          </Link>

          <MainNav />

          <div className="align-self-center flex-1">
            <SearchNav />
          </div>

          <ThemeToggle />

          <div className="ml-auto flex">
            <UserNav />
          </div>
        </div>
      </ResponsiveWrapper>
    </div>
  );
}
