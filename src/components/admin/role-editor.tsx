"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2, X } from "lucide-react";

import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import { type UserRole } from "~/server/auth/rbac";
import { api } from "~/trpc/react";

// Role groups
const ROLE_GROUPS: {
  title: string;
  description: string;
  roles: { role: UserRole; label: string; description: string }[];
}[] = [
  {
    title: "Системные роли",
    description: "Административный доступ к системе",
    roles: [
      { role: "Root", label: "Root", description: "Полный доступ ко всем функциям системы" },
      { role: "SuperAdmin", label: "SuperAdmin", description: "Административный доступ, кроме критических функций" },
      { role: "Admin", label: "Admin", description: "Управление пользователями и контентом" },
    ],
  },
  {
    title: "Представители УК",
    description: "Организационные роли для взаимодействия с собственниками и жителями",
    roles: [
      { role: "BuildingChairman", label: "Председатель дома", description: "Управление своим зданием" },
      { role: "ComplexChairman", label: "Председатель комплекса", description: "Управление комплексом" },
      { role: "ComplexRepresenative", label: "Представитель комплекса", description: "Представительские функции" },
    ],
  },
  {
    title: "Стафф",
    description: "Сотрудники для работы с контентом",
    roles: [
      { role: "Editor", label: "Редактор", description: "Редактирование контента" },
      { role: "Moderator", label: "Модератор", description: "Модерация пользовательского контента" },
    ],
  },
  {
    title: "Жители и собственники",
    description: "Роли жителей комплекса",
    roles: [
      { role: "ApartmentOwner", label: "Владелец квартиры", description: "Владелец квартиры в комплексе" },
      { role: "ApartmentResident", label: "Житель квартиры", description: "Проживающий в квартире" },
      { role: "ParkingOwner", label: "Владелец парковки", description: "Владелец парковочного места" },
      { role: "ParkingResident", label: "Пользователь парковки", description: "Пользователь парковочного места" },
      { role: "StoreOwner", label: "Владелец магазина", description: "Владелец коммерческого помещения" },
      { role: "StoreRepresenative", label: "Представитель магазина", description: "Сотрудник коммерческого помещения" },
    ],
  },
  {
    title: "Гостевой доступ",
    description: "Роль по умолчанию",
    roles: [
      { role: "Guest", label: "Гость", description: "Ограниченный доступ для незарегистрированных действий" },
    ],
  },
];

interface RoleEditorProps {
  userId: string;
  userName: string | null;
  currentRoles: UserRole[];
  currentUserRoles: UserRole[];
}

export function RoleEditor({
  userId,
  userName,
  currentRoles,
  currentUserRoles,
}: RoleEditorProps) {
  const router = useRouter();
  const [selectedRoles, setSelectedRoles] = useState<Set<UserRole>>(
    new Set(currentRoles),
  );
  const [isSaving, setIsSaving] = useState(false);

  const updateRoles = api.admin.users.updateRoles.useMutation({
    onSuccess: () => {
      router.push("/admin/users");
      router.refresh();
    },
    onError: (error) => {
      alert(`Ошибка: ${error.message}`);
      setIsSaving(false);
    },
  });

  // Check what roles current user can assign
  const isRoot = currentUserRoles.includes("Root");
  const isSuperAdmin = currentUserRoles.includes("SuperAdmin");

  const canAssignRole = (role: UserRole): boolean => {
    // Root can assign any role
    if (isRoot) return true;
    // SuperAdmin can assign any role except Root
    if (isSuperAdmin) return role !== "Root";
    // Admin can assign non-admin roles
    return !["Root", "SuperAdmin", "Admin"].includes(role);
  };

  const toggleRole = (role: UserRole) => {
    if (!canAssignRole(role)) return;

    const newRoles = new Set(selectedRoles);
    if (newRoles.has(role)) {
      newRoles.delete(role);
    } else {
      newRoles.add(role);
    }
    setSelectedRoles(newRoles);
  };

  const handleSave = async () => {
    setIsSaving(true);
    await updateRoles.mutateAsync({
      userId,
      roles: Array.from(selectedRoles),
    });
  };

  const hasChanges =
    selectedRoles.size !== currentRoles.length ||
    !currentRoles.every((role) => selectedRoles.has(role));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-lg font-semibold">
          Роли пользователя: {userName ?? "Без имени"}
        </h2>
        <p className="text-sm text-muted-foreground">
          Выберите роли, которые будут назначены пользователю
        </p>
      </div>

      {/* Role Groups */}
      <div className="space-y-6">
        {ROLE_GROUPS.map((group, groupIndex) => (
          <div key={group.title}>
            {groupIndex > 0 && <Separator className="mb-6" />}

            {/* Group Header */}
            <div className="mb-3">
              <h3 className="font-semibold">{group.title}</h3>
              <p className="text-sm text-muted-foreground">{group.description}</p>
            </div>

            {/* Group Roles */}
            <div className="grid gap-3 md:grid-cols-2">
              {group.roles.map(({ role, label, description }) => {
                const isSelected = selectedRoles.has(role);
                const canAssign = canAssignRole(role);

                return (
                  <button
                    key={role}
                    type="button"
                    disabled={!canAssign}
                    onClick={() => toggleRole(role)}
                    className={`flex items-start gap-3 rounded-lg border p-3 text-left transition-colors ${
                      isSelected
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    } ${!canAssign ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
                  >
                    <div
                      className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border ${
                        isSelected
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-muted-foreground"
                      }`}
                    >
                      {isSelected && <Check className="h-3 w-3" />}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{label}</div>
                      <div className="text-xs text-muted-foreground">{description}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between border-t pt-4">
        <div className="text-sm text-muted-foreground">
          Выбрано ролей: {selectedRoles.size}
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => router.push("/admin/users")}
            disabled={isSaving}
          >
            <X className="mr-2 h-4 w-4" />
            Отмена
          </Button>
          <Button onClick={handleSave} disabled={!hasChanges || isSaving}>
            {isSaving ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Check className="mr-2 h-4 w-4" />
            )}
            Сохранить
          </Button>
        </div>
      </div>
    </div>
  );
}
