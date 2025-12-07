import { Shield } from "lucide-react";

import { auth } from "~/server/auth";
import {
  getAccessibleFeatures,
  getAdminNavItems,
  type UserRole,
} from "~/server/auth/rbac";

export default async function AdminPage() {
  const session = await auth();
  const userRoles = (session?.user.roles ?? []) as UserRole[];
  const features = getAccessibleFeatures(userRoles);
  const navItems = getAdminNavItems(userRoles);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
          <Shield className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Панель администратора</h1>
          <p className="text-sm text-muted-foreground">
            Добро пожаловать, {session?.user.name}
          </p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border bg-card p-4">
          <h3 className="text-sm font-medium text-muted-foreground">
            Ваши роли
          </h3>
          <div className="mt-2 flex flex-wrap gap-1">
            {userRoles.length > 0 ? (
              userRoles.map((role) => (
                <span
                  key={role}
                  className="inline-flex items-center rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary"
                >
                  {role}
                </span>
              ))
            ) : (
              <span className="text-sm text-muted-foreground">
                Нет назначенных ролей
              </span>
            )}
          </div>
        </div>

        <div className="rounded-lg border bg-card p-4">
          <h3 className="text-sm font-medium text-muted-foreground">
            Доступные функции
          </h3>
          <p className="mt-2 text-2xl font-bold">{features.length}</p>
        </div>

        <div className="rounded-lg border bg-card p-4">
          <h3 className="text-sm font-medium text-muted-foreground">
            Разделы меню
          </h3>
          <p className="mt-2 text-2xl font-bold">{navItems.length}</p>
        </div>
      </div>

      {/* Quick Links */}
      <div className="rounded-lg border bg-card p-4">
        <h2 className="mb-4 text-lg font-semibold">Быстрые действия</h2>
        <div className="grid gap-2 md:grid-cols-2">
          {navItems.slice(0, 4).map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="flex items-center gap-2 rounded-md border p-3 transition-colors hover:bg-muted"
            >
              <span className="font-medium">{item.title}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
