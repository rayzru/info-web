import { Navigation } from "~/components/navigation";
import { SiteFooter } from "~/components/site-footer";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <div
        data-wrapper=""
        className="container m-auto flex-1 grid max-w-7xl min-w-xs grid-cols-12 gap-4 px-[20px]"
      >
        <main className="col-span-full">
          <Navigation />
          {children}
        </main>
      </div>
      <SiteFooter />
    </div>
  );
}
