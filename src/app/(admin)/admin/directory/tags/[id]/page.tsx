"use client";

import { useEffect, useState } from "react";

import { ChevronLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
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

export default function EditTagPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const tagId = params.id as string;

  // Form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [parentId, setParentId] = useState<string | null>(null);
  const [synonyms, setSynonyms] = useState("");
  const [isInitialized, setIsInitialized] = useState(false);

  // Query for tag data
  const { data: tagData, isLoading: tagLoading } = api.directory.admin.getTag.useQuery(
    { id: tagId },
    { enabled: !!tagId }
  );

  // Query for parent tags (excluding current tag to avoid circular reference)
  const { data: tagsData } = api.directory.getTags.useQuery({ parentId: null });

  // Initialize form with tag data
  useEffect(() => {
    if (tagData && !isInitialized) {
      setName(tagData.name);
      setDescription(tagData.description ?? "");
      setParentId(tagData.parentId);
      setSynonyms((tagData.synonyms ?? []).join(", "));
      setIsInitialized(true);
    }
  }, [tagData, isInitialized]);

  // Mutation
  const updateMutation = api.directory.admin.updateTag.useMutation({
    onSuccess: () => {
      toast({ title: "Категория обновлена" });
      router.push("/admin/directory?tab=tags");
    },
    onError: (error) => {
      toast({
        title: "Ошибка",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast({ title: "Введите название", variant: "destructive" });
      return;
    }

    const synonymsArray = synonyms
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    updateMutation.mutate({
      id: tagId,
      name: name.trim(),
      description: description.trim() || undefined,
      parentId: parentId ?? undefined,
      synonyms: synonymsArray.length > 0 ? synonymsArray : undefined,
    });
  };

  if (tagLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!tagData) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/admin/directory?tab=tags">
            <Button variant="ghost" size="icon">
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-semibold">Категория не найдена</h1>
          </div>
        </div>
      </div>
    );
  }

  // Filter out current tag from parent options to avoid circular reference
  const availableParents = tagsData?.filter((t) => t.id !== tagId) ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/directory?tab=tags">
          <Button variant="ghost" size="icon">
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-semibold">Редактирование категории</h1>
          <p className="text-muted-foreground mt-1">/{tagData.slug}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-xl space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Основная информация</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Название *</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Например: Экстренные службы"
              />
            </div>

            <div className="space-y-2">
              <Label>Описание</Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Краткое описание категории..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label>Родительская категория</Label>
              <Select
                value={parentId ?? "none"}
                onValueChange={(v) => setParentId(v === "none" ? null : v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Без родительской категории" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Без родительской категории</SelectItem>
                  {availableParents.map((tag) => (
                    <SelectItem key={tag.id} value={tag.id}>
                      {tag.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-muted-foreground text-xs">Позволяет создать иерархию категорий</p>
            </div>

            <div className="space-y-2">
              <Label>Синонимы</Label>
              <Input
                value={synonyms}
                onChange={(e) => setSynonyms(e.target.value)}
                placeholder="экстренка, скорая, 112"
              />
              <p className="text-muted-foreground text-xs">
                Перечислите через запятую альтернативные названия для поиска
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button type="submit" disabled={updateMutation.isPending}>
            {updateMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Сохранить изменения
          </Button>
          <Link href="/admin/directory?tab=tags">
            <Button type="button" variant="outline">
              Отмена
            </Button>
          </Link>
        </div>
      </form>
    </div>
  );
}
