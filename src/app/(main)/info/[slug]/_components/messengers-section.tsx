import { MessageCircle } from "lucide-react";

import { cn } from "~/lib/utils";

import { SectionCard } from "./section-card";
import type { Contact } from "./types";

type MessengersSectionProps = {
  contacts: Contact[];
};

function getMessengerHref(contact: Contact): string {
  if (contact.type === "telegram") {
    return contact.value.startsWith("http")
      ? contact.value
      : `https://t.me/${contact.value.replace("@", "")}`;
  }
  if (contact.type === "whatsapp") {
    return contact.value.startsWith("http")
      ? contact.value
      : `https://wa.me/${contact.value.replace(/\D/g, "")}`;
  }
  return `https://vk.com/${contact.value}`;
}

function getMessengerLabel(contact: Contact): string {
  if (contact.label) return contact.label;
  if (contact.type === "telegram") return "Telegram";
  if (contact.type === "whatsapp") return "WhatsApp";
  return "ВКонтакте";
}

export function MessengersSection({ contacts }: MessengersSectionProps) {
  if (contacts.length === 0) return null;

  return (
    <SectionCard icon={MessageCircle} title="Мессенджеры">
      <div className="flex flex-wrap gap-2">
        {contacts.map((contact) => (
          <a
            key={contact.id}
            href={getMessengerHref(contact)}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors",
              contact.type === "telegram" &&
                "bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-950 dark:text-blue-300 dark:hover:bg-blue-900",
              contact.type === "whatsapp" &&
                "bg-green-50 text-green-700 hover:bg-green-100 dark:bg-green-950 dark:text-green-300 dark:hover:bg-green-900",
              contact.type === "vk" &&
                "bg-sky-50 text-sky-700 hover:bg-sky-100 dark:bg-sky-950 dark:text-sky-300 dark:hover:bg-sky-900"
            )}
          >
            <MessageCircle className="h-4 w-4" />
            {getMessengerLabel(contact)}
          </a>
        ))}
      </div>
    </SectionCard>
  );
}
