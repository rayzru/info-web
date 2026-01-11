"use client";

import { Calendar, Heart, MessageCircle, Target, Users } from "lucide-react";
import { useEffect, useState } from "react";

import { cn } from "~/lib/utils";

const sections = [
  { id: "goal", title: "Наша цель", icon: Target },
  { id: "what-we-do", title: "Что мы делаем", icon: Heart },
  { id: "history", title: "История", icon: Calendar },
  { id: "who-we-are", title: "Кто мы", icon: Users },
  { id: "feedback", title: "Обратная связь", icon: MessageCircle },
];

export function AboutContent() {
  const [activeSection, setActiveSection] = useState("goal");

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
            <h1 className="text-2xl font-bold tracking-tight">О проекте</h1>
            <p className="mt-1 text-muted-foreground">
              Информационная платформа жителей ЖК «Сердце Ростова 2»
            </p>
          </header>

          {/* Mission */}
          <section id="goal" className="mb-8 scroll-mt-6">
            <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold">
              <Target className="h-5 w-5 shrink-0 text-primary" />
              Наша цель
            </h2>
            <p className="leading-relaxed text-muted-foreground">
              Создать открытую платформу, где каждый житель может быть в курсе
              происходящего, найти нужную информацию и получить поддержку соседей.
              Своевременное информирование и совместное участие делают место нашего
              обитания комфортным и предсказуемым.
            </p>
          </section>

          {/* What we do */}
          <section id="what-we-do" className="mb-8 scroll-mt-6">
            <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold">
              <Heart className="h-5 w-5 shrink-0 text-primary" />
              Что мы делаем
            </h2>
            <ul className="list-inside list-disc space-y-2 text-muted-foreground marker:text-primary">
              <li>
                Собираем и систематизируем справочную информацию: контакты служб,
                управляющих компаний, полезные сервисы
              </li>
              <li>
                Объединяем соседей в тематических чатах для обмена опытом и
                взаимопомощи
              </li>
              <li>
                Информируем о важных событиях, происшествиях и новостях комплекса
              </li>
              <li>
                Даём возможность каждому собственнику участвовать в жизни ЖК
              </li>
            </ul>
          </section>

          {/* History */}
          <section id="history" className="mb-8 scroll-mt-6">
            <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold">
              <Calendar className="h-5 w-5 shrink-0 text-primary" />
              История
            </h2>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex gap-3">
                <span className="w-12 shrink-0 font-medium text-foreground">
                  2019
                </span>
                <span>Открыт основной чат в Telegram и группа WhatsApp</span>
              </div>
              <div className="flex gap-3">
                <span className="w-12 shrink-0 font-medium text-foreground">
                  2020
                </span>
                <span>Созданы отдельные чаты для каждого строения</span>
              </div>
              <div className="flex gap-3">
                <span className="w-12 shrink-0 font-medium text-foreground">
                  2021
                </span>
                <span>Запущен информационный сайт sr2.today</span>
              </div>
              <div className="flex gap-3">
                <span className="w-12 shrink-0 font-medium text-foreground">
                  2022
                </span>
                <span>Активизирована группа ВКонтакте для объявлений</span>
              </div>
              <div className="flex gap-3">
                <span className="w-12 shrink-0 font-medium text-foreground">
                  2024
                </span>
                <span>Реорганизация чатов, запуск справочника SR2.ru</span>
              </div>
              <div className="flex gap-3">
                <span className="w-12 shrink-0 font-medium text-foreground">
                  2025
                </span>
                <span>Запущен умный чат-бот для поддержания порядка</span>
              </div>
              <div className="flex gap-3">
                <span className="w-12 shrink-0 font-medium text-foreground">
                  2026
                </span>
                <span>Запуск единой информационной платформы с ИИ-ассистентом</span>
              </div>
            </div>
          </section>

          {/* Community */}
          <section id="who-we-are" className="mb-8 scroll-mt-6">
            <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold">
              <Users className="h-5 w-5 shrink-0 text-primary" />
              Кто мы
            </h2>
            <div className="space-y-4 leading-relaxed text-muted-foreground">
              <p>
                Проект развивается силами инициативных жильцов на добровольной основе.
                Мы не коммерческая организация — всё делается соседями для соседей.
              </p>
              <p>
                Информационную поддержку ведут <span className="font-medium text-foreground">модераторы и редакторы</span> нашего
                сообщества, а порядок в чатах поддерживают <span className="font-medium text-foreground">администраторы</span>.
                Эти люди — настоящее золото, благодаря которому наш общий дом остаётся
                уютным и организованным местом.
              </p>
              <p>
                Мы всегда открыты к диалогу и обсуждаем все нововведения вместе.
                С удовольствием примем любого собственника или инициативного соседа
                в ряды тех, кто помогает развивать и улучшать наше сообщество.
              </p>
            </div>
          </section>

          {/* Feedback */}
          <section id="feedback" className="scroll-mt-6">
            <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold">
              <MessageCircle className="h-5 w-5 shrink-0 text-primary" />
              Обратная связь
            </h2>
            <p className="leading-relaxed text-muted-foreground">
              Предложения и пожелания можно оставить в чатах сообщества или написать
              напрямую администраторам. Мы открыты к диалогу и всегда рады новым
              идеям.
            </p>
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
