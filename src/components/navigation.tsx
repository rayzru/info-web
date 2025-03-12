import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { Info, ParkingCircle, Users } from "lucide-react";
import Link from "next/link";

import { auth, signOut } from "~/server/auth";

import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { DropdownMenuContent } from "./ui/dropdown-menu";
import { Logo } from "./logo";

const navigation = [
  {
    title: "Справочная",
    link: "/info",
    icon: <Info />,
  },
  {
    title: "Паркинг",
    link: "/parking",
    icon: <ParkingCircle />,
  },
  {
    title: "Сообщество",
    link: "/community",
    icon: <Users />,
  },
];

export async function Navigation() {
  const session = await auth();

  return (
    <div className="mt-4 flex items-center justify-between">
      <Link href="/">
        <Logo />
      </Link>

      <div className="flex items-center gap-2">
        {navigation.map((item) => (
          <Link key={item.title} href={item.link} passHref>
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
        {!session && <Button>Войти</Button>}

        {session && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost">
                <Avatar className="h-4 w-4">
                  <AvatarImage src={session.user.image} />
                  <AvatarFallback>
                    {session.user.name?.slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                Кабинет
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent>
              <DropdownMenuItem>
                <a href="/my">Кабинет собственника</a>
              </DropdownMenuItem>

              <form
                action={async () => {
                  "use server";
                  await signOut();
                }}
              >
                <DropdownMenuItem asChild>
                  <button className="w-full text-left" type="submit">
                    Выйти
                  </button>
                </DropdownMenuItem>
              </form>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  );
}
