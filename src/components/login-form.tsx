"use client";

import { signIn } from "next-auth/react";

import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

import { GoogleLogo } from "./social-icons/google";
import { VkontakteLogo } from "./social-icons/vk";
import { YandexLogo } from "./social-icons/yandex";

export function LoginForm({
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
              className="min-h-[65px] flex-1 [&>svg]:size-8"
              onClick={async () => await signIn("yandex")}
            >
              <YandexLogo />
            </Button>
            <Button
              key={"vkontakte"}
              variant="outline"
              type="button"
              className="min-h-[65px] flex-1 [&>svg]:size-8"
              onClick={async () => await signIn("vkontakte")}
            >
              <VkontakteLogo />
            </Button>
            <Button
              key={"google"}
              variant="outline"
              type="button"
              className="min-h-[65px] flex-1 [&>svg]:size-8"
              onClick={async () => await signIn("google")}
            >
              <GoogleLogo />
            </Button>
          </div>
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
