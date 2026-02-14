"use client";

import { useState } from "react";

import {
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Edit,
  Eye,
  Folder,
  FolderOpen,
  Loader2,
  Phone,
  Plus,
  Search,
  Tag,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Separator } from "~/components/ui/separator";
import { useToast } from "~/hooks/use-toast";
import { api } from "~/trpc/react";

const SCOPE_LABELS: Record<string, string> = {
  core: "ЖК",
  commerce: "Арендаторы",
  city: "Город",
  promoted: "Реклама",
};

const SCOPE_COLORS: Record<string, string> = {
  core: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  commerce: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  city: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  promoted: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

type TagWithCounts = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  parentId?: string | null;
  scope?: string | null;
  icon?: string | null;
  order?: number | null;
  entryCount: number;
  contactCount: number;
};

export default function TagsManagementPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [selectedTagId, setSelectedTagId] = useState<string | null>(null);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [tagToDelete, setTagToDelete] = useState<TagWithCounts | null>(null);

  // Queries
  const { data: tagTree, isLoading, refetch } = api.directory.admin.getTagTree.useQuery();

  // Get selected tag details
  const selectedTag = tagTree?.find((t) => t.id === selectedTagId);

  // Get parent tag name
  const getParentName = (parentId: string | null | undefined) => {
    if (!parentId || !tagTree) return null;
    return tagTree.find((t) => t.id === parentId)?.name ?? null;
  };

  // Get children of a tag
  const getChildren = (tagId: string) => {
    if (!tagTree) return [];
    return tagTree.filter((t) => t.parentId === tagId);
  };

  // Build tree structure
  const rootTags = tagTree?.filter((t) => !t.parentId) ?? [];

  // Group roots by scope
  const groupedRoots = rootTags.reduce(
    (acc, tag) => {
      const scope = tag.scope ?? "other";
      if (!acc[scope]) acc[scope] = [];
      acc[scope].push(tag);
      return acc;
    },
    {} as Record<string, TagWithCounts[]>
  );

  // Filter tags by search
  const filteredTags = searchQuery.trim()
    ? tagTree?.filter(
        (t) =>
          t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.description?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : null;

  // Mutations
  const deleteMutation = api.directory.admin.deleteTag.useMutation({
    onSuccess: () => {
      toast({ title: "Категория удалена" });
      setDeleteDialogOpen(false);
      setTagToDelete(null);
      if (selectedTagId === tagToDelete?.id) {
        setSelectedTagId(null);
      }
      void refetch();
    },
    onError: (error) => {
      toast({ title: "Ошибка", description: error.message, variant: "destructive" });
    },
  });

  const toggleExpanded = (tagId: string) => {
    const newExpanded = new Set(expandedIds);
    if (newExpanded.has(tagId)) {
      newExpanded.delete(tagId);
    } else {
      newExpanded.add(tagId);
    }
    setExpandedIds(newExpanded);
  };

  const openDeleteDialog = (tag: TagWithCounts) => {
    setTagToDelete(tag);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (tagToDelete) {
      deleteMutation.mutate({ id: tagToDelete.id });
    }
  };

  // Render tag row in tree
  const renderTagRow = (tag: TagWithCounts, depth = 0) => {
    const children = getChildren(tag.id);
    const hasChildren = children.length > 0;
    const isExpanded = expandedIds.has(tag.id);
    const isSelected = selectedTagId === tag.id;

    return (
      <div key={tag.id}>
        <div
          className={`hover:bg-muted flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 transition-colors ${isSelected ? "bg-primary/10 border-primary border-l-2" : ""} `}
          style={{ paddingLeft: `${depth * 16 + 12}px` }}
          onClick={() => setSelectedTagId(tag.id)}
        >
          {hasChildren ? (
            <button
              type="button"
              className="hover:bg-muted-foreground/20 rounded p-0.5"
              onClick={(e) => {
                e.stopPropagation();
                toggleExpanded(tag.id);
              }}
            >
              {isExpanded ? (
                <FolderOpen className="text-muted-foreground h-4 w-4" />
              ) : (
                <Folder className="text-muted-foreground h-4 w-4" />
              )}
            </button>
          ) : (
            <Tag className="text-muted-foreground h-4 w-4" />
          )}

          <span className="flex-1 truncate text-sm font-medium">{tag.name}</span>

          <span className="text-muted-foreground text-xs">{tag.entryCount}</span>
        </div>

        {hasChildren && isExpanded && (
          <div>{children.map((child) => renderTagRow(child, depth + 1))}</div>
        )}
      </div>
    );
  };

  // Render search result
  const renderSearchResult = (tag: TagWithCounts) => {
    const isSelected = selectedTagId === tag.id;

    // Build breadcrumb
    const breadcrumb: string[] = [];
    let currentId = tag.parentId;
    while (currentId) {
      const parent = tagTree?.find((t) => t.id === currentId);
      if (parent) {
        breadcrumb.unshift(parent.name);
        currentId = parent.parentId;
      } else {
        break;
      }
    }

    return (
      <div
        key={tag.id}
        className={`hover:bg-muted flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 transition-colors ${isSelected ? "bg-primary/10 border-primary border-l-2" : ""} `}
        onClick={() => setSelectedTagId(tag.id)}
      >
        <Tag className="text-muted-foreground h-4 w-4 shrink-0" />

        <div className="min-w-0 flex-1">
          <span className="block truncate text-sm font-medium">{tag.name}</span>
          {breadcrumb.length > 0 && (
            <span className="text-muted-foreground block truncate text-xs">
              {breadcrumb.join(" → ")}
            </span>
          )}
        </div>

        <span className="text-muted-foreground shrink-0 text-xs">{tag.entryCount}</span>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/directory">
            <Button variant="ghost" size="icon">
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-semibold">Управление категориями</h1>
            <p className="text-muted-foreground mt-1">
              Иерархия категорий для организации записей справочника
            </p>
          </div>
        </div>
        <Link href="/admin/directory/tags/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Добавить категорию
          </Button>
        </Link>
      </div>

      {/* Split View */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[350px_1fr]">
        {/* Left: Tree */}
        <Card className="h-[calc(100vh-220px)]">
          <CardHeader className="pb-3">
            <div className="relative">
              <Search className="text-muted-foreground absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2" />
              <Input
                placeholder="Поиск категорий..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[calc(100vh-320px)]">
              <div className="px-3 pb-3">
                {filteredTags ? (
                  // Search results
                  filteredTags.length > 0 ? (
                    <div className="space-y-1">
                      {filteredTags.map((tag) => renderSearchResult(tag))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground py-6 text-center text-sm">
                      Ничего не найдено
                    </p>
                  )
                ) : (
                  // Tree view grouped by scope
                  Object.entries(groupedRoots).map(([scope, tags]) => (
                    <div key={scope} className="mb-4">
                      <div className="mb-1 flex items-center gap-2 px-2 py-1.5">
                        <span
                          className={`rounded px-1.5 py-0.5 text-xs font-medium ${SCOPE_COLORS[scope] ?? "bg-gray-100 text-gray-700"}`}
                        >
                          {SCOPE_LABELS[scope] ?? scope}
                        </span>
                        <span className="text-muted-foreground text-xs">
                          {tags.length} корневых
                        </span>
                      </div>
                      {tags.map((tag) => renderTagRow(tag, 0))}
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Right: Details */}
        <Card className="h-[calc(100vh-220px)]">
          {selectedTag ? (
            <>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {selectedTag.name}
                      {selectedTag.scope && (
                        <Badge
                          variant="secondary"
                          className={SCOPE_COLORS[selectedTag.scope] ?? ""}
                        >
                          {SCOPE_LABELS[selectedTag.scope] ?? selectedTag.scope}
                        </Badge>
                      )}
                    </CardTitle>
                    <p className="text-muted-foreground mt-1 text-sm">/{selectedTag.slug}</p>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/admin/directory/tags/${selectedTag.id}`}>
                      <Button variant="outline" size="sm">
                        <Edit className="mr-2 h-4 w-4" />
                        Редактировать
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Description */}
                {selectedTag.description && (
                  <div>
                    <h4 className="mb-1 text-sm font-medium">Описание</h4>
                    <p className="text-muted-foreground text-sm">{selectedTag.description}</p>
                  </div>
                )}

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-muted rounded-lg p-4">
                    <div className="text-muted-foreground mb-1 flex items-center gap-2 text-sm">
                      <Eye className="h-4 w-4" />
                      Записей
                    </div>
                    <p className="text-2xl font-semibold">{selectedTag.entryCount}</p>
                  </div>
                  <div className="bg-muted rounded-lg p-4">
                    <div className="text-muted-foreground mb-1 flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4" />
                      Контактов
                    </div>
                    <p className="text-2xl font-semibold">{selectedTag.contactCount}</p>
                  </div>
                </div>

                {/* Parent */}
                {selectedTag.parentId && (
                  <div>
                    <h4 className="mb-2 text-sm font-medium">Родительская категория</h4>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedTagId(selectedTag.parentId)}
                    >
                      <ChevronLeft className="mr-1 h-3 w-3" />
                      {getParentName(selectedTag.parentId)}
                    </Button>
                  </div>
                )}

                {/* Children */}
                {getChildren(selectedTag.id).length > 0 && (
                  <div>
                    <h4 className="mb-2 text-sm font-medium">Дочерние категории</h4>
                    <div className="flex flex-wrap gap-2">
                      {getChildren(selectedTag.id).map((child) => (
                        <Button
                          key={child.id}
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedTagId(child.id);
                            setExpandedIds((prev) => new Set([...prev, selectedTag.id]));
                          }}
                        >
                          {child.name}
                          <span className="text-muted-foreground ml-1">({child.entryCount})</span>
                          <ChevronRight className="ml-1 h-3 w-3" />
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                <Separator />

                {/* Danger Zone */}
                <div>
                  <h4 className="text-destructive mb-2 text-sm font-medium">Опасная зона</h4>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
                    onClick={() => openDeleteDialog(selectedTag)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Удалить категорию
                  </Button>

                  {(selectedTag.entryCount > 0 ||
                    selectedTag.contactCount > 0 ||
                    getChildren(selectedTag.id).length > 0) && (
                    <div className="bg-destructive/10 mt-2 flex items-start gap-2 rounded-lg p-3">
                      <AlertTriangle className="text-destructive mt-0.5 h-4 w-4 shrink-0" />
                      <div className="text-destructive text-sm">
                        <p className="font-medium">При удалении будут затронуты:</p>
                        <ul className="mt-1 space-y-0.5">
                          {selectedTag.entryCount > 0 && (
                            <li>• {selectedTag.entryCount} записей (связи будут удалены)</li>
                          )}
                          {selectedTag.contactCount > 0 && (
                            <li>• {selectedTag.contactCount} контактов (связи будут удалены)</li>
                          )}
                          {getChildren(selectedTag.id).length > 0 && (
                            <li>
                              • {getChildren(selectedTag.id).length} дочерних категорий станут
                              корневыми
                            </li>
                          )}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </>
          ) : (
            <CardContent className="flex h-full items-center justify-center">
              <div className="text-muted-foreground text-center">
                <Tag className="mx-auto mb-4 h-12 w-12 opacity-50" />
                <p>Выберите категорию для просмотра деталей</p>
              </div>
            </CardContent>
          )}
        </Card>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Удалить категорию?</DialogTitle>
            <DialogDescription>
              Вы уверены, что хотите удалить категорию &quot;{tagToDelete?.name}&quot;?
            </DialogDescription>
          </DialogHeader>

          {tagToDelete &&
            (tagToDelete.entryCount > 0 ||
              tagToDelete.contactCount > 0 ||
              getChildren(tagToDelete.id).length > 0) && (
              <div className="bg-destructive/10 flex items-start gap-2 rounded-lg p-3">
                <AlertTriangle className="text-destructive mt-0.5 h-4 w-4 shrink-0" />
                <div className="text-destructive text-sm">
                  <p className="font-medium">Внимание! При удалении:</p>
                  <ul className="mt-1 space-y-0.5">
                    {tagToDelete.entryCount > 0 && (
                      <li>• Связи с {tagToDelete.entryCount} записями будут удалены</li>
                    )}
                    {tagToDelete.contactCount > 0 && (
                      <li>• Связи с {tagToDelete.contactCount} контактами будут удалены</li>
                    )}
                    {getChildren(tagToDelete.id).length > 0 && (
                      <li>
                        • {getChildren(tagToDelete.id).length} дочерних категорий станут корневыми
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            )}

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
