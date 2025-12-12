"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { signIn } from "next-auth/react";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { cn } from "~/lib/utils";
import {
  registerFormSchema,
  type RegisterFormData,
} from "~/lib/validations/auth";
import { api } from "~/trpc/react";

import { VkIdStack } from "./auth/vk-id-stack";

interface RegisterFormProps extends React.ComponentPropsWithoutRef<"div"> {}

export function RegisterForm({
  className,
  ...props
}: Readonly<RegisterFormProps>) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/my";
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onChange",
  });

  const registerMutation = api.auth.register.useMutation({
    onSuccess: (_data, variables) => {
      // Redirect to check-email page with email in query
      router.push(`/check-email?email=${encodeURIComponent(variables.email)}`);
    },
    onError: (err) => {
      setServerError(err.message);
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    setServerError(null);

    await registerMutation.mutateAsync({
      email: data.email,
      password: data.password,
      name: data.name,
    });
  };

  const isLoading = registerMutation.isPending;
  const isValid = form.formState.isValid;

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <h1 className="text-center text-lg font-bold uppercase tracking-[0.2em] text-foreground/90 [text-shadow:inset_0_1px_2px_rgba(0,0,0,0.1)]">
        РЕГИСТРАЦИЯ
      </h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Имя</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Иван Иванов"
                    data-testid="register-name"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="email@example.com"
                    data-testid="register-email"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Пароль</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    data-testid="register-password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Подтвердите пароль</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    data-testid="register-confirm-password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {serverError && (
            <p className="text-sm text-destructive" data-testid="register-error">
              {serverError}
            </p>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={!isValid || isLoading}
            data-testid="register-submit"
          >
            {isLoading ? "Регистрация..." : "Зарегистрироваться"}
          </Button>
        </form>
      </Form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Или зарегистрироваться через
          </span>
        </div>
      </div>

      <TooltipProvider delayDuration={300}>
        <div className="flex justify-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                type="button"
                className="size-11 p-0"
                onClick={async () => await signIn("yandex", { callbackUrl })}
                data-testid="register-yandex"
              >
                <Image
                  src="/logos/yandex.svg"
                  alt="Яндекс ID"
                  width={36}
                  height={36}
                  className="rounded-full"
                />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Яндекс ID</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                type="button"
                className="group/vk h-11 w-11 p-0 transition-all duration-300 hover:w-20"
                onClick={async () => await signIn("vk", { callbackUrl })}
                data-testid="register-vk"
              >
                <VkIdStack />
              </Button>
            </TooltipTrigger>
            <TooltipContent>VK ID</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                type="button"
                className="size-11 p-0"
                onClick={async () => await signIn("google", { callbackUrl })}
                data-testid="register-google"
              >
                <Image
                  src="/logos/google.svg"
                  alt="Google"
                  width={36}
                  height={36}
                  className="rounded-full"
                />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Google</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                type="button"
                className="size-11 p-0 opacity-50 pointer-events-none"
                data-testid="register-sber"
                disabled
              >
                <Image
                  src="/logos/sber.svg"
                  alt="Сбер ID"
                  width={36}
                  height={36}
                  className="rounded-full"
                />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Сбер ID (скоро)</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                type="button"
                className="size-11 p-0 opacity-50 pointer-events-none"
                data-testid="register-tbank"
                disabled
              >
                <Image
                  src="/logos/tbank.svg"
                  alt="Т-Банк"
                  width={36}
                  height={36}
                  className="rounded-full"
                />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Т-Банк (скоро)</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                type="button"
                className="size-11 p-0 opacity-50 pointer-events-none"
                data-testid="register-telegram"
                disabled
              >
                <Image
                  src="/logos/telegram.svg"
                  alt="Telegram"
                  width={36}
                  height={36}
                  className="rounded-full"
                />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Telegram (скоро)</TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>

      <div className="mt-4 text-center text-sm">
        <span className="text-muted-foreground/70">Уже есть аккаунт?</span>{" "}
        <Link
          href="/login"
          className="font-medium underline underline-offset-4 hover:text-foreground"
        >
          Войти
        </Link>
      </div>
    </div>
  );
}
