"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { cn } from "~/lib/utils";
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
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const registerMutation = api.auth.register.useMutation({
    onSuccess: (data) => {
      setSuccess(data.message);
      setError(null);
      // Redirect to login page after 2 seconds
      setTimeout(() => {
        router.push(`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`);
      }, 2000);
    },
    onError: (err) => {
      setError(err.message);
      setSuccess(null);
    },
  });

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (password !== confirmPassword) {
      setError("Пароли не совпадают");
      return;
    }

    if (password.length < 8) {
      setError("Пароль должен быть не менее 8 символов");
      return;
    }

    if (!/[A-Z]/.test(password)) {
      setError("Пароль должен содержать хотя бы одну заглавную букву");
      return;
    }

    if (!/[a-z]/.test(password)) {
      setError("Пароль должен содержать хотя бы одну строчную букву");
      return;
    }

    if (!/[0-9]/.test(password)) {
      setError("Пароль должен содержать хотя бы одну цифру");
      return;
    }

    setIsLoading(true);
    try {
      await registerMutation.mutateAsync({
        email,
        password,
        name,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <h1 className="text-center text-lg font-bold uppercase tracking-[0.2em] text-foreground/90 [text-shadow:inset_0_1px_2px_rgba(0,0,0,0.1)]">
        РЕГИСТРАЦИЯ
      </h1>

      {/* Success Message */}
      {success && (
        <div className="rounded-lg bg-green-50 p-4 text-sm text-green-700 dark:bg-green-900/20 dark:text-green-400">
          {success}
        </div>
      )}

      {/* Email/Password Form */}
      <form onSubmit={handleRegister} className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="name">Имя</Label>
          <Input
            id="name"
            type="text"
            placeholder="Иван Иванов"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            minLength={2}
            data-testid="register-name"
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="email@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            data-testid="register-email"
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="password">Пароль</Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            data-testid="register-password"
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="confirmPassword">Подтвердите пароль</Label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength={8}
            data-testid="register-confirm-password"
          />
        </div>
        {error && (
          <p className="text-sm text-destructive" data-testid="register-error">
            {error}
          </p>
        )}
        <Button
          type="submit"
          className="w-full"
          disabled={isLoading}
          data-testid="register-submit"
        >
          {isLoading ? "Регистрация..." : "Зарегистрироваться"}
        </Button>
      </form>

      {/* Divider */}
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

      {/* OAuth Providers */}
      <TooltipProvider delayDuration={300}>
        <div className="flex justify-center gap-1">
          {/* Яндекс ID */}
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

          {/* VK ID (стек: VK, Mail.ru, OK) */}
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

          {/* Google */}
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

          {/* Сбер ID */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                type="button"
                className="size-11 p-0"
                onClick={async () => await signIn("sber", { callbackUrl })}
                data-testid="register-sber"
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
            <TooltipContent>Сбер ID</TooltipContent>
          </Tooltip>

          {/* Т-Банк */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                type="button"
                className="size-11 p-0"
                onClick={async () => await signIn("tinkoff", { callbackUrl })}
                data-testid="register-tbank"
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
            <TooltipContent>Т-Банк</TooltipContent>
          </Tooltip>

          {/* Telegram */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                type="button"
                className="size-11 p-0"
                onClick={async () => await signIn("telegram", { callbackUrl })}
                data-testid="register-telegram"
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
            <TooltipContent>Telegram</TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>

      <div className="mt-4 text-center text-sm">
        <span className="text-muted-foreground/70">Уже есть аккаунт?</span>{" "}
        <Link href="/login" className="font-medium underline underline-offset-4 hover:text-foreground">
          Войти
        </Link>
      </div>
    </div>
  );
}
