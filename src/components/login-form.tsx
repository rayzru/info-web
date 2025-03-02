"use client";

import { signIn } from "next-auth/react";

import { Button } from "@sr2/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@sr2/components/ui/card";
import { Input } from "@sr2/components/ui/input";
import { Label } from "@sr2/components/ui/label";
import { cn } from "@sr2/lib/utils";

import { GoogleLogo } from "./social-icons/google";
import { VkontakteLogo } from "./social-icons/vk";
import { YandexLogo } from "./social-icons/yandex";

export async function LoginForm({
  className,
  ...props
}: Readonly<React.ComponentPropsWithoutRef<"div">>) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <h1 className="text-2xl">Парадная</h1>

      <form>
        <div className="flex flex-col gap-6">
          <div className="flex flex-row gap-2">
            <Button
              key={"yandex"}
              variant="outline"
              type="button"
              className="flex-1 [&>svg]:size-8 min-h-[65px]"
              onClick={async () => await signIn("yandex")}
            >
              <YandexLogo />
            </Button>
            <Button
              key={"vkontakte"}
              variant="outline"
              type="button"
              className="flex-1  [&>svg]:size-8 min-h-[65px]"
              onClick={async () => await signIn("vkontakte")}
            >
              <VkontakteLogo />
            </Button>
            <Button
              key={"google"}
              variant="outline"
              type="button"
              className="flex-1 [&>svg]:size-8  min-h-[65px]"
              onClick={async () => await signIn("google")}
            >
              <GoogleLogo />
            </Button>
          </div>
          {/* <p>
            Введите ваш адрес электронной почты и пароль для входа в систему
          </p> */}

          {/* <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              disabled={true}
              placeholder="m@example.com"
              required
            />
          </div>
          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password">Пароль</Label>
              <a
                href="#"
                className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
              >
                Забыли пароль?
              </a>
            </div>
            <Input disabled id="password" type="password" required />
          </div>
          <Button disabled type="submit" className="w-full">
            Войти
          </Button> */}
        </div>
        <div className="mt-4 text-center text-sm">
          Еще не регистрировались?{" "}
          <a href="#" className="underline underline-offset-4">
            Зарегистрируйтесь
          </a>
        </div>
      </form>
    </div>
  );
}
