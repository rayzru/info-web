import { redirect } from "next/navigation";
import { Building2, DoorOpen, Home, Layers, ParkingSquare, Car } from "lucide-react";

import { BuildingTree } from "~/components/admin/building-tree";
import { auth } from "~/server/auth";
import { hasFeatureAccess, type UserRole } from "~/server/auth/rbac";
import { api } from "~/trpc/server";

export default async function BuildingsPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  const userRoles = (session.user.roles ?? []) as UserRole[];

  // Check permission
  if (!hasFeatureAccess(userRoles, "buildings:view")) {
    redirect("/admin");
  }

  // Fetch buildings data and stats
  const [buildings, stats] = await Promise.all([
    api.admin.buildings.list(),
    api.admin.buildings.stats(),
  ]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
          <Building2 className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Здания и помещения</h1>
          <p className="text-sm text-muted-foreground">
            Визуализация структуры зданий комплекса
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <StatCard
          icon={Building2}
          label="Зданий"
          value={stats.buildings}
        />
        <StatCard
          icon={DoorOpen}
          label="Подъездов"
          value={stats.entrances}
        />
        <StatCard
          icon={Layers}
          label="Этажей"
          value={stats.floors}
        />
        <StatCard
          icon={Home}
          label="Квартир"
          value={stats.apartments}
        />
        <StatCard
          icon={ParkingSquare}
          label="Паркингов"
          value={stats.parkings}
        />
        <StatCard
          icon={Car}
          label="Парк. мест"
          value={stats.parkingSpots}
        />
      </div>

      {/* Buildings Tree */}
      <div className="rounded-lg border bg-card p-4">
        <h2 className="mb-4 text-lg font-semibold">Структура зданий</h2>
        <BuildingTree buildings={buildings} />
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-lg border bg-card p-4">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
          <Icon className="h-4 w-4 text-muted-foreground" />
        </div>
        <div>
          <p className="text-2xl font-bold">{value}</p>
          <p className="text-xs text-muted-foreground">{label}</p>
        </div>
      </div>
    </div>
  );
}
