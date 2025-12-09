import { CommunityNav } from "~/components/community-nav";

export default function WeLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex-col md:flex">
      <CommunityNav />
      {children}
    </div>
  );
}
