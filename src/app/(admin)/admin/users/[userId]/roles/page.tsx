import { notFound, redirect } from "next/navigation";
import { ArrowLeft, UserCog } from "lucide-react";
import Link from "next/link";

import { Button } from "~/components/ui/button";
import { RoleEditor } from "~/components/admin/role-editor";
import { auth } from "~/server/auth";
import { hasFeatureAccess, type UserRole } from "~/server/auth/rbac";
import { api } from "~/trpc/server";

interface Props {
  params: Promise<{ userId: string }>;
}

export default async function UserRolesPage({ params }: Props) {
  const { userId } = await params;
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  const currentUserRoles = (session.user.roles ?? []) as UserRole[];

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
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <UserCog className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Управление ролями</h1>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
        </div>
      </div>

      {/* Role Editor */}
      <div className="rounded-lg border bg-card p-6">
        <RoleEditor
          userId={userId}
          userName={user.name}
          currentRoles={user.roles}
          currentUserRoles={currentUserRoles}
        />
      </div>
    </div>
  );
}
