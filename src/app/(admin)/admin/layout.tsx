import { type Metadata } from "next";
import { redirect } from "next/navigation";

import { AdminNavMenu } from "~/components/admin/admin-nav-menu";
import { auth } from "~/server/auth";
import { getGroupedAdminNavItems, type UserRole } from "~/server/auth/rbac";

export const metadata: Metadata = {
  title: "Админ-панель | Сердце Ростова 2",
  description: "Панель администрирования",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // Double-check auth (middleware should handle this, but defense in depth)
  if (!session) {
    redirect("/login");
  }

  if (!session.user.isAdmin) {
    redirect("/my");
  }

  const userRoles = (session.user.roles ?? []) as UserRole[];
  const navGroups = getGroupedAdminNavItems(userRoles);

  return (
    <div className="min-h-screen bg-muted/30">
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
