"use client";

import {
  BookOpen,
  UserPlus,
  FileCheck,
  Home,
  Car,
  ClipboardList,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Info,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

const sections = [
  { id: "overview", title: "Обзор", icon: BookOpen },
  { id: "registration", title: "Регистрация", icon: UserPlus },
  { id: "verification", title: "Подтверждение", icon: FileCheck },
  { id: "apartments", title: "Квартиры", icon: Home },
  { id: "parking", title: "Паркинг", icon: Car },
  { id: "moderation", title: "Модерация", icon: ClipboardList },
];

export function GuideContent() {
  const [activeSection, setActiveSection] = useState("overview");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-20% 0px -70% 0px" }
    );

    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="py-6">
      <div className="flex gap-8">
        {/* Main content */}
        <article className="min-w-0 max-w-prose flex-1">
          <header className="mb-8">
            <h1 className="text-2xl font-bold tracking-tight">
              Как пользоваться сервисом
            </h1>
            <p className="mt-1 text-muted-foreground">
              Пошаговое руководство для жителей ЖК «Сердце Ростова 2»
            </p>
          </header>

          {/* Overview */}
          <section id="overview" className="mb-10 scroll-mt-6">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
              <BookOpen className="h-5 w-5 shrink-0 text-primary" />
              Обзор сервиса
            </h2>
            <div className="space-y-4 leading-relaxed text-muted-foreground">
              <p>
                Наш сервис — это информационная платформа для жителей ЖК,
                которая объединяет несколько ключевых функций:
              </p>
              <ul className="space-y-2 list-none">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                  <span>
                    <span className="font-medium text-foreground">Справочник</span> —
                    контакты служб, организаций и полезная информация о ЖК
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                  <span>
                    <span className="font-medium text-foreground">Объявления</span> —
                    аренда и продажа квартир, машиномест в паркинге
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                  <span>
                    <span className="font-medium text-foreground">Новости</span> —
                    важные события, объявления и обновления комплекса
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                  <span>
                    <span className="font-medium text-foreground">Обратная связь</span> —
                    жалобы, пожелания и заявки
                  </span>
                </li>
              </ul>

              <div className="rounded-lg border bg-blue-50 dark:bg-blue-950/30 p-4 flex gap-3">
                <Info className="h-5 w-5 shrink-0 text-blue-600 mt-0.5" />
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  Для просмотра справочника и новостей регистрация не требуется.
                  Для подачи объявлений необходима регистрация и подтверждение
                  права собственности.
                </p>
              </div>
            </div>
          </section>

          {/* Registration */}
          <section id="registration" className="mb-10 scroll-mt-6">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
              <UserPlus className="h-5 w-5 shrink-0 text-primary" />
              Регистрация в сервисе
            </h2>
            <div className="space-y-4 leading-relaxed text-muted-foreground">
              <p>
                Регистрация открыта для всех жителей комплекса. Вы можете
                зарегистрироваться двумя способами:
              </p>

              <div className="space-y-3">
                <div className="rounded-lg border p-4">
                  <p className="font-medium text-foreground mb-2">
                    Быстрая регистрация
                  </p>
                  <p className="text-sm">
                    Войдите одним нажатием через Яндекс ID, VK ID или Google.
                    Нажмите «Войти» и выберите удобный вариант.
                  </p>
                </div>

                <div className="rounded-lg border p-4">
                  <p className="font-medium text-foreground mb-2">
                    Email и пароль
                  </p>
                  <p className="text-sm">
                    Классическая регистрация с подтверждением email. Потребуется
                    ввести код из письма.
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <Button asChild>
                  <Link href="/register">
                    <UserPlus className="mr-2 h-4 w-4" />
                    Зарегистрироваться
                  </Link>
                </Button>
              </div>
            </div>
          </section>

          {/* Verification */}
          <section id="verification" className="mb-10 scroll-mt-6">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
              <FileCheck className="h-5 w-5 shrink-0 text-primary" />
              Подтверждение собственности
            </h2>
            <div className="space-y-4 leading-relaxed text-muted-foreground">
              <p>
                Для подачи объявлений о продаже или аренде недвижимости
                необходимо подтвердить право собственности. Это защищает
                жителей от мошенников и обеспечивает достоверность информации.
              </p>

              <div className="rounded-lg border bg-amber-50 dark:bg-amber-950/30 p-4 flex gap-3">
                <AlertCircle className="h-5 w-5 shrink-0 text-amber-600 mt-0.5" />
                <p className="text-sm text-amber-800 dark:text-amber-200">
                  Без подтверждения собственности вы не сможете создавать
                  объявления о продаже или аренде.
                </p>
              </div>

              <h3 className="font-medium text-foreground pt-2">
                Как подтвердить собственность:
              </h3>

              <div className="space-y-4">
                {/* Path 1 */}
                <div className="rounded-lg border-2 border-primary/20 bg-primary/5 p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                      1
                    </span>
                    <p className="font-medium text-foreground">
                      Через заявку с документами
                    </p>
                  </div>
                  <ol className="space-y-2 text-sm list-decimal list-inside">
                    <li>Перейдите в раздел «Моя недвижимость»</li>
                    <li>Нажмите «Добавить объект»</li>
                    <li>Выберите тип (квартира или машиноместо)</li>
                    <li>Укажите адрес и номер</li>
                    <li>
                      Прикрепите фото документа:{" "}
                      <span className="text-muted-foreground">
                        выписка ЕГРН, свидетельство о собственности или договор
                      </span>
                    </li>
                    <li>Отправьте заявку на проверку</li>
                  </ol>
                  <p className="mt-3 text-xs text-muted-foreground">
                    Срок рассмотрения: обычно в течение 24 часов
                  </p>
                </div>

                {/* Path 2 */}
                <div className="rounded-lg border p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-xs font-bold">
                      2
                    </span>
                    <p className="font-medium text-foreground">
                      Личное подтверждение администратором
                    </p>
                  </div>
                  <p className="text-sm">
                    Если вы знакомы с администраторами сообщества лично, они
                    могут подтвердить вашу собственность без загрузки документов.
                    Для этого свяжитесь с администратором в чате.
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <Button variant="outline" asChild>
                  <Link href="/my/property/add">
                    <FileCheck className="mr-2 h-4 w-4" />
                    Добавить недвижимость
                  </Link>
                </Button>
              </div>
            </div>
          </section>

          {/* Apartments */}
          <section id="apartments" className="mb-10 scroll-mt-6">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
              <Home className="h-5 w-5 shrink-0 text-primary" />
              Объявления о квартирах
            </h2>
            <div className="space-y-4 leading-relaxed text-muted-foreground">
              <p>
                После подтверждения собственности вы можете размещать объявления
                о продаже или сдаче в аренду вашей квартиры.
              </p>

              <h3 className="font-medium text-foreground">Типы объявлений:</h3>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-lg border p-3">
                  <p className="font-medium text-foreground text-sm">
                    Продажа квартиры
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Для собственников, желающих продать недвижимость
                  </p>
                </div>
                <div className="rounded-lg border p-3">
                  <p className="font-medium text-foreground text-sm">
                    Аренда квартиры
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Долгосрочная или краткосрочная аренда
                  </p>
                </div>
              </div>

              <h3 className="font-medium text-foreground pt-2">
                Процесс подачи объявления:
              </h3>
              <ol className="space-y-2 text-sm list-decimal list-inside">
                <li>Убедитесь, что квартира добавлена и подтверждена</li>
                <li>Перейдите в «Мои объявления» → «Создать объявление»</li>
                <li>Выберите квартиру из списка вашей недвижимости</li>
                <li>Укажите тип объявления (продажа/аренда)</li>
                <li>Заполните описание и загрузите фотографии</li>
                <li>Укажите цену и условия</li>
                <li>Отправьте на модерацию</li>
              </ol>

              <div className="pt-2">
                <Button asChild>
                  <Link href="/listings/realty">
                    <Home className="mr-2 h-4 w-4" />
                    Смотреть объявления
                  </Link>
                </Button>
              </div>
            </div>
          </section>

          {/* Parking */}
          <section id="parking" className="mb-10 scroll-mt-6">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
              <Car className="h-5 w-5 shrink-0 text-primary" />
              Объявления о паркинге
            </h2>
            <div className="space-y-4 leading-relaxed text-muted-foreground">
              <p>
                Машиноместа в подземном паркинге также можно продать или сдать
                в аренду через наш сервис. Процесс аналогичен квартирам.
              </p>

              <h3 className="font-medium text-foreground">Типы объявлений:</h3>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-lg border p-3">
                  <p className="font-medium text-foreground text-sm">
                    Продажа машиноместа
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Продажа права собственности на место в паркинге
                  </p>
                </div>
                <div className="rounded-lg border p-3">
                  <p className="font-medium text-foreground text-sm">
                    Аренда машиноместа
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Помесячная аренда места в паркинге
                  </p>
                </div>
              </div>

              <h3 className="font-medium text-foreground pt-2">
                Особенности паркинга:
              </h3>
              <ul className="space-y-2 text-sm list-disc list-inside">
                <li>Укажите уровень паркинга и номер места</li>
                <li>Отметьте, есть ли рядом колонна или препятствия</li>
                <li>Добавьте фото места для наглядности</li>
                <li>Укажите размеры места, если нестандартные</li>
              </ul>

              <div className="pt-2">
                <Button asChild>
                  <Link href="/listings/parking">
                    <Car className="mr-2 h-4 w-4" />
                    Смотреть паркинг
                  </Link>
                </Button>
              </div>
            </div>
          </section>

          {/* Moderation */}
          <section id="moderation" className="scroll-mt-6">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
              <ClipboardList className="h-5 w-5 shrink-0 text-primary" />
              Модерация и сроки
            </h2>
            <div className="space-y-4 leading-relaxed text-muted-foreground">
              <p>
                Все заявки и объявления проходят модерацию для обеспечения
                качества и безопасности информации.
              </p>

              <div className="space-y-3">
                <div className="flex items-start gap-3 rounded-lg border p-3">
                  <ShieldCheck className="h-5 w-5 shrink-0 text-green-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-foreground text-sm">
                      Заявки на подтверждение собственности
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Обычно рассматриваются в течение 24 часов
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-lg border p-3">
                  <ShieldCheck className="h-5 w-5 shrink-0 text-green-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-foreground text-sm">
                      Объявления о недвижимости
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Проверяются и публикуются в течение нескольких часов
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-lg border p-3">
                  <ShieldCheck className="h-5 w-5 shrink-0 text-green-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-foreground text-sm">
                      Обращения и жалобы
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Рассматриваются в порядке поступления
                    </p>
                  </div>
                </div>
              </div>

              <p className="text-sm">
                Статус всех ваших заявок можно отслеживать в личном кабинете.
                При отклонении заявки вы получите уведомление с указанием причины.
              </p>

              <div className="pt-2 flex gap-3 flex-wrap">
                <Button variant="outline" asChild>
                  <Link href="/my">
                    Личный кабинет
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/feedback">
                    Обратная связь
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </section>
        </article>

        {/* Right navigation */}
        <aside className="hidden w-48 shrink-0 md:block">
          <nav className="sticky top-6">
            <p className="mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              На странице
            </p>
            <ul className="space-y-1">
              {sections.map(({ id, title }) => (
                <li key={id}>
                  <button
                    onClick={() => scrollToSection(id)}
                    className={cn(
                      "w-full rounded-md px-3 py-1.5 text-left text-sm transition-colors",
                      activeSection === id
                        ? "bg-primary/10 font-medium text-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    {title}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </aside>
      </div>
    </div>
  );
}
