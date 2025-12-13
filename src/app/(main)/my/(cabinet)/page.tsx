import {
  Home,
  KeyRound,
  Megaphone,
  User,
} from "lucide-react";
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
      <PageHeader
       title="Кабинет"
       description={`Добро пожаловать, ${userName}`}
      />

      {/* Category cards - asymmetric grid */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5">
        {/* Listings - larger */}
        <Link href="/my/ads" className="group sm:col-span-1 lg:col-span-3">
          <Card className="relative flex min-h-28 sm:min-h-50 h-full flex-col overflow-hidden transition-all hover:bg-amber-50 hover:border-amber-200 hover:shadow-lg dark:hover:bg-amber-950/30 dark:hover:border-amber-800">
            {activeListings.length > 0 && (
              <Badge className="absolute right-4 top-4 z-10 bg-green-500">
                {activeListings.length} активных
              </Badge>
            )}
            <Megaphone className="absolute -bottom-6 -right-6 h-32 w-32 text-muted-foreground/10" />
            <CardHeader className="relative z-10 flex-1">
              <CardTitle className="text-xl">Объявления</CardTitle>
              <CardDescription>
                Аренда и продажа недвижимости
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>

        {/* Property - smaller */}
        <Link href="/my/property" className="group sm:col-span-1 lg:col-span-2">
          <Card className="relative flex min-h-28 sm:min-h-50 h-full flex-col overflow-hidden transition-all hover:bg-green-50 hover:border-green-200 hover:shadow-lg dark:hover:bg-green-950/30 dark:hover:border-green-800">
            {pendingClaims.length > 0 && (
              <Badge className="absolute right-4 top-4 z-10 bg-yellow-500">
                {pendingClaims.length} на модерации
              </Badge>
            )}
            <Home className="absolute -bottom-6 -right-6 h-32 w-32 text-muted-foreground/10" />
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
          <Card className="relative flex min-h-28 sm:min-h-50 h-full flex-col overflow-hidden transition-all hover:bg-blue-50 hover:border-blue-200 hover:shadow-lg dark:hover:bg-blue-950/30 dark:hover:border-blue-800">
            <User className="absolute -bottom-6 -right-6 h-32 w-32 text-muted-foreground/10" />
            <CardHeader className="relative z-10 flex-1">
              <CardTitle className="text-xl">Профиль</CardTitle>
              <CardDescription>
                Личные данные и контакты
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>

        {/* Security - larger */}
        <Link href="/my/security" className="group sm:col-span-1 lg:col-span-3">
          <Card className="relative flex min-h-28 sm:min-h-50 h-full flex-col overflow-hidden transition-all hover:bg-violet-50 hover:border-violet-200 hover:shadow-lg dark:hover:bg-violet-950/30 dark:hover:border-violet-800">
            <KeyRound className="absolute -bottom-6 -right-6 h-32 w-32 text-muted-foreground/10" />
            <CardHeader className="relative z-10 flex-1">
              <CardTitle className="text-xl">Безопасность</CardTitle>
              <CardDescription>
                Пароль и способы входа
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>
      </div>
    </div>
  );
}
