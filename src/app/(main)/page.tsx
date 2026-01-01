import { Suspense } from "react";

import { api } from "~/trpc/server";
import { LatestNews } from "~/components/latest-news";
import { LatestPublications } from "~/components/latest-publications";
import { UpcomingEvents } from "~/components/upcoming-events";

import { DirectoryContent } from "./info/directory-content";

export const metadata = {
  title: "Справочная | SR2",
  description: "Контакты, организации и полезная информация о ЖК",
};

export default async function Home() {
  // Prefetch root tags for initial render
  const tags = await api.directory.getTags({ parentId: null });
  const entries = await api.directory.list({ limit: 20 });

  // Prefetch content for widgets to check if they're empty
  const [news, events, publications] = await Promise.all([
    api.news.latest({ limit: 4 }),
    api.publications.upcomingEvents({ limit: 4 }),
    api.publications.latest({ limit: 4 }),
  ]);

  const hasNews = news.length > 0;
  const hasEvents = events.length > 0;
  const hasPublications = publications.length > 0;
  const hasAnyWidget = hasNews || hasEvents || hasPublications;

  // Count non-empty sections for grid
  const widgetCount = [hasNews, hasEvents, hasPublications].filter(Boolean).length;

  return (
    <div className="container py-8">
      <Suspense fallback={<DirectoryContentSkeleton />}>
        <DirectoryContent initialTags={tags} initialEntries={entries} />
      </Suspense>

      {/* News, Events, Publications - side by side on desktop */}
      {hasAnyWidget && (
        <div className={`grid gap-6 py-8 ${
          widgetCount === 3
            ? "lg:grid-cols-3"
            : widgetCount === 2
              ? "lg:grid-cols-2"
              : ""
        }`}>
          {hasNews && (
            <Suspense fallback={<WidgetColumnSkeleton title="Новости" />}>
              <LatestNews variant="column" />
            </Suspense>
          )}

          {hasEvents && (
            <Suspense fallback={<WidgetColumnSkeleton title="Мероприятия" />}>
              <UpcomingEvents variant="column" />
            </Suspense>
          )}

          {hasPublications && (
            <Suspense fallback={<WidgetColumnSkeleton title="Публикации" />}>
              <LatestPublications variant="column" />
            </Suspense>
          )}
        </div>
      )}
    </div>
  );
}

function DirectoryContentSkeleton() {
  return (
    <div className="flex flex-col min-h-[40vh] items-center justify-center">
      <div className="w-full max-w-xl space-y-4">
        <div className="h-14 bg-muted animate-pulse rounded-lg" />
        <div className="flex justify-center gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-10 w-24 bg-muted animate-pulse rounded-full" />
          ))}
        </div>
      </div>
    </div>
  );
}

function WidgetColumnSkeleton({ title }: { title: string }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="h-5 w-5 bg-muted animate-pulse rounded" />
          <div className="h-6 w-24 bg-muted animate-pulse rounded" />
        </div>
        <div className="h-6 w-16 bg-muted animate-pulse rounded" />
      </div>
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-lg border overflow-hidden">
            <div className="p-3 space-y-2">
              <div className="h-4 w-full bg-muted animate-pulse rounded" />
              <div className="h-3 w-2/3 bg-muted animate-pulse rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
