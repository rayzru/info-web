import { Suspense } from "react";

import { VerifyEmailContent } from "./verify-email-content";

export default function VerifyEmailPage() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Suspense fallback={<div className="text-center">Загрузка...</div>}>
          <VerifyEmailContent />
        </Suspense>
      </div>
    </div>
  );
}
