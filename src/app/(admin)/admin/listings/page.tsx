"use client";

import { useState } from "react";

import {
  Check,
  ChevronLeft,
  ChevronRight,
  Eye,
  Home,
  ImageIcon,
  Loader2,
  MoreHorizontal,
  ParkingCircle,
  X,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

import { AdminPageHeader } from "~/components/admin/admin-page-header";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Textarea } from "~/components/ui/textarea";
import { useMobile } from "~/hooks/use-mobile";
import { useToast } from "~/hooks/use-toast";
import { api } from "~/trpc/react";

const STATUS_LABELS: Record<string, string> = {
  draft: "Черновик",
  pending_moderation: "На модерации",
  approved: "Активно",
  rejected: "Отклонено",
  archived: "В архиве",
};

const STATUS_COLORS: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
  draft: "secondary",
  pending_moderation: "outline",
  approved: "default",
  rejected: "destructive",
  archived: "secondary",
};

const LISTING_TYPE_LABELS: Record<string, string> = {
  rent: "Аренда",
  sale: "Продажа",
};

const REJECTION_TEMPLATES = [
  { value: "inappropriate_content", label: "Недопустимое содержание" },
  { value: "misleading_info", label: "Недостоверная информация" },
  { value: "wrong_price", label: "Некорректная цена" },
  { value: "duplicate", label: "Дубликат объявления" },
  { value: "custom", label: "Свой текст" },
];

const REJECTION_TEXT: Record<string, string> = {
  inappropriate_content: "Объявление содержит недопустимый контент",
  misleading_info: "Указанная информация не соответствует действительности",
  wrong_price: "Указана некорректная цена",
  duplicate: "Это объявление дублирует уже существующее",
};

type ModerationDialogProps = {
  listing: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
};

