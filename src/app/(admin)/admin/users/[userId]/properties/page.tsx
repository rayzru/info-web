import { ArrowLeft, Building2 } from "lucide-react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { PropertyManager } from "~/components/admin/property-manager";
import { Button } from "~/components/ui/button";
import { auth } from "~/server/auth";
import { hasFeatureAccess, type UserRole } from "~/server/auth/rbac";
import { api } from "~/trpc/server";

interface Props {
  params: Promise<{ userId: string }>;
}

export default async function UserPropertiesPage({ params }: Props) {
  const { userId } = await params;
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  const currentUserRoles = session.user.roles ?? [];

  // Check permission
  if (!hasFeatureAccess(currentUserRoles, "users:roles")) {
    redirect("/admin/users");
  }

  // Fetch user data
  let user;
  try {
    user = await api.admin.users.getById({ userId });
  } catch {
    notFound();
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/users">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex items-center gap-3">
          <div className="bg-primary flex h-10 w-10 items-center justify-center rounded-lg">
            <Building2 className="text-primary-foreground h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Управление собственностью</h1>
            <p className="text-muted-foreground text-sm">
              {user.name ?? "Без имени"} ({user.email})
            </p>
          </div>
        </div>
      </div>

      {/* Property Manager */}
      <PropertyManager userId={userId} userName={user.name} />
    </div>
  );
}
