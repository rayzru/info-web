import { notFound } from "next/navigation";
import {
  FileText,
  Building,
  Eye,
  Calendar,
} from "lucide-react";

import { api } from "~/trpc/server";
import { Badge } from "~/components/ui/badge";
import { Separator } from "~/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { RichRenderer } from "~/components/editor/renderer/rich-renderer";
import { PageHeader } from "~/components/page-header";
import { ArticleFeedback } from "./article-feedback";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function HowtoArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = await api.knowledge.getBySlug({ slug });

  if (!article) {
    notFound();
  }

  const publishedDate = article.publishedAt
    ? new Date(article.publishedAt).toLocaleDateString("ru-RU", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <div className="py-6">
      <PageHeader
        title={article.title}
        description={article.excerpt ?? undefined}
      />

      {/* Tags */}
      {article.tags.length > 0 && (
        <div className="mb-6 flex flex-wrap gap-2">
          {article.tags.map((tag) => (
            <Badge key={tag.id} variant="secondary">
              {tag.name}
            </Badge>
          ))}
        </div>
      )}

      {/* Building info */}
      {article.building && (
        <div className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
          <Building className="h-4 w-4" />
          <span>
            Для жителей строения {article.building.number}
            {article.building.title && ` (${article.building.title})`}
          </span>
        </div>
      )}

      <Separator className="mb-8" />

      {/* Content */}
      {article.content && (
        <article className="prose prose-lg max-w-none dark:prose-invert">
          <RichRenderer content={JSON.parse(article.content)} className="prose-lg" />
        </article>
      )}

      {/* Feedback */}
      <ArticleFeedback
        articleId={article.id}
        articleTitle={article.title}
        articleSlug={slug}
        helpfulCount={article.helpfulCount}
        notHelpfulCount={article.notHelpfulCount}
      />
    </div>
  );
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const article = await api.knowledge.getBySlug({ slug });

  if (!article) {
    return { title: "Статья не найдена" };
  }

  return {
    title: article.title,
    description: article.excerpt ?? `${article.title} - база знаний`,
  };
}
