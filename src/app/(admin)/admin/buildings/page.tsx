import { Building2, Car, DoorOpen, Home, Layers, ParkingSquare } from "lucide-react";
import { redirect } from "next/navigation";

import { AdminPageHeader } from "~/components/admin/admin-page-header";
import { BuildingTree } from "~/components/admin/building-tree";
import { auth } from "~/server/auth";
import { hasFeatureAccess, type UserRole } from "~/server/auth/rbac";
import { api } from "~/trpc/server";

export default async function BuildingsPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  const userRoles = session.user.roles ?? [];

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
      <AdminPageHeader
        title="Здания и помещения"
        description="Визуализация структуры зданий комплекса"
      />

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <StatCard icon={Building2} label="Зданий" value={stats.buildings} />
        <StatCard icon={DoorOpen} label="Подъездов" value={stats.entrances} />
        <StatCard icon={Layers} label="Этажей" value={stats.floors} />
        <StatCard icon={Home} label="Квартир" value={stats.apartments} />
        <StatCard icon={ParkingSquare} label="Паркингов" value={stats.parkings} />
        <StatCard icon={Car} label="Парк. мест" value={stats.parkingSpots} />
      </div>

      {/* Buildings Tree */}
      <div className="bg-card rounded-lg border p-4">
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
    <div className="bg-card rounded-lg border p-4">
      <div className="flex items-start gap-3">
        <Icon className="mt-2 h-5 w-5 text-gray-300" />
        <div>
          <p className="text-2xl font-bold">{value}</p>
          <p className="text-muted-foreground text-xs">{label}</p>
        </div>
      </div>
    </div>
  );
}
