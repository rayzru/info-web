import Link from "next/link";

import { Button } from "./ui/button";

export function MainNavItem({
  title,
  icon,
  link,
}: Readonly<{
  title: string;
  link: string;
  icon: React.ReactNode;
}>) {
  return (
    <>
      <Button
        variant="ghost"
        asChild
        className="inline-flex rounded-full md:hidden"
      >
        <Link
          href={link}
          className="text-muted-foreground hover:text-primary text-sm font-medium transition-colors"
        >
          {icon}
        </Link>
      </Button>
      <Button
        variant="ghost"
        size={"default"}
        asChild
        className="hidden rounded-full md:inline-flex"
      >
        <Link href={link} className="text-muted-foreground hover:text-primary">
          {title}
        </Link>
      </Button>
    </>
  );
}
