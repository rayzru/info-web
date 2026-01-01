import { CommunityNav } from "~/components/community-nav";

export default function WeLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="container max-w-4xl mx-auto flex-col md:flex">
      <CommunityNav />
      {children}
    </div>
  );
}
