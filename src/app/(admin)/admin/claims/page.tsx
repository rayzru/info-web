"use client";

import { useState } from "react";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  FileText,
  History,
  Home,
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
import { Label } from "~/components/ui/label";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
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

const STATUS_LABELS: Record<string, string> = {
  pending: "Ожидает",
  review: "На рассмотрении",
  approved: "Одобрена",
  rejected: "Отклонена",
  documents_requested: "Запрошены документы",
};

const ROLE_LABELS: Record<string, string> = {
  ApartmentOwner: "Собственник квартиры",
  ApartmentResident: "Житель квартиры",
  ParkingOwner: "Собственник парковки",
  ParkingResident: "Арендатор парковки",
  StoreOwner: "Владелец магазина",
  StoreRepresenative: "Представитель магазина",
};

const APPROVAL_TEMPLATES = [
  { value: "approved_all_correct", label: "Все хорошо, все данные верны" },
  { value: "approved_custom", label: "Свой текст" },
];

const REJECTION_TEMPLATES = [
  { value: "rejected_no_documents", label: "Подтверждающие документы не получены" },
  { value: "rejected_invalid_documents", label: "Подтверждающие документы не верны" },
  { value: "rejected_no_reason", label: "Отказ без объявления причины" },
  { value: "rejected_custom", label: "Свой текст" },
];

type ReviewDialogProps = {
  claim: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
};

