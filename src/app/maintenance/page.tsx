import { redirect } from "next/navigation";
import { Wrench, Clock, ArrowLeft } from "lucide-react";

import { Button } from "~/components/ui/button";
import { db } from "~/server/db";
import { systemSettings, SETTING_KEYS, type MaintenanceSettings } from "~/server/db/schema";
import { eq } from "drizzle-orm";

export const metadata = {
  title: "Технические работы | SR2",
  description: "Сервис временно недоступен из-за проведения технических работ",
};

export const dynamic = "force-dynamic";

async function getMaintenanceSettings(): Promise<MaintenanceSettings | null> {
  const setting = await db.query.systemSettings.findFirst({
    where: eq(systemSettings.key, SETTING_KEYS.MAINTENANCE_MODE),
  });

  if (!setting) return null;
  return setting.value as MaintenanceSettings;
}

export default async function MaintenancePage() {
  const settings = await getMaintenanceSettings();

  // If maintenance mode is disabled, redirect to home
  if (!settings?.enabled) {
    redirect("/");
  }

  const expectedEndTime = settings.expectedEndTime
    ? new Date(settings.expectedEndTime)
    : null;

  const message =
    settings.message ??
    "Мы проводим плановые технические работы для улучшения функционала сервиса. Пожалуйста, попробуйте зайти позже.";

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 flex items-center justify-center p-4">
      <div className="max-w-lg w-full text-center space-y-8">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 animate-ping bg-orange-500/20 rounded-full" />
            <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900/30">
              <Wrench className="h-12 w-12 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </div>

        {/* Title */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Технические работы
          </h1>
          <p className="text-muted-foreground text-lg">
            Сервис временно недоступен
          </p>
        </div>

        {/* Message */}
        <div className="rounded-lg border bg-card p-6">
          <p className="text-muted-foreground leading-relaxed">{message}</p>
        </div>

        {/* Expected End Time */}
        {expectedEndTime && (
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>
              Ожидаемое время завершения:{" "}
              <strong className="text-foreground">
                {expectedEndTime.toLocaleString("ru-RU", {
                  day: "numeric",
                  month: "long",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </strong>
            </span>
          </div>
        )}

        {/* Info */}
        <p className="text-xs text-muted-foreground">
          Приносим извинения за временные неудобства.
          <br />
          Спасибо за понимание!
        </p>

        {/* Social/Contact */}
        <div className="pt-4 border-t">
          <p className="text-sm text-muted-foreground mb-3">
            Следите за обновлениями:
          </p>
          <Button variant="outline" asChild>
            <a
              href="https://t.me/sr2_news"
              target="_blank"
              rel="noopener noreferrer"
            >
              Telegram канал
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}
