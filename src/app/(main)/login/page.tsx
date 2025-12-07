import { redirect } from "next/navigation";
import { Suspense } from "react";

import { LoginForm } from "~/components/login-form";
import { auth } from "~/server/auth";

const isDev = process.env.NODE_ENV === "development";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const session = await auth();
  const { callbackUrl } = await searchParams;

  // Redirect logged in users away from login page
  if (session) {
    redirect(callbackUrl ?? "/my");
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Suspense fallback={<div>Загрузка...</div>}>
          <LoginForm showTestAccounts={isDev} />
        </Suspense>
      </div>
    </div>
  );
}
