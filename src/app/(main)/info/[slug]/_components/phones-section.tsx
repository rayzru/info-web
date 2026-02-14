import { Phone } from "lucide-react";

import { SectionCard } from "./section-card";
import type { Contact } from "./types";

type PhonesSectionProps = {
  contacts: Contact[];
};

function groupPhonesByCategory(phones: Contact[]) {
  if (phones.length <= 3 || phones.every((p) => !p.label)) {
    return null;
  }

  const groups = new Map<string, Contact[]>();

  for (const phone of phones) {
    const category = phone.label ?? "Другие";
    if (!groups.has(category)) {
      groups.set(category, []);
    }
    groups.get(category)!.push(phone);
  }

  if (groups.size <= 1) {
    return null;
  }

  return groups;
}

function PhoneItem({ contact, showLabel = false }: { contact: Contact; showLabel?: boolean }) {
  return (
    <a
      href={`tel:${contact.value}`}
      className="hover:bg-muted group -mx-2 flex items-center gap-3 rounded-lg px-2 py-2 transition-colors"
    >
      <div className="bg-primary/10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full">
        <Phone className="text-primary h-4 w-4" />
      </div>
      <div>
        <span className="group-hover:text-primary font-medium transition-colors">
          {contact.value}
        </span>
        {showLabel && contact.label && (
          <p className="text-muted-foreground text-sm">{contact.label}</p>
        )}
      </div>
    </a>
  );
}

export function PhonesSection({ contacts }: PhonesSectionProps) {
  if (contacts.length === 0) return null;

  const phoneGroups = groupPhonesByCategory(contacts);

  if (phoneGroups) {
    return (
      <section>
        <div className="grid gap-4 sm:grid-cols-2">
          {Array.from(phoneGroups.entries()).map(([category, phones]) => (
            <div key={category} className="bg-card rounded-xl border p-4">
              <h3 className="text-muted-foreground mb-3 text-sm font-medium">{category}</h3>
              <div className="space-y-2">
                {phones.map((contact) => (
                  <PhoneItem key={contact.id} contact={contact} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <SectionCard icon={Phone} title="Телефоны">
      <div className="space-y-2">
        {contacts.map((contact) => (
          <PhoneItem key={contact.id} contact={contact} showLabel />
        ))}
      </div>
    </SectionCard>
  );
}
