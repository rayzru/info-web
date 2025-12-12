"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Mail, RefreshCw } from "lucide-react";

import { Button } from "~/components/ui/button";
import { api } from "~/trpc/react";
import { useState } from "react";

export function CheckEmailContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const [resent, setResent] = useState(false);

  const resendMutation = api.auth.resendVerificationEmail.useMutation({
    onSuccess: () => {
      setResent(true);
    },
  });

  const handleResend = () => {
    if (email) {
      resendMutation.mutate({ email });
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 text-center">
      <h1 className="text-lg font-bold uppercase tracking-[0.2em] text-foreground/90">
        Проверьте почту
      </h1>

      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
        <Mail className="h-8 w-8 text-primary" />
      </div>

      <div className="space-y-2">
        <p className="text-muted-foreground">
          Мы отправили письмо для подтверждения на
        </p>
        {email && (
          <p className="font-medium text-foreground">{email}</p>
        )}
      </div>

      <p className="text-sm text-muted-foreground">
        Перейдите по ссылке в письме, чтобы активировать аккаунт.
        Письмо действительно в течение 24 часов.
      </p>

      <div className="flex flex-col gap-3 w-full">
        {email && (
          <Button
            variant="outline"
            onClick={handleResend}
            disabled={resendMutation.isPending || resent}
            className="w-full"
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${resendMutation.isPending ? "animate-spin" : ""}`} />
            {resent ? "Письмо отправлено" : "Отправить повторно"}
          </Button>
        )}

        <Button asChild variant="ghost" className="w-full">
          <Link href="/login">Вернуться к входу</Link>
        </Button>
      </div>

      <p className="text-xs text-muted-foreground">
        Не получили письмо? Проверьте папку «Спам» или{" "}
        <Link href="/resend-verification" className="underline underline-offset-2 hover:text-foreground">
          запросите новое
        </Link>
        .
      </p>
    </div>
  );
}
