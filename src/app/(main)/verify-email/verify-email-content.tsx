"use client";

import { useEffect, useState } from "react";

import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import { Button } from "~/components/ui/button";
import { api } from "~/trpc/react";

export function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  const verifyMutation = api.auth.verifyEmail.useMutation({
    onSuccess: (data) => {
      setStatus("success");
      setMessage(data.message);
      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    },
    onError: (error) => {
      setStatus("error");
      setMessage(error.message);
    },
  });

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Токен подтверждения отсутствует");
      return;
    }

    verifyMutation.mutate({ token });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return (
    <div className="flex flex-col items-center gap-6 text-center">
      <h1 className="text-foreground/90 text-lg font-bold uppercase tracking-[0.2em]">
        Подтверждение Email
      </h1>

      {status === "loading" && (
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="text-primary h-12 w-12 animate-spin" />
          <p className="text-muted-foreground">Проверяем ваш email...</p>
        </div>
      )}

      {status === "success" && (
        <div className="flex flex-col items-center gap-4">
          <CheckCircle2 className="h-12 w-12 text-green-500" />
          <p className="text-green-600 dark:text-green-400">{message}</p>
          <p className="text-muted-foreground text-sm">Перенаправление на страницу входа...</p>
          <Button asChild>
            <Link href="/login">Войти сейчас</Link>
          </Button>
        </div>
      )}

      {status === "error" && (
        <div className="flex flex-col items-center gap-4">
          <XCircle className="text-destructive h-12 w-12" />
          <p className="text-destructive">{message}</p>
          <div className="flex flex-col gap-2">
            <Button asChild variant="outline">
              <Link href="/resend-verification">Отправить повторно</Link>
            </Button>
            <Button asChild variant="ghost">
              <Link href="/login">Вернуться к входу</Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
