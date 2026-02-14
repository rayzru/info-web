"use client";

import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Mail } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
import { api } from "~/trpc/react";

const resendSchema = z.object({
  email: z.string().email("Введите корректный email"),
});

type ResendFormData = z.infer<typeof resendSchema>;

export function ResendVerificationForm() {
  const [success, setSuccess] = useState(false);

  const form = useForm<ResendFormData>({
    resolver: zodResolver(resendSchema),
    defaultValues: {
      email: "",
    },
  });

  const resendMutation = api.auth.resendVerificationEmail.useMutation({
    onSuccess: () => {
      setSuccess(true);
    },
  });

  const onSubmit = async (data: ResendFormData) => {
    await resendMutation.mutateAsync({ email: data.email });
  };

  if (success) {
    return (
      <div className="flex flex-col items-center gap-6 text-center">
        <h1 className="text-foreground/90 text-lg font-bold uppercase tracking-[0.2em]">
          Запрос обработан
        </h1>
        <CheckCircle2 className="h-12 w-12 text-green-500" />
        <p className="text-muted-foreground">
          Если указанный адрес зарегистрирован и требует подтверждения, на него будет отправлено
          письмо со ссылкой.
        </p>
        <p className="text-muted-foreground text-sm">Проверьте папку «Входящие» и «Спам».</p>
        <div className="flex w-full flex-col gap-2">
          <Button asChild variant="outline">
            <Link href="/login">Вернуться к входу</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-foreground/90 text-center text-lg font-bold uppercase tracking-[0.2em]">
        Повторная отправка
      </h1>

      <div className="flex flex-col items-center gap-2 text-center">
        <Mail className="text-muted-foreground h-10 w-10" />
        <p className="text-muted-foreground text-sm">
          Введите email, на который вы регистрировались, и мы отправим вам новое письмо для
          подтверждения.
        </p>
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
                  <Input type="email" placeholder="email@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={resendMutation.isPending}>
            {resendMutation.isPending ? "Отправка..." : "Отправить письмо"}
          </Button>
        </form>
      </Form>

      <div className="text-center text-sm">
        <Link href="/login" className="text-muted-foreground hover:text-foreground hover:underline">
          Вернуться к входу
        </Link>
      </div>
    </div>
  );
}
