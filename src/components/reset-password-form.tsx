"use client";

import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
import { type ResetPasswordFormData, resetPasswordSchema } from "~/lib/validations/auth";
import { api } from "~/trpc/react";

interface ResetPasswordFormProps extends React.ComponentPropsWithoutRef<"div"> {
  token: string;
}

export function ResetPasswordForm({
  token,
  className,
  ...props
}: Readonly<ResetPasswordFormProps>) {
  const router = useRouter();
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
    mode: "onChange",
  });

  const resetMutation = api.auth.resetPassword.useMutation({
    onSuccess: () => {
      setIsSuccess(true);
    },
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    await resetMutation.mutateAsync({
      token,
      password: data.password,
    });
  };

  const isLoading = resetMutation.isPending;
  const isValid = form.formState.isValid;

  if (isSuccess) {
    return (
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <CheckCircle2 className="h-6 w-6 text-green-600" />
          </div>
          <h1 className="text-lg font-semibold">Пароль изменён</h1>
          <p className="text-muted-foreground text-sm">
            Ваш пароль успешно изменён. Теперь вы можете войти с новым паролем.
          </p>
        </div>

        <Link href="/login">
          <Button className="w-full">Войти в аккаунт</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="flex flex-col gap-2 text-center">
        <h1 className="text-lg font-semibold">Новый пароль</h1>
        <p className="text-muted-foreground text-sm">
          Придумайте надёжный пароль для вашего аккаунта
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Новый пароль</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Минимум 8 символов"
                    disabled={isLoading}
                    data-testid="reset-password-password"
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
                    placeholder="Повторите пароль"
                    disabled={isLoading}
                    data-testid="reset-password-confirm"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {resetMutation.error && (
            <p className="text-destructive text-sm">{resetMutation.error.message}</p>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={!isValid || isLoading}
            data-testid="reset-password-submit"
          >
            {isLoading ? "Сохранение..." : "Сохранить пароль"}
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
