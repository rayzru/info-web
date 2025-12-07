"use client";

import { useState } from "react";
import { Camera, Loader2 } from "lucide-react";

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
  } | null;
}

export function ProfileForm({ user, profile }: ProfileFormProps) {
  const { toast } = useToast();
  const utils = api.useUtils();

  const [displayName, setDisplayName] = useState(
    profile?.displayName ?? user?.name ?? ""
  );
  const [firstName, setFirstName] = useState(profile?.firstName ?? "");
  const [lastName, setLastName] = useState(profile?.lastName ?? "");
  const [middleName, setMiddleName] = useState(profile?.middleName ?? "");
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
    });
  };

  const handleAvatarClick = () => {
    updateAvatar.mutate({});
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      {/* Main Profile Section - Two Column Layout */}
      <section>
        <h2 className="text-lg font-medium pb-3 border-b mb-6">
          Основная информация
        </h2>
        <div className="flex flex-col-reverse md:flex-row gap-8">
          {/* Left Column - Profile Data */}
          <div className="flex-1 space-y-6">
            {/* Display Name */}
            <div className="space-y-2">
              <Label htmlFor="displayName">Имя пользователя</Label>
              <Input
                id="displayName"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Введите отображаемое имя"
              />
              <p className="text-xs text-muted-foreground">
                Как вас видят другие пользователи сообщества
              </p>
            </div>

            {/* Full Name */}
            <div className="space-y-3">
              <Label className="text-muted-foreground text-sm">ФИО</Label>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-xs">
                    Фамилия
                  </Label>
                  <Input
                    id="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Иванов"
                    disabled
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-xs">
                    Имя
                  </Label>
                  <Input
                    id="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Иван"
                    disabled
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="middleName" className="text-xs">
                    Отчество
                  </Label>
                  <Input
                    id="middleName"
                    value={middleName}
                    onChange={(e) => setMiddleName(e.target.value)}
                    placeholder="Иванович"
                    disabled
                  />
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Редактирование ФИО пока недоступно
              </p>
            </div>

            {/* Gender & Birthday Row */}
            <div className="grid gap-6 md:grid-cols-2">
              {/* Gender */}
              <div className="space-y-2">
                <Label htmlFor="gender">Пол</Label>
                <Select value={gender} onValueChange={setGender}>
                  <SelectTrigger>
                    <SelectValue placeholder="Не указан" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Мужской</SelectItem>
                    <SelectItem value="Female">Женский</SelectItem>
                    <SelectItem value="Unspecified">Не указывать</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Date of Birth */}
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Дата рождения</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                />
              </div>
            </div>

            {/* Privacy Settings */}
            <div className="space-y-3 pt-2">
              <Label className="text-muted-foreground text-sm">
                Настройки приватности
              </Label>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="hideName"
                    checked={hideName}
                    onCheckedChange={(checked) => setHideName(checked === true)}
                  />
                  <Label htmlFor="hideName" className="text-sm font-normal">
                    Скрывать имя от других пользователей
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="hideGender"
                    checked={hideGender}
                    onCheckedChange={(checked) =>
                      setHideGender(checked === true)
                    }
                  />
                  <Label htmlFor="hideGender" className="text-sm font-normal">
                    Скрывать пол от других пользователей
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="hideBirthday"
                    checked={hideBirthday}
                    onCheckedChange={(checked) =>
                      setHideBirthday(checked === true)
                    }
                  />
                  <Label htmlFor="hideBirthday" className="text-sm font-normal">
                    Скрывать возраст (день рождения будет показан, но без года)
                  </Label>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Profile Image */}
          <div className="md:w-48 shrink-0">
            <div className="space-y-3">
              <Label className="text-muted-foreground text-sm">
                Изображение профиля
              </Label>
              <div className="relative aspect-square w-full max-w-48 mx-auto md:mx-0">
                <Avatar className="h-full w-full rounded-xl">
                  <AvatarImage
                    src={profile?.avatar ?? user?.image ?? ""}
                    alt=""
                    className="object-cover rounded-xl"
                  />
                  <AvatarFallback className="text-4xl rounded-xl">
                    {displayName?.charAt(0) ?? "?"}
                  </AvatarFallback>
                </Avatar>
                <Button
                  type="button"
                  size="icon"
                  variant="secondary"
                  className="absolute bottom-2 right-2 h-9 w-9 rounded-lg shadow-md"
                  onClick={handleAvatarClick}
                >
                  <Camera className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground text-center md:text-left">
                Функция загрузки в разработке
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contacts Section */}
      <section>
        <h2 className="text-lg font-medium pb-3 border-b mb-6">Контакты</h2>
        <div className="space-y-6">
          {/* Phone */}
          <div className="space-y-2">
            <Label htmlFor="phone">Телефон</Label>
            <Input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+7 (999) 123-45-67"
              className="max-w-sm"
            />
            <p className="text-xs text-muted-foreground">
              Контактный номер для связи с соседями
            </p>
          </div>

          {/* Email (read-only, from auth provider) */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={user?.email ?? ""}
              disabled
              className="max-w-sm"
            />
            <p className="text-xs text-muted-foreground">
              Email получен от провайдера авторизации и не может быть изменен
            </p>
          </div>

          {/* Privacy Settings for Contacts */}
          <div className="flex items-center space-x-2 pt-2">
            <Checkbox
              id="hidePhone"
              checked={hidePhone}
              onCheckedChange={(checked) => setHidePhone(checked === true)}
            />
            <Label htmlFor="hidePhone" className="text-sm font-normal">
              Скрывать телефон от других пользователей
            </Label>
          </div>
        </div>
      </section>

      {/* Submit Button */}
      <div className="flex justify-end pt-4">
        <Button type="submit" disabled={updateProfile.isPending} size="lg">
          {updateProfile.isPending && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}
          Сохранить изменения
        </Button>
      </div>
    </form>
  );
}
