"use client";

import { useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  AlertTriangle,
  Ban,
  Check,
  CheckCircle2,
  ExternalLink,
  Loader2,
  RefreshCw,
  Search,
  Shield,
  UserCheck,
  UserMinus,
  UserPlus,
  UserX,
  XCircle,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Separator } from "~/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Textarea } from "~/components/ui/textarea";
import { cn } from "~/lib/utils";
import { BLOCK_CATEGORIES, RULES_VIOLATIONS } from "~/lib/block-reasons";
import { api } from "~/trpc/react";

// Telegram icon SVG
function TelegramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
    </svg>
  );
}

type BlockCategory = "rules_violation" | "fraud" | "spam" | "abuse" | "other";
type RuleViolation =
  | "3.1"
  | "3.2"
  | "3.3"
  | "3.4"
  | "3.5"
  | "4.1"
  | "4.2"
  | "4.3"
  | "5.1"
  | "5.2";

// Quick Block Widget
function QuickBlockWidget() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<{
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
    roles: string[];
    isBlocked: boolean;
  } | null>(null);
  const [showBlockDialog, setShowBlockDialog] = useState(false);
  const [blockCategory, setBlockCategory] = useState<BlockCategory>("rules_violation");
  const [violatedRules, setViolatedRules] = useState<RuleViolation[]>([]);
  const [blockReason, setBlockReason] = useState("");

  const utils = api.useUtils();

  const { data: searchResults, isLoading: isSearching } =
    api.admin.operations.quickSearch.useQuery(
      { query: searchQuery, limit: 10 },
      { enabled: searchQuery.length >= 2 }
    );

  const blockMutation = api.admin.users.block.useMutation({
    onSuccess: () => {
      setShowBlockDialog(false);
      setSelectedUser(null);
      setSearchQuery("");
      setBlockCategory("rules_violation");
      setViolatedRules([]);
      setBlockReason("");
      void utils.admin.operations.quickSearch.invalidate();
    },
  });

  const handleBlock = () => {
    if (!selectedUser) return;

    blockMutation.mutate({
      userId: selectedUser.id,
      category: blockCategory,
      violatedRules: blockCategory === "rules_violation" ? violatedRules : undefined,
      reason: blockReason || undefined,
    });
  };

  const toggleRule = (rule: RuleViolation) => {
    setViolatedRules((prev) =>
      prev.includes(rule) ? prev.filter((r) => r !== rule) : [...prev, rule]
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Ban className="h-5 w-5" />
          Быстрая блокировка
        </CardTitle>
        <CardDescription>
          Поиск пользователя и быстрая блокировка с выбором причины
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Поиск по имени или email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Search results */}
        {isSearching && (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        )}

        {searchResults && searchResults.length > 0 && (
          <div className="max-h-[300px] space-y-2 overflow-y-auto rounded-md border p-2">
            {searchResults.map((user) => (
              <button
                key={user.id}
                onClick={() => {
                  setSelectedUser(user);
                  setShowBlockDialog(true);
                }}
                disabled={user.isBlocked}
                className={cn(
                  "flex w-full items-center gap-3 rounded-md p-2 text-left transition-colors",
                  user.isBlocked
                    ? "cursor-not-allowed opacity-50"
                    : "hover:bg-accent"
                )}
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.image ?? undefined} />
                  <AvatarFallback>
                    {user.name?.slice(0, 2).toUpperCase() ?? "?"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 overflow-hidden">
                  <div className="flex items-center gap-2">
                    <span className="truncate font-medium">
                      {user.name ?? "Без имени"}
                    </span>
                    {user.isBlocked && (
                      <Badge variant="destructive" className="text-xs">
                        Заблокирован
                      </Badge>
                    )}
                  </div>
                  <div className="truncate text-xs text-muted-foreground">
                    {user.email}
                  </div>
                </div>
                {user.roles.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {user.roles.slice(0, 2).map((role) => (
                      <Badge key={role} variant="secondary" className="text-xs">
                        {role}
                      </Badge>
                    ))}
                    {user.roles.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{user.roles.length - 2}
                      </Badge>
                    )}
                  </div>
                )}
              </button>
            ))}
          </div>
        )}

        {searchQuery.length >= 2 && searchResults?.length === 0 && !isSearching && (
          <div className="py-4 text-center text-sm text-muted-foreground">
            Пользователи не найдены
          </div>
        )}

        {/* Block confirmation dialog */}
        <Dialog open={showBlockDialog} onOpenChange={setShowBlockDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Ban className="h-5 w-5 text-destructive" />
                Блокировка пользователя
              </DialogTitle>
              <DialogDescription>
                {selectedUser?.name ?? "Пользователь"} будет заблокирован и не
                сможет войти в систему.
              </DialogDescription>
            </DialogHeader>

            {selectedUser && (
              <div className="space-y-4">
                {/* Selected user info */}
                <div className="flex items-center gap-3 rounded-md bg-muted p-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={selectedUser.image ?? undefined} />
                    <AvatarFallback>
                      {selectedUser.name?.slice(0, 2).toUpperCase() ?? "?"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">
                      {selectedUser.name ?? "Без имени"}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {selectedUser.email}
                    </div>
                  </div>
                </div>

                {/* Category selection */}
                <div className="space-y-2">
                  <Label>Категория блокировки</Label>
                  <Select
                    value={blockCategory}
                    onValueChange={(v) => setBlockCategory(v as BlockCategory)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(BLOCK_CATEGORIES).map(([key, value]) => (
                        <SelectItem key={key} value={key}>
                          {value.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Rules violation selection */}
                {blockCategory === "rules_violation" && (
                  <div className="space-y-2">
                    <Label>Нарушенные пункты правил</Label>
                    <div className="max-h-50 space-y-1 overflow-y-auto rounded-md border p-2">
                      {Object.entries(RULES_VIOLATIONS).map(([key, value]) => (
                        <button
                          key={key}
                          onClick={() => toggleRule(key as RuleViolation)}
                          className={cn(
                            "flex w-full items-center gap-2 rounded px-2 py-1 text-left text-sm transition-colors",
                            violatedRules.includes(key as RuleViolation)
                              ? "bg-primary text-primary-foreground"
                              : "hover:bg-accent"
                          )}
                        >
                          <div
                            className={cn(
                              "flex h-4 w-4 items-center justify-center rounded border",
                              violatedRules.includes(key as RuleViolation)
                                ? "border-primary-foreground bg-primary-foreground text-primary"
                                : "border-input"
                            )}
                          >
                            {violatedRules.includes(key as RuleViolation) && (
                              <Check className="h-3 w-3" />
                            )}
                          </div>
                          <span className="font-medium">{key}:</span>
                          <span className="flex-1 truncate">{value.title}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Additional reason */}
                <div className="space-y-2">
                  <Label>
                    Дополнительный комментарий
                    {blockCategory === "other" && (
                      <span className="text-destructive"> *</span>
                    )}
                  </Label>
                  <Textarea
                    value={blockReason}
                    onChange={(e) => setBlockReason(e.target.value)}
                    placeholder="Причина блокировки..."
                    rows={3}
                  />
                </div>
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowBlockDialog(false)}>
                Отмена
              </Button>
              <Button
                variant="destructive"
                onClick={handleBlock}
                disabled={
                  blockMutation.isPending ||
                  (blockCategory === "rules_violation" && violatedRules.length === 0) ||
                  (blockCategory === "other" && !blockReason.trim())
                }
              >
                {blockMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Блокировка...
                  </>
                ) : (
                  <>
                    <Ban className="mr-2 h-4 w-4" />
                    Заблокировать
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}

// Telegram Sync Widget
function TelegramSyncWidget() {
  const { data: syncStatus } = api.admin.operations.telegramSyncStatus.useQuery();
  const {
    data: syncData,
    isLoading,
    refetch,
    isRefetching,
  } = api.admin.operations.getTelegramSync.useQuery(undefined, {
    enabled: syncStatus?.configured ?? false,
    refetchOnWindowFocus: false,
  });

  if (!syncStatus?.configured) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TelegramIcon className="h-5 w-5" />
            Синхронизация с Telegram
          </CardTitle>
          <CardDescription>
            Проверка присутствия админов в чате Telegram
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center gap-4 py-8 text-center">
            <AlertCircle className="h-12 w-12 text-muted-foreground" />
            <div>
              <p className="font-medium">Telegram не настроен</p>
              <p className="text-sm text-muted-foreground">
                Добавьте TELEGRAM_ADMIN_CHAT_ID в .env для синхронизации
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <TelegramIcon className="h-5 w-5" />
              Синхронизация с Telegram
            </CardTitle>
            <CardDescription>
              Сравнение админов системы с участниками чата
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isLoading || isRefetching}
          >
            {isRefetching ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : syncData ? (
          <Tabs defaultValue="not-in-chat" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="not-in-chat" className="gap-2">
                <UserPlus className="h-4 w-4" />
                <span className="hidden sm:inline">Нет в чате</span>
                {syncData.notInChat.length > 0 && (
                  <Badge variant="destructive" className="h-5 px-1.5">
                    {syncData.notInChat.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="synced" className="gap-2">
                <UserCheck className="h-4 w-4" />
                <span className="hidden sm:inline">В чате</span>
                <Badge variant="secondary" className="h-5 px-1.5">
                  {syncData.inChat.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="extra" className="gap-2">
                <UserMinus className="h-4 w-4" />
                <span className="hidden sm:inline">Лишние</span>
                {syncData.extraInChat.length > 0 && (
                  <Badge variant="outline" className="h-5 px-1.5">
                    {syncData.extraInChat.length}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>

            {/* Not in chat - admins who need to join */}
            <TabsContent value="not-in-chat" className="mt-4">
              {syncData.notInChat.length === 0 ? (
                <div className="flex flex-col items-center gap-2 py-8 text-center">
                  <CheckCircle2 className="h-12 w-12 text-green-500" />
                  <p className="text-sm text-muted-foreground">
                    Все админы присутствуют в чате
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Эти администраторы должны присоединиться к чату:
                  </p>
                  <div className="max-h-[300px] space-y-2 overflow-y-auto">
                    {syncData.notInChat.map((user) => (
                      <div
                        key={user.userId}
                        className="flex items-center gap-3 rounded-md border p-3"
                      >
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={user.image ?? undefined} />
                          <AvatarFallback>
                            {user.name?.slice(0, 2).toUpperCase() ?? "?"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 overflow-hidden">
                          <div className="flex items-center gap-2">
                            <Link
                              href={`/admin/users/${user.userId}`}
                              className="truncate font-medium hover:underline"
                            >
                              {user.name ?? "Без имени"}
                            </Link>
                            {!user.telegramId && (
                              <Badge variant="outline" className="text-xs">
                                Нет TG
                              </Badge>
                            )}
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {user.roles.map((role) => (
                              <Badge
                                key={role}
                                variant="secondary"
                                className="text-xs"
                              >
                                {role}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        {user.telegramUsername && (
                          <a
                            href={`https://t.me/${user.telegramUsername}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-sm text-blue-500 hover:underline"
                          >
                            @{user.telegramUsername}
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>

            {/* Synced - admins in chat */}
            <TabsContent value="synced" className="mt-4">
              {syncData.inChat.length === 0 ? (
                <div className="flex flex-col items-center gap-2 py-8 text-center">
                  <AlertTriangle className="h-12 w-12 text-amber-500" />
                  <p className="text-sm text-muted-foreground">
                    Никто из админов не в чате
                  </p>
                </div>
              ) : (
                <div className="max-h-[300px] space-y-2 overflow-y-auto">
                  {syncData.inChat.map((user) => (
                    <div
                      key={user.userId}
                      className="flex items-center gap-3 rounded-md border border-green-200 bg-green-50 p-3 dark:border-green-900 dark:bg-green-950/30"
                    >
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user.image ?? undefined} />
                        <AvatarFallback>
                          {user.name?.slice(0, 2).toUpperCase() ?? "?"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 overflow-hidden">
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/admin/users/${user.userId}`}
                            className="truncate font-medium hover:underline"
                          >
                            {user.name ?? "Без имени"}
                          </Link>
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {user.roles.map((role) => (
                            <Badge
                              key={role}
                              variant="secondary"
                              className="text-xs"
                            >
                              {role}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      {user.telegramUsername && (
                        <span className="text-sm text-muted-foreground">
                          @{user.telegramUsername}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Extra - people in chat who are not admins */}
            <TabsContent value="extra" className="mt-4">
              {syncData.extraInChat.length === 0 ? (
                <div className="flex flex-col items-center gap-2 py-8 text-center">
                  <CheckCircle2 className="h-12 w-12 text-green-500" />
                  <p className="text-sm text-muted-foreground">
                    В чате нет лишних участников
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Эти участники чата не являются администраторами системы:
                  </p>
                  <div className="max-h-[300px] space-y-2 overflow-y-auto">
                    {syncData.extraInChat.map((member) => (
                      <div
                        key={member.telegramId}
                        className="flex items-center gap-3 rounded-md border border-amber-200 bg-amber-50 p-3 dark:border-amber-900 dark:bg-amber-950/30"
                      >
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900">
                          <TelegramIcon className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium">
                            {member.firstName} {member.lastName ?? ""}
                          </div>
                          {member.username && (
                            <div className="text-sm text-muted-foreground">
                              @{member.username}
                            </div>
                          )}
                        </div>
                        <Badge variant="outline">
                          {member.chatStatus === "administrator"
                            ? "Админ чата"
                            : "Участник"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        ) : null}
      </CardContent>
    </Card>
  );
}

// Main Page
export default function UserOperationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Сервисные операции</h1>
        <p className="text-muted-foreground">
          Быстрые операции с пользователями и синхронизация
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <QuickBlockWidget />
        <TelegramSyncWidget />
      </div>
    </div>
  );
}
