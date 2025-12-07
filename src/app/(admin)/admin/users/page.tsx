import { Users } from "lucide-react";

import { UsersTable } from "~/components/admin/users-table";
import { auth } from "~/server/auth";
import { hasFeatureAccess, type UserRole } from "~/server/auth/rbac";

export default async function AdminUsersPage() {
  const session = await auth();
  const userRoles = (session?.user.roles ?? []) as UserRole[];

  const canManageRoles = hasFeatureAccess(userRoles, "users:roles");
  const canDeleteUsers = hasFeatureAccess(userRoles, "users:delete");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
          <Users className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Пользователи</h1>
          <p className="text-sm text-muted-foreground">
            Управление пользователями системы
          </p>
        </div>
      </div>

      {/* Users Table */}
      <UsersTable
        canManageRoles={canManageRoles}
        canDeleteUsers={canDeleteUsers}
      />
    </div>
  );
}
