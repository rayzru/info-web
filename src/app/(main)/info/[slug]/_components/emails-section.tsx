import { Mail } from "lucide-react";

import { SectionCard } from "./section-card";
import type { Contact } from "./types";

type EmailsSectionProps = {
  contacts: Contact[];
};

export function EmailsSection({ contacts }: EmailsSectionProps) {
  if (contacts.length === 0) return null;

  return (
    <SectionCard icon={Mail} title="Email">
      <div className="space-y-2">
        {contacts.map((contact) => (
          <a
            key={contact.id}
            href={`mailto:${contact.value}`}
            className="hover:bg-muted group -mx-2 flex items-center gap-3 rounded-lg px-2 py-2 transition-colors"
          >
            <div className="bg-primary/10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full">
              <Mail className="text-primary h-4 w-4" />
            </div>
            <div>
              <span className="group-hover:text-primary font-medium transition-colors">
                {contact.value}
              </span>
              {contact.label && <p className="text-muted-foreground text-sm">{contact.label}</p>}
            </div>
          </a>
        ))}
      </div>
    </SectionCard>
  );
}
