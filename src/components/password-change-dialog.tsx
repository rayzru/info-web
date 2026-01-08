"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod/v4";
import { Check, Loader2, X } from "lucide-react";

import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
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
import { useToast } from "~/hooks/use-toast";
import { api } from "~/trpc/react";

// Password requirements
const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_MAX_LENGTH = 128;

// Password validation rules for inline feedback
const passwordRules = [
  {
    id: "length",
    label: "Минимум 8 символов",
    test: (v: string) => v.length >= PASSWORD_MIN_LENGTH,
  },
  {
    id: "uppercase",
    label: "Заглавная буква",
    test: (v: string) => /[A-ZА-ЯЁ]/.test(v),
  },
  {
    id: "lowercase",
    label: "Строчная буква",
    test: (v: string) => /[a-zа-яё]/.test(v),
  },
  {
    id: "number",
    label: "Цифра",
    test: (v: string) => /\d/.test(v),
  },
] as const;

// Schema for setting new password (no current password required)
const setPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(PASSWORD_MIN_LENGTH, `Минимум ${PASSWORD_MIN_LENGTH} символов`)
      .max(PASSWORD_MAX_LENGTH, `Максимум ${PASSWORD_MAX_LENGTH} символов`),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Пароли не совпадают",
    path: ["confirmPassword"],
  });

// Schema for changing existing password
const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Введите текущий пароль"),
    newPassword: z
      .string()
      .min(PASSWORD_MIN_LENGTH, `Минимум ${PASSWORD_MIN_LENGTH} символов`)
      .max(PASSWORD_MAX_LENGTH, `Максимум ${PASSWORD_MAX_LENGTH} символов`),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Пароли не совпадают",
    path: ["confirmPassword"],
  });

type SetPasswordFormData = z.infer<typeof setPasswordSchema>;
type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

interface PasswordChangeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  hasPassword: boolean;
  onSuccess?: () => void;
}

export function PasswordChangeDialog({
  open,
  onOpenChange,
  hasPassword,
  onSuccess,
}: PasswordChangeDialogProps) {
  const { toast } = useToast();
  const utils = api.useUtils();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const changePassword = api.auth.changePassword.useMutation({
    onSuccess: (result) => {
      toast({
        title: "Успешно",
        description: result.message,
      });
      onOpenChange(false);
      form.reset();
      void utils.auth.getLinkedAccounts.invalidate();
      onSuccess?.();
    },
    onError: (error) => {
      toast({
        title: "Ошибка",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const form = useForm<SetPasswordFormData | ChangePasswordFormData>({
    resolver: zodResolver(hasPassword ? changePasswordSchema : setPasswordSchema),
    defaultValues: hasPassword
      ? { currentPassword: "", newPassword: "", confirmPassword: "" }
      : { newPassword: "", confirmPassword: "" },
    mode: "onChange",
  });

  const newPasswordValue = form.watch("newPassword") ?? "";

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      form.reset();
      setShowCurrentPassword(false);
      setShowNewPassword(false);
    }
  }, [open, form]);

  const handleSubmit = (data: SetPasswordFormData | ChangePasswordFormData) => {
    changePassword.mutate({
      currentPassword: hasPassword ? (data as ChangePasswordFormData).currentPassword : undefined,
      newPassword: data.newPassword,
    });
  };

  const handleClose = () => {
    onOpenChange(false);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {hasPassword ? "Изменить пароль" : "Установить пароль"}
          </DialogTitle>
          <DialogDescription>
            {hasPassword
              ? "Введите текущий пароль и новый пароль"
              : "Установите пароль для входа по email"}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            {hasPassword && (
              <FormField
                control={form.control}
                name="currentPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Текущий пароль</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          type={showCurrentPassword ? "text" : "password"}
                          autoComplete="current-password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground text-xs"
                        >
                          {showCurrentPassword ? "Скрыть" : "Показать"}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{hasPassword ? "Новый пароль" : "Пароль"}</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        {...field}
                        type={showNewPassword ? "text" : "password"}
                        autoComplete="new-password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground text-xs"
                      >
                        {showNewPassword ? "Скрыть" : "Показать"}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Inline password strength indicator */}
            {newPasswordValue.length > 0 && (
              <div className="space-y-2 rounded-lg border bg-muted/50 p-3">
                <p className="text-xs font-medium text-muted-foreground">
                  Требования к паролю:
                </p>
                <div className="grid grid-cols-2 gap-1.5">
                  {passwordRules.map((rule) => {
                    const passed = rule.test(newPasswordValue);
                    return (
                      <div
                        key={rule.id}
                        className={cn(
                          "flex items-center gap-1.5 text-xs transition-colors",
                          passed ? "text-green-600" : "text-muted-foreground"
                        )}
                      >
                        {passed ? (
                          <Check className="h-3 w-3" />
                        ) : (
                          <X className="h-3 w-3" />
                        )}
                        {rule.label}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Подтвердите пароль</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="password"
                      autoComplete="new-password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="gap-2 sm:gap-0">
              <Button type="button" variant="outline" onClick={handleClose}>
                Отмена
              </Button>
              <Button
                type="submit"
                disabled={changePassword.isPending || !form.formState.isValid}
              >
                {changePassword.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {hasPassword ? "Изменить" : "Установить"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
