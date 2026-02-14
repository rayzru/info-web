import { Home, KeyRound, Megaphone, MessageSquare, Settings, User } from "lucide-react";
import Link from "next/link";

import { PageHeader } from "~/components/page-header";
import { Badge } from "~/components/ui/badge";
import { Card, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { auth } from "~/server/auth";
import { api } from "~/trpc/server";

export default async function CabinetPage() {
  const session = await auth();
  const userName = session?.user?.name ?? "Пользователь";

  // Get user's claims
  const claims = await api.claims.my();
  const pendingClaims = claims.filter((c) => c.status === "pending");
  const approvedClaims = claims.filter((c) => c.status === "approved");

  // Get user's listings
  const listings = await api.listings.my();
  const activeListings = listings.filter((l) => l.status === "approved");

  return (
    <div className="space-y-8">
      {/* Header */}
      <PageHeader title="Кабинет" description={`Добро пожаловать, ${userName}`} />

      {/* Category cards - asymmetric grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {/* Listings - larger */}
        <Link href="/my/ads" className="group sm:col-span-1 lg:col-span-3">
          <Card className="sm:min-h-50 relative flex h-full min-h-28 flex-col overflow-hidden transition-all hover:border-amber-200 hover:bg-amber-50 hover:shadow-lg dark:hover:border-amber-800 dark:hover:bg-amber-950/30">
            {activeListings.length > 0 && (
              <Badge className="absolute right-4 top-4 z-10 bg-green-500">
                {activeListings.length} активных
              </Badge>
            )}
            <Megaphone className="text-muted-foreground/10 absolute -bottom-6 -right-6 h-32 w-32" />
            <CardHeader className="relative z-10 flex-1">
              <CardTitle className="text-xl">Объявления</CardTitle>
              <CardDescription>Аренда и продажа недвижимости</CardDescription>
            </CardHeader>
          </Card>
        </Link>

        {/* Property - smaller */}
        <Link href="/my/property" className="group sm:col-span-1 lg:col-span-2">
          <Card className="sm:min-h-50 relative flex h-full min-h-28 flex-col overflow-hidden transition-all hover:border-green-200 hover:bg-green-50 hover:shadow-lg dark:hover:border-green-800 dark:hover:bg-green-950/30">
            {pendingClaims.length > 0 && (
              <Badge className="absolute right-4 top-4 z-10 bg-yellow-500">
                {pendingClaims.length} на модерации
              </Badge>
            )}
            <Home className="text-muted-foreground/10 absolute -bottom-6 -right-6 h-32 w-32" />
            <CardHeader className="relative z-10 flex-1">
              <CardTitle className="text-xl">Недвижимость</CardTitle>
              <CardDescription>
                {approvedClaims.length > 0
                  ? `${approvedClaims.length} подтверждённых объектов`
                  : "Квартиры и машиноместа"}
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>

        {/* Profile - smaller */}
        <Link href="/my/profile" className="group sm:col-span-1 lg:col-span-2">
          <Card className="sm:min-h-50 relative flex h-full min-h-28 flex-col overflow-hidden transition-all hover:border-blue-200 hover:bg-blue-50 hover:shadow-lg dark:hover:border-blue-800 dark:hover:bg-blue-950/30">
            <User className="text-muted-foreground/10 absolute -bottom-6 -right-6 h-32 w-32" />
            <CardHeader className="relative z-10 flex-1">
              <CardTitle className="text-xl">Профиль</CardTitle>
              <CardDescription>Личные данные и контакты</CardDescription>
            </CardHeader>
          </Card>
        </Link>

        {/* Security - larger */}
        <Link href="/my/security" className="group sm:col-span-1 lg:col-span-3">
          <Card className="sm:min-h-50 relative flex h-full min-h-28 flex-col overflow-hidden transition-all hover:border-violet-200 hover:bg-violet-50 hover:shadow-lg dark:hover:border-violet-800 dark:hover:bg-violet-950/30">
            <KeyRound className="text-muted-foreground/10 absolute -bottom-6 -right-6 h-32 w-32" />
            <CardHeader className="relative z-10 flex-1">
              <CardTitle className="text-xl">Безопасность</CardTitle>
              <CardDescription>Пароль и способы входа</CardDescription>
            </CardHeader>
          </Card>
        </Link>

        {/* Settings - smaller */}
        <Link href="/my/settings" className="group sm:col-span-1 lg:col-span-2">
          <Card className="sm:min-h-50 relative flex h-full min-h-28 flex-col overflow-hidden transition-all hover:border-slate-200 hover:bg-slate-50 hover:shadow-lg dark:hover:border-slate-800 dark:hover:bg-slate-950/30">
            <Settings className="text-muted-foreground/10 absolute -bottom-6 -right-6 h-32 w-32" />
            <CardHeader className="relative z-10 flex-1">
              <CardTitle className="text-xl">Настройки</CardTitle>
              <CardDescription>Область интересов и тема</CardDescription>
            </CardHeader>
          </Card>
        </Link>

        {/* Publications - larger */}
        <Link href="/my/publications" className="group sm:col-span-1 lg:col-span-3">
          <Card className="sm:min-h-50 relative flex h-full min-h-28 flex-col overflow-hidden transition-all hover:border-cyan-200 hover:bg-cyan-50 hover:shadow-lg dark:hover:border-cyan-800 dark:hover:bg-cyan-950/30">
            <MessageSquare className="text-muted-foreground/10 absolute -bottom-6 -right-6 h-32 w-32" />
            <CardHeader className="relative z-10 flex-1">
              <CardTitle className="text-xl">Публикации</CardTitle>
              <CardDescription>Объявления для соседей</CardDescription>
            </CardHeader>
          </Card>
        </Link>
      </div>
    </div>
  );
}
