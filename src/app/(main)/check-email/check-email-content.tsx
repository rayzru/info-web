"use client";

import { useState } from "react";

import { Mail, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { Button } from "~/components/ui/button";
import { api } from "~/trpc/react";

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
      <h1 className="text-foreground/90 text-lg font-bold uppercase tracking-[0.2em]">
        Проверьте почту
      </h1>

      <div className="bg-primary/10 flex h-16 w-16 items-center justify-center rounded-full">
        <Mail className="text-primary h-8 w-8" />
      </div>

      <div className="space-y-2">
        <p className="text-muted-foreground">Мы отправили письмо для подтверждения на</p>
        {email && <p className="text-foreground font-medium">{email}</p>}
      </div>

      <p className="text-muted-foreground text-sm">
        Перейдите по ссылке в письме, чтобы активировать аккаунт. Письмо действительно в течение 24
        часов.
      </p>

      <div className="flex w-full flex-col gap-3">
        {email && (
          <Button
            variant="outline"
            onClick={handleResend}
            disabled={resendMutation.isPending || resent}
            className="w-full"
          >
            <RefreshCw
              className={`mr-2 h-4 w-4 ${resendMutation.isPending ? "animate-spin" : ""}`}
            />
            {resent ? "Письмо отправлено" : "Отправить повторно"}
          </Button>
        )}

        <Button asChild variant="ghost" className="w-full">
          <Link href="/login">Вернуться к входу</Link>
        </Button>
      </div>

      <p className="text-muted-foreground text-xs">
        Не получили письмо? Проверьте папку «Спам» или{" "}
        <Link
          href="/resend-verification"
          className="hover:text-foreground underline underline-offset-2"
        >
          запросите новое
        </Link>
        .
      </p>
    </div>
  );
}
