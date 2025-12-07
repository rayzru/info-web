import { Info, Map, ParkingCircle, Users } from "lucide-react";
import Link from "next/link";

import { auth, signOut } from "~/server/auth";

import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Logo } from "./logo";

const navigation = [
  {
    title: "Справочная",
    link: "/",
    icon: <Info />,
    testId: "nav-info",
  },
  {
    title: "Карта",
    link: "/map",
    icon: <Map />,
    testId: "nav-map",
  },
  {
    title: "Паркинг",
    link: "/parking",
    icon: <ParkingCircle />,
    testId: "nav-parking",
  },
  {
    title: "Сообщество",
    link: "/community",
    icon: <Users />,
    testId: "nav-community",
  },
];

export async function Navigation() {
  const session = await auth();

  return (
    <div className="mt-4 flex items-center justify-between">
      <Link href="/" data-testid="nav-logo">
        <Logo />
      </Link>

      <div className="flex items-center gap-2">
        {navigation.map((item) => (
          <Link key={item.title} href={item.link} passHref data-testid={item.testId}>
            <Button
              key={`${item.title}-text`}
              variant="ghost"
              className="md:hidden"
              size={"icon"}
            >
              {item.icon}
            </Button>
            <Button
              key={`${item.title}-icon`}
              variant="ghost"
              className="hidden md:block"
            >
              {item.title}
            </Button>
          </Link>
        ))}
      </div>

      <div>
        {!session && <Link passHref href={"/login"} data-testid="nav-login"><Button>Войти</Button></Link>}

        {session && (
          <div className="flex items-center gap-2">
            <Link href="/my" passHref data-testid="nav-user-cabinet">
              <Button variant="ghost">
                <Avatar className="h-4 w-4">
                  <AvatarImage src={session.user.image ?? undefined} />
                  <AvatarFallback>
                    {session.user.name?.slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                {session.user.name ?? "Кабинет"}
              </Button>
            </Link>
            <form
              action={async () => {
                "use server";
                await signOut();
              }}
            >
              <Button variant="outline" type="submit" data-testid="nav-logout">
                Выйти
              </Button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
