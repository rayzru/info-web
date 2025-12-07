import { Navigation } from "~/components/navigation";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      data-wrapper=""
      className="container m-auto grid max-w-7xl min-w-xs grid-cols-12 gap-4 px-[20px]"
    >
      <main className="col-span-full">
        <Navigation />
        {children}
      </main>
    </div>
  );
}
