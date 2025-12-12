"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Loader2, Plus, Trash2 } from "lucide-react";

import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Checkbox } from "~/components/ui/checkbox";
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
import { TagPicker, type TagOption } from "~/components/ui/tag-picker";
import { useToast } from "~/hooks/use-toast";
import { api } from "~/trpc/react";

const CONTACT_TYPES = [
  { value: "phone", label: "Телефон" },
  { value: "email", label: "Email" },
  { value: "telegram", label: "Telegram" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "vk", label: "ВКонтакте" },
  { value: "website", label: "Сайт" },
  { value: "address", label: "Адрес" },
  { value: "other", label: "Другое" },
];

const DAY_NAMES = [
  "Воскресенье",
  "Понедельник",
  "Вторник",
  "Среда",
  "Четверг",
  "Пятница",
  "Суббота",
];

type Contact = {
  type: string;
  value: string;
  label: string;
  subtitle: string;
  isPrimary: boolean;
  tagIds: string[];
};

type Schedule = {
  dayOfWeek: number;
  openTime: string;
  closeTime: string;
  note: string;
};

export default function EditDirectoryEntryPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const entryId = params.id as string;

  // Form state
  const [type, setType] = useState<string>("contact");
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Queries
  const { data: entryData, isLoading: entryLoading } =
    api.directory.admin.get.useQuery({ id: entryId }, { enabled: !!entryId });
  const { data: tagsData } = api.directory.getTags.useQuery({ parentId: null });
  const { data: allTagsData } = api.directory.getTags.useQuery({
    includeAll: true,
  });

  // Transform tags for TagPicker with grouping
  const contactTagOptions: TagOption[] = React.useMemo(() => {
    if (!allTagsData) return [];

    return allTagsData
      .filter(
        (tag) =>
          tag.slug.startsWith("stroenie-") ||
          tag.slug.startsWith("podezd-") ||
          tag.slug === "konsierzh" ||
          tag.slug === "chat" ||
          tag.slug === "elektrik" ||
          tag.slug === "santehnik" ||
          tag.slug === "dispetcher" ||
          tag.slug === "lift" ||
          tag.slug === "domofon" ||
          tag.slug === "vorota",
      )
      .map((tag) => {
        let group = "Прочее";
        if (tag.slug.startsWith("stroenie-")) group = "Строения";
        else if (tag.slug.startsWith("podezd-")) group = "Подъезды";
        else if (
          [
            "konsierzh",
            "elektrik",
            "santehnik",
            "dispetcher",
            "lift",
            "domofon",
            "vorota",
          ].includes(tag.slug)
        ) {
          group = "Службы";
        } else if (tag.slug === "chat") group = "Каналы";

        return {
          id: tag.id,
          name: tag.name,
          subtitle: tag.description ?? undefined,
          slug: tag.slug,
          group,
          synonyms: tag.synonyms ?? [],
        };
      });
  }, [allTagsData]);

  // Initialize form with entry data
  useEffect(() => {
    if (entryData && !isInitialized) {
      setType(entryData.type);
      setTitle(entryData.title);
      setSubtitle(entryData.subtitle ?? "");
      setDescription(entryData.description ?? "");
      setContent(entryData.content ?? "");

      // Map contacts
      const mappedContacts: Contact[] = (entryData.contacts ?? []).map((c) => ({
        type: c.type,
        value: c.value,
        label: c.label ?? "",
        subtitle: c.subtitle ?? "",
        isPrimary: c.isPrimary === 1,
        tagIds: (c.tags ?? []).map((t) => t.id),
      }));
      setContacts(
        mappedContacts.length > 0
          ? mappedContacts
          : [
              {
                type: "phone",
                value: "",
                label: "",
                subtitle: "",
                isPrimary: true,
                tagIds: [],
              },
            ],
      );

      // Map schedules
      const mappedSchedules: Schedule[] = (entryData.schedules ?? []).map(
        (s) => ({
          dayOfWeek: s.dayOfWeek,
          openTime: s.openTime ?? "09:00",
          closeTime: s.closeTime ?? "18:00",
          note: s.note ?? "",
        }),
      );
      setSchedules(mappedSchedules);

      // Map tags
      setSelectedTagIds((entryData.tags ?? []).map((t) => t.id));

      setIsInitialized(true);
    }
  }, [entryData, isInitialized]);

  // Mutations
  const updateMutation = api.directory.admin.update.useMutation({
    onSuccess: () => {
      toast({ title: "Запись обновлена" });
      router.push("/admin/directory");
    },
    onError: (error) => {
      toast({
        title: "Ошибка",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Contact handlers
  const addContact = () => {
    setContacts([
      ...contacts,
      {
        type: "phone",
        value: "",
        label: "",
        subtitle: "",
        isPrimary: false,
        tagIds: [],
      },
    ]);
  };

  const removeContact = (index: number) => {
    const newContacts = contacts.filter((_, i) => i !== index);
    // Ensure at least one primary
    if (newContacts.length > 0 && !newContacts.some((c) => c.isPrimary)) {
      newContacts[0]!.isPrimary = true;
    }
    setContacts(newContacts);
  };

  const updateContact = (
    index: number,
    field: keyof Contact,
    value: string | boolean | string[],
  ) => {
    const newContacts = [...contacts];
    if (field === "isPrimary" && value === true) {
      // Only one primary
      newContacts.forEach((c, i) => {
        c.isPrimary = i === index;
      });
    } else {
      (newContacts[index] as any)[field] = value;
    }
    setContacts(newContacts);
  };

  // Schedule handlers
  const toggleScheduleDay = (dayOfWeek: number) => {
    const existing = schedules.find((s) => s.dayOfWeek === dayOfWeek);
    if (existing) {
      setSchedules(schedules.filter((s) => s.dayOfWeek !== dayOfWeek));
    } else {
      setSchedules([
        ...schedules,
        { dayOfWeek, openTime: "09:00", closeTime: "18:00", note: "" },
      ]);
    }
  };

  const updateSchedule = (
    dayOfWeek: number,
    field: keyof Schedule,
    value: string | number,
  ) => {
    setSchedules(
      schedules.map((s) =>
        s.dayOfWeek === dayOfWeek ? { ...s, [field]: value } : s,
      ),
    );
  };

  // Tag handlers
  const toggleTag = (tagId: string) => {
    if (selectedTagIds.includes(tagId)) {
      setSelectedTagIds(selectedTagIds.filter((id) => id !== tagId));
    } else {
      setSelectedTagIds([...selectedTagIds, tagId]);
    }
  };

  // Submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast({ title: "Введите название", variant: "destructive" });
      return;
    }

    const validContacts = contacts
      .filter((c) => c.value.trim())
      .map((c, i) => ({
        type: c.type as any,
        value: c.value.trim(),
        label: c.label.trim() || undefined,
        subtitle: c.subtitle.trim() || undefined,
        isPrimary: c.isPrimary,
        order: i,
        tagIds: c.tagIds.length > 0 ? c.tagIds : undefined,
      }));

    const validSchedules = schedules.map((s) => ({
      dayOfWeek: s.dayOfWeek,
      openTime: s.openTime || undefined,
      closeTime: s.closeTime || undefined,
      note: s.note || undefined,
    }));

    // Only include type if it's a valid value
    const validTypes = [
      "contact",
      "organization",
      "location",
      "document",
    ] as const;
    const typeToSend = validTypes.includes(type as (typeof validTypes)[number])
      ? (type as (typeof validTypes)[number])
      : undefined;

    updateMutation.mutate({
      id: entryId,
      type: typeToSend,
      title: title.trim(),
      subtitle: subtitle.trim() || undefined,
      description: description.trim() || undefined,
      content: content.trim() || undefined,
      contacts: validContacts.length > 0 ? validContacts : undefined,
      schedules: validSchedules.length > 0 ? validSchedules : undefined,
      tagIds: selectedTagIds.length > 0 ? selectedTagIds : undefined,
    });
  };

  if (entryLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!entryData) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/admin/directory">
            <Button variant="ghost" size="icon">
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-semibold">Запись не найдена</h1>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/directory">
          <Button variant="ghost" size="icon">
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-semibold">Редактирование записи</h1>
          <p className="text-muted-foreground mt-1">/{entryData.slug}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          {/* Main form */}
          <div className="space-y-6">
            {/* Basic info */}
            <Card>
              <CardHeader>
                <CardTitle>Основная информация</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Тип записи</Label>
                  <Select value={type} onValueChange={setType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="contact">Контакт</SelectItem>
                      <SelectItem value="organization">Организация</SelectItem>
                      <SelectItem value="location">Локация</SelectItem>
                      <SelectItem value="document">Документ</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Название *</Label>
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Например: Диспетчерская УК"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Подзаголовок</Label>
                  <Input
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                    placeholder="Например: Литеры 2, 3"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Описание</Label>
                  <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Краткое описание..."
                    rows={3}
                  />
                </div>

                {type === "document" && (
                  <div className="space-y-2">
                    <Label>Содержимое (HTML)</Label>
                    <Textarea
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="<p>Содержимое документа...</p>"
                      rows={6}
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Contacts */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Контакты</CardTitle>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addContact}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Добавить
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {contacts.map((contact, index) => (
                  <div
                    key={index}
                    className="space-y-2 border-b pb-4 last:border-b-0"
                  >
                    <div className="flex items-start gap-2">
                      <Select
                        value={contact.type}
                        onValueChange={(v) => updateContact(index, "type", v)}
                      >
                        <SelectTrigger className="w-[120px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {CONTACT_TYPES.map((t) => (
                            <SelectItem key={t.value} value={t.value}>
                              {t.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <Input
                        value={contact.value}
                        onChange={(e) =>
                          updateContact(index, "value", e.target.value)
                        }
                        placeholder="Значение"
                        className="flex-1"
                      />
                    </div>
                    <div className="flex items-start gap-2">
                      <Input
                        value={contact.label}
                        onChange={(e) =>
                          updateContact(index, "label", e.target.value)
                        }
                        placeholder="Подпись"
                        className="flex-1"
                      />

                      <Input
                        value={contact.subtitle}
                        onChange={(e) =>
                          updateContact(index, "subtitle", e.target.value)
                        }
                        placeholder="Подзаголовок"
                        className="flex-1"
                      />
                    </div>
                    <div className="flex justify-between">
                      <div className="flex items-center gap-2">
                        
                        <Checkbox
                          id={`contact${index}`}
                          checked={contact.isPrimary}
                          onCheckedChange={(v) =>
                            updateContact(index, "isPrimary", !!v)
                          }
                        />
                        <span className="text-muted-foreground text-xs">
                          <Label htmlFor={`contact${index}`}>Основной контакт</Label>
                          
                        </span>
                      </div>

                      {contacts.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeContact(index)}
                        >
                          <Trash2 className="text-destructive h-4 w-4" />
                        </Button>
                      )}
                    </div>

                    {/* Contact-level tags */}
                    {contactTagOptions.length > 0 && (
                      <div className="pl-1">
                        <TagPicker
                          options={contactTagOptions}
                          selected={contact.tagIds}
                          onChange={(tagIds) =>
                            updateContact(index, "tagIds", tagIds)
                          }
                          placeholder="Добавить теги..."
                          emptyText="Теги не найдены"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Schedule */}
            <Card>
              <CardHeader>
                <CardTitle>График работы</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {DAY_NAMES.map((name, index) => {
                    const isActive = schedules.some(
                      (s) => s.dayOfWeek === index,
                    );
                    return (
                      <Button
                        key={index}
                        type="button"
                        variant={isActive ? "default" : "outline"}
                        size="sm"
                        onClick={() => toggleScheduleDay(index)}
                      >
                        {name}
                      </Button>
                    );
                  })}
                </div>

                {schedules.length > 0 && (
                  <div className="mt-4 space-y-3">
                    {schedules
                      .sort((a, b) => a.dayOfWeek - b.dayOfWeek)
                      .map((schedule) => (
                        <div
                          key={schedule.dayOfWeek}
                          className="flex items-center gap-4"
                        >
                          <span className="w-28 text-sm font-medium">
                            {DAY_NAMES[schedule.dayOfWeek]}
                          </span>
                          <Input
                            type="time"
                            value={schedule.openTime}
                            onChange={(e) =>
                              updateSchedule(
                                schedule.dayOfWeek,
                                "openTime",
                                e.target.value,
                              )
                            }
                            className="w-28"
                          />
                          <span className="text-muted-foreground">—</span>
                          <Input
                            type="time"
                            value={schedule.closeTime}
                            onChange={(e) =>
                              updateSchedule(
                                schedule.dayOfWeek,
                                "closeTime",
                                e.target.value,
                              )
                            }
                            className="w-28"
                          />
                          <Input
                            value={schedule.note}
                            onChange={(e) =>
                              updateSchedule(
                                schedule.dayOfWeek,
                                "note",
                                e.target.value,
                              )
                            }
                            placeholder="Примечание"
                            className="flex-1"
                          />
                        </div>
                      ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Tags */}
            <Card>
              <CardHeader>
                <CardTitle>Категории</CardTitle>
              </CardHeader>
              <CardContent>
                {tagsData && tagsData.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {tagsData.map((tag) => (
                      <Badge
                        key={tag.id}
                        variant={
                          selectedTagIds.includes(tag.id)
                            ? "default"
                            : "outline"
                        }
                        className="cursor-pointer"
                        onClick={() => toggleTag(tag.id)}
                      >
                        {tag.name}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm">
                    Категорий пока нет
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardContent className="space-y-3 pt-6">
                <Button
                  type="submit"
                  className="w-full"
                  disabled={updateMutation.isPending}
                >
                  {updateMutation.isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Сохранить изменения
                </Button>
                <Link
                  href={`/info/${entryData.slug}`}
                  target="_blank"
                  className="block"
                >
                  <Button type="button" variant="outline" className="w-full">
                    Открыть на сайте
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
