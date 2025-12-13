import { Suspense } from "react";

import { api } from "~/trpc/server";
import { LatestNews } from "~/components/latest-news";

import { DirectoryContent } from "./info/directory-content";

export const metadata = {
  title: "Справочная | SR2",
  description: "Контакты, организации и полезная информация о ЖК",
};

export default async function Home() {
  // Prefetch root tags for initial render
  const tags = await api.directory.getTags({ parentId: null });
  const entries = await api.directory.list({ limit: 20 });

  return (
    <div className="container py-8">
      <Suspense fallback={<DirectoryContentSkeleton />}>
        <DirectoryContent initialTags={tags} initialEntries={entries} />
      </Suspense>

      {/* Latest News Section */}
      <Suspense fallback={<NewsSkeleton />}>
        <LatestNews />
      </Suspense>
    </div>
  );
}

function DirectoryContentSkeleton() {
  return (
    <div className="flex flex-col min-h-[60vh] items-center justify-center">
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

function NewsSkeleton() {
  return (
    <div className="py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="h-6 w-32 bg-muted animate-pulse rounded" />
        <div className="h-8 w-24 bg-muted animate-pulse rounded" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-lg border overflow-hidden">
            <div className="aspect-video bg-muted animate-pulse" />
            <div className="p-4 space-y-2">
              <div className="h-5 w-20 bg-muted animate-pulse rounded" />
              <div className="h-5 w-full bg-muted animate-pulse rounded" />
              <div className="h-4 w-3/4 bg-muted animate-pulse rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