function ModerationDialog({ listing, open, onOpenChange, onSuccess }: ModerationDialogProps) {
  const { toast } = useToast();
  const [action, setAction] = useState<"approve" | "reject">("approve");
  const [template, setTemplate] = useState<string>("");
  const [customText, setCustomText] = useState("");

  const moderateMutation = api.listings.admin.moderate.useMutation({
    onSuccess: () => {
      toast({
        title: action === "approve" ? "Объявление одобрено" : "Объявление отклонено",
        description: "Решение сохранено",
      });
      onOpenChange(false);
      setTemplate("");
      setCustomText("");
      onSuccess();
    },
    onError: (error) => {
      toast({
        title: "Ошибка",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = () => {
    if (action === "reject" && !template) {
      toast({
        title: "Выберите причину отклонения",
        variant: "destructive",
      });
      return;
    }

    if (action === "reject" && template === "custom" && !customText.trim()) {
      toast({
        title: "Введите причину отклонения",
        variant: "destructive",
      });
      return;
    }

    const rejectionReason =
      action === "reject"
        ? template === "custom"
          ? customText
          : REJECTION_TEXT[template]
        : undefined;

    moderateMutation.mutate({
      listingId: listing.id,
      status: action === "approve" ? "approved" : "rejected",
      rejectionReason,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Модерация объявления</DialogTitle>
          <DialogDescription>{listing.title}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Listing Details */}
          <div className="bg-muted space-y-2 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <Badge variant={listing.listingType === "rent" ? "default" : "secondary"}>
                {LISTING_TYPE_LABELS[listing.listingType]}
              </Badge>
              <span className="font-bold">
                {listing.price.toLocaleString("ru-RU")} ₽{listing.listingType === "rent" && "/мес"}
              </span>
            </div>
            {listing.description && (
              <p className="text-muted-foreground line-clamp-3 text-sm">{listing.description}</p>
            )}
          </div>

          {/* Action Selection */}
          <div className="space-y-3">
            <Label>Решение</Label>
            <div className="flex gap-3">
              <Button
                type="button"
                variant={action === "approve" ? "default" : "outline"}
                className="flex-1"
                onClick={() => {
                  setAction("approve");
                  setTemplate("");
                }}
              >
                <Check className="mr-2 h-4 w-4" />
                Одобрить
              </Button>
              <Button
                type="button"
                variant={action === "reject" ? "destructive" : "outline"}
                className="flex-1"
                onClick={() => {
                  setAction("reject");
                  setTemplate("");
                }}
              >
                <X className="mr-2 h-4 w-4" />
                Отклонить
              </Button>
            </div>
          </div>

          {/* Rejection Reason */}
          {action === "reject" && (
            <div className="space-y-3">
              <Label>Причина отклонения</Label>
              <RadioGroup value={template} onValueChange={setTemplate}>
                {REJECTION_TEMPLATES.map((t) => (
                  <div key={t.value} className="flex items-center space-x-2">
                    <RadioGroupItem value={t.value} id={t.value} />
                    <Label htmlFor={t.value} className="cursor-pointer font-normal">
                      {t.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          )}

          {/* Custom Text */}
          {action === "reject" && template === "custom" && (
            <div className="space-y-2">
              <Label>Причина</Label>
              <Textarea
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                placeholder="Опишите причину отклонения..."
                rows={3}
              />
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Отмена
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={moderateMutation.isPending}
            variant={action === "reject" ? "destructive" : "default"}
          >
            {moderateMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {action === "approve" ? "Одобрить" : "Отклонить"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function AdminListingsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isMobile = useMobile();

  // Get filters from URL params
  const statusFilter = searchParams.get("status") ?? "pending_moderation";
  const typeFilter = searchParams.get("type") ?? "all";
  const pageParam = searchParams.get("page");
  const page = pageParam ? parseInt(pageParam, 10) : 1;
  const searchQuery = searchParams.get("q") ?? "";

  const [localSearch, setLocalSearch] = useState(searchQuery);
  const [selectedListing, setSelectedListing] = useState<any>(null);
  const [moderationDialogOpen, setModerationDialogOpen] = useState(false);

  const utils = api.useUtils();
  const { data, isLoading, refetch } = api.listings.admin.list.useQuery({
    page,
    limit: 20,
    status: statusFilter !== "all" ? (statusFilter as any) : undefined,
    type: typeFilter !== "all" ? (typeFilter as any) : undefined,
  });

  const handleModerationSuccess = () => {
    refetch();
    utils.listings.admin.stats.invalidate();
  };

  // Update URL with new filter
  const setFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(key, value);
    params.delete("page"); // Reset to page 1 on filter change
    router.push(`/admin/listings?${params.toString()}`);
  };

  // Update URL with new page
  const setPage = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (newPage === 1) {
      params.delete("page");
    } else {
      params.set("page", newPage.toString());
    }
    router.push(`/admin/listings?${params.toString()}`);
  };

  const openModerationDialog = (listing: any) => {
    setSelectedListing(listing);
    setModerationDialogOpen(true);
  };

  const getPropertyInfo = (listing: any) => {
    if (listing.propertyType === "apartment" && listing.apartment) {
      return {
        icon: Home,
        title: `Квартира ${listing.apartment.number}`,
        subtitle:
          listing.apartment.floor?.entrance?.building?.title ??
          `Строение ${listing.apartment.floor?.entrance?.building?.number}`,
      };
    }
    if (listing.propertyType === "parking" && listing.parkingSpot) {
      return {
        icon: ParkingCircle,
        title: `Место ${listing.parkingSpot.number}`,
        subtitle: listing.parkingSpot.floor?.parking?.name,
      };
    }
    return {
      icon: Home,
      title: "Неизвестный объект",
      subtitle: "",
    };
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Модерация объявлений"
        description="Рассмотрение объявлений пользователей"
      />

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <Input
          placeholder="Поиск по названию..."
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          className="w-full sm:w-64"
        />

        <Select value={statusFilter} onValueChange={(v) => setFilter("status", v)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Статус" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все статусы</SelectItem>
            <SelectItem value="pending_moderation">На модерации</SelectItem>
            <SelectItem value="approved">Активные</SelectItem>
            <SelectItem value="rejected">Отклоненные</SelectItem>
            <SelectItem value="archived">В архиве</SelectItem>
          </SelectContent>
        </Select>

        <Select value={typeFilter} onValueChange={(v) => setFilter("type", v)}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Тип" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все типы</SelectItem>
            <SelectItem value="rent">Аренда</SelectItem>
            <SelectItem value="sale">Продажа</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Listings Table/Cards */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : data?.listings && data.listings.length > 0 ? (
        <>
          {/* Desktop Table View */}
          <div className="hidden rounded-lg border md:block">
            <div className="bg-muted/50 text-muted-foreground flex items-center gap-4 border-b px-4 py-3 text-sm font-medium">
              <div className="w-24">Дата</div>
              <div className="min-w-0 flex-1">Объявление</div>
              <div className="w-28">Тип</div>
              <div className="w-32">Цена</div>
              <div className="w-40">Автор</div>
              <div className="w-28">Статус</div>
              <div className="w-10"></div>
            </div>

            {data.listings.map((listing) => {
              const propertyInfo = getPropertyInfo(listing);
              const PropertyIcon = propertyInfo.icon;

              return (
                <div
                  key={listing.id}
                  className="hover:bg-muted/30 flex items-center gap-4 border-b px-4 py-3 last:border-b-0"
                >
                  {/* Date */}
                  <div className="text-muted-foreground w-24 text-sm">
                    {formatDate(listing.createdAt)}
                  </div>

                  {/* Title + Property */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <PropertyIcon className="text-muted-foreground h-4 w-4 shrink-0" />
                      <span className="truncate font-medium">{listing.title}</span>
                    </div>
                    <div className="text-muted-foreground mt-0.5 flex items-center gap-1.5 text-xs">
                      <span className="truncate">{propertyInfo.title}</span>
                      {propertyInfo.subtitle && (
                        <>
                          <span>·</span>
                          <span className="truncate">{propertyInfo.subtitle}</span>
                        </>
                      )}
                    </div>
                    {listing.photos && listing.photos.length > 0 && (
                      <div className="mt-1 flex items-center gap-1">
                        <ImageIcon className="h-3 w-3" />
                        <span className="text-muted-foreground text-xs">
                          {listing.photos.length}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Listing Type */}
                  <div className="w-28">
                    <Badge variant={listing.listingType === "rent" ? "default" : "secondary"}>
                      {LISTING_TYPE_LABELS[listing.listingType]}
                    </Badge>
                  </div>

                  {/* Price */}
                  <div className="w-32 text-sm font-medium">
                    {listing.price.toLocaleString("ru-RU")} ₽
                    {listing.listingType === "rent" && (
                      <span className="text-muted-foreground">/мес</span>
                    )}
                  </div>

                  {/* Author */}
                  <div className="flex w-40 items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={listing.user?.image ?? undefined} />
                      <AvatarFallback className="text-xs">
                        {listing.user?.name?.slice(0, 2).toUpperCase() ?? "??"}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-muted-foreground truncate text-sm">
                      {listing.user?.name ?? listing.user?.email}
                    </span>
                  </div>

                  {/* Status */}
                  <div className="w-28">
                    <Badge variant={STATUS_COLORS[listing.status]}>
                      {STATUS_LABELS[listing.status]}
                    </Badge>
                  </div>

                  {/* Actions */}
                  <div className="w-10">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {listing.status === "pending_moderation" && (
                          <DropdownMenuItem onClick={() => openModerationDialog(listing)}>
                            <Eye className="mr-2 h-4 w-4" />
                            Рассмотреть
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Mobile Card View */}
          <div className="space-y-3 md:hidden">
            {data.listings.map((listing) => {
              const propertyInfo = getPropertyInfo(listing);
              const PropertyIcon = propertyInfo.icon;

              return (
                <div key={listing.id} className="bg-card rounded-lg border p-4">
                  <div className="mb-3 flex items-start justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="mb-1 flex items-center gap-2">
                        <PropertyIcon className="text-muted-foreground h-4 w-4 shrink-0" />
                        <h3 className="truncate font-medium">{listing.title}</h3>
                      </div>
                      <div className="text-muted-foreground text-xs">
                        {propertyInfo.title} · {propertyInfo.subtitle}
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {listing.status === "pending_moderation" && (
                          <DropdownMenuItem onClick={() => openModerationDialog(listing)}>
                            <Eye className="mr-2 h-4 w-4" />
                            Рассмотреть
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="mb-3 flex flex-wrap gap-2">
                    <Badge variant={STATUS_COLORS[listing.status]}>
                      {STATUS_LABELS[listing.status]}
                    </Badge>
                    <Badge variant={listing.listingType === "rent" ? "default" : "secondary"}>
                      {LISTING_TYPE_LABELS[listing.listingType]}
                    </Badge>
                  </div>

                  <div className="text-muted-foreground space-y-1 text-sm">
                    <div className="font-medium">
                      {listing.price.toLocaleString("ru-RU")} ₽
                      {listing.listingType === "rent" && "/мес"}
                    </div>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-5 w-5">
                        <AvatarImage src={listing.user?.image ?? undefined} />
                        <AvatarFallback className="text-xs">
                          {listing.user?.name?.slice(0, 2).toUpperCase() ?? "??"}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-xs">{listing.user?.name ?? listing.user?.email}</span>
                      <span>·</span>
                      <span className="text-xs">{formatDate(listing.createdAt)}</span>
                    </div>
                    {listing.photos && listing.photos.length > 0 && (
                      <div className="flex items-center gap-1">
                        <ImageIcon className="h-3 w-3" />
                        <span className="text-xs">{listing.photos.length} фото</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          {data.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <Button
                variant="outline"
                size="icon"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm">
                {page} из {data.totalPages}
              </span>
              <Button
                variant="outline"
                size="icon"
                disabled={page === data.totalPages}
                onClick={() => setPage(page + 1)}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </>
      ) : (
        <div className="text-muted-foreground rounded-lg border py-12 text-center">
          {statusFilter === "pending_moderation"
            ? "Нет объявлений на модерации"
            : "Объявлений не найдено"}
        </div>
      )}

      {/* Moderation Dialog */}
      {selectedListing && (
        <ModerationDialog
          listing={selectedListing}
          open={moderationDialogOpen}
          onOpenChange={setModerationDialogOpen}
          onSuccess={handleModerationSuccess}
        />
      )}
    </div>
  );
}
