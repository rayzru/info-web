"use client";

import { useState } from "react";

import {
  Building2,
  Check,
  Loader2,
  Map,
  Monitor,
  Moon,
  Plus,
  Settings,
  Sun,
  X,
} from "lucide-react";
import { useTheme } from "next-themes";

import { PageHeader } from "~/components/page-header";
import { Button } from "~/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "~/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { useToast } from "~/hooks/use-toast";
import { cn } from "~/lib/utils";
import { type Theme, useThemeStore } from "~/stores/theme-store";
import { api } from "~/trpc/react";

export default function SettingsPage() {
  const { toast } = useToast();
  const utils = api.useUtils();

  // Theme
  const { theme, setTheme: setThemeStore } = useThemeStore();
  const { setTheme: setNextTheme } = useTheme();

  const handleThemeChange = (newTheme: Theme) => {
    setThemeStore(newTheme);
    setNextTheme(newTheme);
  };

  // Interest buildings
  const { data: interestBuildings, isLoading: loadingInterests } =
    api.profile.getInterestBuildings.useQuery();
  const { data: availableBuildings, isLoading: loadingBuildings } =
    api.profile.getAvailableBuildings.useQuery();
  const { data: profileData } = api.profile.get.useQuery();

  const [mapProvider, setMapProvider] = useState<string>(
    profileData?.profile?.mapProvider ?? "yandex"
  );
  const [buildingSelectorOpen, setBuildingSelectorOpen] = useState(false);

  const addBuilding = api.profile.addInterestBuilding.useMutation({
    onSuccess: () => {
      toast({
        title: "Строение добавлено",
        description: "Область интересов обновлена",
      });
      void utils.profile.getInterestBuildings.invalidate();
    },
    onError: (error) => {
      toast({
        title: "Ошибка",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const removeBuilding = api.profile.removeInterestBuilding.useMutation({
    onSuccess: () => {
      toast({
        title: "Строение удалено",
        description: "Область интересов обновлена",
      });
      void utils.profile.getInterestBuildings.invalidate();
    },
    onError: (error) => {
      toast({
        title: "Ошибка",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateProfile = api.profile.update.useMutation({
    onSuccess: () => {
      toast({
        title: "Настройки сохранены",
        description: "Изменения успешно применены",
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

  const handleMapProviderChange = (value: string) => {
    setMapProvider(value);
    updateProfile.mutate({
      mapProvider: value as "yandex" | "2gis" | "google" | "apple" | "osm",
    });
  };

  const selectedBuildingIds = new Set(interestBuildings?.map((b) => b.buildingId) ?? []);

  const unselectedBuildings =
    availableBuildings?.filter((b) => !selectedBuildingIds.has(b.id)) ?? [];

  const themeOptions = [
    {
      value: "system" as Theme,
      label: "Система",
      icon: Monitor,
      description: "Следовать настройкам устройства",
    },
    { value: "light" as Theme, label: "Светлая", icon: Sun, description: "Всегда светлая тема" },
    { value: "dark" as Theme, label: "Тёмная", icon: Moon, description: "Всегда тёмная тема" },
  ];

  return (
    <div className="space-y-8">
      <PageHeader title="Настройки" description="Персонализация и область интересов" />

      {/* Область интересов - строения */}
      <section>
        <h2 className="mb-6 flex items-center gap-2 border-b pb-3 text-lg font-medium">
          <Building2 className="h-5 w-5" />
          Область интересов
        </h2>

        <div className="grid gap-4 lg:grid-cols-[1fr_1fr] lg:items-start lg:gap-12">
          <div className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm font-medium">Выбранные строения</p>

              {loadingInterests ? (
                <div className="text-muted-foreground flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm">Загрузка...</span>
                </div>
              ) : interestBuildings && interestBuildings.length > 0 ? (
                <div className="flex flex-wrap gap-3">
                  {interestBuildings.map((building) => (
                    <div
                      key={building.buildingId}
                      className="bg-card min-w-30 group relative rounded-lg border p-3 pr-8"
                    >
                      <button
                        type="button"
                        className="text-muted-foreground/60 hover:text-destructive hover:bg-destructive/10 absolute right-1.5 top-1.5 rounded-full p-1 transition-colors"
                        onClick={() => removeBuilding.mutate({ buildingId: building.buildingId })}
                        disabled={removeBuilding.isPending}
                        title="Удалить"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                      <p className="text-muted-foreground mb-0.5 text-xs">Строение</p>
                      <p className="text-sm font-medium">
                        {building.buildingNumber}
                        {building.buildingTitle && (
                          <span className="text-muted-foreground ml-1 font-normal">
                            ({building.buildingTitle})
                          </span>
                        )}
                      </p>
                      {building.autoAdded && (
                        <p className="text-muted-foreground/70 mt-1 text-[10px]">
                          добавлено автоматически
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">
                  Строения не выбраны. Добавьте строения, чтобы видеть релевантный контент.
                </p>
              )}
            </div>

            <Popover open={buildingSelectorOpen} onOpenChange={setBuildingSelectorOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <Plus className="h-4 w-4" />
                  Добавить строение
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-72 p-0" align="start">
                <Command>
                  <CommandInput placeholder="Поиск строения..." />
                  <CommandList>
                    <CommandEmpty>
                      {loadingBuildings ? "Загрузка..." : "Строения не найдены"}
                    </CommandEmpty>
                    <CommandGroup>
                      {unselectedBuildings.map((building) => (
                        <CommandItem
                          key={building.id}
                          value={`${building.number} ${building.title ?? ""}`}
                          onSelect={() => {
                            addBuilding.mutate({ buildingId: building.id });
                            setBuildingSelectorOpen(false);
                          }}
                        >
                          <Check className={cn("mr-2 h-4 w-4", "opacity-0")} />
                          <span>
                            {building.number}
                            {building.liter && ` (${building.liter})`}
                            {building.title && ` — ${building.title}`}
                          </span>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          <p className="text-muted-foreground text-sm lg:pt-6">
            Выбранные строения определяют приоритет контента: вопросы в справочнике, объявления и
            новости будут фильтроваться по вашим интересам. При регистрации недвижимости строение
            добавляется автоматически.
          </p>
        </div>
      </section>

      {/* Настройки приложения */}
      <section>
        <h2 className="mb-6 flex items-center gap-2 border-b pb-3 text-lg font-medium">
          <Settings className="h-5 w-5" />
          Приложение
        </h2>

        <div className="space-y-8">
          {/* Тема */}
          <div className="grid gap-4 lg:grid-cols-[1fr_1fr] lg:items-start lg:gap-12">
            <div className="space-y-3">
              <p className="text-sm font-medium">Тема оформления</p>
              <div className="flex gap-2">
                {themeOptions.map((option) => {
                  const Icon = option.icon;
                  const isSelected = theme === option.value;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      className={cn(
                        "flex min-w-24 flex-col items-center gap-2 rounded-lg border p-4 transition-all",
                        isSelected
                          ? "border-primary bg-primary/5 text-primary"
                          : "border-muted hover:border-foreground/20 hover:bg-muted/50"
                      )}
                      onClick={() => handleThemeChange(option.value)}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="text-sm font-medium">{option.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
            <p className="text-muted-foreground text-sm lg:pt-6">
              Выберите предпочитаемую цветовую схему интерфейса. Режим «Система» автоматически
              переключается между светлой и тёмной темой в зависимости от настроек вашего
              устройства.
            </p>
          </div>

          {/* Провайдер карт */}
          <div className="grid gap-4 lg:grid-cols-[1fr_1fr] lg:items-start lg:gap-12">
            <div className="space-y-3">
              <p className="flex items-center gap-2 text-sm font-medium">
                <Map className="h-4 w-4" />
                Провайдер карт
              </p>
              <Select value={mapProvider} onValueChange={handleMapProviderChange}>
                <SelectTrigger className="w-full sm:w-64">
                  <SelectValue placeholder="Выберите провайдера карт" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yandex">Яндекс Карты</SelectItem>
                  <SelectItem value="2gis">2ГИС</SelectItem>
                  <SelectItem value="google">Google Карты</SelectItem>
                  <SelectItem value="apple">Apple Maps</SelectItem>
                  <SelectItem value="osm">OpenStreetMap</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <p className="text-muted-foreground text-sm lg:pt-6">
              Адреса в приложении будут открываться в выбранном картографическом сервисе. Яндекс
              Карты и 2ГИС рекомендуются для России.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
