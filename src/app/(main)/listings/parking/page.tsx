"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, ArrowUpDown, Building2, Calendar, Car, Phone } from "lucide-react";
import Link from "next/link";

import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { api, type RouterOutputs } from "~/trpc/react";

type ListingType = "rent" | "sale";

type ListingData = RouterOutputs["listings"]["public"]["list"]["listings"][0];

// Generate parking code: P<building>-<floor>-<spot>
function getParkingCode(listing: ListingData): string {
  if (!listing.parkingSpot?.floor?.parking?.building?.number) {
    return "P?-?-???";
  }
  const building = listing.parkingSpot.floor.parking.building.number;
  const floor = Math.abs(listing.parkingSpot.floor.floorNumber);
  const spot = listing.parkingSpot.number.toString().padStart(3, "0");
  return `P${building}-${floor}-${spot}`;
}

// Parse parking code for sorting
function parseParkingCode(code: string): { building: number; floor: number; spot: number } {
  const match = code.match(/P(\d+)-(\d+)-(\d+)/);
  if (!match) return { building: 999, floor: 999, spot: 999 };
  return {
    building: parseInt(match[1]!, 10),
    floor: parseInt(match[2]!, 10),
    spot: parseInt(match[3]!, 10),
  };
}

export default function ParkingListingsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentType = searchParams.get("type") as ListingType | null;
  const currentBuilding = searchParams.get("building");
  const currentSort = searchParams.get("sort") ?? "code";

  const [page, setPage] = useState(1);

  const { data: buildingsData } = api.listings.public.buildingsWithParkings.useQuery();
  const { data, isLoading } = api.listings.public.list.useQuery({
    page: 1,
    limit: 100, // Get all for client-side sorting
    type: currentType ?? undefined,
    propertyType: "parking",
    buildingNumber: currentBuilding ? parseInt(currentBuilding) : undefined,
  });

  const setFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "all") {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    router.push(`/listings/parking?${params.toString()}`);
    setPage(1);
  };

  const formatPrice = (price: number, type: ListingType) => {
    const formatted = new Intl.NumberFormat("ru-RU").format(price);
    if (type === "rent") {
      return `${formatted} ₽/мес`;
    }
    return `${formatted} ₽`;
  };

  // Sort listings
  const sortedListings = [...(data?.listings ?? [])].sort((a, b) => {
    if (currentSort === "code") {
      const codeA = parseParkingCode(getParkingCode(a));
      const codeB = parseParkingCode(getParkingCode(b));
      if (codeA.building !== codeB.building) return codeA.building - codeB.building;
      if (codeA.floor !== codeB.floor) return codeA.floor - codeB.floor;
      return codeA.spot - codeB.spot;
    }
    if (currentSort === "price_asc") {
      return a.price - b.price;
    }
    if (currentSort === "price_desc") {
      return b.price - a.price;
    }
    // Default: by date (newest first)
    return new Date(b.publishedAt ?? 0).getTime() - new Date(a.publishedAt ?? 0).getTime();
  });

  // Client-side pagination
  const pageSize = 20;
  const totalPages = Math.ceil(sortedListings.length / pageSize);
  const paginatedListings = sortedListings.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/listings">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
          <Car className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Паркинг</h1>
          <p className="text-sm text-muted-foreground">
            Аренда и продажа парковочных мест
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        {/* Type filter */}
        <Select
          value={currentType ?? "all"}
          onValueChange={(value) => setFilter("type", value)}
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Тип сделки" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все типы</SelectItem>
            <SelectItem value="rent">Аренда</SelectItem>
            <SelectItem value="sale">Продажа</SelectItem>
          </SelectContent>
        </Select>

        {/* Building filter */}
        <Select
          value={currentBuilding ?? "all"}
          onValueChange={(value) => setFilter("building", value)}
        >
          <SelectTrigger className="w-44">
            <SelectValue placeholder="Строение" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все строения</SelectItem>
            {buildingsData?.map((building) => (
              <SelectItem key={building.id} value={String(building.number)}>
                Строение {building.number}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Sort */}
        <Select
          value={currentSort}
          onValueChange={(value) => setFilter("sort", value)}
        >
          <SelectTrigger className="w-44">
            <ArrowUpDown className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Сортировка" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="code">По номеру (P1-1-001)</SelectItem>
            <SelectItem value="price_asc">Сначала дешевые</SelectItem>
            <SelectItem value="price_desc">Сначала дорогие</SelectItem>
            <SelectItem value="date">По дате</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Listings grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <p className="text-muted-foreground">Загрузка...</p>
        </div>
      ) : paginatedListings.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12">
          <Car className="h-12 w-12 text-muted-foreground/50" />
          <p className="mt-4 text-lg font-medium text-muted-foreground">
            Объявления не найдены
          </p>
          {(currentType || currentBuilding) && (
            <button
              onClick={() => router.push("/listings/parking")}
              className="mt-2 text-sm text-primary hover:underline"
            >
              Сбросить фильтры
            </button>
          )}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {paginatedListings.map((listing) => {
            const parkingCode = getParkingCode(listing);
            return (
              <Card key={listing.id} className="overflow-hidden">
                {/* Main photo placeholder */}
                <div className="relative aspect-video bg-muted">
                  {listing.photos && listing.photos.length > 0 ? (
                    <img
                      src={listing.photos.find((p) => p.isMain)?.url ?? listing.photos[0]?.url}
                      alt={listing.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <Car className="h-12 w-12 text-muted-foreground/30" />
                    </div>
                  )}
                  {/* Type badge */}
                  <div className="absolute left-2 top-2">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        listing.listingType === "rent"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {listing.listingType === "rent" ? "Аренда" : "Продажа"}
                    </span>
                  </div>
                  {/* Parking code badge */}
                  <div className="absolute right-2 top-2">
                    <span className="inline-flex items-center rounded-full bg-gray-900/80 px-2.5 py-0.5 font-mono text-xs font-bold text-white">
                      {parkingCode}
                    </span>
                  </div>
                </div>

                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="line-clamp-2 font-semibold leading-tight">
                      {listing.title}
                    </h3>
                    <span className="shrink-0 text-lg font-bold text-primary">
                      {formatPrice(listing.price, listing.listingType)}
                    </span>
                  </div>
                </CardHeader>

                <CardContent className="space-y-3">
                  {/* Location */}
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Building2 className="h-4 w-4 shrink-0" />
                    <span className="line-clamp-1">
                      Строение {listing.parkingSpot?.floor?.parking?.building?.number},
                      уровень {listing.parkingSpot?.floor?.floorNumber ?? "?"},
                      место {listing.parkingSpot?.number}
                    </span>
                  </div>

                  {/* Publication date */}
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4 shrink-0" />
                    <span>
                      {listing.publishedAt
                        ? new Date(listing.publishedAt).toLocaleDateString("ru-RU", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })
                        : "Дата не указана"}
                    </span>
                  </div>

                  {/* User info */}
                  <div className="flex items-center justify-between border-t pt-3">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={listing.user?.image ?? undefined} />
                        <AvatarFallback className="text-xs">
                          {listing.user?.name?.slice(0, 2).toUpperCase() ?? "U"}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm text-muted-foreground">
                        {listing.user?.name ?? "Пользователь"}
                      </span>
                    </div>
                    <Button size="sm" variant="outline">
                      <Phone className="mr-1 h-3 w-3" />
                      Связаться
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Страница {page} из {totalPages} (всего {sortedListings.length})
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Назад
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Вперед
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
