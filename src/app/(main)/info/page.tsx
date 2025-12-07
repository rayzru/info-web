import { Suspense } from "react";

import { api } from "~/trpc/server";

import { DirectoryContent } from "./directory-content";

export const metadata = {
  title: "Справочная",
  description: "Контакты, организации и полезная информация о ЖК",
};

export default async function InfoPage() {
  // Prefetch root tags for initial render
  const tags = await api.directory.getTags({ parentId: null });
  const entries = await api.directory.list({ limit: 20 });

  return (
    <div className="container py-8">
      <Suspense fallback={<DirectoryContentSkeleton />}>
        <DirectoryContent initialTags={tags} initialEntries={entries} />
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
