"use client";

import { useState } from "react";
import Image from "next/image";
import { signIn } from "next-auth/react";
import {
  AlertTriangle,
  Check,
  Loader2,
  Lock,
  Plus,
  Unlink,
} from "lucide-react";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { useToast } from "~/hooks/use-toast";
import { api } from "~/trpc/react";

// Provider display info with logo paths
const PROVIDER_INFO: Record<
  string,
  { name: string; logo: string }
> = {
  yandex: { name: "Яндекс ID", logo: "/logos/yandex.svg" },
  vk: { name: "VK ID", logo: "/logos/vk.svg" },
  google: { name: "Google", logo: "/logos/google.svg" },
  mailru: { name: "Mail.ru", logo: "/logos/mailru.svg" },
  odnoklassniki: { name: "Одноклассники", logo: "/logos/ok.svg" },
  sber: { name: "Сбер ID", logo: "/logos/sber.svg" },
  tinkoff: { name: "Т-Банк", logo: "/logos/tbank.svg" },
  telegram: { name: "Telegram", logo: "/logos/telegram.svg" },
};

interface LinkedAccountsProps {
  availableProviders: {
    id: string;
    name: string;
    type: "oauth" | "credentials";
  }[];
}

export function LinkedAccounts({ availableProviders }: LinkedAccountsProps) {
  const { toast } = useToast();
  const utils = api.useUtils();

  const { data, isLoading } = api.auth.getLinkedAccounts.useQuery();

  const unlinkAccount = api.auth.unlinkAccount.useMutation({
    onSuccess: () => {
      toast({
        title: "Аккаунт отвязан",
        description: "Способ входа успешно удалён",
      });
      void utils.auth.getLinkedAccounts.invalidate();
    },
    onError: (error) => {
      toast({
        title: "Ошибка",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const [unlinkProvider, setUnlinkProvider] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const linkedAccounts = data?.accounts ?? [];
  const hasPassword = data?.hasPassword ?? false;

  // Calculate which providers can be linked (not already linked)
  const linkedProviderIds = linkedAccounts.map((a) => a.provider);
  const availableToLink = availableProviders.filter(
    (p) =>
      !linkedProviderIds.includes(p.id) &&
      p.id !== "credentials" &&
      p.type === "oauth"
  );

  // Total auth methods
  const totalAuthMethods = linkedAccounts.length + (hasPassword ? 1 : 0);

  const handleLinkProvider = (providerId: string) => {
    // Use signIn with redirect to link account
    void signIn(providerId, { callbackUrl: "/my/security" });
  };

  const handleUnlink = (provider: string) => {
    unlinkAccount.mutate({ provider });
    setUnlinkProvider(null);
  };

  return (
    <div className="space-y-8">
      {/* Linked OAuth accounts as cards */}
      <section>
        <h3 className="text-sm font-medium text-muted-foreground mb-4">
          Привязанные аккаунты
        </h3>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {linkedAccounts.map((account) => {
            const info = PROVIDER_INFO[account.provider] ?? {
              name: account.provider,
              logo: null,
            };
            const canUnlink = totalAuthMethods > 1;

            return (
              <div
                key={account.provider}
                className="relative flex flex-col items-center p-6 rounded-xl border bg-card"
              >
                {/* Unlink button in top-right corner */}
                <Dialog
                  open={unlinkProvider === account.provider}
                  onOpenChange={(open) =>
                    setUnlinkProvider(open ? account.provider : null)
                  }
                >
                  <DialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 h-7 w-7 text-muted-foreground/50 hover:text-destructive"
                      disabled={!canUnlink}
                      title={
                        canUnlink
                          ? "Отвязать аккаунт"
                          : "Нельзя отвязать единственный способ входа"
                      }
                    >
                      <Unlink className="h-3.5 w-3.5" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Отвязать {info.name}?</DialogTitle>
                      <DialogDescription>
                        Вы больше не сможете входить через {info.name}. Вы
                        сможете привязать этот аккаунт снова в любое время.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setUnlinkProvider(null)}
                      >
                        Отмена
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => handleUnlink(account.provider)}
                        disabled={unlinkAccount.isPending}
                      >
                        {unlinkAccount.isPending && (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        Отвязать
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                {/* Logo */}
                <div className="w-14 h-14 rounded-xl bg-muted flex items-center justify-center overflow-hidden mb-3">
                  {info.logo ? (
                    <Image
                      src={info.logo}
                      alt={info.name}
                      width={44}
                      height={44}
                      className="rounded-lg"
                    />
                  ) : (
                    <span className="text-muted-foreground font-bold text-lg">?</span>
                  )}
                </div>

                {/* Provider name */}
                <p className="font-medium text-sm">{info.name}</p>

                {/* Status badge */}
                <span className="mt-2 text-xs text-green-600 flex items-center gap-1">
                  <Check className="h-3 w-3" />
                  Привязан
                </span>
              </div>
            );
          })}
        </div>

        {linkedAccounts.length === 0 && (
          <p className="text-sm text-muted-foreground">
            Нет привязанных аккаунтов
          </p>
        )}
      </section>

      {/* Available to link */}
      {availableToLink.length > 0 && (
        <section>
          <h3 className="text-sm font-medium text-muted-foreground mb-4">
            Доступные для привязки
          </h3>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {availableToLink.map((provider) => {
              const info = PROVIDER_INFO[provider.id] ?? {
                name: provider.name,
                logo: null,
              };

              return (
                <button
                  key={provider.id}
                  onClick={() => handleLinkProvider(provider.id)}
                  className="flex flex-col items-center p-6 rounded-xl border border-dashed hover:border-primary hover:bg-primary/5 transition-colors"
                >
                  {/* Logo */}
                  <div className="w-14 h-14 rounded-xl bg-muted flex items-center justify-center overflow-hidden mb-3 opacity-50">
                    {info.logo ? (
                      <Image
                        src={info.logo}
                        alt={info.name}
                        width={44}
                        height={44}
                        className="rounded-lg"
                      />
                    ) : (
                      <span className="text-muted-foreground font-bold text-lg">?</span>
                    )}
                  </div>

                  {/* Provider name */}
                  <p className="font-medium text-sm">{info.name}</p>

                  {/* Add hint */}
                  <span className="mt-2 text-xs text-muted-foreground flex items-center gap-1">
                    <Plus className="h-3 w-3" />
                    Привязать
                  </span>
                </button>
              );
            })}
          </div>
        </section>
      )}

      {/* Warning */}
      {totalAuthMethods === 1 && (
        <div className="flex items-start gap-3 p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
          <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-medium text-amber-600">
              Рекомендуем добавить резервный способ входа
            </p>
            <p className="text-muted-foreground mt-1">
              Если вы потеряете доступ к единственному способу авторизации,
              восстановить доступ к аккаунту будет сложно.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export function PasswordSection() {
  const { toast } = useToast();
  const utils = api.useUtils();

  const { data } = api.auth.getLinkedAccounts.useQuery();
  const hasPassword = data?.hasPassword ?? false;

  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const changePassword = api.auth.changePassword.useMutation({
    onSuccess: (result) => {
      toast({
        title: "Успешно",
        description: result.message,
      });
      setIsChangingPassword(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      void utils.auth.getLinkedAccounts.invalidate();
    },
    onError: (error) => {
      toast({
        title: "Ошибка",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast({
        title: "Ошибка",
        description: "Пароли не совпадают",
        variant: "destructive",
      });
      return;
    }

    changePassword.mutate({
      currentPassword: hasPassword ? currentPassword : undefined,
      newPassword,
    });
  };

  return (
    <section>
      <h3 className="text-sm font-medium text-muted-foreground mb-4">
        Пароль
      </h3>

      {isChangingPassword ? (
        <form onSubmit={handleSubmit} className="space-y-4 max-w-sm">
          {hasPassword && (
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Текущий пароль</Label>
              <Input
                id="currentPassword"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="newPassword">
              {hasPassword ? "Новый пароль" : "Пароль"}
            </Label>
            <Input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={8}
            />
            <p className="text-xs text-muted-foreground">
              Минимум 8 символов, заглавная и строчная буква, цифра
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Подтвердите пароль</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="submit" disabled={changePassword.isPending}>
              {changePassword.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {hasPassword ? "Изменить пароль" : "Установить пароль"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsChangingPassword(false);
                setCurrentPassword("");
                setNewPassword("");
                setConfirmPassword("");
              }}
            >
              Отмена
            </Button>
          </div>
        </form>
      ) : (
        <div className="flex items-center justify-between p-4 rounded-lg border bg-card max-w-lg">
          <div className="flex items-center gap-3">
            <Lock className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm">
                {hasPassword ? "Пароль установлен" : "Пароль не установлен"}
              </p>
              {!hasPassword && (
                <p className="text-xs text-muted-foreground">
                  Установите пароль для входа по email
                </p>
              )}
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsChangingPassword(true)}
          >
            {hasPassword ? "Изменить" : "Установить"}
          </Button>
        </div>
      )}
    </section>
  );
}
