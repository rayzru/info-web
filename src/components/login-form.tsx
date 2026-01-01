"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { signIn } from "next-auth/react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Building2,
  Crown,
  Edit,
  Eye,
  Handshake,
  Home,
  Shield,
  User,
} from "lucide-react";

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
import { loginFormSchema, type LoginFormData } from "~/lib/validations/auth";

import { VkIdStack } from "./auth/vk-id-stack";

// Test accounts for dev mode
const TEST_ACCOUNTS = [
  { key: "admin", label: "Admin", icon: Crown, color: "text-red-500" },
  { key: "moderator", label: "Mod", icon: Shield, color: "text-orange-500" },
  { key: "editor", label: "Edit", icon: Edit, color: "text-blue-500" },
  { key: "chairman", label: "Пред", icon: Building2, color: "text-teal-500" },
  { key: "ukRep", label: "УК", icon: Handshake, color: "text-cyan-500" },
  { key: "owner", label: "Owner", icon: Home, color: "text-green-500" },
  { key: "resident", label: "Res", icon: User, color: "text-purple-500" },
  { key: "guest", label: "Guest", icon: Eye, color: "text-gray-500" },
] as const;

interface LoginFormProps extends React.ComponentPropsWithoutRef<"div"> {}

export function LoginForm({
  className,
  ...props
}: Readonly<LoginFormProps>) {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/my";
  const errorParam = searchParams.get("error");

  const [isLoading, setIsLoading] = useState(false);

  // Маппинг серверных ошибок (из URL или code параметра)
  const codeParam = searchParams.get("code");

  const getInitialServerError = () => {
    const errorCode = codeParam ?? errorParam;

    if (errorCode === "CredentialsSignin") {
      return "Неверный email или пароль";
    }
    if (errorCode === "EMAIL_NOT_VERIFIED") {
      return "Email не подтверждён. Проверьте почту или запросите повторную отправку.";
    }
    if (errorCode === "USER_BLOCKED") {
      return "blocked"; // Special marker for block message
    }
    return null;
  };

  const isBlocked = (codeParam ?? errorParam) === "USER_BLOCKED";

  const [serverError, setServerError] = useState<string | null>(getInitialServerError());
  const [showResendLink, setShowResendLink] = useState(
    codeParam === "EMAIL_NOT_VERIFIED" || errorParam === "EMAIL_NOT_VERIFIED"
  );

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onSubmit", // Не показываем ошибки валидации полей
  });

  // Минимальные условия для разблокировки кнопки (без показа ошибок)
  const email = form.watch("email");
  const password = form.watch("password");
  const canSubmit = email.includes("@") && password.length >= 1;

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setServerError(null);

    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        // NextAuth v5 returns the error code in result.code for CredentialsSignin subclasses
        const errorCode = result.code ?? result.error;

        if (errorCode === "EMAIL_NOT_VERIFIED") {
          setServerError("Email не подтверждён. Проверьте почту или запросите повторную отправку.");
          setShowResendLink(true);
        } else if (errorCode === "USER_BLOCKED") {
          setServerError("blocked");
          setShowResendLink(false);
        } else if (errorCode === "CredentialsSignin" || result.error === "CredentialsSignin") {
          setServerError("Неверный email или пароль");
          setShowResendLink(false);
        } else {
          setServerError("Произошла ошибка при входе. Попробуйте позже.");
          setShowResendLink(false);
        }
      } else if (result?.ok) {
        window.location.href = callbackUrl;
      }
    } catch {
      setServerError("Произошла ошибка при входе. Попробуйте позже.");
    } finally {
      setIsLoading(false);
    }
  };

  // Block message component
  const BlockedMessage = () => (
    <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4 text-sm">
      <h3 className="mb-2 font-semibold text-destructive">Аккаунт заблокирован</h3>
      <p className="mb-3 text-muted-foreground">
        Ваш аккаунт заблокирован за нарушение Правил пользования ресурсом.
      </p>
      <p className="mb-3 text-muted-foreground">
        Если вы считаете, что блокировка применена ошибочно, вы можете обратиться к администрации
        для разъяснения обстоятельств дела.
      </p>
      <p className="text-xs text-muted-foreground/70">
        Для обжалования решения или получения дополнительной информации направьте обращение на адрес
        электронной почты администрации ресурса.
      </p>
    </div>
  );

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <h1 className="text-center text-lg font-bold uppercase tracking-[0.2em] text-foreground/90 [text-shadow:inset_0_1px_2px_rgba(0,0,0,0.1)]">
        ПАРАДНАЯ
      </h1>

      {(isBlocked || serverError === "blocked") && <BlockedMessage />}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
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
                    disabled={isLoading}
                    data-testid="login-email"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel>Пароль</FormLabel>
                  <Link
                    href="/forgot-password"
                    className="text-xs text-muted-foreground hover:text-foreground hover:underline"
                  >
                    Забыли пароль?
                  </Link>
                </div>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    disabled={isLoading}
                    data-testid="login-password"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          {serverError && serverError !== "blocked" && (
            <p className="text-sm text-destructive" data-testid="login-error">
              {serverError}
              {showResendLink && (
                <>
                  {" "}
                  <Link
                    href="/resend-verification"
                    className="underline underline-offset-2 hover:text-destructive/80"
                  >
                    Отправить повторно
                  </Link>
                </>
              )}
            </p>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={!canSubmit || isLoading}
            data-testid="login-submit"
          >
            {isLoading ? "Вход..." : "Войти"}
          </Button>
        </form>
      </Form>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Или войти через
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
                data-testid="login-yandex"
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

          {/* VK ID (стек: VK, Mail.ru, OK) - временно отключено */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                type="button"
                className="group/vk h-11 w-11 p-0 opacity-50 pointer-events-none"
                data-testid="login-vk"
                disabled
              >
                <VkIdStack />
              </Button>
            </TooltipTrigger>
            <TooltipContent>VK ID (скоро)</TooltipContent>
          </Tooltip>

          {/* Google */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                type="button"
                className="size-11 p-0"
                onClick={async () => await signIn("google", { callbackUrl })}
                data-testid="login-google"
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

          {/* Сбер ID - временно отключено */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                type="button"
                className="size-11 p-0 opacity-50 pointer-events-none"
                data-testid="login-sber"
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

          {/* Т-Банк - временно отключено */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                type="button"
                className="size-11 p-0 opacity-50 pointer-events-none"
                data-testid="login-tbank"
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

          {/* Telegram - временно отключено */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                type="button"
                className="size-11 p-0 opacity-50 pointer-events-none"
                data-testid="login-telegram"
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
        <span className="text-muted-foreground/70">Еще не регистрировались?</span>{" "}
        <Link href="/register" className="font-medium underline underline-offset-4 hover:text-foreground">
          Зарегистрируйтесь
        </Link>
      </div>

      {/* Dev-only: Test Accounts */}
      {process.env.NODE_ENV === "development" && (
        <>
          <div className="relative mt-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-dashed border-amber-500/30" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-amber-600">
                DEV: Тестовые аккаунты
              </span>
            </div>
          </div>

          <TooltipProvider delayDuration={300}>
            <div className="flex flex-wrap justify-center gap-1">
              {TEST_ACCOUNTS.map((account) => {
                const Icon = account.icon;
                return (
                  <Tooltip key={account.key}>
                    <TooltipTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-9 gap-1.5 border-dashed border-amber-500/30 hover:border-amber-500 hover:bg-amber-500/10"
                        onClick={async () => {
                          await signIn("test-credentials", {
                            account: account.key,
                            callbackUrl,
                          });
                        }}
                      >
                        <Icon className={cn("h-3.5 w-3.5", account.color)} />
                        <span className="text-xs">{account.label}</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Войти как Test {account.label}</p>
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </div>
          </TooltipProvider>
        </>
      )}
    </div>
  );
}
