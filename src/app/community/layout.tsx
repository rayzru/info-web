import "@sr2/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";

import { TRPCReactProvider } from "@sr2/trpc/react";
import { ThemeProvider } from "@sr2/components/theme-provider";
import { Navigation } from "@sr2/components/navigation";
import { CommunityNav } from "@sr2/components/community-nav";

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
