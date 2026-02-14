import { FileText, MessageCircle, Phone } from "lucide-react";
import Link from "next/link";

import { PageHeader } from "~/components/page-header";
import { Badge } from "~/components/ui/badge";
import { api } from "~/trpc/server";

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
        <div className="text-muted-foreground py-12 text-center">
          <FileText className="mx-auto mb-4 h-12 w-12 opacity-50" />
          <p>Статьи пока не добавлены</p>
        </div>
      ) : (
        <div className="space-y-10">
          {/* Grouped by root tags */}
          {categories.map((category) => (
            <section key={category.tag.id}>
              <h2 className="mb-4 text-lg font-medium">{category.tag.name}</h2>

              {/* Subcategories (e.g., "Строение 1", "Строение 2") */}
              {category.subcategories.length > 0 && (
                <div className="mb-6 space-y-4">
                  {category.subcategories.map((sub) => (
                    <div key={sub.tag.id} className="bg-card rounded-lg border p-4">
                      <h3 className="mb-3 font-medium">{sub.tag.name}</h3>
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
              <div className="mb-4 flex items-center gap-2">
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
      className="hover:bg-muted/50 group -mx-3 flex items-center gap-3 rounded-md px-3 py-2 transition-colors"
    >
      <div className="min-w-0 flex-1">
        <span className="group-hover:text-primary text-sm transition-colors">{entry.title}</span>
        {entry.subtitle && (
          <span className="text-muted-foreground ml-2 text-xs">{entry.subtitle}</span>
        )}
      </div>
      {phoneContact && (
        <div className="text-muted-foreground flex shrink-0 items-center gap-1.5">
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
      className="bg-card hover:border-primary/30 group rounded-lg border p-4 transition-all hover:shadow-md"
    >
      <div className="flex items-start gap-3">
        <div className="bg-primary/10 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg">
          <FileText className="text-primary h-4 w-4" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="group-hover:text-primary line-clamp-2 font-medium transition-colors">
            {article.title}
          </h3>
          {article.excerpt && (
            <p className="text-muted-foreground mt-1 line-clamp-2 text-sm">{article.excerpt}</p>
          )}
        </div>
      </div>
    </Link>
  );
}
