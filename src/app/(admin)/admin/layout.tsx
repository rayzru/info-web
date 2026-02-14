import { type Metadata } from "next";
import { redirect } from "next/navigation";

import { AdminNavMenu } from "~/components/admin/admin-nav-menu";
import { auth } from "~/server/auth";
import { getGroupedAdminNavItems, type UserRole } from "~/server/auth/rbac";

// Force dynamic rendering for all admin pages (they require auth and use client hooks)
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Админ-панель | Сердце Ростова 2",
  description: "Панель администрирования",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  // Double-check auth (middleware should handle this, but defense in depth)
  if (!session) {
    redirect("/login");
  }

  if (!session.user.isAdmin) {
    redirect("/my");
  }

  const userRoles = session.user.roles ?? [];
  const navGroups = getGroupedAdminNavItems(userRoles);

  return (
    <div className="bg-muted/30 min-h-screen">
      {/* Horizontal Navigation */}
      <AdminNavMenu
        user={{
          id: session.user.id,
          name: session.user.name,
          email: session.user.email,
          image: session.user.image,
        }}
        navGroups={navGroups}
      />

      {/* Main Content */}
      <main className="container mx-auto p-6">{children}</main>
    </div>
  );
}
