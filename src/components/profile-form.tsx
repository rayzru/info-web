"use client";

import { useState } from "react";
import { AlertCircle, AlertTriangle, Camera, Loader2, MessageCircle, Trash2 } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
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
import { useToast } from "~/hooks/use-toast";
import { api } from "~/trpc/react";

interface ProfileFormProps {
  user: {
    id?: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  } | null;
  profile: {
    id: string;
    userId: string;
    firstName: string | null;
    lastName: string | null;
    middleName: string | null;
    displayName: string | null;
    phone: string | null;
    hidePhone: boolean;
    hideName: boolean;
    hideGender: boolean;
    hideBirthday: boolean;
    avatar: string | null;
    dateOfBirth: Date | null;
    gender: "Male" | "Female" | "Unspecified" | null;
    telegramUsername: string | null;
    telegramId: string | null;
    telegramVerified: boolean;
    telegramVerifiedAt: Date | null;
    maxUsername: string | null;
    whatsappPhone: string | null;
    hideMessengers: boolean;
  } | null;
}

// Компонент чекбокса приватности
function PrivacyCheckbox({
  id,
  checked,
  onCheckedChange,
  label,
}: {
  id: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  label: string;
}) {
  return (
    <div className="flex items-center space-x-2">
      <Checkbox
        id={id}
        checked={checked}
        onCheckedChange={(c) => onCheckedChange(c === true)}
      />
      <Label htmlFor={id} className="text-xs font-normal text-muted-foreground">
        {label}
      </Label>
    </div>
  );
}