function ReviewDialog({ claim, open, onOpenChange, onSuccess }: ReviewDialogProps) {
  const { toast } = useToast();
  const [action, setAction] = useState<"approve" | "reject">("approve");
  const [template, setTemplate] = useState<string>("");
  const [customText, setCustomText] = useState("");

  const reviewMutation = api.claims.admin.review.useMutation({
    onSuccess: () => {
      toast({
        title: action === "approve" ? "Заявка одобрена" : "Заявка отклонена",
        description: "Решение сохранено",
      });
      onOpenChange(false);
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
    if (!template) {
      toast({
        title: "Выберите причину",
        variant: "destructive",
      });
      return;
    }

    if (template.endsWith("_custom") && !customText.trim()) {
      toast({
        title: "Введите текст решения",
        variant: "destructive",
      });
      return;
    }

    reviewMutation.mutate({
      claimId: claim.id,
      status: action === "approve" ? "approved" : "rejected",
      resolutionTemplate: template as any,
      customText: template.endsWith("_custom") ? customText : undefined,
    });
  };

  const templates = action === "approve" ? APPROVAL_TEMPLATES : REJECTION_TEMPLATES;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Рассмотрение заявки</DialogTitle>
          <DialogDescription>
            Выберите решение и укажите причину
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
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

          {/* Template Selection */}
          <div className="space-y-3">
            <Label>Причина</Label>
            <RadioGroup value={template} onValueChange={setTemplate}>
              {templates.map((t) => (
                <div key={t.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={t.value} id={t.value} />
                  <Label htmlFor={t.value} className="font-normal cursor-pointer">
                    {t.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Custom Text */}
          {template.endsWith("_custom") && (
            <div className="space-y-2">
              <Label>Текст решения</Label>
              <Textarea
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                placeholder="Введите текст решения..."
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
            disabled={reviewMutation.isPending}
            variant={action === "reject" ? "destructive" : "default"}
          >
            {reviewMutation.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            {action === "approve" ? "Одобрить" : "Отклонить"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

type HistoryDialogProps = {
  claimId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

function HistoryDialog({ claimId, open, onOpenChange }: HistoryDialogProps) {
  const { data: history, isLoading } = api.claims.admin.getHistory.useQuery(
    { claimId },
    { enabled: open }
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>История заявки</DialogTitle>
        </DialogHeader>

        <div className="py-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : history && history.length > 0 ? (
            <div className="relative pl-6 space-y-6">
              {/* Timeline line */}
              <div className="absolute left-[9px] top-2 bottom-2 w-px bg-border" />

              {history.map((entry, idx) => (
                <div key={entry.id} className="relative">
                  {/* Timeline dot */}
                  <div
                    className={`absolute -left-6 top-1 h-4 w-4 rounded-full border-2 ${
                      entry.toStatus === "approved"
                        ? "bg-green-500 border-green-500"
                        : entry.toStatus === "rejected"
                          ? "bg-red-500 border-red-500"
                          : "bg-background border-primary"
                    }`}
                  />

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          entry.toStatus === "approved"
                            ? "default"
                            : entry.toStatus === "rejected"
                              ? "destructive"
                              : "secondary"
                        }
                      >
                        {STATUS_LABELS[entry.toStatus]}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {new Date(entry.createdAt).toLocaleString("ru-RU")}
                      </span>
                    </div>

                    {entry.resolutionText && (
                      <p className="text-sm text-muted-foreground">
                        {entry.resolutionText}
                      </p>
                    )}

                    {entry.changedByUser && (
                      <p className="text-xs text-muted-foreground">
                        {entry.changedByUser.name ?? entry.changedByUser.email}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">
              История пуста
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function AdminClaimsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get filter from URL params
  const statusFilter = searchParams.get("status") ?? "all";
  const pageParam = searchParams.get("page");
  const page = pageParam ? parseInt(pageParam, 10) : 1;

  const [selectedClaim, setSelectedClaim] = useState<any>(null);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [historyDialogOpen, setHistoryDialogOpen] = useState(false);
  const [historyClaimId, setHistoryClaimId] = useState<string>("");

  const { data: stats } = api.claims.admin.stats.useQuery();
  const { data, isLoading, refetch } = api.claims.admin.list.useQuery({
    page,
    limit: 20,
    status: statusFilter !== "all" ? (statusFilter as any) : undefined,
  });

  // Update URL with new filter
  const setFilter = (status: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (status === "all") {
      params.delete("status");
    } else {
      params.set("status", status);
    }
    params.delete("page"); // Reset to page 1 on filter change
    router.push(`/admin/claims?${params.toString()}`);
  };

  // Update URL with new page
  const setPage = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (newPage === 1) {
      params.delete("page");
    } else {
      params.set("page", newPage.toString());
    }
    router.push(`/admin/claims?${params.toString()}`);
  };

  // Calculate total for "All" card
  const totalClaims = stats
    ? stats.pending + stats.underReview + stats.approved + stats.rejected
    : 0;

  const openReviewDialog = (claim: any) => {
    setSelectedClaim(claim);
    setReviewDialogOpen(true);
  };

  const openHistoryDialog = (claimId: string) => {
    setHistoryClaimId(claimId);
    setHistoryDialogOpen(true);
  };

  const getPropertyInfo = (claim: any) => {
    if (claim.apartment) {
      return {
        icon: Home,
        title: `Квартира ${claim.apartment.number}`,
        subtitle: claim.apartment.floor?.entrance?.building?.title
          ?? `Строение ${claim.apartment.floor?.entrance?.building?.number}`,
      };
    }
    if (claim.parkingSpot) {
      return {
        icon: ParkingCircle,
        title: `Место ${claim.parkingSpot.number}`,
        subtitle: claim.parkingSpot.floor?.parking?.name,
      };
    }
    return {
      icon: FileText,
      title: "Неизвестный объект",
      subtitle: "",
    };
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Заявки на недвижимость</h1>
        <p className="text-muted-foreground mt-1">
          Рассмотрение заявок пользователей
        </p>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid gap-4 grid-cols-2 sm:grid-cols-5">
          <Card
            className={`cursor-pointer transition-all hover:shadow-md ${
              statusFilter === "all"
                ? "ring-2 ring-primary ring-offset-2"
                : ""
            }`}
            onClick={() => setFilter("all")}
          >
            <CardContent className="pt-4">
              <div className="text-2xl font-bold">{totalClaims}</div>
              <p className="text-sm text-muted-foreground">Все заявки</p>
            </CardContent>
          </Card>
          <Card
            className={`cursor-pointer transition-all hover:shadow-md ${
              statusFilter === "pending"
                ? "ring-2 ring-yellow-500 ring-offset-2"
                : ""
            }`}
            onClick={() => setFilter("pending")}
          >
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-yellow-600">
                {stats.pending}
              </div>
              <p className="text-sm text-muted-foreground">Ожидают</p>
            </CardContent>
          </Card>
          <Card
            className={`cursor-pointer transition-all hover:shadow-md ${
              statusFilter === "review"
                ? "ring-2 ring-blue-500 ring-offset-2"
                : ""
            }`}
            onClick={() => setFilter("review")}
          >
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-blue-600">
                {stats.underReview}
              </div>
              <p className="text-sm text-muted-foreground">На рассмотрении</p>
            </CardContent>
          </Card>
          <Card
            className={`cursor-pointer transition-all hover:shadow-md ${
              statusFilter === "approved"
                ? "ring-2 ring-green-500 ring-offset-2"
                : ""
            }`}
            onClick={() => setFilter("approved")}
          >
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-green-600">
                {stats.approved}
              </div>
              <p className="text-sm text-muted-foreground">Одобрено</p>
            </CardContent>
          </Card>
          <Card
            className={`cursor-pointer transition-all hover:shadow-md ${
              statusFilter === "rejected"
                ? "ring-2 ring-red-500 ring-offset-2"
                : ""
            }`}
            onClick={() => setFilter("rejected")}
          >
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-red-600">
                {stats.rejected}
              </div>
              <p className="text-sm text-muted-foreground">Отклонено</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <div className="flex items-center gap-4">
        <Select value={statusFilter} onValueChange={setFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Все статусы" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все статусы</SelectItem>
            <SelectItem value="pending">Ожидают</SelectItem>
            <SelectItem value="review">На рассмотрении</SelectItem>
            <SelectItem value="approved">Одобрены</SelectItem>
            <SelectItem value="rejected">Отклонены</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Claims List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : data?.claims && data.claims.length > 0 ? (
        <div className="space-y-4">
          {data.claims.map((claim) => {
            const propertyInfo = getPropertyInfo(claim);
            const PropertyIcon = propertyInfo.icon;

            return (
              <Card key={claim.id}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    {/* User Avatar */}
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={claim.user?.image ?? undefined} />
                      <AvatarFallback>
                        {claim.user?.name?.slice(0, 2).toUpperCase() ?? "??"}
                      </AvatarFallback>
                    </Avatar>

                    {/* Claim Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium">
                          {claim.user?.name ?? claim.user?.email}
                        </span>
                        <Badge
                          variant={
                            claim.status === "approved"
                              ? "default"
                              : claim.status === "rejected"
                                ? "destructive"
                                : claim.status === "pending"
                                  ? "secondary"
                                  : "outline"
                          }
                        >
                          {STATUS_LABELS[claim.status]}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                        <PropertyIcon className="h-4 w-4" />
                        <span>{propertyInfo.title}</span>
                        <span>·</span>
                        <span>{propertyInfo.subtitle}</span>
                      </div>

                      <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                        <span>{ROLE_LABELS[claim.claimedRole]}</span>
                        <span>·</span>
                        <span>
                          {new Date(claim.createdAt).toLocaleDateString("ru-RU")}
                        </span>
                      </div>

                      {claim.userComment && (
                        <p className="mt-2 text-sm bg-muted p-2 rounded">
                          {claim.userComment}
                        </p>
                      )}

                      {claim.adminComment && (
                        <p className="mt-2 text-sm text-muted-foreground italic">
                          Решение: {claim.adminComment}
                        </p>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openHistoryDialog(claim.id)}
                      >
                        <History className="h-4 w-4" />
                      </Button>

                      {(claim.status === "pending" ||
                        claim.status === "review") && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openReviewDialog(claim)}
                        >
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
            Заявок не найдено
          </CardContent>
        </Card>
      )}

      {/* Review Dialog */}
      {selectedClaim && (
        <ReviewDialog
          claim={selectedClaim}
          open={reviewDialogOpen}
          onOpenChange={setReviewDialogOpen}
          onSuccess={() => refetch()}
        />
      )}

      {/* History Dialog */}
      <HistoryDialog
        claimId={historyClaimId}
        open={historyDialogOpen}
        onOpenChange={setHistoryDialogOpen}
      />
    </div>
  );
}
