import Link from "next/link";
import { Button } from "./ui/button";

export function MainNavItem({
  title,
  icon,
  link,
}: {
  title: string;
  link: string;
  icon: React.ReactNode;
}) {
  return (
    <>
      <Button
        variant="ghost"
        size={"icon"}
        asChild
        className="inline-flex md:hidden"
      >
        <Link
          href={link}
          className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
        >
          {icon}
        </Link>
      </Button>
      <Button variant="ghost" asChild className="hidden md:inline-flex">
        <Link
          href={link}
          className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
        >
          {title}
        </Link>
      </Button>
    </>
  );
}
