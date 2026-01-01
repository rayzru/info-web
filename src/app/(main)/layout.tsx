import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { eq } from "drizzle-orm";

import { Navigation } from "~/components/navigation";
import { SiteFooter } from "~/components/site-footer";
import { db } from "~/server/db";
import { systemSettings, SETTING_KEYS, type MaintenanceSettings } from "~/server/db/schema";
import { auth } from "~/server/auth";

// Paths that should be accessible during maintenance (for admin login flow)
const MAINTENANCE_BYPASS_PATHS = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
];

async function checkMaintenance() {
  // Check if current path should bypass maintenance
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") ?? headersList.get("x-invoke-path") ?? "";

  if (MAINTENANCE_BYPASS_PATHS.some((path) => pathname.startsWith(path))) {
    return;
  }

  const setting = await db.query.systemSettings.findFirst({
    where: eq(systemSettings.key, SETTING_KEYS.MAINTENANCE_MODE),
  });

  const maintenanceSettings = setting?.value as MaintenanceSettings | undefined;

  if (!maintenanceSettings?.enabled) {
    return;
  }

  // Check if user is admin
  const session = await auth();
  if (session?.user?.isAdmin) {
    return;
  }

  // Redirect non-admins to maintenance page
  redirect("/maintenance");
}

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await checkMaintenance();

  return (
    <div className="flex min-h-screen flex-col">
      <div
        data-wrapper=""
        className="container m-auto flex-1 grid max-w-7xl min-w-xs grid-cols-12 gap-4 px-[20px]"
      >
        <main className="col-span-full">
          <Navigation />
          {children}
        </main>
      </div>
      <SiteFooter />
    </div>
  );
}
