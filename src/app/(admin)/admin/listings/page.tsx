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
  ParkingCircle,
  X,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
} from "~/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
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
import { useToast } from "~/hooks/use-toast";
import { api } from "~/trpc/react";

const STATUS_LABELS: Record<string, string> = {
  draft: "Черновик",
  pending_moderation: "На модерации",
  approved: "Активно",
  rejected: "Отклонено",
  archived: "В архиве",
};

const STATUS_COLORS: Record<string, string> = {
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

    const rejectionReason = action === "reject"
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
          <DialogDescription>
            {listing.title}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Listing Details */}
          <div className="bg-muted p-4 rounded-lg space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant={listing.listingType === "rent" ? "default" : "secondary"}>
                {LISTING_TYPE_LABELS[listing.listingType]}
              </Badge>
              <span className="font-bold">
                {listing.price.toLocaleString("ru-RU")} ₽
                {listing.listingType === "rent" && "/мес"}
              </span>
            </div>
            {listing.description && (
              <p className="text-sm text-muted-foreground line-clamp-3">
                {listing.description}
              </p>
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
                    <Label htmlFor={t.value} className="font-normal cursor-pointer">
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
            {moderateMutation.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
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

  // Get filters from URL params
  const statusFilter = searchParams.get("status") ?? "pending_moderation";
  const typeFilter = searchParams.get("type") ?? "all";
  const pageParam = searchParams.get("page");
  const page = pageParam ? parseInt(pageParam, 10) : 1;

  const [selectedListing, setSelectedListing] = useState<any>(null);
  const [moderationDialogOpen, setModerationDialogOpen] = useState(false);

  const utils = api.useUtils();
  const { data: stats } = api.listings.admin.stats.useQuery(undefined, {
    staleTime: 30000, // Cache for 30 seconds
  });
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
        subtitle: listing.apartment.floor?.entrance?.building?.title
          ?? `Строение ${listing.apartment.floor?.entrance?.building?.number}`,
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Модерация объявлений</h1>
        <p className="text-muted-foreground mt-1">
          Рассмотрение объявлений пользователей
        </p>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid gap-4 grid-cols-2 sm:grid-cols-4">
          <Card
            className={`cursor-pointer transition-all hover:shadow-md ${
              statusFilter === "pending_moderation"
                ? "ring-2 ring-yellow-500 ring-offset-2"
                : ""
            }`}
            onClick={() => setFilter("status", "pending_moderation")}
          >
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-yellow-600">
                {stats.pendingModeration}
              </div>
              <p className="text-sm text-muted-foreground">На модерации</p>
            </CardContent>
          </Card>
          <Card
            className={`cursor-pointer transition-all hover:shadow-md ${
              statusFilter === "approved"
                ? "ring-2 ring-green-500 ring-offset-2"
                : ""
            }`}
            onClick={() => setFilter("status", "approved")}
          >
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-green-600">
                {stats.approved}
              </div>
              <p className="text-sm text-muted-foreground">Активные</p>
            </CardContent>
          </Card>
          <Card
            className={`cursor-pointer transition-all hover:shadow-md ${
              statusFilter === "rejected"
                ? "ring-2 ring-red-500 ring-offset-2"
                : ""
            }`}
            onClick={() => setFilter("status", "rejected")}
          >
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-red-600">
                {stats.rejected}
              </div>
              <p className="text-sm text-muted-foreground">Отклонено</p>
            </CardContent>
          </Card>
          <Card
            className={`cursor-pointer transition-all hover:shadow-md ${
              statusFilter === "all"
                ? "ring-2 ring-primary ring-offset-2"
                : ""
            }`}
            onClick={() => setFilter("status", "all")}
          >
            <CardContent className="pt-4">
              <div className="text-2xl font-bold">
                {stats.total}
              </div>
              <p className="text-sm text-muted-foreground">Всего</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <div className="flex items-center gap-4">
        <Select value={statusFilter} onValueChange={(v) => setFilter("status", v)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Статус" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pending_moderation">На модерации</SelectItem>
            <SelectItem value="approved">Активные</SelectItem>
            <SelectItem value="rejected">Отклоненные</SelectItem>
            <SelectItem value="all">Все</SelectItem>
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

      {/* Listings List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : data?.listings && data.listings.length > 0 ? (
        <div className="space-y-4">
          {data.listings.map((listing) => {
            const propertyInfo = getPropertyInfo(listing);
            const PropertyIcon = propertyInfo.icon;

            return (
              <Card key={listing.id}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    {/* User Avatar */}
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={listing.user?.image ?? undefined} />
                      <AvatarFallback>
                        {listing.user?.name?.slice(0, 2).toUpperCase() ?? "??"}
                      </AvatarFallback>
                    </Avatar>

                    {/* Listing Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium truncate max-w-[300px]">
                          {listing.title}
                        </span>
                        <Badge variant={STATUS_COLORS[listing.status] as any}>
                          {STATUS_LABELS[listing.status]}
                        </Badge>
                        <Badge variant={listing.listingType === "rent" ? "default" : "secondary"}>
                          {LISTING_TYPE_LABELS[listing.listingType]}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                        <PropertyIcon className="h-4 w-4" />
                        <span>{propertyInfo.title}</span>
                        <span>·</span>
                        <span>{propertyInfo.subtitle}</span>
                      </div>

                      <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                        <span className="font-medium text-foreground">
                          {listing.price.toLocaleString("ru-RU")} ₽
                          {listing.listingType === "rent" && "/мес"}
                        </span>
                        <span>·</span>
                        <span>{listing.user?.name ?? listing.user?.email}</span>
                        <span>·</span>
                        <span>
                          {new Date(listing.createdAt).toLocaleDateString("ru-RU")}
                        </span>
                        {listing.photos && listing.photos.length > 0 && (
                          <>
                            <span>·</span>
                            <span className="flex items-center gap-1">
                              <ImageIcon className="h-3 w-3" />
                              {listing.photos.length}
                            </span>
                          </>
                        )}
                      </div>

                      {listing.description && (
                        <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                          {listing.description}
                        </p>
                      )}

                      {listing.rejectionReason && (
                        <p className="mt-2 text-sm text-red-600 italic">
                          Причина отклонения: {listing.rejectionReason}
                        </p>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      {listing.status === "pending_moderation" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openModerationDialog(listing)}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          Рассмотреть
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}

          {/* Pagination */}
          {data.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-4">
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
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            {statusFilter === "pending_moderation"
              ? "Нет объявлений на модерации"
              : "Объявлений не найдено"}
          </CardContent>
        </Card>
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
