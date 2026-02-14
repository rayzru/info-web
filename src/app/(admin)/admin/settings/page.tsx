"use client";

import { useEffect, useState } from "react";

import { AlertTriangle, Loader2, Save, Wrench } from "lucide-react";

import { AdminPageHeader } from "~/components/admin/admin-page-header";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Switch } from "~/components/ui/switch";
import { Textarea } from "~/components/ui/textarea";
import { useToast } from "~/hooks/use-toast";
import { api } from "~/trpc/react";

export default function AdminSettingsPage() {
  const { toast } = useToast();

  // Maintenance settings state
  const [maintenanceEnabled, setMaintenanceEnabled] = useState(false);
  const [maintenanceMessage, setMaintenanceMessage] = useState("");
  const [expectedEndTime, setExpectedEndTime] = useState("");
  const [initialized, setInitialized] = useState(false);

  // Query
  const { data: maintenanceSettings, isLoading } = api.settings.getMaintenanceSettings.useQuery();

  // Initialize form when data loads
  useEffect(() => {
    if (maintenanceSettings && !initialized) {
      setMaintenanceEnabled(maintenanceSettings.enabled);
      setMaintenanceMessage(maintenanceSettings.message ?? "");
      setExpectedEndTime(
        maintenanceSettings.expectedEndTime
          ? new Date(maintenanceSettings.expectedEndTime).toISOString().slice(0, 16)
          : ""
      );
      setInitialized(true);
    }
  }, [maintenanceSettings, initialized]);

  // Mutations
  const updateMutation = api.settings.updateMaintenanceSettings.useMutation({
    onSuccess: () => {
      toast({ title: "Настройки сохранены" });
    },
    onError: (error) => {
      toast({ title: "Ошибка", description: error.message, variant: "destructive" });
    },
  });

  const toggleMutation = api.settings.toggleMaintenanceMode.useMutation({
    onSuccess: (data) => {
      setMaintenanceEnabled(data.enabled);
      toast({
        title: data.enabled ? "Режим техобслуживания включен" : "Режим техобслуживания выключен",
      });
    },
    onError: (error) => {
      toast({ title: "Ошибка", description: error.message, variant: "destructive" });
    },
  });

  const handleSave = () => {
    updateMutation.mutate({
      enabled: maintenanceEnabled,
      message: maintenanceMessage || undefined,
      expectedEndTime: expectedEndTime ? new Date(expectedEndTime).toISOString() : undefined,
    });
  };

  const handleQuickToggle = () => {
    toggleMutation.mutate({ enabled: !maintenanceEnabled });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Настройки" description="Системные настройки сайта" />

      {/* Maintenance Mode Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100 dark:bg-orange-900/30">
                <Wrench className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <CardTitle>Режим техобслуживания</CardTitle>
                <CardDescription>
                  Временно закрыть доступ к сайту для всех пользователей
                </CardDescription>
              </div>
            </div>
            <Switch
              checked={maintenanceEnabled}
              onCheckedChange={handleQuickToggle}
              disabled={toggleMutation.isPending}
            />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {maintenanceEnabled && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Режим техобслуживания активен</AlertTitle>
              <AlertDescription>
                Все пользователи будут перенаправляться на страницу техобслуживания. Администраторы
                могут продолжать работу.
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="message">Сообщение для пользователей</Label>
            <Textarea
              id="message"
              value={maintenanceMessage}
              onChange={(e) => setMaintenanceMessage(e.target.value)}
              placeholder="Мы проводим плановые технические работы для улучшения функционала сервиса..."
              rows={3}
            />
            <p className="text-muted-foreground text-xs">
              Это сообщение будет показано пользователям на странице техобслуживания
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="expectedEndTime">Ожидаемое время завершения</Label>
            <Input
              id="expectedEndTime"
              type="datetime-local"
              value={expectedEndTime}
              onChange={(e) => setExpectedEndTime(e.target.value)}
            />
            <p className="text-muted-foreground text-xs">
              Опционально. Покажет пользователям когда ожидается восстановление работы
            </p>
          </div>

          <div className="flex justify-end pt-4">
            <Button onClick={handleSave} disabled={updateMutation.isPending}>
              {updateMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <Save className="mr-2 h-4 w-4" />
              Сохранить настройки
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