export function ProfileForm({ user, profile }: ProfileFormProps) {
  const { toast } = useToast();
  const utils = api.useUtils();

  const [displayName, setDisplayName] = useState(
    profile?.displayName ?? user?.name ?? ""
  );
  const [firstName] = useState(profile?.firstName ?? "");
  const [lastName] = useState(profile?.lastName ?? "");
  const [middleName] = useState(profile?.middleName ?? "");
  const [phone, setPhone] = useState(profile?.phone ?? "");
  const [gender, setGender] = useState<string>(profile?.gender ?? "");
  const [dateOfBirth, setDateOfBirth] = useState(
    profile?.dateOfBirth
      ? new Date(profile.dateOfBirth).toISOString().split("T")[0]
      : ""
  );
  const [hidePhone, setHidePhone] = useState(profile?.hidePhone ?? false);
  const [hideName, setHideName] = useState(profile?.hideName ?? false);
  const [hideGender, setHideGender] = useState(profile?.hideGender ?? false);
  const [hideBirthday, setHideBirthday] = useState(
    profile?.hideBirthday ?? false
  );

  const [telegramUsername, setTelegramUsername] = useState(
    profile?.telegramUsername ?? ""
  );
  const [maxUsername, setMaxUsername] = useState(profile?.maxUsername ?? "");
  const [whatsappPhone, setWhatsappPhone] = useState(
    profile?.whatsappPhone ?? ""
  );
  const [hideMessengers, setHideMessengers] = useState(
    profile?.hideMessengers ?? false
  );

  const updateProfile = api.profile.update.useMutation({
    onSuccess: () => {
      toast({
        title: "Профиль обновлен",
        description: "Изменения успешно сохранены",
      });
      void utils.profile.get.invalidate();
    },
    onError: (error) => {
      toast({
        title: "Ошибка",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateAvatar = api.profile.updateAvatar.useMutation({
    onSuccess: (result) => {
      if (!result.success) {
        toast({
          title: "Функция недоступна",
          description: result.message,
        });
      }
    },
  });

  const [deletionReason, setDeletionReason] = useState("");
  const [showDeletionForm, setShowDeletionForm] = useState(false);

  const { data: deletionRequest } = api.profile.getDeletionRequest.useQuery();

  const requestDeletion = api.profile.requestDeletion.useMutation({
    onSuccess: (result) => {
      if (result.success) {
        toast({
          title: "Заявка отправлена",
          description: result.message,
        });
        setShowDeletionForm(false);
        setDeletionReason("");
        void utils.profile.getDeletionRequest.invalidate();
      } else {
        toast({
          title: "Ошибка",
          description: result.message,
          variant: "destructive",
        });
      }
    },
    onError: (error) => {
      toast({
        title: "Ошибка",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const cancelDeletion = api.profile.cancelDeletionRequest.useMutation({
    onSuccess: (result) => {
      if (result.success) {
        toast({
          title: "Заявка отменена",
          description: result.message,
        });
        void utils.profile.getDeletionRequest.invalidate();
      } else {
        toast({
          title: "Ошибка",
          description: result.message,
          variant: "destructive",
        });
      }
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    updateProfile.mutate({
      displayName: displayName || undefined,
      firstName: firstName || undefined,
      lastName: lastName || undefined,
      middleName: middleName || undefined,
      phone: phone || null,
      gender: gender ? (gender as "Male" | "Female" | "Unspecified") : null,
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
      hidePhone,
      hideName,
      hideGender,
      hideBirthday,
      telegramUsername: telegramUsername || null,
      maxUsername: maxUsername || null,
      whatsappPhone: whatsappPhone || null,
      hideMessengers,
    });
  };

  const handleAvatarClick = () => {
    updateAvatar.mutate({});
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-12">
      {/* Avatar Section */}
      <section>
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
          <div className="relative">
            <Avatar className="h-24 w-24 rounded-xl">
              <AvatarImage
                src={profile?.avatar ?? user?.image ?? ""}
                alt=""
                className="object-cover rounded-xl"
              />
              <AvatarFallback className="text-3xl rounded-xl">
                {displayName?.charAt(0) ?? "?"}
              </AvatarFallback>
            </Avatar>
            <Button
              type="button"
              size="icon"
              variant="secondary"
              className="absolute -bottom-1 -right-1 h-8 w-8 rounded-lg shadow-md"
              onClick={handleAvatarClick}
            >
              <Camera className="h-4 w-4" />
            </Button>
          </div>
          <div className="text-center sm:text-left">
            <h2 className="text-xl font-semibold">{displayName || "Имя не указано"}</h2>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
            <p className="text-xs text-muted-foreground mt-1">
              Функция загрузки фото в разработке
            </p>
          </div>
        </div>
      </section>

      {/* Основная информация */}
      <section>
        <h2 className="text-lg font-medium pb-3 border-b mb-8">
          Основная информация
        </h2>

        <div className="space-y-8">
          {/* Отображаемое имя */}
          <div className="grid gap-2 lg:grid-cols-[1fr_1fr] lg:gap-12 lg:items-start">
            <div className="space-y-3 order-1">
              <Label htmlFor="displayName">Отображаемое имя</Label>
              <Input
                id="displayName"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Как вас называть?"
              />
              <PrivacyCheckbox
                id="hideName"
                checked={hideName}
                onCheckedChange={setHideName}
                label="Скрывать от других пользователей"
              />
            </div>
            <p className="text-sm text-muted-foreground order-2 lg:pt-6">
              Это имя видят другие жители в комментариях, объявлениях и сообщениях.
              Можете использовать никнейм или настоящее имя.
            </p>
          </div>

          {/* ФИО */}
          <div className="grid gap-2 lg:grid-cols-[1fr_1fr] lg:gap-12 lg:items-start">
            <div className="space-y-3 order-1">
              <Label className="text-muted-foreground">ФИО (редактирование недоступно)</Label>
              <div className="grid gap-2 sm:grid-cols-3">
                <Input value={lastName} placeholder="Фамилия" disabled className="bg-muted/50" />
                <Input value={firstName} placeholder="Имя" disabled className="bg-muted/50" />
                <Input value={middleName} placeholder="Отчество" disabled className="bg-muted/50" />
              </div>
            </div>
            <p className="text-sm text-muted-foreground order-2 lg:pt-6">
              ФИО используется для формирования шаблонов договоров аренды, заявок,
              претензий и обращений. Редактирование будет доступно после верификации.
            </p>
          </div>

          {/* Пол */}
          <div className="grid gap-2 lg:grid-cols-[1fr_1fr] lg:gap-12 lg:items-start">
            <div className="space-y-3 order-1">
              <Label htmlFor="gender">Пол</Label>
              <Select value={gender} onValueChange={setGender}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Не указан" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Мужской</SelectItem>
                  <SelectItem value="Female">Женский</SelectItem>
                  <SelectItem value="Unspecified">Не указывать</SelectItem>
                </SelectContent>
              </Select>
              <PrivacyCheckbox
                id="hideGender"
                checked={hideGender}
                onCheckedChange={setHideGender}
                label="Скрывать от других пользователей"
              />
            </div>
            <p className="text-sm text-muted-foreground order-2 lg:pt-6">
              Пол помогает формировать статистику сообщества и персонализировать
              обращения в уведомлениях.
            </p>
          </div>

          {/* Дата рождения */}
          <div className="grid gap-2 lg:grid-cols-[1fr_1fr] lg:gap-12 lg:items-start">
            <div className="space-y-3 order-1">
              <Label htmlFor="dateOfBirth">Дата рождения</Label>
              <Input
                id="dateOfBirth"
                type="date"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                className="w-full sm:w-48"
              />
              <PrivacyCheckbox
                id="hideBirthday"
                checked={hideBirthday}
                onCheckedChange={setHideBirthday}
                label="Скрывать год рождения (день и месяц останутся видимыми)"
              />
            </div>
            <p className="text-sm text-muted-foreground order-2 lg:pt-6">
              Дата рождения используется для поздравлений от соседей и расчёта
              возрастной статистики жителей комплекса.
            </p>
          </div>
        </div>
      </section>

      {/* Контакты */}
      <section>
        <h2 className="text-lg font-medium pb-3 border-b mb-8">Контакты</h2>

        <div className="space-y-8">
          {/* Телефон */}
          <div className="grid gap-2 lg:grid-cols-[1fr_1fr] lg:gap-12 lg:items-start">
            <div className="space-y-3 order-1">
              <Label htmlFor="phone">Телефон</Label>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+7 (999) 123-45-67"
              />
              <PrivacyCheckbox
                id="hidePhone"
                checked={hidePhone}
                onCheckedChange={setHidePhone}
                label="Скрывать от других пользователей"
              />
            </div>
            <p className="text-sm text-muted-foreground order-2 lg:pt-6">
              Телефон нужен для связи с вами по вопросам объявлений, заявок на
              собственность и экстренных ситуаций в доме.
            </p>
          </div>

          {/* Email */}
          <div className="grid gap-2 lg:grid-cols-[1fr_1fr] lg:gap-12 lg:items-start">
            <div className="space-y-3 order-1">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={user?.email ?? ""}
                disabled
                className="bg-muted/50"
              />
            </div>
            <p className="text-sm text-muted-foreground order-2 lg:pt-6">
              Email используется для входа в систему и важных уведомлений.
              Получен от провайдера авторизации и не может быть изменён.
            </p>
          </div>
        </div>
      </section>

      {/* Мессенджеры */}
      <section>
        <h2 className="text-lg font-medium pb-3 border-b mb-8 flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          Мессенджеры
        </h2>

        <div className="space-y-8">
          {/* Telegram */}
          <div className="grid gap-2 lg:grid-cols-[1fr_1fr] lg:gap-12 lg:items-start">
            <div className="space-y-3 order-1">
              <Label htmlFor="telegramUsername">Telegram</Label>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">@</span>
                <Input
                  id="telegramUsername"
                  value={telegramUsername}
                  onChange={(e) => setTelegramUsername(e.target.value.replace(/^@/, ""))}
                  placeholder="username"
                  className="flex-1"
                />
              </div>
              {profile?.telegramVerified && (
                <p className="text-xs text-green-600 flex items-center gap-1">
                  <span className="inline-block w-2 h-2 rounded-full bg-green-500" />
                  Подтверждён через бота
                </p>
              )}
            </div>
            <p className="text-sm text-muted-foreground order-2 lg:pt-6">
              Telegram — основной способ связи в нашем сообществе. Через бота
              можно подтвердить аккаунт для получения уведомлений.
            </p>
          </div>

          {/* Max */}
          <div className="grid gap-2 lg:grid-cols-[1fr_1fr] lg:gap-12 lg:items-start">
            <div className="space-y-3 order-1">
              <Label htmlFor="maxUsername">Max (VK Мессенджер)</Label>
              <Input
                id="maxUsername"
                value={maxUsername}
                onChange={(e) => setMaxUsername(e.target.value)}
                placeholder="Имя пользователя или ссылка"
              />
            </div>
            <p className="text-sm text-muted-foreground order-2 lg:pt-6">
              Max (VK Мессенджер) — популярная альтернатива для тех, кто предпочитает
              российские сервисы.
            </p>
          </div>

          {/* WhatsApp */}
          <div className="grid gap-2 lg:grid-cols-[1fr_1fr] lg:gap-12 lg:items-start">
            <div className="space-y-3 order-1">
              <Label htmlFor="whatsappPhone">WhatsApp</Label>
              <Input
                id="whatsappPhone"
                type="tel"
                value={whatsappPhone}
                onChange={(e) => setWhatsappPhone(e.target.value)}
                placeholder="+7 (999) 123-45-67"
              />
              <div className="flex items-center gap-2 text-xs text-amber-600 dark:text-amber-400">
                <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                <span>Возможны блокировки на территории РФ</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground order-2 lg:pt-6">
              WhatsApp широко используется, но может быть недоступен на территории РФ
              из-за блокировок.
            </p>
          </div>

          {/* Приватность мессенджеров */}
          <div className="pt-2">
            <PrivacyCheckbox
              id="hideMessengers"
              checked={hideMessengers}
              onCheckedChange={setHideMessengers}
              label="Скрывать все мессенджеры от других пользователей"
            />
          </div>
        </div>
      </section>

      {/* Кнопка сохранения */}
      <div className="flex justify-end pt-4">
        <Button type="submit" disabled={updateProfile.isPending} size="lg">
          {updateProfile.isPending && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}
          Сохранить изменения
        </Button>
      </div>

      {/* Удаление аккаунта */}
      <section className="pt-10 mt-10 border-t border-destructive/20">
        <h2 className="text-lg font-medium pb-3 border-b border-destructive/20 mb-6 text-destructive flex items-center gap-2">
          <Trash2 className="h-5 w-5" />
          Удаление аккаунта
        </h2>

        {deletionRequest ? (
          <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
              <div className="flex-1 space-y-3">
                <div>
                  <p className="font-medium text-destructive">
                    Заявка на удаление отправлена
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Ваша заявка на удаление аккаунта находится на рассмотрении.
                    Администрация обработает её в течение 30 дней.
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Дата подачи:{" "}
                    {new Date(deletionRequest.createdAt).toLocaleDateString(
                      "ru-RU",
                      {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      }
                    )}
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => cancelDeletion.mutate()}
                  disabled={cancelDeletion.isPending}
                >
                  {cancelDeletion.isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Отменить заявку
                </Button>
              </div>
            </div>
          </div>
        ) : showDeletionForm ? (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              После подтверждения заявки все ваши персональные данные будут
              безвозвратно удалены из сервиса в течение 30 дней.
            </p>
            <div className="space-y-2">
              <Label htmlFor="deletionReason">
                Причина удаления (необязательно)
              </Label>
              <Textarea
                id="deletionReason"
                value={deletionReason}
                onChange={(e) => setDeletionReason(e.target.value)}
                placeholder="Расскажите, почему вы хотите удалить аккаунт..."
                className="resize-none"
                rows={3}
              />
            </div>
            <div className="flex gap-3">
              <Button
                type="button"
                variant="destructive"
                onClick={() =>
                  requestDeletion.mutate({ reason: deletionReason || undefined })
                }
                disabled={requestDeletion.isPending}
              >
                {requestDeletion.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Подтвердить удаление
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowDeletionForm(false);
                  setDeletionReason("");
                }}
              >
                Отмена
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid gap-2 lg:grid-cols-[1fr_1fr] lg:gap-12 lg:items-start">
            <div className="order-1">
              <Button
                type="button"
                variant="outline"
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={() => setShowDeletionForm(true)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Запросить удаление аккаунта
              </Button>
            </div>
            <p className="text-sm text-muted-foreground order-2 lg:pt-2">
              Вы можете удалить свой аккаунт и все связанные с ним персональные
              данные. Это действие необратимо. Заявка будет рассмотрена
              администрацией в течение 30 дней.
            </p>
          </div>
        )}
      </section>
    </form>
  );
}
