import { Suspense } from "react";
import { CheckEmailContent } from "./check-email-content";

export default function CheckEmailPage() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Suspense fallback={<div className="text-center">Загрузка...</div>}>
          <CheckEmailContent />
        </Suspense>
      </div>
    </div>
  );
}
