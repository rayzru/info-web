import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { AlertCircle, ArrowLeft } from "lucide-react";

import { Button } from "~/components/ui/button";
import { ResetPasswordForm } from "~/components/reset-password-form";
import { auth } from "~/server/auth";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const session = await auth();
  const { token } = await searchParams;

  // Redirect logged in users
  if (session) {
    redirect("/my");
  }

  // No token provided
  if (!token) {
    return (
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
              <h1 className="text-lg font-semibold">Ссылка недействительна</h1>
              <p className="text-sm text-muted-foreground">
                Ссылка для сброса пароля отсутствует или повреждена. Запросите
                новую ссылку.
              </p>
            </div>

            <Link href="/forgot-password">
              <Button variant="outline" className="w-full">
                Запросить новую ссылку
              </Button>
            </Link>

            <div className="text-center text-sm">
              <Link
                href="/login"
                className="text-muted-foreground hover:text-foreground hover:underline"
              >
                <ArrowLeft className="mr-1 inline h-3 w-3" />
                Вернуться к входу
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Suspense fallback={<div>Загрузка...</div>}>
          <ResetPasswordForm token={token} />
        </Suspense>
      </div>
    </div>
  );
}
