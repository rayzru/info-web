import {
  Home,
  KeyRound,
  Megaphone,
  User,
} from "lucide-react";
import Link from "next/link";
import { PageHeader } from "~/components/page-header";

import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
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

      {/* Category cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
        {/* Listings */}
        <Card className="relative flex min-h-[200px] flex-col overflow-hidden">
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
          <CardContent className="relative z-10">
            <Button asChild size="sm">
              <Link href="/my/ads">Мои объявления</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Property */}
        <Card className="relative flex min-h-[200px] flex-col overflow-hidden">
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
          <CardContent className="relative z-10">
            <Button asChild size="sm">
              <Link href="/my/property">Управление</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Profile */}
        <Card className="relative flex min-h-[200px] flex-col overflow-hidden">
          <User className="absolute -bottom-6 -right-6 h-32 w-32 text-muted-foreground/10" />
          <CardHeader className="relative z-10 flex-1">
            <CardTitle className="text-xl">Профиль</CardTitle>
            <CardDescription>
              Личные данные и контактная информация
            </CardDescription>
          </CardHeader>
          <CardContent className="relative z-10 flex gap-2">
            <Button asChild size="sm">
              <Link href="/my/profile">Изменить</Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link href="/my/security">
                <KeyRound className="mr-1 h-4 w-4" />
                Безопасность
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
