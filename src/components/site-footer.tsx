"use client";

import { type MouseEvent } from "react";
import { Heart, Mail, MessageCircle, Monitor, Moon, Sun } from "lucide-react";
import Link from "next/link";
import { useTheme } from "next-themes";

import { Button } from "./ui/button";
import { cn } from "~/lib/utils";
import { useThemeStore, type Theme } from "~/stores/theme-store";
import { useThemeTransition } from "./theme-transition";

export function SiteFooter() {
  const { theme, setTheme } = useThemeStore();
  const { setTheme: setNextTheme } = useTheme();
  const triggerTransition = useThemeTransition();

  const handleThemeChange = async (newTheme: Theme, e: MouseEvent) => {
    // Use View Transitions API for smooth animated theme change
    await triggerTransition(
      () => {
        setTheme(newTheme);
        setNextTheme(newTheme);
      },
      { x: e.clientX, y: e.clientY }
    );
  };

  const themeOptions = [
    { value: "system" as Theme, icon: Monitor, label: "Авто" },
    { value: "light" as Theme, icon: Sun, label: "Светлая" },
    { value: "dark" as Theme, icon: Moon, label: "Тёмная" },
  ];
  return (
    <footer className="mt-auto border-t bg-muted/30">
      <div className="container mx-auto max-w-7xl px-[20px] py-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          {/* Signature */}
          <div className="max-w-md space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Heart className="h-4 w-4 text-red-500" />
              <span>Соседями для соседей</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Информационный сервис создан и поддерживается инициативными
              жильцами ЖК «Сердце Ростова 2». Мы объединяем соседей, собираем
              полезную информацию и создаём инструменты для комфортной жизни в
              нашем доме.
            </p>
          </div>

          {/* Links */}
          <div className="flex gap-8 md:gap-12">
            <div className="flex flex-col gap-2 text-sm">
              <p className="text-xs font-medium text-foreground mb-1">Сообщество</p>
              <Link
                href="/community"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                О проекте
              </Link>
              <Link
                href="/community/rules"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Правила сообщества
              </Link>
            </div>
            <div className="flex flex-col gap-2 text-sm">
              <p className="text-xs font-medium text-foreground mb-1">Правовая информация</p>
              <Link
                href="/terms"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Пользовательское соглашение
              </Link>
              <Link
                href="/privacy"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Политика конфиденциальности
              </Link>
            </div>
            <div className="flex flex-col gap-2 text-sm">
              <p className="text-xs font-medium text-foreground mb-1">Связаться</p>
              <Link
                href="https://t.me/serdcerostova2"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
              >
                <MessageCircle className="h-3.5 w-3.5" />
                Основной чат
              </Link>
              <a
                href="mailto:help@sr2.ru"
                className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
              >
                <Mail className="h-3.5 w-3.5" />
                help@sr2.ru
              </a>
            </div>
          </div>
        </div>

        {/* Bottom line */}
        <div className="mt-6 pt-4 border-t border-border/50 flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            Открытое сообщество в рамках законодательства РФ
          </p>

          {/* Theme switcher */}
          <div className="flex items-center gap-0.5 rounded-md border bg-background p-0.5">
            {themeOptions.map((option) => {
              const Icon = option.icon;
              const isSelected = theme === option.value;
              return (
                <Button
                  key={option.value}
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "h-7 w-7",
                    isSelected && "bg-muted"
                  )}
                  onClick={(e) => handleThemeChange(option.value, e)}
                  title={option.label}
                >
                  <Icon className="h-3.5 w-3.5" />
                </Button>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
}
