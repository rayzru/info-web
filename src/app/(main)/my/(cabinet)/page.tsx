import { Avatar } from "@radix-ui/react-avatar";
import {
  ChevronRight,
  ClipboardList,
  HomeIcon,
  Megaphone,
  ParkingCircleIcon,
  User,
} from "lucide-react";
import Link from "next/link";

import { AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { auth } from "~/server/auth";
import { api } from "~/trpc/server";

export default async function ProfilePage() {
  const session = await auth();
  const userName = session?.user?.name ?? "Пользователь";
  const userEmail = session?.user?.email ?? "";
  const userImage = session?.user?.image ?? "";

  // Get user's claims and approved properties
  const claims = await api.claims.my();
  const pendingClaims = claims.filter((c) => c.status === "pending");
  const approvedApartments = claims.filter(
    (c) => c.claimType === "apartment" && c.status === "approved"
  );
  const approvedParking = claims.filter(
    (c) => c.claimType === "parking" && c.status === "approved"
  );

  // Get user's listings
  const listings = await api.listings.my();
  const activeListings = listings.filter((l) => l.status === "approved");
  const pendingListings = listings.filter(
    (l) => l.status === "pending_moderation"
  );

  const hasProperty = approvedApartments.length > 0 || approvedParking.length > 0;

  return (
    <div className="py-6">
      {/* Header with User Info */}
      <div className="flex items-center gap-4 mb-8">
        <Avatar className="h-14 w-14">
          <AvatarImage src={userImage} alt="" className="rounded-full" />
          <AvatarFallback className="text-lg bg-primary/10 text-primary">
            {userName.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-xl font-semibold">{userName}</h1>
          <p className="text-sm text-muted-foreground">{userEmail}</p>
        </div>
      </div>

      {/* Main Actions */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-8">
        <Link href="/my/declare" className="group">
          <Card className="h-full transition-all hover:shadow-md hover:border-primary/50 group-hover:bg-primary/5">
            <CardContent className="flex items-center gap-4 p-5">
              <div className="shrink-0 rounded-xl bg-blue-500/10 p-3 group-hover:bg-blue-500/20 transition-colors">
                <ClipboardList className="h-6 w-6 text-blue-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium">Недвижимость</p>
                <p className="text-sm text-muted-foreground truncate">
                  {pendingClaims.length > 0
                    ? `${pendingClaims.length} на рассмотрении`
                    : "Квартира или парковка"}
                </p>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </CardContent>
          </Card>
        </Link>

        <Link href="/my/ads" className="group">
          <Card className="h-full transition-all hover:shadow-md hover:border-primary/50 group-hover:bg-primary/5">
            <CardContent className="flex items-center gap-4 p-5">
              <div className="shrink-0 rounded-xl bg-green-500/10 p-3 group-hover:bg-green-500/20 transition-colors">
                <Megaphone className="h-6 w-6 text-green-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium">Объявления</p>
                <p className="text-sm text-muted-foreground truncate">
                  {activeListings.length > 0
                    ? `${activeListings.length} активных`
                    : "Аренда и продажа"}
                </p>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </CardContent>
          </Card>
        </Link>

        <Link href="/my/profile" className="group sm:col-span-2 lg:col-span-1">
          <Card className="h-full transition-all hover:shadow-md hover:border-primary/50 group-hover:bg-primary/5">
            <CardContent className="flex items-center gap-4 p-5">
              <div className="shrink-0 rounded-xl bg-violet-500/10 p-3 group-hover:bg-violet-500/20 transition-colors">
                <User className="h-6 w-6 text-violet-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium">Профиль</p>
                <p className="text-sm text-muted-foreground truncate">
                  Настройки и информация
                </p>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Property Section */}
      {hasProperty ? (
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Мои объекты</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {approvedApartments.map((claim) => (
              <div
                key={claim.id}
                className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"
              >
                <div className="rounded-lg bg-primary/10 p-2">
                  <HomeIcon className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">
                    Квартира {claim.apartment?.number}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {claim.apartment?.floor?.entrance?.building?.title ??
                      `Строение ${claim.apartment?.floor?.entrance?.building?.number}`}
                  </p>
                </div>
                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                  {claim.claimedRole === "ApartmentOwner" ? "Собственник" : "Житель"}
                </span>
              </div>
            ))}

            {approvedParking.map((claim) => (
              <div
                key={claim.id}
                className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"
              >
                <div className="rounded-lg bg-blue-500/10 p-2">
                  <ParkingCircleIcon className="h-4 w-4 text-blue-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">
                    Место {claim.parkingSpot?.number}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {claim.parkingSpot?.floor?.parking?.name}
                  </p>
                </div>
                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                  {claim.claimedRole === "ParkingOwner" ? "Собственник" : "Арендатор"}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      ) : (
        <Card className="mb-6 border-dashed">
          <CardContent className="flex items-center gap-4 py-6">
            <div className="rounded-xl bg-muted p-3">
              <HomeIcon className="h-6 w-6 text-muted-foreground" />
            </div>
            <div className="flex-1">
              <p className="font-medium">Нет подтвержденных объектов</p>
              <p className="text-sm text-muted-foreground">
                Подайте заявку для подтверждения прав
              </p>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/my/declare">Подать заявку</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Pending Claims */}
      {pendingClaims.length > 0 && (
        <Card className="mb-6 border-yellow-200 bg-yellow-50/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-yellow-500 animate-pulse" />
              Заявки на рассмотрении
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {pendingClaims.map((claim) => (
              <div
                key={claim.id}
                className="flex items-center gap-3 p-3 rounded-lg bg-white/80"
              >
                {claim.claimType === "apartment" ? (
                  <HomeIcon className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ParkingCircleIcon className="h-4 w-4 text-muted-foreground" />
                )}
                <span className="text-sm flex-1">
                  {claim.claimType === "apartment"
                    ? `Квартира ${claim.apartment?.number}`
                    : `Парковка ${claim.parkingSpot?.number}`}
                </span>
                <span className="text-xs text-muted-foreground">
                  {new Date(claim.createdAt).toLocaleDateString("ru-RU")}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Active Listings Preview */}
      {(activeListings.length > 0 || pendingListings.length > 0) && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Мои объявления</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/my/ads">
                  Все
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {[...activeListings, ...pendingListings].slice(0, 3).map((listing) => (
              <div
                key={listing.id}
                className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{listing.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {listing.listingType === "rent" ? "Аренда" : "Продажа"}
                    {" · "}
                    {listing.price.toLocaleString("ru-RU")} ₽
                    {listing.listingType === "rent" && "/мес"}
                  </p>
                </div>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${
                    listing.status === "approved"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {listing.status === "approved" ? "Активно" : "Модерация"}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
