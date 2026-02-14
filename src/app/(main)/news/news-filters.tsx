"use client";

import { AlertTriangle, Calendar, Megaphone, Sparkles, Users, Wrench } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import type { NewsType } from "~/server/db/schema";

const NEWS_TYPE_FILTERS: Array<{
  value: NewsType | null;
  label: string;
  icon: typeof Megaphone;
}> = [
  { value: null, label: "Все", icon: Megaphone },
  { value: "announcement", label: "Объявления", icon: Megaphone },
  { value: "event", label: "Мероприятия", icon: Calendar },
  { value: "maintenance", label: "Тех. работы", icon: Wrench },
  { value: "update", label: "Обновления", icon: Sparkles },
  { value: "community", label: "Сообщество", icon: Users },
  { value: "urgent", label: "Срочные", icon: AlertTriangle },
];

interface NewsFiltersProps {
  currentType?: NewsType;
}

export function NewsFilters({ currentType }: NewsFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleTypeChange = (type: NewsType | null) => {
    const params = new URLSearchParams(searchParams.toString());

    if (type) {
      params.set("type", type);
    } else {
      params.delete("type");
    }

    router.push(`/news?${params.toString()}`);
  };

  return (
    <div className="mb-6 flex flex-wrap gap-2">
      {NEWS_TYPE_FILTERS.map(({ value, label, icon: Icon }) => {
        const isActive = value === (currentType ?? null);

        return (
          <Button
            key={value ?? "all"}
            variant={isActive ? "default" : "outline"}
            size="sm"
            onClick={() => handleTypeChange(value)}
            className={cn("gap-1.5", isActive && "pointer-events-none")}
          >
            <Icon className="h-4 w-4" />
            {label}
          </Button>
        );
      })}
    </div>
  );
}
