"use client";

import { useEffect, useState } from "react";

import { Edit3, ExternalLink, Eye, Heart, Lightbulb, Shield, Users, Wallet } from "lucide-react";
import Link from "next/link";

import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

const sections = [
  { id: "use", title: "Использование", icon: Heart },
  { id: "suggest", title: "Предложения", icon: Lightbulb },
  { id: "participate", title: "Участие", icon: Users },
  { id: "support", title: "Поддержка", icon: Wallet },
];

export function ContributeContent() {
  const [activeSection, setActiveSection] = useState("use");

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
            <h1 className="text-2xl font-bold tracking-tight">Как помочь проекту</h1>
            <p className="text-muted-foreground mt-1">
              Каждый может внести свой вклад в развитие сообщества
            </p>
          </header>

          {/* Use the service */}
          <section id="use" className="mb-8 scroll-mt-6">
            <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold">
              <Heart className="text-primary h-5 w-5 shrink-0" />
              Используйте сервис по назначению
            </h2>
            <div className="text-muted-foreground space-y-4 leading-relaxed">
              <p>
                <span className="text-foreground font-medium">
                  Самая большая помощь проекту — это его целевое использование.
                </span>{" "}
                Наш сервис создан для соседей и ради соседей, чтобы упростить самые обыденные вещи —
                поиск нужной информации о ЖК.
              </p>
              <p>
                Когда вы ищете контакт управляющей компании, номер телефона консьержа или расписание
                работы пункта выдачи — используйте наш справочник. Это и есть главная помощь
                проекту.
              </p>
              <p>
                Рассказывайте о сервисе соседям, делитесь ссылками в чатах. Чем больше людей знают о
                платформе, тем полезнее она становится для всех.
              </p>
            </div>
          </section>

          {/* Suggest improvements */}
          <section id="suggest" className="mb-8 scroll-mt-6">
            <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold">
              <Lightbulb className="text-primary h-5 w-5 shrink-0" />
              Предлагайте улучшения
            </h2>
            <div className="text-muted-foreground space-y-4 leading-relaxed">
              <p>
                Мы постоянно работаем над улучшением сервиса и всегда рады услышать ваши идеи. Если
                вам не хватает какой-то информации, функции или вы заметили ошибку — обязательно
                сообщите нам.
              </p>
              <p>
                Каждое предложение рассматривается командой, и многие идеи жителей уже реализованы в
                нашем сервисе. Ваш взгляд со стороны помогает сделать платформу удобнее для всех.
              </p>
              <div className="pt-2">
                <Button asChild>
                  <Link href="/feedback?type=suggestion">
                    <Lightbulb className="mr-2 h-4 w-4" />
                    Предложить улучшение
                  </Link>
                </Button>
              </div>
            </div>
          </section>

          {/* Participate */}
          <section id="participate" className="mb-8 scroll-mt-6">
            <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold">
              <Users className="text-primary h-5 w-5 shrink-0" />
              Станьте частью команды
            </h2>
            <div className="text-muted-foreground space-y-4 leading-relaxed">
              <p>
                У нас существует система ролей для тех, кто хочет принимать активное участие в
                развитии проекта. Каждая роль важна и вносит свой вклад в общее дело.
              </p>

              {/* Roles */}
              <div className="bg-muted/30 space-y-4 rounded-lg border p-4">
                <div className="flex gap-3">
                  <Shield className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />
                  <div>
                    <p className="text-foreground font-medium">Администраторы</p>
                    <p className="text-sm">
                      Управляют платформой, настраивают систему, следят за порядком в чатах и
                      обрабатывают обращения жителей. Принимают решения о развитии проекта.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Eye className="mt-0.5 h-5 w-5 shrink-0 text-blue-500" />
                  <div>
                    <p className="text-foreground font-medium">Модераторы</p>
                    <p className="text-sm">
                      Проверяют и публикуют контент, следят за актуальностью информации, отвечают на
                      вопросы жителей. Помогают поддерживать качество материалов.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Edit3 className="mt-0.5 h-5 w-5 shrink-0 text-green-500" />
                  <div>
                    <p className="text-foreground font-medium">Редакторы</p>
                    <p className="text-sm">
                      Добавляют и обновляют информацию в справочнике: контакты, организации,
                      полезные сведения. Помогают держать данные в актуальном состоянии.
                    </p>
                  </div>
                </div>
              </div>

              <p>
                Если вы хотите присоединиться к команде — напишите нам через форму обратной связи
                или свяжитесь с администраторами в чатах сообщества. Мы всегда рады инициативным
                соседям!
              </p>

              <div className="pt-2">
                <Button variant="outline" asChild>
                  <Link href="/feedback?type=request&title=Хочу помогать проекту">
                    <Users className="mr-2 h-4 w-4" />
                    Хочу участвовать
                  </Link>
                </Button>
              </div>
            </div>
          </section>

          {/* Financial support */}
          <section id="support" className="scroll-mt-6">
            <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold">
              <Wallet className="text-primary h-5 w-5 shrink-0" />
              Финансовая поддержка
            </h2>
            <div className="text-muted-foreground space-y-4 leading-relaxed">
              <p>
                Наш проект развивается на добровольных началах, но для работы сервиса требуются
                определённые ресурсы: серверы, домен, хранилище данных и другие технические
                мощности.
              </p>
              <p>
                Если вы хотите поддержать проект финансово — будем очень благодарны. Любая сумма
                помогает нам продолжать работу и развивать сервис для всех жителей комплекса.
              </p>
              <div className="pt-2">
                <Button asChild>
                  <a
                    href="https://www.tinkoff.ru/rm/rumm.andrey1/iLjWk37710/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Wallet className="mr-2 h-4 w-4" />
                    Поддержать проект
                    <ExternalLink className="ml-2 h-3 w-3" />
                  </a>
                </Button>
              </div>
            </div>
          </section>
        </article>

        {/* Right navigation */}
        <aside className="hidden w-48 shrink-0 md:block">
          <nav className="sticky top-6">
            <p className="text-muted-foreground mb-3 text-xs font-medium uppercase tracking-wide">
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
                        ? "bg-primary/10 text-primary font-medium"
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
