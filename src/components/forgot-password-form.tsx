"use client";

import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import Link from "next/link";
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
import { cn } from "~/lib/utils";
import { type ForgotPasswordFormData, forgotPasswordSchema } from "~/lib/validations/auth";
import { api } from "~/trpc/react";

interface ForgotPasswordFormProps extends React.ComponentPropsWithoutRef<"div"> {}

export function ForgotPasswordForm({ className, ...props }: Readonly<ForgotPasswordFormProps>) {
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
    mode: "onSubmit", // Не показываем ошибки валидации сразу
  });

  const requestResetMutation = api.auth.requestPasswordReset.useMutation({
    onSuccess: () => {
      setIsSuccess(true);
    },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    await requestResetMutation.mutateAsync({ email: data.email });
  };

  // Минимальные условия для разблокировки кнопки (без показа ошибок)
  const email = form.watch("email");
  const canSubmit = email.includes("@") && email.includes(".");
  const isLoading = requestResetMutation.isPending;

  if (isSuccess) {
    return (
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <CheckCircle2 className="h-6 w-6 text-green-600" />
          </div>
          <h1 className="text-lg font-semibold">Проверьте почту</h1>
          <p className="text-muted-foreground text-sm">
            Если аккаунт с указанным email существует, мы отправили на него инструкции по
            восстановлению пароля.
          </p>
        </div>

        <Link href="/login">
          <Button variant="outline" className="w-full">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Вернуться к входу
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="flex flex-col gap-2 text-center">
        <h1 className="text-lg font-semibold">Восстановление пароля</h1>
        <p className="text-muted-foreground text-sm">Введите email, указанный при регистрации</p>
      </div>

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
                    data-testid="forgot-password-email"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          {requestResetMutation.error && (
            <p className="text-destructive text-sm">{requestResetMutation.error.message}</p>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={!canSubmit || isLoading}
            data-testid="forgot-password-submit"
          >
            {isLoading ? "Отправка..." : "Отправить ссылку"}
          </Button>
        </form>
      </Form>

      <div className="text-center text-sm">
        <Link href="/login" className="text-muted-foreground hover:text-foreground hover:underline">
          <ArrowLeft className="mr-1 inline h-3 w-3" />
          Вернуться к входу
        </Link>
      </div>
    </div>
  );
}
