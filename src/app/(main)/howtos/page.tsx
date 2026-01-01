import Link from "next/link";
import { FileText, Phone, MessageCircle } from "lucide-react";

import { api } from "~/trpc/server";
import { Badge } from "~/components/ui/badge";
import { PageHeader } from "~/components/page-header";

export const metadata = {
  title: "Чего",
  description: "Полезные статьи и инструкции для жителей",
};

export default async function HowtosPage() {
  const { categories, uncategorized, total } = await api.knowledge.listGroupedByTags();

  const isEmpty = total === 0 && categories.length === 0;

  return (
    <div className="py-6">
      <PageHeader title="Чего" />

      {isEmpty ? (
        <div className="py-12 text-center text-muted-foreground">
          <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>Статьи пока не добавлены</p>
        </div>
      ) : (
        <div className="space-y-10">
          {/* Grouped by root tags */}
          {categories.map((category) => (
            <section key={category.tag.id}>
              <h2 className="text-lg font-medium mb-4">{category.tag.name}</h2>

              {/* Subcategories (e.g., "Строение 1", "Строение 2") */}
              {category.subcategories.length > 0 && (
                <div className="space-y-4 mb-6">
                  {category.subcategories.map((sub) => (
                    <div key={sub.tag.id} className="rounded-lg border bg-card p-4">
                      <h3 className="font-medium mb-3">{sub.tag.name}</h3>
                      <div className="space-y-2">
                        {sub.entries.map((entry) => (
                          <EntryRow key={entry.id} entry={entry} />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Articles */}
              {category.articles.length > 0 && (
                <div className="grid gap-3 sm:grid-cols-2">
                  {category.articles.map((article) => (
                    <ArticleCard key={article.id} article={article} />
                  ))}
                </div>
              )}
            </section>
          ))}

          {/* Uncategorized articles */}
          {uncategorized.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-4">
                <h2 className="text-lg font-medium">Прочее</h2>
                <Badge variant="secondary" className="ml-1">
                  {uncategorized.length}
                </Badge>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {uncategorized.map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}

function EntryRow({
  entry,
}: {
  entry: {
    id: string;
    slug: string;
    title: string;
    subtitle: string | null;
    icon: string | null;
    contacts: {
      type: string;
      value: string;
      label: string | null;
      isPrimary: number;
      hasWhatsApp: number;
      hasTelegram: number;
    }[];
  };
}) {
  const phoneContact = entry.contacts.find((c) => c.type === "phone");

  return (
    <Link
      href={`/info/${entry.slug}`}
      className="group flex items-center gap-3 py-2 px-3 -mx-3 rounded-md hover:bg-muted/50 transition-colors"
    >
      <div className="min-w-0 flex-1">
        <span className="text-sm group-hover:text-primary transition-colors">
          {entry.title}
        </span>
        {entry.subtitle && (
          <span className="text-xs text-muted-foreground ml-2">
            {entry.subtitle}
          </span>
        )}
      </div>
      {phoneContact && (
        <div className="flex items-center gap-1.5 shrink-0 text-muted-foreground">
          <Phone className="h-3.5 w-3.5" />
          <span className="text-xs">{phoneContact.value}</span>
          {phoneContact.hasWhatsApp === 1 && (
            <MessageCircle className="h-3.5 w-3.5 text-green-600" />
          )}
        </div>
      )}
    </Link>
  );
}

function ArticleCard({
  article,
}: {
  article: {
    id: string;
    slug: string;
    title: string;
    excerpt: string | null;
    tags: { id: string; name: string; slug: string }[];
  };
}) {
  return (
    <Link
      href={`/howtos/${article.slug}`}
      className="group rounded-lg border bg-card p-4 transition-all hover:shadow-md hover:border-primary/30"
    >
      <div className="flex items-start gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
          <FileText className="h-4 w-4 text-primary" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-medium group-hover:text-primary transition-colors line-clamp-2">
            {article.title}
          </h3>
          {article.excerpt && (
            <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
              {article.excerpt}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
