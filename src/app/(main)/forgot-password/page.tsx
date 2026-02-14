import { Suspense } from "react";

import { redirect } from "next/navigation";

import { ForgotPasswordForm } from "~/components/forgot-password-form";
import { auth } from "~/server/auth";

export default async function Page() {
  const session = await auth();

  // Redirect logged in users
  if (session) {
    redirect("/my");
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Suspense fallback={<div>Загрузка...</div>}>
          <ForgotPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}
