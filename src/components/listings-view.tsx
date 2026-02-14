"use client";

import { useState } from "react";

import {
  Archive,
  ClipboardList,
  Download,
  FileText,
  HomeIcon,
  ImageIcon,
  Loader2,
  Megaphone,
  ParkingCircleIcon,
  Plus,
  Send,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
  DialogTrigger,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Textarea } from "~/components/ui/textarea";
import { useToast } from "~/hooks/use-toast";
import { api } from "~/trpc/react";

interface ListingsViewProps {
  listings: Array<{
    id: string;
    listingType: "rent" | "sale";
    propertyType: "apartment" | "parking";
    title: string;
    description: string | null;
    price: number;
    status: string;
    viewCount: number;
    createdAt: Date;
    apartment?: {
      number: string;
      floor?: {
        floorNumber: number;
        entrance?: {
          entranceNumber: number;
          building?: {
            title: string | null;
            number: number | null;
          };
        };
      };
    } | null;
    parkingSpot?: {
      number: string;
      floor?: {
        floorNumber: number;
        parking?: {
          name: string;
          building?: {
            title: string | null;
            number: number | null;
          };
        };
      };
    } | null;
    photos: Array<{
      id: string;
      url: string;
      isMain: boolean;
    }>;
  }>;
  myProperties: {
    apartments: Array<{
      id: string;
      number: string;
      type: string;
      floor: {
        floorNumber: number;
        entrance: {
          entranceNumber: number;
          building: {
            id: string;
            title: string | null;
            number: number | null;
          };
        };
      };
    }>;
    parkingSpots: Array<{
      id: string;
      number: string;
      type: string;
      floor: {
        floorNumber: number;
        parking: {
          name: string;
          building: {
            id: string;
            title: string | null;
            number: number | null;
          };
        };
      };
    }>;
  };
  hasVerifiedProperties: boolean;
}

