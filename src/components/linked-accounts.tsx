"use client";

import { useState } from "react";
import Image from "next/image";
import { signIn } from "next-auth/react";
import {
  AlertTriangle,
  Check,
  Loader2,
  Mail,
  Pencil,
  Plus,
  Unlink,
} from "lucide-react";

import { Button } from "~/components/ui/button";
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
import { PasswordChangeDialog } from "./password-change-dialog";

// Provider display info with logo paths
const PROVIDER_INFO: Record<string, { name: string; logo: string }> = {
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
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);

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

  // All OAuth providers (both linked and available)
  const oauthProviders = availableProviders.filter(
    (p) => p.id !== "credentials" && p.type === "oauth"
  );

  return (
    <div className="space-y-8">
      {/* All auth methods in one grid */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {/* Email/Password card - first */}
        {hasPassword ? (
          // Password is set - active card with change password button inside
          <div className="flex flex-col items-center rounded-xl border bg-card p-6">
            <div className="mb-3 flex h-14 w-14 items-center justify-center overflow-hidden rounded-xl bg-muted">
              <Mail className="h-7 w-7 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium">Email и пароль</p>
            <span className="mt-2 flex items-center gap-1 text-xs text-green-600">
              <Check className="h-3 w-3" />
              Активен
            </span>
            <button
              onClick={() => setPasswordDialogOpen(true)}
              className="mt-3 flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-primary"
            >
              <Pencil className="h-3 w-3" />
              Сменить пароль
            </button>
          </div>
        ) : (
          // Password not set - inactive clickable card
          <button
            onClick={() => setPasswordDialogOpen(true)}
            className="flex flex-col items-center rounded-xl border border-dashed p-6 transition-colors hover:border-primary hover:bg-primary/5"
          >
            <div className="mb-3 flex h-14 w-14 items-center justify-center overflow-hidden rounded-xl bg-muted opacity-50">
              <Mail className="h-7 w-7 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium text-muted-foreground">
              Email и пароль
            </p>
            <span className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
              <Plus className="h-3 w-3" />
              Установить
            </span>
          </button>
        )}

        {/* Password change dialog */}
        <PasswordChangeDialog
          open={passwordDialogOpen}
          onOpenChange={setPasswordDialogOpen}
          hasPassword={hasPassword}
        />

        {/* OAuth providers */}
        {oauthProviders.map((provider) => {
          const info = PROVIDER_INFO[provider.id] ?? {
            name: provider.name,
            logo: null,
          };
          const isLinked = linkedProviderIds.includes(provider.id);
          const canUnlink = totalAuthMethods > 1;

          if (isLinked) {
            // Linked provider card
            return (
              <div
                key={provider.id}
                className="relative flex flex-col items-center rounded-xl border bg-card p-6"
              >
                {/* Unlink button in top-right corner */}
                <Dialog
                  open={unlinkProvider === provider.id}
                  onOpenChange={(open) =>
                    setUnlinkProvider(open ? provider.id : null)
                  }
                >
                  <DialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-2 h-7 w-7 text-muted-foreground/50 hover:text-destructive"
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
                        onClick={() => handleUnlink(provider.id)}
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
                <div className="mb-3 flex h-14 w-14 items-center justify-center overflow-hidden rounded-xl bg-muted">
                  {info.logo ? (
                    <Image
                      src={info.logo}
                      alt={info.name}
                      width={44}
                      height={44}
                      className="rounded-lg"
                    />
                  ) : (
                    <span className="text-lg font-bold text-muted-foreground">
                      ?
                    </span>
                  )}
                </div>

                {/* Provider name */}
                <p className="text-sm font-medium">{info.name}</p>

                {/* Status badge */}
                <span className="mt-2 flex items-center gap-1 text-xs text-green-600">
                  <Check className="h-3 w-3" />
                  Привязан
                </span>
              </div>
            );
          }

          // Not linked - clickable card
          return (
            <button
              key={provider.id}
              onClick={() => handleLinkProvider(provider.id)}
              className="flex flex-col items-center rounded-xl border border-dashed p-6 transition-colors hover:border-primary hover:bg-primary/5"
            >
              {/* Logo */}
              <div className="mb-3 flex h-14 w-14 items-center justify-center overflow-hidden rounded-xl bg-muted opacity-50">
                {info.logo ? (
                  <Image
                    src={info.logo}
                    alt={info.name}
                    width={44}
                    height={44}
                    className="rounded-lg"
                  />
                ) : (
                  <span className="text-lg font-bold text-muted-foreground">
                    ?
                  </span>
                )}
              </div>

              {/* Provider name */}
              <p className="text-sm font-medium text-muted-foreground">
                {info.name}
              </p>

              {/* Add hint */}
              <span className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                <Plus className="h-3 w-3" />
                Привязать
              </span>
            </button>
          );
        })}
      </div>

      {/* Warning */}
      {totalAuthMethods === 1 && (
        <div className="flex items-start gap-3 rounded-lg border border-amber-500/20 bg-amber-500/10 p-4">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
          <div className="text-sm">
            <p className="font-medium text-amber-600">
              Рекомендуем добавить резервный способ входа
            </p>
            <p className="mt-1 text-muted-foreground">
              Если вы потеряете доступ к единственному способу авторизации,
              восстановить доступ к аккаунту будет сложно.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
