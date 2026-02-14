import { ExternalLink, Globe } from "lucide-react";

import { SectionCard } from "./section-card";
import type { Contact } from "./types";

type WebsitesSectionProps = {
  contacts: Contact[];
};

export function WebsitesSection({ contacts }: WebsitesSectionProps) {
  if (contacts.length === 0) return null;

  return (
    <SectionCard icon={Globe} title="Ссылки">
      <div className="space-y-2">
        {contacts.map((contact) => (
          <a
            key={contact.id}
            href={contact.value}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:bg-muted group -mx-2 flex items-center gap-3 rounded-lg px-2 py-2 transition-colors"
          >
            <div className="bg-primary/10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full">
              <ExternalLink className="text-primary h-4 w-4" />
            </div>
            <div className="min-w-0">
              <span className="group-hover:text-primary block truncate font-medium transition-colors">
                {contact.value.replace(/^https?:\/\//, "")}
              </span>
              {contact.label && <p className="text-muted-foreground text-sm">{contact.label}</p>}
            </div>
          </a>
        ))}
      </div>
    </SectionCard>
  );
}
