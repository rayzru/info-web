"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  const renderTagRow = (tag: TagWithCounts, depth: number = 0) => {
    const children = getChildren(tag.id);
    const hasChildren = children.length > 0;
    const isExpanded = expandedIds.has(tag.id);
    const isSelected = selectedTagId === tag.id;

    return (
      <div key={tag.id}>
        <div
          className={`
            flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer transition-colors
            hover:bg-muted
            ${isSelected ? "bg-primary/10 border-l-2 border-primary" : ""}
          `}
          style={{ paddingLeft: `${depth * 16 + 12}px` }}
          onClick={() => setSelectedTagId(tag.id)}
        >
          {hasChildren ? (
            <button
              type="button"
              className="p-0.5 hover:bg-muted-foreground/20 rounded"
              onClick={(e) => {
                e.stopPropagation();
                toggleExpanded(tag.id);
              }}
            >
              {isExpanded ? (
                <FolderOpen className="h-4 w-4 text-muted-foreground" />
              ) : (
                <Folder className="h-4 w-4 text-muted-foreground" />
              )}
            </button>
          ) : (
            <Tag className="h-4 w-4 text-muted-foreground" />
          )}

          <span className="flex-1 truncate text-sm font-medium">{tag.name}</span>

          <span className="text-xs text-muted-foreground">{tag.entryCount}</span>
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
        className={`
          flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer transition-colors
          hover:bg-muted
          ${isSelected ? "bg-primary/10 border-l-2 border-primary" : ""}
        `}
        onClick={() => setSelectedTagId(tag.id)}
      >
        <Tag className="h-4 w-4 text-muted-foreground shrink-0" />

        <div className="flex-1 min-w-0">
          <span className="text-sm font-medium truncate block">{tag.name}</span>
          {breadcrumb.length > 0 && (
            <span className="text-xs text-muted-foreground truncate block">
              {breadcrumb.join(" → ")}
            </span>
          )}
        </div>

        <span className="text-xs text-muted-foreground shrink-0">{tag.entryCount}</span>
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
      <div className="grid grid-cols-1 lg:grid-cols-[350px_1fr] gap-6">
        {/* Left: Tree */}
        <Card className="h-[calc(100vh-220px)]">
          <CardHeader className="pb-3">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
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
                    <p className="py-6 text-center text-sm text-muted-foreground">
                      Ничего не найдено
                    </p>
                  )
                ) : (
                  // Tree view grouped by scope
                  Object.entries(groupedRoots).map(([scope, tags]) => (
                    <div key={scope} className="mb-4">
                      <div className="flex items-center gap-2 px-2 py-1.5 mb-1">
                        <span
                          className={`text-xs font-medium px-1.5 py-0.5 rounded ${SCOPE_COLORS[scope] ?? "bg-gray-100 text-gray-700"}`}
                        >
                          {SCOPE_LABELS[scope] ?? scope}
                        </span>
                        <span className="text-xs text-muted-foreground">
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
                    <p className="text-sm text-muted-foreground mt-1">
                      /{selectedTag.slug}
                    </p>
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
                    <h4 className="text-sm font-medium mb-1">Описание</h4>
                    <p className="text-sm text-muted-foreground">
                      {selectedTag.description}
                    </p>
                  </div>
                )}

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-muted rounded-lg">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                      <Eye className="h-4 w-4" />
                      Записей
                    </div>
                    <p className="text-2xl font-semibold">{selectedTag.entryCount}</p>
                  </div>
                  <div className="p-4 bg-muted rounded-lg">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                      <Phone className="h-4 w-4" />
                      Контактов
                    </div>
                    <p className="text-2xl font-semibold">{selectedTag.contactCount}</p>
                  </div>
                </div>

                {/* Parent */}
                {selectedTag.parentId && (
                  <div>
                    <h4 className="text-sm font-medium mb-2">Родительская категория</h4>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedTagId(selectedTag.parentId!)}
                    >
                      <ChevronLeft className="mr-1 h-3 w-3" />
                      {getParentName(selectedTag.parentId)}
                    </Button>
                  </div>
                )}

                {/* Children */}
                {getChildren(selectedTag.id).length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium mb-2">Дочерние категории</h4>
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
                          <span className="ml-1 text-muted-foreground">
                            ({child.entryCount})
                          </span>
                          <ChevronRight className="ml-1 h-3 w-3" />
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                <Separator />

                {/* Danger Zone */}
                <div>
                  <h4 className="text-sm font-medium text-destructive mb-2">
                    Опасная зона
                  </h4>
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
                    <div className="mt-2 p-3 bg-destructive/10 rounded-lg flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                      <div className="text-sm text-destructive">
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
            <CardContent className="h-full flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <Tag className="h-12 w-12 mx-auto mb-4 opacity-50" />
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
              <div className="p-3 bg-destructive/10 rounded-lg flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                <div className="text-sm text-destructive">
                  <p className="font-medium">Внимание! При удалении:</p>
                  <ul className="mt-1 space-y-0.5">
                    {tagToDelete.entryCount > 0 && (
                      <li>
                        • Связи с {tagToDelete.entryCount} записями будут удалены
                      </li>
                    )}
                    {tagToDelete.contactCount > 0 && (
                      <li>
                        • Связи с {tagToDelete.contactCount} контактами будут удалены
                      </li>
                    )}
                    {getChildren(tagToDelete.id).length > 0 && (
                      <li>
                        • {getChildren(tagToDelete.id).length} дочерних категорий станут
                        корневыми
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
              {deleteMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Удалить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
