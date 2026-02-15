"use client";

import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";

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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "~/components/ui/tooltip";
import { cn } from "~/lib/utils";
import { type LoginFormData, loginFormSchema } from "~/lib/validations/auth";
import { api } from "~/trpc/react";

import { VkIdStack } from "./auth/vk-id-stack";

interface LoginFormProps extends React.ComponentPropsWithoutRef<"div"> {}

export function LoginForm({ className, ...props }: Readonly<LoginFormProps>) {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/my";
  const errorParam = searchParams.get("error");

  const [isLoading, setIsLoading] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

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

  // Mutation for resending verification email
  const resendVerificationMutation = api.auth.resendVerificationEmail.useMutation({
    onSuccess: () => {
      setResendSuccess(true);
      setShowResendLink(false);
      setTimeout(() => setResendSuccess(false), 5000); // Hide success message after 5 seconds
    },
    onError: (error) => {
      setServerError(error.message);
    },
  });

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

  const handleResendVerification = async () => {
    const emailValue = form.getValues("email");
    if (!emailValue) {
      setServerError("Введите email для повторной отправки");
      return;
    }
    await resendVerificationMutation.mutateAsync({ email: emailValue });
  };

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setServerError(null);
    setResendSuccess(false);

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
    <div className="border-destructive/20 bg-destructive/5 rounded-lg border p-4 text-sm">
      <h3 className="text-destructive mb-2 font-semibold">Аккаунт заблокирован</h3>
      <p className="text-muted-foreground mb-3">
        Ваш аккаунт заблокирован за нарушение Правил пользования ресурсом.
      </p>
      <p className="text-muted-foreground mb-3">
        Если вы считаете, что блокировка применена ошибочно, вы можете обратиться к администрации
        для разъяснения обстоятельств дела.
      </p>
      <p className="text-muted-foreground/70 text-xs">
        Для обжалования решения или получения дополнительной информации направьте обращение на адрес
        электронной почты администрации ресурса.
      </p>
    </div>
  );

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <h1 className="text-foreground/90 text-center text-lg font-bold uppercase tracking-[0.2em] [text-shadow:inset_0_1px_2px_rgba(0,0,0,0.1)]">
        ПОДЪЕЗД
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
                    className="text-primary hover:text-primary/80 text-xs hover:underline"
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

          {resendSuccess && (
            <p className="text-sm text-green-600" data-testid="resend-success">
              Письмо для подтверждения отправлено повторно. Проверьте почту.
            </p>
          )}

          {serverError && serverError !== "blocked" && (
            <div className="text-destructive text-sm" data-testid="login-error">
              <p>{serverError}</p>
              {showResendLink && (
                <Button
                  type="button"
                  variant="link"
                  size="sm"
                  className="text-destructive hover:text-destructive/80 h-auto p-0 underline underline-offset-2"
                  onClick={handleResendVerification}
                  disabled={resendVerificationMutation.isPending}
                >
                  {resendVerificationMutation.isPending ? "Отправка..." : "Отправить повторно"}
                </Button>
              )}
            </div>
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
          <span className="bg-background text-muted-foreground px-2">Или войти через</span>
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

          {/* VK ID (стек: VK, Mail.ru, OK) */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                type="button"
                className="group/vk h-11 w-11 p-0"
                onClick={async () => await signIn("vk", { callbackUrl })}
                data-testid="login-vk"
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
        </div>
      </TooltipProvider>

      <div className="mt-4 text-center text-sm">
        <span className="text-muted-foreground/70">Еще не регистрировались?</span>{" "}
        <Link
          href="/register"
          className="text-primary hover:text-primary/80 font-medium underline underline-offset-4"
        >
          Зарегистрируйтесь
        </Link>
      </div>
    </div>
  );
}
