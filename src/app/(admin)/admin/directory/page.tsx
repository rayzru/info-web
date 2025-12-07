"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  Edit,
  Loader2,
  MoreHorizontal,
  Phone,
  Plus,
  Search,
  Tag,
  Trash2,
} from "lucide-react";

import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { useToast } from "~/hooks/use-toast";
import { api } from "~/trpc/react";

const TYPE_LABELS: Record<string, string> = {
  contact: "Контакт",
  organization: "Организация",
  location: "Локация",
  document: "Документ",
};

export default function AdminDirectoryPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const tab = searchParams.get("tab") ?? "entries";
  const pageParam = searchParams.get("page");
  const page = pageParam ? parseInt(pageParam, 10) : 1;
  const typeFilter = searchParams.get("type") ?? "all";
  const searchQuery = searchParams.get("q") ?? "";

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [entryToDelete, setEntryToDelete] = useState<{ id: string; title: string } | null>(null);
  const [localSearch, setLocalSearch] = useState(searchQuery);

  // Queries
  const { data: entriesData, isLoading: entriesLoading, refetch: refetchEntries } =
    api.directory.admin.list.useQuery({
      page,
      limit: 20,
      type: typeFilter !== "all" ? (typeFilter as any) : undefined,
      search: searchQuery || undefined,
    });

  const { data: tagsData, isLoading: tagsLoading, refetch: refetchTags } =
    api.directory.getTags.useQuery({ parentId: null });

  // Mutations
  const deleteMutation = api.directory.admin.delete.useMutation({
    onSuccess: () => {
      toast({ title: "Запись удалена" });
      setDeleteDialogOpen(false);
      setEntryToDelete(null);
      refetchEntries();
    },
    onError: (error) => {
      toast({ title: "Ошибка", description: error.message, variant: "destructive" });
    },
  });

  const deleteTagMutation = api.directory.admin.deleteTag.useMutation({
    onSuccess: () => {
      toast({ title: "Категория удалена" });
      refetchTags();
    },
    onError: (error) => {
      toast({ title: "Ошибка", description: error.message, variant: "destructive" });
    },
  });

  // URL manipulation helpers
  const setTab = (newTab: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", newTab);
    params.delete("page");
    router.push(`/admin/directory?${params.toString()}`);
  };

  const setFilter = (type: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (type === "all") {
      params.delete("type");
    } else {
      params.set("type", type);
    }
    params.delete("page");
    router.push(`/admin/directory?${params.toString()}`);
  };

  const setPage = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (newPage === 1) {
      params.delete("page");
    } else {
      params.set("page", newPage.toString());
    }
    router.push(`/admin/directory?${params.toString()}`);
  };

  const handleSearch = () => {
    const params = new URLSearchParams(searchParams.toString());
    if (localSearch) {
      params.set("q", localSearch);
    } else {
      params.delete("q");
    }
    params.delete("page");
    router.push(`/admin/directory?${params.toString()}`);
  };

  const openDeleteDialog = (entry: { id: string; title: string }) => {
    setEntryToDelete(entry);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (entryToDelete) {
      deleteMutation.mutate({ id: entryToDelete.id });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Справочная</h1>
          <p className="text-muted-foreground mt-1">
            Управление записями и категориями справочника
          </p>
        </div>
        <Link href="/admin/directory/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Добавить запись
          </Button>
        </Link>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="entries">Записи</TabsTrigger>
          <TabsTrigger value="tags">Категории</TabsTrigger>
        </TabsList>

        <TabsContent value="entries" className="space-y-4 mt-4">
          {/* Filters */}
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Поиск..."
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="pl-10"
              />
            </div>
            <Select value={typeFilter} onValueChange={setFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Все типы" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все типы</SelectItem>
                <SelectItem value="contact">Контакты</SelectItem>
                <SelectItem value="organization">Организации</SelectItem>
                <SelectItem value="location">Локации</SelectItem>
                <SelectItem value="document">Документы</SelectItem>
              </SelectContent>
            </Select>
            {searchQuery && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setLocalSearch("");
                  const params = new URLSearchParams(searchParams.toString());
                  params.delete("q");
                  router.push(`/admin/directory?${params.toString()}`);
                }}
              >
                Сбросить поиск
              </Button>
            )}
          </div>

          {/* Entries List */}
          {entriesLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : entriesData?.entries && entriesData.entries.length > 0 ? (
            <div className="space-y-3">
              {entriesData.entries.map((entry) => (
                <Card key={entry.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/admin/directory/${entry.id}`}
                            className="font-medium hover:underline"
                          >
                            {entry.title}
                          </Link>
                          <Badge variant="outline">{TYPE_LABELS[entry.type]}</Badge>
                        </div>

                        {entry.description && (
                          <p className="mt-1 text-sm text-muted-foreground line-clamp-1">
                            {entry.description}
                          </p>
                        )}

                        <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
                          <span>/{entry.slug}</span>
                          {entry.contacts && entry.contacts.length > 0 && (
                            <span className="flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              {entry.contacts.length} контакт(ов)
                            </span>
                          )}
                          {entry.tags && entry.tags.length > 0 && (
                            <span className="flex items-center gap-1">
                              <Tag className="h-3 w-3" />
                              {entry.tags.map((t) => t.name).join(", ")}
                            </span>
                          )}
                        </div>
                      </div>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/admin/directory/${entry.id}`}>
                              <Edit className="mr-2 h-4 w-4" />
                              Редактировать
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/info/${entry.slug}`} target="_blank">
                              Открыть на сайте
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => openDeleteDialog({ id: entry.id, title: entry.title })}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Удалить
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {/* Pagination */}
              {entriesData.totalPages > 1 && (
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
                    {page} из {entriesData.totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    disabled={page === entriesData.totalPages}
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
                {searchQuery ? "Ничего не найдено" : "Записей пока нет"}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="tags" className="space-y-4 mt-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Категории для организации записей справочника
            </p>
            <Link href="/admin/directory/tags/new">
              <Button variant="outline" size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Добавить категорию
              </Button>
            </Link>
          </div>

          {tagsLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : tagsData && tagsData.length > 0 ? (
            <div className="space-y-2">
              {tagsData.map((tag) => (
                <TagRow
                  key={tag.id}
                  tag={tag}
                  onDelete={(id) => deleteTagMutation.mutate({ id })}
                  depth={0}
                />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                Категорий пока нет
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Удалить запись?</DialogTitle>
            <DialogDescription>
              Вы уверены, что хотите удалить &quot;{entryToDelete?.title}&quot;? Это действие
              нельзя отменить.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Отмена
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Удалить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Tag row component with children support
function TagRow({
  tag,
  onDelete,
  depth,
}: {
  tag: { id: string; name: string; slug: string; entryCount: number; hasChildren: boolean };
  onDelete: (id: string) => void;
  depth: number;
}) {
  const [expanded, setExpanded] = useState(false);
  const { data: children } = api.directory.getTags.useQuery(
    { parentId: tag.id },
    { enabled: expanded && tag.hasChildren }
  );

  return (
    <>
      <Card className={depth > 0 ? "ml-6" : ""}>
        <CardContent className="p-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              {tag.hasChildren && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => setExpanded(!expanded)}
                >
                  <ChevronRight
                    className={`h-4 w-4 transition-transform ${expanded ? "rotate-90" : ""}`}
                  />
                </Button>
              )}
              <span className="font-medium">{tag.name}</span>
              <Badge variant="secondary" className="text-xs">
                {tag.entryCount} записей
              </Badge>
            </div>

            <div className="flex items-center gap-2">
              <Link href={`/admin/directory/tags/${tag.id}`}>
                <Button variant="ghost" size="sm">
                  <Edit className="h-4 w-4" />
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="sm"
                className="text-destructive"
                onClick={() => onDelete(tag.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {expanded && children && children.length > 0 && (
        <div className="space-y-2">
          {children.map((child) => (
            <TagRow key={child.id} tag={child} onDelete={onDelete} depth={depth + 1} />
          ))}
        </div>
      )}
    </>
  );
}
