import { Globe, ExternalLink } from "lucide-react";
import type { Contact } from "./types";
import { SectionCard } from "./section-card";

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
            className="group -mx-2 flex items-center gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-muted"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10">
              <ExternalLink className="h-4 w-4 text-primary" />
            </div>
            <div className="min-w-0">
              <span className="block truncate font-medium transition-colors group-hover:text-primary">
                {contact.value.replace(/^https?:\/\//, "")}
              </span>
              {contact.label && (
                <p className="text-sm text-muted-foreground">{contact.label}</p>
              )}
            </div>
          </a>
        ))}
      </div>
    </SectionCard>
  );
}
