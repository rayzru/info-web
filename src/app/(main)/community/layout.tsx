import { type Metadata } from "next";

import { CommunityNav } from "~/components/community-nav";

import "~/styles/globals.css";

export const metadata: Metadata = {
  title: "Сердце Ростова 2",
  description: "Сообщество жильцов",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

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
