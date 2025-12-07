import { notFound } from "next/navigation";
import Link from "next/link";
import {
  Phone,
  Mail,
  MapPin,
  ExternalLink,
  MessageCircle,
  Clock,
  ChevronLeft,
  Building,
} from "lucide-react";

import { api } from "~/trpc/server";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";

type Props = {
  params: Promise<{ slug: string }>;
};

const DAY_NAMES = [
  "Воскресенье",
  "Понедельник",
  "Вторник",
  "Среда",
  "Четверг",
  "Пятница",
  "Суббота",
];

export default async function DirectoryEntryPage({ params }: Props) {
  const { slug } = await params;
  const entry = await api.directory.getEntry({ slug });

  if (!entry) {
    notFound();
  }

  const phoneContacts = entry.contacts.filter((c) => c.type === "phone");
  const emailContacts = entry.contacts.filter((c) => c.type === "email");
  const messengerContacts = entry.contacts.filter((c) =>
    ["telegram", "whatsapp", "vk"].includes(c.type)
  );
  const websiteContacts = entry.contacts.filter((c) => c.type === "website");
  const addressContacts = entry.contacts.filter((c) => c.type === "address");

  return (
    <div className="container py-6">
      {/* Back button */}
      <div className="mb-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/info">
            <ChevronLeft className="mr-1 h-4 w-4" />
            Назад к справочной
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* Main content */}
        <div className="space-y-6">
          {/* Header */}
          <div>
            <div className="flex items-start justify-between gap-4">
              <h1 className="text-2xl font-semibold">{entry.title}</h1>
              <Badge variant="outline">
                {entry.type === "contact" && "Контакт"}
                {entry.type === "organization" && "Организация"}
                {entry.type === "location" && "Локация"}
                {entry.type === "document" && "Документ"}
              </Badge>
            </div>

            {entry.description && (
              <p className="mt-2 text-muted-foreground">{entry.description}</p>
            )}

            {/* Tags */}
            {entry.tags.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {entry.tags.map((tag) => (
                  <Badge key={tag.id} variant="secondary">
                    {tag.name}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <Separator />

          {/* Content */}
          {entry.content && (
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <div dangerouslySetInnerHTML={{ __html: entry.content }} />
            </div>
          )}

          {/* Location info */}
          {(entry.building || entry.floorNumber) && (
            <div className="rounded-lg border bg-card p-4">
              <h3 className="font-medium mb-2 flex items-center gap-2">
                <Building className="h-4 w-4" />
                Расположение
              </h3>
              <div className="text-sm text-muted-foreground">
                {entry.building && <span>Дом {entry.building.number}</span>}
                {entry.floorNumber !== null && (
                  <span>
                    {entry.building && ", "}
                    {entry.floorNumber > 0
                      ? `${entry.floorNumber} этаж`
                      : `${entry.floorNumber} этаж (подвал)`}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Contacts */}
          {entry.contacts.length > 0 && (
            <div className="rounded-lg border bg-card p-4">
              <h3 className="font-medium mb-3">Контакты</h3>
              <div className="space-y-3">
                {/* Phones */}
                {phoneContacts.map((contact) => (
                  <a
                    key={contact.id}
                    href={`tel:${contact.value}`}
                    className="flex items-start gap-3 text-sm hover:bg-muted -mx-2 px-2 py-1 rounded"
                  >
                    <Phone className="h-4 w-4 mt-0.5 text-primary" />
                    <div>
                      <div className="font-medium">{contact.value}</div>
                      {contact.label && (
                        <div className="text-muted-foreground text-xs">
                          {contact.label}
                        </div>
                      )}
                    </div>
                  </a>
                ))}

                {/* Emails */}
                {emailContacts.map((contact) => (
                  <a
                    key={contact.id}
                    href={`mailto:${contact.value}`}
                    className="flex items-start gap-3 text-sm hover:bg-muted -mx-2 px-2 py-1 rounded"
                  >
                    <Mail className="h-4 w-4 mt-0.5 text-primary" />
                    <div>
                      <div className="font-medium">{contact.value}</div>
                      {contact.label && (
                        <div className="text-muted-foreground text-xs">
                          {contact.label}
                        </div>
                      )}
                    </div>
                  </a>
                ))}

                {/* Messengers */}
                {messengerContacts.map((contact) => (
                  <a
                    key={contact.id}
                    href={
                      contact.type === "telegram"
                        ? `https://t.me/${contact.value.replace("@", "")}`
                        : contact.type === "whatsapp"
                          ? `https://wa.me/${contact.value.replace(/\D/g, "")}`
                          : `https://vk.com/${contact.value}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-3 text-sm hover:bg-muted -mx-2 px-2 py-1 rounded"
                  >
                    <MessageCircle className="h-4 w-4 mt-0.5 text-primary" />
                    <div>
                      <div className="font-medium">{contact.value}</div>
                      <div className="text-muted-foreground text-xs capitalize">
                        {contact.type}
                      </div>
                    </div>
                  </a>
                ))}

                {/* Websites */}
                {websiteContacts.map((contact) => (
                  <a
                    key={contact.id}
                    href={contact.value}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-3 text-sm hover:bg-muted -mx-2 px-2 py-1 rounded"
                  >
                    <ExternalLink className="h-4 w-4 mt-0.5 text-primary" />
                    <div>
                      <div className="font-medium truncate max-w-[200px]">
                        {contact.value.replace(/^https?:\/\//, "")}
                      </div>
                      {contact.label && (
                        <div className="text-muted-foreground text-xs">
                          {contact.label}
                        </div>
                      )}
                    </div>
                  </a>
                ))}

                {/* Addresses */}
                {addressContacts.map((contact) => (
                  <div
                    key={contact.id}
                    className="flex items-start gap-3 text-sm -mx-2 px-2 py-1"
                  >
                    <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
                    <div>
                      <div>{contact.value}</div>
                      {contact.label && (
                        <div className="text-muted-foreground text-xs">
                          {contact.label}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Schedule */}
          {entry.schedules.length > 0 && (
            <div className="rounded-lg border bg-card p-4">
              <h3 className="font-medium mb-3 flex items-center gap-2">
                <Clock className="h-4 w-4" />
                График работы
              </h3>
              <div className="space-y-1 text-sm">
                {entry.schedules.map((schedule) => (
                  <div
                    key={schedule.id}
                    className="flex justify-between gap-2"
                  >
                    <span className="text-muted-foreground">
                      {DAY_NAMES[schedule.dayOfWeek]}
                    </span>
                    <span>
                      {schedule.openTime && schedule.closeTime
                        ? `${schedule.openTime.slice(0, 5)} - ${schedule.closeTime.slice(0, 5)}`
                        : schedule.note ?? "Выходной"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const entry = await api.directory.getEntry({ slug });

  if (!entry) {
    return { title: "Не найдено" };
  }

  return {
    title: entry.title,
    description: entry.description ?? `${entry.title} - справочная информация`,
  };
}
