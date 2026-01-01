"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import type { JSONContent } from "@tiptap/react";
import { ArrowLeft, Loader2, Send } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Switch } from "~/components/ui/switch";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { StandardEditor } from "~/components/editor/rich-editor";
import { ImageUploader } from "~/components/media";
import { TagSelector } from "~/components/tag-selector";
import { PageHeader } from "~/components/page-header";
import { useToast } from "~/hooks/use-toast";
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

// Типы публикаций (без announcement и event - они управляются отдельно)
const PUBLICATION_TYPES = [
  { value: "help_request", label: "Просьба о помощи" },
  { value: "lost_found", label: "Потеряно/найдено" },
  { value: "recommendation", label: "Рекомендация" },
  { value: "question", label: "Вопрос" },
  { value: "discussion", label: "Обсуждение" },
] as const;

// Validation schema
const publicationFormSchema = z.object({
  title: z
    .string()
    .min(1, "Заголовок обязателен")
    .max(255, "Заголовок слишком длинный"),
  content: z.custom<JSONContent>(),
  coverImage: z.string().optional(),
  type: z.enum([
    "help_request",
    "lost_found",
    "recommendation",
    "question",
    "discussion",
  ]),
  isUrgent: z.boolean(),
  isAnonymous: z.boolean(),
  tagIds: z.array(z.string()),
});

type PublicationFormValues = z.infer<typeof publicationFormSchema>;

export default function NewPublicationPage() {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<PublicationFormValues>({
    resolver: zodResolver(publicationFormSchema),
    defaultValues: {
      title: "",
      content: INITIAL_CONTENT,
      coverImage: "",
      type: "discussion",
      isUrgent: false,
      isAnonymous: false,
      tagIds: [],
    },
  });

  const createMutation = api.publications.create.useMutation({
    onSuccess: () => {
      toast({
        title: "Публикация отправлена",
        description: "Ваша публикация отправлена на модерацию",
      });
      router.push("/my/publications");
    },
    onError: (error) => {
      toast({
        title: "Ошибка",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (values: PublicationFormValues) => {
    createMutation.mutate({
      title: values.title.trim(),
      content: values.content,
      coverImage: values.coverImage?.trim() || undefined,
      type: values.type,
      isUrgent: values.isUrgent,
      isAnonymous: values.isAnonymous,
      tagIds: values.tagIds.length > 0 ? values.tagIds : undefined,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/my/publications">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <PageHeader
          title="Новая публикация"
          description="Поделитесь информацией с соседями"
        />
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Type and Tags row */}
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Тип публикации</FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {PUBLICATION_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
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
          </div>

          {/* Title */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Заголовок *</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Введите заголовок публикации"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Content */}
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Содержание</FormLabel>
                <FormControl>
                  <StandardEditor
                    content={field.value}
                    onChange={field.onChange}
                    placeholder="Опишите вашу публикацию подробнее..."
                    minHeight="200px"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Cover image */}
          <FormField
            control={form.control}
            name="coverImage"
            render={({ field }) => (
              <FormItem>
                <ImageUploader
                  label="Обложка (необязательно)"
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

          {/* Settings row */}
          <div className="flex flex-wrap items-center gap-6 py-2">
            <FormField
              control={form.control}
              name="isUrgent"
              render={({ field }) => (
                <FormItem className="flex items-center gap-2">
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="mt-0! cursor-pointer">Срочно</FormLabel>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isAnonymous"
              render={({ field }) => (
                <FormItem className="flex items-center gap-2">
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="mt-0! cursor-pointer">Анонимно</FormLabel>
                </FormItem>
              )}
            />
          </div>

          {/* Submit */}
          <div className="flex items-center gap-4 pt-4 border-t">
            <Button
              type="submit"
              disabled={createMutation.isPending}
            >
              {createMutation.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Send className="mr-2 h-4 w-4" />
              )}
              Отправить на модерацию
            </Button>
            <p className="text-xs text-muted-foreground">
              После проверки модератором публикация станет доступна всем
            </p>
          </div>
        </form>
      </Form>
    </div>
  );
}
