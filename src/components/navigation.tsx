import { Logo } from "./logo";
import { MainNav } from "./main-nav";
import { UserNav } from "./user-nav";
import Link from "next/link";
import { SearchNav } from "./search-nav";
import { ThemeToggle } from "./theme-toggle";
import ResponsiveWrapper from "./responsive-wrapper";

export async function Navigation() {
  return (
    <div className="border-b">
      <ResponsiveWrapper>
        <div className="flex h-16 items-center gap-3">
          <Link href="/" passHref>
            <Logo />
          </Link>

          <MainNav />

          <div className="flex-1 align-self-center">
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
