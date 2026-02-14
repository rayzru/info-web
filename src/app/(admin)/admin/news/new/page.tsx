"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type { JSONContent } from "@tiptap/react";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { StandardEditor } from "~/components/editor/rich-editor";
import { ImageUploader } from "~/components/media";
import { TagSelector } from "~/components/tag-selector";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Switch } from "~/components/ui/switch";
import { Textarea } from "~/components/ui/textarea";
import { useToast } from "~/hooks/use-toast";
import { generateSlug } from "~/lib/utils/slug";
import type { NewsStatus, NewsType } from "~/server/db/schema";
import { api } from "~/trpc/react";

const INITIAL_CONTENT: JSONContent = {
  type: "doc",
  content: [
    {
      type: "paragraph",
      content: [],
    },
  ],
};

// Validation schema
const newsFormSchema = z.object({
  title: z.string().min(1, "Заголовок обязателен").max(255, "Заголовок слишком длинный"),
  slug: z
    .string()
    .max(255, "Slug слишком длинный")
    .regex(/^[a-z0-9-]*$/i, "Slug может содержать только буквы, цифры и дефисы")
    .optional()
    .or(z.literal("")),
  excerpt: z.string().max(500, "Описание слишком длинное").optional(),
  coverImage: z.string().optional(),
  content: z.custom<JSONContent>(),
  type: z.enum(["announcement", "event", "maintenance", "update", "community", "urgent"]),
  status: z.enum(["draft", "scheduled", "published", "archived"]),
  publishAt: z.string().optional(),
  isPinned: z.boolean(),
  isHighlighted: z.boolean(),
  isAnonymous: z.boolean(),
  tagIds: z.array(z.string()),
});

type NewsFormValues = z.infer<typeof newsFormSchema>;

export default function NewNewsPage() {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<NewsFormValues>({
    resolver: zodResolver(newsFormSchema),
    defaultValues: {
      title: "",
      slug: "",
      excerpt: "",
      coverImage: "",
      content: INITIAL_CONTENT,
      type: "announcement",
      status: "draft",
      publishAt: "",
      isPinned: false,
      isHighlighted: false,
      isAnonymous: false,
      tagIds: [],
    },
  });

  const createMutation = api.news.create.useMutation({
    onSuccess: (data) => {
      toast({ title: "Новость создана" });
      router.push(`/admin/news/${data?.id}`);
    },
    onError: (error) => {
      toast({
        title: "Ошибка",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (values: NewsFormValues) => {
    createMutation.mutate({
      title: values.title.trim(),
      slug: values.slug?.trim() || undefined,
      excerpt: values.excerpt?.trim() || undefined,
      coverImage: values.coverImage?.trim() || undefined,
      content: values.content,
      type: values.type,
      status: values.status,
      publishAt: values.publishAt ? new Date(values.publishAt) : undefined,
      isPinned: values.isPinned,
      isHighlighted: values.isHighlighted,
      isAnonymous: values.isAnonymous,
      tagIds: values.tagIds,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/news">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-semibold">Создать новость</h1>
          <p className="text-muted-foreground mt-1">Заполните информацию о новости</p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Main Content */}
            <div className="space-y-6 lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Основная информация</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Заголовок *</FormLabel>
                        <FormControl>
                          <Input placeholder="Введите заголовок новости" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="slug"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Slug (URL)</FormLabel>
                        <FormControl>
                          <Input placeholder="Автоматически из заголовка и даты" {...field} />
                        </FormControl>
                        <FormDescription>Оставьте пустым для автогенерации</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="excerpt"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Краткое описание</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Краткое описание для карточки новости"
                            rows={2}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="coverImage"
                    render={({ field }) => (
                      <FormItem>
                        <ImageUploader
                          label="Обложка"
                          value={field.value || null}
                          onChange={(url) => field.onChange(url ?? "")}
                          enableCrop
                          aspectRatio={16 / 9}
                          maxWidth={1200}
                          addWatermark={false}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Содержание</CardTitle>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <StandardEditor
                            content={field.value}
                            onChange={field.onChange}
                            placeholder="Введите текст новости..."
                            minHeight="300px"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Публикация</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Статус</FormLabel>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="draft">Черновик</SelectItem>
                            <SelectItem value="scheduled">Запланирована</SelectItem>
                            <SelectItem value="published">Опубликована</SelectItem>
                            <SelectItem value="archived">В архиве</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="publishAt"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Дата публикации</FormLabel>
                        <FormControl>
                          <Input type="datetime-local" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Классификация</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Тип</FormLabel>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="announcement">Объявление</SelectItem>
                            <SelectItem value="event">Мероприятие</SelectItem>
                            <SelectItem value="maintenance">Тех. работы</SelectItem>
                            <SelectItem value="update">Обновление</SelectItem>
                            <SelectItem value="community">Сообщество</SelectItem>
                            <SelectItem value="urgent">Срочное</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="tagIds"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Теги</FormLabel>
                        <FormControl>
                          <TagSelector
                            value={field.value}
                            onChange={field.onChange}
                            placeholder="Выберите теги..."
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="isPinned"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between">
                        <FormLabel>Закрепить</FormLabel>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="isHighlighted"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between">
                        <FormLabel>Выделить</FormLabel>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="isAnonymous"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between">
                        <div>
                          <FormLabel>Анонимно</FormLabel>
                          <p className="text-muted-foreground text-xs">От имени ресурса</p>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Button type="submit" className="w-full" disabled={createMutation.isPending}>
                {createMutation.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                Создать
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
