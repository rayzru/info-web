"use client";

import { useEffect, useRef, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertTriangle,
  CheckCircle2,
  FileText,
  HelpCircle,
  Image as ImageIcon,
  Lightbulb,
  Loader2,
  MessageSquare,
  Paperclip,
  Send,
  ShieldCheck,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { ImageUploader } from "~/components/media/image-uploader";
import { Alert, AlertDescription } from "~/components/ui/alert";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
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
import { Textarea } from "~/components/ui/textarea";
import { useToast } from "~/hooks/use-toast";
import { FEEDBACK_LIMITS } from "~/server/db/schema";
import { api } from "~/trpc/react";

const FEEDBACK_TYPES = [
  { value: "complaint", label: "Жалоба", icon: AlertTriangle, color: "text-red-500" },
  { value: "suggestion", label: "Пожелание", icon: Lightbulb, color: "text-yellow-500" },
  { value: "request", label: "Заявка", icon: FileText, color: "text-blue-500" },
  { value: "question", label: "Вопрос", icon: HelpCircle, color: "text-purple-500" },
  { value: "other", label: "Другое", icon: MessageSquare, color: "text-gray-500" },
] as const;

const feedbackFormSchema = z.object({
  type: z.enum(["complaint", "suggestion", "request", "question", "other"]),
  title: z.string().max(FEEDBACK_LIMITS.MAX_TITLE_LENGTH).optional(),
  content: z
    .string()
    .min(10, "Текст должен содержать минимум 10 символов")
    .max(FEEDBACK_LIMITS.MAX_CONTENT_LENGTH),
  contactName: z.string().max(255).optional(),
  contactEmail: z.string().email("Некорректный email").optional().or(z.literal("")),
  contactPhone: z.string().max(20).optional(),
});

type FeedbackFormValues = z.infer<typeof feedbackFormSchema>;

export default function FeedbackPage() {
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const { toast } = useToast();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [photos, setPhotos] = useState<string[]>([]);
  const contentRef = useRef<HTMLTextAreaElement>(null);

  // Read URL params for pre-filling
  const typeParam = searchParams.get("type");
  const titleParam = searchParams.get("title");
  const focusParam = searchParams.get("focus");
  const contextParam = searchParams.get("context");

  // Validate type param
  const validTypes = ["complaint", "suggestion", "request", "question", "other"] as const;
  const defaultType = validTypes.includes(typeParam as (typeof validTypes)[number])
    ? (typeParam as (typeof validTypes)[number])
    : "suggestion";

  const form = useForm<FeedbackFormValues>({
    resolver: zodResolver(feedbackFormSchema),
    defaultValues: {
      type: defaultType,
      title: titleParam ?? "",
      content: "",
      contactName: session?.user?.name ?? "",
      contactEmail: session?.user?.email ?? "",
      contactPhone: "",
    },
  });

  // Focus on content field if requested
  useEffect(() => {
    if (focusParam === "content" && contentRef.current) {
      // Small delay to ensure form is rendered
      const timer = setTimeout(() => {
        contentRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [focusParam]);

  const contentLength = form.watch("content")?.length ?? 0;

  const submitMutation = api.feedback.submit.useMutation({
    onSuccess: () => {
      setIsSubmitted(true);
    },
    onError: (error) => {
      toast({
        title: "Ошибка",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (values: FeedbackFormValues) => {
    // Add context reference to content if provided
    const contentWithContext = contextParam
      ? `[Контекст: ${contextParam}]\n\n${values.content}`
      : values.content;

    submitMutation.mutate({
      type: values.type,
      title: values.title || undefined,
      content: contentWithContext,
      contactName: values.contactName || undefined,
      contactEmail: values.contactEmail || undefined,
      contactPhone: values.contactPhone || undefined,
      photos: photos.length > 0 ? photos : undefined,
    });
  };

  const handleAddPhoto = (url: string | null) => {
    if (url && photos.length < FEEDBACK_LIMITS.MAX_PHOTOS) {
      setPhotos([...photos, url]);
    }
  };

  const handleRemovePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  if (isSubmitted) {
    return (
      <div className="container mx-auto max-w-2xl py-12">
        <Card className="border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950/20">
          <CardContent className="pt-6">
            <div className="space-y-4 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-green-900 dark:text-green-100">
                  Обращение отправлено
                </h2>
                <p className="mt-2 text-green-700 dark:text-green-300">
                  Спасибо за ваше обращение! Мы рассмотрим его в ближайшее время.
                </p>
                {form.getValues("contactEmail") && (
                  <p className="mt-2 text-sm text-green-600 dark:text-green-400">
                    Ответ будет направлен на указанный email.
                  </p>
                )}
              </div>
              <Button
                variant="outline"
                onClick={() => {
                  setIsSubmitted(false);
                  form.reset();
                  setPhotos([]);
                }}
                className="mt-4"
              >
                Отправить ещё
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-2xl space-y-6 py-8">
      {/* Header */}
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold">Обратная связь</h1>
        <p className="text-muted-foreground">Оставьте жалобу, пожелание или заявку</p>
      </div>

      {/* Privacy notice */}
      <Alert>
        <ShieldCheck className="h-4 w-4" />
        <AlertDescription>
          Ваши данные хранятся конфиденциально. Контактная информация используется только для
          обратной связи и не передаётся третьим лицам.
        </AlertDescription>
      </Alert>

      {/* Context info (e.g., article reference) */}
      {contextParam && (
        <Alert variant="default" className="bg-muted/50">
          <FileText className="h-4 w-4" />
          <AlertDescription className="flex items-center gap-2">
            <span>Контекст:</span>
            <Link href={contextParam} className="text-primary font-medium hover:underline">
              {contextParam}
            </Link>
          </AlertDescription>
        </Alert>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Type selection */}
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Тип обращения</FormLabel>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
                  {FEEDBACK_TYPES.map((type) => {
                    const Icon = type.icon;
                    const isSelected = field.value === type.value;
                    return (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() => field.onChange(type.value)}
                        className={`flex flex-col items-center gap-1 rounded-lg border-2 p-3 transition-all ${
                          isSelected
                            ? "border-primary bg-primary/5"
                            : "border-muted hover:border-primary/50"
                        } `}
                      >
                        <Icon className={`h-5 w-5 ${type.color}`} />
                        <span className="text-xs font-medium">{type.label}</span>
                      </button>
                    );
                  })}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Title (optional) */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Тема <span className="text-muted-foreground font-normal">(необязательно)</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="Кратко опишите суть обращения" {...field} />
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
                <FormLabel>Текст обращения *</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Подробно опишите вашу жалобу, пожелание или заявку..."
                    rows={6}
                    {...field}
                    ref={(el) => {
                      field.ref(el);
                      (contentRef as React.MutableRefObject<HTMLTextAreaElement | null>).current =
                        el;
                    }}
                  />
                </FormControl>
                <div className="text-muted-foreground flex justify-between text-xs">
                  <FormMessage />
                  <span
                    className={
                      contentLength > FEEDBACK_LIMITS.MAX_CONTENT_LENGTH ? "text-destructive" : ""
                    }
                  >
                    {contentLength} / {FEEDBACK_LIMITS.MAX_CONTENT_LENGTH}
                  </span>
                </div>
              </FormItem>
            )}
          />

          {/* Contact info section */}
          <div className="space-y-4 border-t pt-4">
            <div>
              <h3 className="font-medium">Контактные данные для обратной связи</h3>
              <p className="text-muted-foreground text-sm">Заполните, если хотите получить ответ</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="contactName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Имя</FormLabel>
                    <FormControl>
                      <Input placeholder="Как к вам обращаться" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contactPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Телефон</FormLabel>
                    <FormControl>
                      <Input placeholder="+7 (___) ___-__-__" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="contactEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="example@mail.ru" {...field} />
                  </FormControl>
                  <FormDescription>На этот адрес будет отправлен ответ</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Photo attachments */}
          <div className="space-y-4 border-t pt-4">
            <div>
              <h3 className="flex items-center gap-2 font-medium">
                <ImageIcon className="h-4 w-4" />
                Фотографии
              </h3>
              <p className="text-muted-foreground text-sm">
                До {FEEDBACK_LIMITS.MAX_PHOTOS} фотографий (необязательно)
              </p>
            </div>

            {/* Photo grid */}
            {photos.length > 0 && (
              <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
                {photos.map((photo, index) => (
                  <div
                    key={index}
                    className="relative aspect-square overflow-hidden rounded-lg border"
                  >
                    <Image
                      src={photo}
                      alt={`Фото ${index + 1}`}
                      fill
                      className="object-cover"
                      unoptimized={photo.includes("/uploads/")}
                    />
                    <button
                      type="button"
                      onClick={() => handleRemovePhoto(index)}
                      className="absolute right-1 top-1 rounded-full bg-black/50 p-1 transition-colors hover:bg-black/70"
                    >
                      <X className="h-3 w-3 text-white" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Add photo button */}
            {photos.length < FEEDBACK_LIMITS.MAX_PHOTOS && (
              <ImageUploader
                key={photos.length}
                value={null}
                onChange={handleAddPhoto}
                placeholder="Добавить фотографию"
                enableCrop={false}
                maxWidth={1200}
                addWatermark={false}
              />
            )}
          </div>

          {/* Submit */}
          <div className="pt-4">
            <Button type="submit" className="w-full" size="lg" disabled={submitMutation.isPending}>
              {submitMutation.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Send className="mr-2 h-4 w-4" />
              )}
              Отправить обращение
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
