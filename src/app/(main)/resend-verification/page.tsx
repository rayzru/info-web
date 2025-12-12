import { Suspense } from "react";

import { ResendVerificationForm } from "./resend-verification-form";

export default function ResendVerificationPage() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Suspense fallback={<div className="text-center">Загрузка...</div>}>
          <ResendVerificationForm />
        </Suspense>
      </div>
    </div>
  );
}
