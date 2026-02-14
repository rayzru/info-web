"use client";

import { FileText, Scale, Shield, Trash2, UserCheck } from "lucide-react";
import Link from "next/link";

import { ArticleWithNav } from "~/components/article-with-nav";

const sections = [
  { id: "intro", title: "Введение" },
  { id: "general", title: "Общие положения" },
  { id: "registration", title: "Регистрация" },
  { id: "legal", title: "Правовые основания" },
  { id: "liability", title: "Ответственность" },
  { id: "deletion", title: "Удаление аккаунта" },
  { id: "changes", title: "Изменения" },
];

export default function TermsPage() {
  return (
    <ArticleWithNav
      title="Пользовательское соглашение"
      description="Правила использования информационного сервиса SR2.ru"
      sections={sections}
    >
      {/* Intro */}
      <section id="intro" className="mb-8 scroll-mt-6">
        <div className="bg-muted/50 rounded-lg border p-4">
          <p className="text-muted-foreground text-sm">
            Настоящее Пользовательское соглашение (далее — «Соглашение») регулирует отношения между
            информационным сервисом SR2.ru (далее — «Сервис») и пользователями Сервиса. Регистрация
            в Сервисе означает полное и безоговорочное принятие условий настоящего Соглашения.
          </p>
        </div>
      </section>

      {/* General */}
      <section id="general" className="mb-8 scroll-mt-6">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
          <FileText className="text-primary h-5 w-5" />
          Общие положения
        </h2>
        <div className="text-muted-foreground space-y-3 text-sm leading-relaxed">
          <p>
            1.1. Сервис SR2.ru является некоммерческим информационным проектом, созданным и
            поддерживаемым инициативными жильцами жилого комплекса «Сердце Ростова 2» для удобства
            соседей.
          </p>
          <p>
            1.2. Сервис предоставляет справочную информацию о жилом комплексе, управляющих
            компаниях, контактах служб и полезных сервисах.
          </p>
          <p>
            1.3. Использование Сервиса является бесплатным. Любые пожертвования направляются
            исключительно на развитие и поддержку Сервиса.
          </p>
          <p>
            1.4. Сервис не является официальным представителем застройщика, управляющих компаний или
            государственных органов.
          </p>
        </div>
      </section>

      {/* Registration */}
      <section id="registration" className="mb-8 scroll-mt-6">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
          <UserCheck className="text-primary h-5 w-5" />
          Регистрация и использование
        </h2>
        <div className="text-muted-foreground space-y-3 text-sm leading-relaxed">
          <p>
            2.1. Регистрация в Сервисе осуществляется через авторизацию с использованием учётной
            записи Яндекс.
          </p>
          <p>2.2. Регистрируясь в Сервисе, пользователь подтверждает, что:</p>
          <ul className="ml-4 list-inside list-disc space-y-1">
            <li>Ознакомился и согласен с настоящим Соглашением</li>
            <li>
              Ознакомился и согласен с{" "}
              <Link href="/privacy" className="text-primary hover:underline">
                Политикой конфиденциальности
              </Link>
            </li>
            <li>Является дееспособным лицом</li>
            <li>Предоставляет достоверную информацию о себе</li>
          </ul>
          <p>
            2.3. Пользователь обязуется не использовать Сервис для противоправных целей, не нарушать
            права других пользователей и соблюдать{" "}
            <Link href="/community/rules" className="text-primary hover:underline">
              Правила сообщества
            </Link>
            .
          </p>
        </div>
      </section>

      {/* Legal basis */}
      <section id="legal" className="mb-8 scroll-mt-6">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
          <Scale className="text-primary h-5 w-5" />
          Правовые основания
        </h2>
        <div className="text-muted-foreground space-y-3 text-sm leading-relaxed">
          <p>
            3.1. Деятельность Сервиса осуществляется в соответствии с законодательством Российской
            Федерации, в том числе:
          </p>
          <ul className="ml-4 list-inside list-disc space-y-1">
            <li>
              Федеральный закон от 27.07.2006 № 149-ФЗ «Об информации, информационных технологиях и
              о защите информации»
            </li>
            <li>Федеральный закон от 27.07.2006 № 152-ФЗ «О персональных данных»</li>
            <li>Гражданский кодекс Российской Федерации</li>
          </ul>
          <p>
            3.2. Любые споры, возникающие из использования Сервиса, разрешаются в соответствии с
            действующим законодательством РФ.
          </p>
        </div>
      </section>

      {/* Liability */}
      <section id="liability" className="mb-8 scroll-mt-6">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
          <Shield className="text-primary h-5 w-5" />
          Ограничение ответственности
        </h2>
        <div className="text-muted-foreground space-y-3 text-sm leading-relaxed">
          <p>
            4.1. Сервис предоставляется «как есть». Администрация не гарантирует, что Сервис будет
            соответствовать ожиданиям пользователя или работать без перерывов и ошибок.
          </p>
          <p>
            4.2. Информация, размещённая в Сервисе, носит справочный характер. Администрация не
            несёт ответственности за точность, полноту и актуальность информации.
          </p>
          <p>
            4.3. Администрация не несёт ответственности за действия третьих лиц и за любой ущерб,
            причинённый пользователю в результате использования Сервиса.
          </p>
        </div>
      </section>

      {/* Account deletion */}
      <section id="deletion" className="mb-8 scroll-mt-6">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
          <Trash2 className="text-primary h-5 w-5" />
          Удаление аккаунта
        </h2>
        <div className="text-muted-foreground space-y-3 text-sm leading-relaxed">
          <p>
            5.1. Пользователь имеет право в любой момент удалить свой аккаунт и все связанные с ним
            персональные данные.
          </p>
          <p>
            5.2. Для удаления аккаунта необходимо подать заявку через специальную форму в{" "}
            <Link href="/my/profile" className="text-primary hover:underline">
              настройках профиля
            </Link>
            .
          </p>
          <p>
            5.3. После подтверждения заявки все персональные данные пользователя будут безвозвратно
            удалены из Сервиса в течение 30 дней.
          </p>
          <p>
            5.4. Администрация оставляет за собой право сохранять обезличенные данные для
            статистических целей.
          </p>
        </div>
      </section>

      {/* Changes */}
      <section id="changes" className="scroll-mt-6">
        <h2 className="mb-4 text-lg font-semibold">Изменения Соглашения</h2>
        <div className="text-muted-foreground space-y-3 text-sm leading-relaxed">
          <p>
            6.1. Администрация вправе в одностороннем порядке изменять условия настоящего
            Соглашения.
          </p>
          <p>
            6.2. Продолжение использования Сервиса после внесения изменений означает согласие
            пользователя с новой редакцией Соглашения.
          </p>
          <p className="text-muted-foreground mt-6 text-xs">
            Дата последнего обновления: декабрь 2025
          </p>
        </div>
      </section>
    </ArticleWithNav>
  );
}
