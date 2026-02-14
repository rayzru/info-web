"use client";

import { Database, Eye, Lock, Mail, Shield, Trash2, UserCheck } from "lucide-react";
import Link from "next/link";

import { ArticleWithNav } from "~/components/article-with-nav";

const sections = [
  { id: "intro", title: "Введение" },
  { id: "collect", title: "Какие данные собираем" },
  { id: "documents", title: "Подтверждающие документы" },
  { id: "use", title: "Как используем" },
  { id: "sharing", title: "Передача третьим лицам" },
  { id: "rights", title: "Права пользователя" },
  { id: "deletion", title: "Удаление данных" },
  { id: "legal", title: "Правовые основания" },
  { id: "contact", title: "Обратная связь" },
];

export default function PrivacyPage() {
  return (
    <ArticleWithNav
      title="Политика конфиденциальности"
      description="Политика обработки персональных данных сервиса SR2.ru"
      sections={sections}
    >
      {/* Intro */}
      <section id="intro" className="mb-8 scroll-mt-6">
        <div className="bg-muted/50 rounded-lg border p-4">
          <p className="text-muted-foreground text-sm">
            Настоящая Политика конфиденциальности описывает, как информационный сервис SR2.ru (далее
            — «Сервис») собирает, использует и защищает персональные данные пользователей. Мы
            серьёзно относимся к защите вашей конфиденциальности и не передаём персональные данные
            третьим лицам.
          </p>
        </div>
      </section>

      {/* What we collect */}
      <section id="collect" className="mb-8 scroll-mt-6">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
          <Database className="text-primary h-5 w-5" />
          Какие данные мы собираем
        </h2>
        <div className="text-muted-foreground space-y-3 text-sm leading-relaxed">
          <p>1.1. При регистрации через Яндекс ID мы получаем:</p>
          <ul className="ml-4 list-inside list-disc space-y-1">
            <li>Имя пользователя</li>
            <li>Адрес электронной почты</li>
            <li>Аватар профиля (если доступен)</li>
          </ul>
          <p>1.2. Дополнительно пользователь может добровольно добавить:</p>
          <ul className="ml-4 list-inside list-disc space-y-1">
            <li>Отображаемое имя</li>
            <li>Номер телефона</li>
            <li>Дату рождения</li>
            <li>Пол</li>
            <li>Информацию о недвижимости (номер квартиры, парковочного места)</li>
          </ul>
          <p>
            1.3. При подаче заявки на подтверждение прав на недвижимость пользователь может{" "}
            <strong>добровольно</strong> загрузить подтверждающие документы:
          </p>
          <ul className="ml-4 list-inside list-disc space-y-1">
            <li>Выписку из ЕГРН</li>
            <li>Договор купли-продажи или аренды</li>
            <li>Копию паспорта или иного документа, удостоверяющего личность</li>
            <li>Другие подтверждающие документы</li>
          </ul>
          <p>1.4. Автоматически собираются технические данные:</p>
          <ul className="ml-4 list-inside list-disc space-y-1">
            <li>IP-адрес</li>
            <li>Тип браузера и устройства</li>
            <li>Время и дата посещений</li>
          </ul>
        </div>
      </section>

      {/* Documents */}
      <section id="documents" className="mb-8 scroll-mt-6">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
          <Lock className="text-primary h-5 w-5" />
          Подтверждающие документы
        </h2>
        <div className="text-muted-foreground space-y-3 text-sm leading-relaxed">
          <p>
            2.1. Загрузка подтверждающих документов при подаче заявки на недвижимость является{" "}
            <strong>полностью добровольной</strong>.
          </p>
          <p>2.2. Цели обработки загруженных документов:</p>
          <ul className="ml-4 list-inside list-disc space-y-1">
            <li>Проверка права собственности или аренды на недвижимость</li>
            <li>Ускорение рассмотрения заявки администратором</li>
            <li>Защита от мошенничества и неправомерного доступа</li>
          </ul>
          <p>2.3. Обработка документов:</p>
          <ul className="ml-4 list-inside list-disc space-y-1">
            <li>Документы хранятся только на время рассмотрения заявки</li>
            <li>
              После одобрения или отклонения заявки все загруженные файлы автоматически удаляются
            </li>
            <li>Мы не занимаемся накоплением персональных данных из документов</li>
            <li>Документы не передаются третьим лицам</li>
            <li>Доступ к документам имеют только администраторы Сервиса для целей верификации</li>
          </ul>
          <p>2.4. Безопасность хранения:</p>
          <ul className="ml-4 list-inside list-disc space-y-1">
            <li>Документы хранятся на защищённых серверах с шифрованием</li>
            <li>Используется современная инфраструктура S3-совместимого хранилища</li>
            <li>Система соответствует требованиям защиты персональных данных</li>
          </ul>
        </div>
      </section>

      {/* How we use */}
      <section id="use" className="mb-8 scroll-mt-6">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
          <Eye className="text-primary h-5 w-5" />
          Как мы используем данные
        </h2>
        <div className="text-muted-foreground space-y-3 text-sm leading-relaxed">
          <p>3.1. Персональные данные используются исключительно для:</p>
          <ul className="ml-4 list-inside list-disc space-y-1">
            <li>Идентификации пользователя в Сервисе</li>
            <li>Предоставления доступа к функциям Сервиса</li>
            <li>Связи с пользователем по техническим вопросам</li>
            <li>Улучшения работы Сервиса</li>
            <li>
              Добровольного обмена контактной информацией между соседями жилого комплекса (при явном
              согласии пользователя)
            </li>
          </ul>
          <p>3.2. Мы НЕ используем данные для:</p>
          <ul className="ml-4 list-inside list-disc space-y-1">
            <li>Рекламных рассылок</li>
            <li>Продажи или передачи третьим лицам</li>
            <li>Профилирования для рекламных целей</li>
          </ul>
        </div>
      </section>

      {/* No sharing */}
      <section id="sharing" className="mb-8 scroll-mt-6">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
          <Lock className="text-primary h-5 w-5" />
          Передача данных третьим лицам
        </h2>
        <div className="text-muted-foreground space-y-3 text-sm leading-relaxed">
          <p className="text-foreground font-medium">
            Мы не передаём персональные данные пользователей третьим лицам.
          </p>
          <p>3.1. Исключения составляют случаи:</p>
          <ul className="ml-4 list-inside list-disc space-y-1">
            <li>
              Когда это требуется по запросу уполномоченных государственных органов в соответствии с
              законодательством РФ
            </li>
            <li>
              Когда пользователь <strong>добровольно</strong> публикует свою контактную информацию
              для обмена с другими жильцами жилого комплекса (Сервис создан для соседского общения)
            </li>
          </ul>
          <p>
            3.2. Данные хранятся на защищённых серверах и не передаются за пределы Российской
            Федерации.
          </p>
        </div>
      </section>

      {/* User rights */}
      <section id="rights" className="mb-8 scroll-mt-6">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
          <UserCheck className="text-primary h-5 w-5" />
          Права пользователя
        </h2>
        <div className="text-muted-foreground space-y-3 text-sm leading-relaxed">
          <p>4.1. Пользователь имеет право:</p>
          <ul className="ml-4 list-inside list-disc space-y-1">
            <li>Получить информацию о своих персональных данных</li>
            <li>Изменить или дополнить свои данные</li>
            <li>Ограничить видимость данных для других пользователей</li>
            <li>Потребовать удаления всех своих персональных данных</li>
          </ul>
          <p>
            4.2. Настройки приватности доступны в{" "}
            <Link href="/my/profile" className="text-primary hover:underline">
              личном кабинете
            </Link>
            . Вы можете скрыть отдельные данные (имя, телефон, пол, дату рождения) от других
            пользователей.
          </p>
        </div>
      </section>

      {/* Deletion */}
      <section id="deletion" className="mb-8 scroll-mt-6">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
          <Trash2 className="text-primary h-5 w-5" />
          Удаление данных
        </h2>
        <div className="text-muted-foreground space-y-3 text-sm leading-relaxed">
          <p>5.1. Вы можете удалить свой аккаунт и все персональные данные в любой момент.</p>
          <p>
            5.2. Для этого перейдите в{" "}
            <Link href="/my/profile" className="text-primary hover:underline">
              настройки профиля
            </Link>{" "}
            и подайте заявку на удаление аккаунта.
          </p>
          <p>5.3. После подтверждения заявки будут удалены:</p>
          <ul className="ml-4 list-inside list-disc space-y-1">
            <li>Профиль и все персональные данные</li>
            <li>Связь аккаунта с объектами недвижимости</li>
            <li>История сессий и авторизаций</li>
          </ul>
          <p>5.4. Удаление происходит в течение 30 дней с момента подтверждения заявки.</p>
        </div>
      </section>

      {/* Legal basis */}
      <section id="legal" className="mb-8 scroll-mt-6">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
          <Shield className="text-primary h-5 w-5" />
          Правовые основания
        </h2>
        <div className="text-muted-foreground space-y-3 text-sm leading-relaxed">
          <p>6.1. Обработка персональных данных осуществляется в соответствии с:</p>
          <ul className="ml-4 list-inside list-disc space-y-1">
            <li>Федеральным законом от 27.07.2006 № 152-ФЗ «О персональных данных»</li>
            <li>
              Федеральным законом от 27.07.2006 № 149-ФЗ «Об информации, информационных технологиях
              и о защите информации»
            </li>
            <li>
              Постановлением Правительства РФ от 01.11.2012 № 1119 «Об утверждении требований к
              защите персональных данных»
            </li>
          </ul>
          <p>
            6.2. Согласие на обработку персональных данных даётся пользователем при регистрации в
            Сервисе.
          </p>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="scroll-mt-6">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
          <Mail className="text-primary h-5 w-5" />
          Обратная связь
        </h2>
        <div className="text-muted-foreground space-y-3 text-sm leading-relaxed">
          <p>
            По вопросам обработки персональных данных вы можете связаться с администрацией Сервиса
            через чаты сообщества.
          </p>
          <p className="text-muted-foreground mt-6 text-xs">
            Дата последнего обновления: декабрь 2025
          </p>
        </div>
      </section>
    </ArticleWithNav>
  );
}