export function ListingsView({ listings, myProperties, hasVerifiedProperties }: ListingsViewProps) {
  const router = useRouter();
  const { toast } = useToast();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [listingType, setListingType] = useState<"rent" | "sale">("rent");
  const [propertyType, setPropertyType] = useState<"apartment" | "parking">("apartment");
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");

  const createListing = api.listings.create.useMutation({
    onSuccess: () => {
      toast({
        title: "Объявление создано",
        description: "Объявление сохранено как черновик",
      });
      setIsCreateOpen(false);
      resetForm();
      router.refresh();
    },
    onError: (error) => {
      toast({
        title: "Ошибка",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const submitForModeration = api.listings.submitForModeration.useMutation({
    onSuccess: () => {
      toast({
        title: "Отправлено на модерацию",
        description: "Объявление будет рассмотрено администрацией",
      });
      router.refresh();
    },
    onError: (error) => {
      toast({
        title: "Ошибка",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const archiveListing = api.listings.archive.useMutation({
    onSuccess: () => {
      toast({
        title: "Объявление архивировано",
      });
      router.refresh();
    },
  });

  const deleteListing = api.listings.delete.useMutation({
    onSuccess: () => {
      toast({
        title: "Объявление удалено",
      });
      router.refresh();
    },
    onError: (error) => {
      toast({
        title: "Ошибка",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setListingType("rent");
    setPropertyType("apartment");
    setSelectedPropertyId("");
    setTitle("");
    setDescription("");
    setPrice("");
  };

  const handleCreate = () => {
    // For apartments require title, for parking generate it
    if (!selectedPropertyId || !price) return;
    if (propertyType === "apartment" && !title) return;

    // Generate title for parking spots
    let listingTitle = title;
    if (propertyType === "parking") {
      const spot = myProperties.parkingSpots.find((s) => s.id === selectedPropertyId);
      if (spot) {
        listingTitle = `${listingType === "rent" ? "Аренда" : "Продажа"} P${spot.floor.parking.building.number}/-${spot.floor.floorNumber}/${spot.number}`;
      }
    }

    createListing.mutate({
      listingType,
      propertyType,
      apartmentId: propertyType === "apartment" ? selectedPropertyId : undefined,
      parkingSpotId: propertyType === "parking" ? selectedPropertyId : undefined,
      title: listingTitle,
      description: description || undefined,
      price: parseInt(price, 10),
      utilitiesIncluded: propertyType === "parking",
    });
  };

  const activeListings = listings.filter((l) => l.status === "approved");
  const pendingListings = listings.filter((l) => l.status === "pending_moderation");
  const draftListings = listings.filter((l) => l.status === "draft" || l.status === "rejected");
  const archivedListings = listings.filter((l) => l.status === "archived");

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return (
          <span className="rounded bg-green-100 px-2 py-1 text-xs text-green-700">Активно</span>
        );
      case "pending_moderation":
        return (
          <span className="rounded bg-yellow-100 px-2 py-1 text-xs text-yellow-700">
            На модерации
          </span>
        );
      case "draft":
        return (
          <span className="rounded bg-gray-100 px-2 py-1 text-xs text-gray-700">Черновик</span>
        );
      case "rejected":
        return <span className="rounded bg-red-100 px-2 py-1 text-xs text-red-700">Отклонено</span>;
      case "archived":
        return (
          <span className="rounded bg-gray-100 px-2 py-1 text-xs text-gray-500">В архиве</span>
        );
      default:
        return null;
    }
  };

  const ListingCard = ({
    listing,
    hideFooter = false,
  }: {
    listing: ListingsViewProps["listings"][0];
    hideFooter?: boolean;
  }) => (
    <Card key={listing.id}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {listing.propertyType === "apartment" ? (
              <HomeIcon className="text-muted-foreground h-5 w-5 opacity-60" />
            ) : (
              <ParkingCircleIcon className="text-muted-foreground h-5 w-5 opacity-60" />
            )}
            <div>
              <CardTitle className="text-base">{listing.title}</CardTitle>
              <CardDescription>
                {listing.propertyType === "apartment"
                  ? `Квартира ${listing.apartment?.number}, ${
                      listing.apartment?.floor?.entrance?.building?.title ??
                      `Строение ${listing.apartment?.floor?.entrance?.building?.number}`
                    }`
                  : `Парковка ${listing.parkingSpot?.number}, ${listing.parkingSpot?.floor?.parking?.name}`}
              </CardDescription>
            </div>
          </div>
          {getStatusBadge(listing.status)}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 text-sm">
          <span
            className={`font-medium ${
              listing.listingType === "rent" ? "text-green-600" : "text-blue-600"
            }`}
          >
            {listing.listingType === "rent" ? "Аренда" : "Продажа"}
          </span>
          <span className="font-bold">
            {listing.price.toLocaleString("ru-RU")} ₽{listing.listingType === "rent" && "/мес"}
          </span>
          {listing.photos.length > 0 && (
            <span className="text-muted-foreground flex items-center gap-1">
              <ImageIcon className="h-3 w-3" />
              {listing.photos.length}
            </span>
          )}
          {listing.status === "approved" && (
            <span className="text-muted-foreground">{listing.viewCount} просмотров</span>
          )}
        </div>
      </CardContent>
      {!hideFooter && (
        <CardFooter className="border-t pt-3">
          <div className="flex w-full gap-2">
            {(listing.status === "draft" || listing.status === "rejected") && (
              <>
                <Button
                  size="sm"
                  onClick={() => submitForModeration.mutate({ listingId: listing.id })}
                  disabled={submitForModeration.isPending}
                >
                  {submitForModeration.isPending ? (
                    <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                  ) : (
                    <Send className="mr-2 h-3 w-3" />
                  )}
                  На модерацию
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => deleteListing.mutate({ listingId: listing.id })}
                  disabled={deleteListing.isPending}
                >
                  <Trash2 className="mr-2 h-3 w-3" />
                  Удалить
                </Button>
              </>
            )}
            {listing.status === "approved" && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => archiveListing.mutate({ listingId: listing.id })}
                disabled={archiveListing.isPending}
              >
                <Archive className="mr-2 h-3 w-3" />В архив
              </Button>
            )}
          </div>
        </CardFooter>
      )}
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* No verified properties message */}
      {!hasVerifiedProperties && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader className="text-center">
            <div className="mx-auto mb-2 w-fit rounded-lg bg-yellow-500/20 p-4">
              <ClipboardList className="h-8 w-8 text-yellow-600" />
            </div>
            <CardTitle>Нет подтвержденных объектов</CardTitle>
            <CardDescription>
              Чтобы размещать объявления, сначала подтвердите права на квартиру или парковочное
              место
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button asChild>
              <Link href="/my/property">Перейти к недвижимости</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Create Listing Button */}
      {hasVerifiedProperties && (
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Создать объявление
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Новое объявление</DialogTitle>
              <DialogDescription>
                Создайте объявление о сдаче или продаже недвижимости
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              {/* Listing Type */}
              <div className="space-y-2">
                <Label>Тип объявления</Label>
                <Select
                  value={listingType}
                  onValueChange={(v) => setListingType(v as "rent" | "sale")}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rent">Аренда</SelectItem>
                    <SelectItem value="sale">Продажа</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Property Type */}
              <div className="space-y-2">
                <Label>Тип недвижимости</Label>
                <Select
                  value={propertyType}
                  onValueChange={(v) => {
                    setPropertyType(v as "apartment" | "parking");
                    setSelectedPropertyId("");
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {myProperties.apartments.length > 0 && (
                      <SelectItem value="apartment">Квартира</SelectItem>
                    )}
                    {myProperties.parkingSpots.length > 0 && (
                      <SelectItem value="parking">Парковка</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>

              {/* Property Selection */}
              <div className="space-y-2">
                <Label>Выберите объект</Label>
                <Select value={selectedPropertyId} onValueChange={setSelectedPropertyId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите объект" />
                  </SelectTrigger>
                  <SelectContent>
                    {propertyType === "apartment"
                      ? myProperties.apartments.map((apt) => (
                          <SelectItem key={apt.id} value={apt.id}>
                            Квартира {apt.number},{" "}
                            {apt.floor.entrance.building.title ??
                              `Строение ${apt.floor.entrance.building.number}`}
                          </SelectItem>
                        ))
                      : myProperties.parkingSpots.map((spot) => (
                          <SelectItem key={spot.id} value={spot.id}>
                            Место {spot.number}, {spot.floor.parking.name}
                          </SelectItem>
                        ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Title - only for apartments */}
              {propertyType === "apartment" && (
                <div className="space-y-2">
                  <Label>Заголовок</Label>
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Например: Уютная студия в новом доме"
                  />
                </div>
              )}

              {/* Description */}
              <div className="space-y-2">
                <Label>Описание</Label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={
                    propertyType === "parking"
                      ? "Укажите особенности места: размеры, удобство подъезда, наличие розетки и т.д."
                      : "Опишите особенности объекта..."
                  }
                  rows={3}
                />
              </div>

              {/* Price */}
              <div className="space-y-2">
                <Label>Цена {listingType === "rent" && "(в месяц)"}</Label>
                <Input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="0"
                />
                {propertyType === "parking" && listingType === "rent" && (
                  <p className="text-muted-foreground text-xs">
                    Цена включает коммунальные расходы на содержание парковки
                  </p>
                )}
              </div>

              {/* Photo Upload Placeholder */}
              <Card className="border-dashed">
                <CardContent className="pt-4">
                  <div className="flex items-center gap-3">
                    <ImageIcon className="text-muted-foreground h-5 w-5" />
                    <div>
                      <p className="text-sm font-medium">Фотографии</p>
                      <p className="text-muted-foreground text-xs">Загрузка фото пока недоступна</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Contract Template for Parking Rental */}
              {propertyType === "parking" && listingType === "rent" && (
                <Card className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/30">
                  <CardContent className="pt-4">
                    <div className="flex items-start gap-3">
                      <FileText className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Шаблон договора аренды</p>
                        <p className="text-muted-foreground mt-1 text-xs">
                          Рекомендуем использовать типовой договор с условиями передачи ключа,
                          залога и правилами пользования парковкой
                        </p>
                        <Button variant="outline" size="sm" className="mt-2" asChild>
                          <a
                            href="/templates/parking-rental-contract.html"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Download className="mr-2 h-3 w-3" />
                            Скачать шаблон договора
                          </a>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setIsCreateOpen(false);
                  resetForm();
                }}
              >
                Отмена
              </Button>
              <Button
                onClick={handleCreate}
                disabled={
                  createListing.isPending ||
                  !selectedPropertyId ||
                  (propertyType === "apartment" && !title) ||
                  !price
                }
              >
                {createListing.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Создать черновик
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Listings Tabs */}
      {listings.length > 0 && (
        <Tabs defaultValue="active">
          <TabsList>
            <TabsTrigger value="active" className="font-normal">
              Активные
              <span className="bg-muted ml-1.5 flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-xs">
                {activeListings.length}
              </span>
            </TabsTrigger>
            <TabsTrigger value="pending" className="font-normal">
              На модерации
              <span className="bg-muted ml-1.5 flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-xs">
                {pendingListings.length}
              </span>
            </TabsTrigger>
            <TabsTrigger value="drafts" className="font-normal">
              Черновики
              <span className="bg-muted ml-1.5 flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-xs">
                {draftListings.length}
              </span>
            </TabsTrigger>
            <TabsTrigger value="archived" className="font-normal">
              Архив
              <span className="bg-muted ml-1.5 flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-xs">
                {archivedListings.length}
              </span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-4">
            {activeListings.length === 0 ? (
              <Card>
                <CardContent className="text-muted-foreground py-8 text-center">
                  Нет активных объявлений
                </CardContent>
              </Card>
            ) : (
              activeListings.map((listing) => <ListingCard key={listing.id} listing={listing} />)
            )}
          </TabsContent>

          <TabsContent value="pending" className="space-y-4">
            {pendingListings.length === 0 ? (
              <Card>
                <CardContent className="text-muted-foreground py-8 text-center">
                  Нет объявлений на модерации
                </CardContent>
              </Card>
            ) : (
              pendingListings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} hideFooter />
              ))
            )}
          </TabsContent>

          <TabsContent value="drafts" className="space-y-4">
            {draftListings.length === 0 ? (
              <Card>
                <CardContent className="text-muted-foreground py-8 text-center">
                  Нет черновиков
                </CardContent>
              </Card>
            ) : (
              draftListings.map((listing) => <ListingCard key={listing.id} listing={listing} />)
            )}
          </TabsContent>

          <TabsContent value="archived" className="space-y-4">
            {archivedListings.length === 0 ? (
              <Card>
                <CardContent className="text-muted-foreground py-8 text-center">
                  Архив пуст
                </CardContent>
              </Card>
            ) : (
              archivedListings.map((listing) => <ListingCard key={listing.id} listing={listing} />)
            )}
          </TabsContent>
        </Tabs>
      )}

      {/* Empty State */}
      {listings.length === 0 && hasVerifiedProperties && (
        <Card>
          <CardHeader className="text-center">
            <div className="bg-muted mx-auto mb-2 w-fit rounded-lg p-4">
              <Megaphone className="text-muted-foreground h-8 w-8" />
            </div>
            <CardTitle>У вас пока нет объявлений</CardTitle>
            <CardDescription>Создайте первое объявление о сдаче или продаже</CardDescription>
          </CardHeader>
        </Card>
      )}
    </div>
  );
}
