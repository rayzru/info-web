import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

import { api } from "~/trpc/server";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";

import {
  PhonesSection,
  MessengersSection,
  EmailsSection,
  WebsitesSection,
  LocationSection,
  ScheduleSection,
} from "./_components";

type Props = {
  params: Promise<{ slug: string }>;
};

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
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/info">
            <ChevronLeft className="mr-1 h-4 w-4" />
            Назад к справочной
          </Link>
        </Button>
      </div>

      {/* Centered content */}
      <div className="mx-auto max-w-2xl space-y-8">
        {/* Header */}
        <header className="text-center">
          <Badge variant="outline" className="mb-3">
            {entry.type === "contact" && "Контакт"}
            {entry.type === "organization" && "Организация"}
            {entry.type === "location" && "Локация"}
            {entry.type === "document" && "Документ"}
          </Badge>

          <h1 className="text-2xl font-semibold sm:text-3xl">{entry.title}</h1>

          {entry.description && (
            <p className="mt-2 text-muted-foreground">{entry.description}</p>
          )}

          {entry.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {entry.tags.map((tag) => (
                <Badge key={tag.id} variant="secondary">
                  {tag.name}
                </Badge>
              ))}
            </div>
          )}
        </header>

        {/* Content (if any HTML content) */}
        {entry.content && (
          <div className="prose prose-sm mx-auto max-w-none dark:prose-invert">
            <div dangerouslySetInnerHTML={{ __html: entry.content }} />
          </div>
        )}

        {/* Contact sections */}
        {entry.contacts.length > 0 && (
          <div className="space-y-6">
            <PhonesSection contacts={phoneContacts} />
            <MessengersSection contacts={messengerContacts} />
            <EmailsSection contacts={emailContacts} />
            <WebsitesSection contacts={websiteContacts} />
            <LocationSection
              addresses={addressContacts}
              building={entry.building}
              floorNumber={entry.floorNumber}
            />
          </div>
        )}

        <ScheduleSection schedules={entry.schedules} />
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
