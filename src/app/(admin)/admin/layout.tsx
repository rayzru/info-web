import { type Metadata } from "next";
import { redirect } from "next/navigation";

import { AdminNavigation } from "~/components/admin/admin-navigation";
import { auth } from "~/server/auth";
import { getAdminNavItems, type UserRole } from "~/server/auth/rbac";

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
  const navItems = getAdminNavItems(userRoles);

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container mx-auto flex gap-6 p-6">
        {/* Main Content Area - Left Side */}
        <main className="flex-1">{children}</main>

        {/* Admin Navigation - Right Side */}
        <AdminNavigation
          user={{
            id: session.user.id,
            name: session.user.name,
            email: session.user.email,
            image: session.user.image,
          }}
          navItems={navItems}
        />
      </div>
    </div>
  );
}
