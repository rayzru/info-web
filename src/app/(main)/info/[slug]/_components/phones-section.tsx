import { Phone } from "lucide-react";
import type { Contact } from "./types";
import { SectionCard } from "./section-card";

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
      className="group -mx-2 flex items-center gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-muted"
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10">
        <Phone className="h-4 w-4 text-primary" />
      </div>
      <div>
        <span className="font-medium transition-colors group-hover:text-primary">
          {contact.value}
        </span>
        {showLabel && contact.label && (
          <p className="text-sm text-muted-foreground">{contact.label}</p>
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
            <div key={category} className="rounded-xl border bg-card p-4">
              <h3 className="mb-3 text-sm font-medium text-muted-foreground">
                {category}
              </h3>
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
