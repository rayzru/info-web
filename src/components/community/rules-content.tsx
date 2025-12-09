"use client";

import {
  AlertTriangle,
  Ban,
  CheckCircle2,
  Heart,
  Link2Off,
  MessageSquare,
  Scale,
  Shield,
  ThumbsUp,
  Volume2,
} from "lucide-react";

import { ArticleWithNav } from "~/components/article-with-nav";

const sections = [
  { id: "intro", title: "Введение" },
  { id: "principles", title: "Основные принципы" },
  { id: "prohibited", title: "Запрещено" },
  { id: "moderation", title: "Модерация" },
];

export function RulesContent() {
  return (
    <ArticleWithNav
      title="Правила сообщества"
      description="Общие правила для всех чатов и ресурсов"
      sections={sections}
    >
      {/* Intro */}
      <section id="intro" className="mb-8 scroll-mt-6">
        <div className="rounded-lg border bg-muted/50 p-4">
          <p className="text-sm text-muted-foreground">
            Чаты и ресурсы сообщества ведут активные жильцы — ваши соседи — на
            добровольных началах. Цель — объединение для улучшения качества жизни в
            нашем ЖК.
          </p>
        </div>
      </section>

      {/* Main principles */}
      <section id="principles" className="mb-8 scroll-mt-6">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
          <Heart className="h-5 w-5 text-primary" />
          Основные принципы
        </h2>
        <div className="space-y-3">
          <RuleItem
            icon={<ThumbsUp className="h-5 w-5" />}
            title="Уважение"
            description="Относитесь к соседям с уважением. Это основа здорового сообщества."
          />
          <RuleItem
            icon={<MessageSquare className="h-5 w-5" />}
            title="По теме"
            description="Придерживайтесь темы чата и уважайте время других участников."
          />
          <RuleItem
            icon={<CheckCircle2 className="h-5 w-5" />}
            title="Конструктив"
            description="Делитесь опытом и рекомендациями, основанными на личном опыте."
          />
        </div>
      </section>

      {/* Prohibited */}
      <section id="prohibited" className="mb-8 scroll-mt-6">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
          <Ban className="h-5 w-5 text-destructive" />
          Запрещено
        </h2>
        <div className="space-y-3">
          <RuleItem
            icon={<Volume2 className="h-5 w-5" />}
            title="Реклама и самореклама"
            description="Запрещены сообщения для продвижения товаров, услуг или финансовых интересов. Вместо рекламы — честные рекомендации соседей."
            variant="destructive"
          />
          <RuleItem
            icon={<AlertTriangle className="h-5 w-5" />}
            title="Оскорбления и агрессия"
            description="Любые формы ругани, мата, оскорблений и агрессии (прямой или завуалированной) недопустимы."
            variant="destructive"
          />
          <RuleItem
            icon={<Link2Off className="h-5 w-5" />}
            title="Внешние ссылки"
            description="Только ссылки на официальные государственные сайты, юридические справочники или новости по теме. Ссылки на сторонние чаты запрещены."
            variant="destructive"
          />
          <RuleItem
            icon={<Shield className="h-5 w-5" />}
            title="Запрещённые темы"
            description="Политика, религия, контент 18+ и любые темы, нарушающие законы РФ."
            variant="destructive"
          />
        </div>
      </section>

      {/* Moderation */}
      <section id="moderation" className="scroll-mt-6">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
          <Scale className="h-5 w-5 text-primary" />
          Модерация
        </h2>
        <p className="text-sm text-muted-foreground">
          Администраторы добровольно следят за соблюдением правил. Все спорные
          вопросы обсуждаются открыто — мы за цивилизованное общение и
          конструктивный подход.
        </p>
      </section>
    </ArticleWithNav>
  );
}

function RuleItem({
  icon,
  title,
  description,
  variant = "default",
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  variant?: "default" | "destructive";
}) {
  return (
    <div className="flex gap-3">
      <div
        className={`flex h-5 shrink-0 items-center ${
          variant === "destructive"
            ? "text-destructive"
            : "text-muted-foreground"
        }`}
      >
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium leading-5">{title}</p>
        <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
