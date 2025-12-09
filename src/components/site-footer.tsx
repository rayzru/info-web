import { Heart } from "lucide-react";
import Link from "next/link";

export function SiteFooter() {
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
            <p className="text-xs text-muted-foreground">
              Все средства направляются на развитие и поддержку сервиса.
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
          </div>
        </div>

        {/* Bottom line */}
        <div className="mt-6 pt-4 border-t border-border/50">
          <p className="text-xs text-muted-foreground text-center">
            Открытое сообщество в рамках законодательства РФ
          </p>
        </div>
      </div>
    </footer>
  );
}
