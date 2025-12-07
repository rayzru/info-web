/**
 * Role-Based Access Control (RBAC) Service
 *
 * Defines role hierarchy, feature permissions, and access control functions.
 */

import { type userRoleEnum } from "~/server/db/schemas/users";

// Type for user roles from the database enum
export type UserRole = (typeof userRoleEnum.enumValues)[number];

// Admin features that can be controlled
export type AdminFeature =
  | "admin:access" // Basic admin panel access
  | "users:view" // View users list
  | "users:manage" // Edit user details
  | "users:roles" // Assign/remove roles
  | "users:delete" // Delete users
  | "buildings:view" // View buildings
  | "buildings:manage" // Manage buildings
  | "properties:view" // View property requests
  | "properties:approve" // Approve/reject property requests
  | "claims:view" // View property claims
  | "claims:review" // Review/approve property claims
  | "listings:view" // View all listings
  | "listings:moderate" // Moderate listings
  | "content:view" // View content
  | "content:moderate" // Moderate user content
  | "directory:manage" // Manage directory entries and tags
  | "system:settings" // Access system settings
  | "system:logs"; // View system logs

// Role hierarchy - higher roles inherit permissions from lower roles
// Root > SuperAdmin > Admin > specific roles
const ROLE_HIERARCHY: Record<UserRole, UserRole[]> = {
  Root: ["SuperAdmin"],
  SuperAdmin: ["Admin"],
  Admin: ["Editor", "Moderator"],
  Editor: [],
  Moderator: [],
  BuildingChairman: [],
  ComplexChairman: ["ComplexRepresenative"],
  ComplexRepresenative: [],
  ApartmentOwner: ["ApartmentResident"],
  ApartmentResident: [],
  ParkingOwner: ["ParkingResident"],
  ParkingResident: [],
  StoreOwner: ["StoreRepresenative"],
  StoreRepresenative: [],
  Guest: [],
};

// Feature permission map - which roles can access which features
const FEATURE_PERMISSIONS: Record<AdminFeature, UserRole[]> = {
  "admin:access": [
    "Root",
    "SuperAdmin",
    "Admin",
    "BuildingChairman",
    "ComplexChairman",
    "Editor",
    "Moderator",
  ],
  "users:view": ["Root", "SuperAdmin", "Admin"],
  "users:manage": ["Root", "SuperAdmin", "Admin"],
  "users:roles": ["Root", "SuperAdmin", "Admin"],
  "users:delete": ["Root"],
  "buildings:view": ["Root", "SuperAdmin", "Admin", "BuildingChairman"],
  "buildings:manage": ["Root", "SuperAdmin", "Admin"],
  "properties:view": [
    "Root",
    "SuperAdmin",
    "Admin",
    "BuildingChairman",
    "ComplexChairman",
  ],
  "properties:approve": [
    "Root",
    "SuperAdmin",
    "Admin",
    "BuildingChairman",
    "ComplexChairman",
  ],
  "claims:view": [
    "Root",
    "SuperAdmin",
    "Admin",
    "BuildingChairman",
    "ComplexChairman",
  ],
  "claims:review": [
    "Root",
    "SuperAdmin",
    "Admin",
    "BuildingChairman",
    "ComplexChairman",
  ],
  "listings:view": ["Root", "SuperAdmin", "Admin", "Moderator"],
  "listings:moderate": ["Root", "SuperAdmin", "Admin", "Moderator"],
  "content:view": ["Root", "SuperAdmin", "Admin", "Editor", "Moderator"],
  "content:moderate": ["Root", "SuperAdmin", "Admin", "Moderator"],
  "directory:manage": ["Root", "SuperAdmin", "Admin", "Editor"],
  "system:settings": ["Root", "SuperAdmin"],
  "system:logs": ["Root"],
};

// Roles that grant admin panel access
export const ADMIN_ROLES: UserRole[] = [
  "Root",
  "SuperAdmin",
  "Admin",
  "BuildingChairman",
  "ComplexChairman",
  "Editor",
  "Moderator",
];

/**
 * Get all roles that a role inherits from (including itself)
 */
function getInheritedRoles(role: UserRole, visited = new Set<UserRole>()): Set<UserRole> {
  if (visited.has(role)) return visited;
  visited.add(role);

  const inheritedRoles = ROLE_HIERARCHY[role] ?? [];
  for (const inheritedRole of inheritedRoles) {
    getInheritedRoles(inheritedRole, visited);
  }

  return visited;
}

/**
 * Get all effective roles for a user (including inherited roles)
 */
export function getEffectiveRoles(userRoles: UserRole[]): Set<UserRole> {
  const effectiveRoles = new Set<UserRole>();

  for (const role of userRoles) {
    const inherited = getInheritedRoles(role);
    for (const r of inherited) {
      effectiveRoles.add(r);
    }
  }

  return effectiveRoles;
}

/**
 * Check if user has access to a specific feature
 */
export function hasFeatureAccess(
  userRoles: UserRole[],
  feature: AdminFeature,
): boolean {
  const allowedRoles = FEATURE_PERMISSIONS[feature];
  if (!allowedRoles) return false;

  const effectiveRoles = getEffectiveRoles(userRoles);

  return allowedRoles.some((role) => effectiveRoles.has(role));
}

/**
 * Check if user has admin panel access
 */
export function isAdmin(userRoles: UserRole[]): boolean {
  return hasFeatureAccess(userRoles, "admin:access");
}

/**
 * Get list of features user has access to
 */
export function getAccessibleFeatures(userRoles: UserRole[]): AdminFeature[] {
  const features: AdminFeature[] = [];

  for (const feature of Object.keys(FEATURE_PERMISSIONS) as AdminFeature[]) {
    if (hasFeatureAccess(userRoles, feature)) {
      features.push(feature);
    }
  }

  return features;
}

/**
 * Navigation items for admin panel based on features
 */
export interface AdminNavItem {
  title: string;
  href: string;
  icon: string; // Icon name for lucide-react
  feature: AdminFeature;
}

export const ADMIN_NAV_ITEMS: AdminNavItem[] = [
  {
    title: "Пользователи",
    href: "/admin/users",
    icon: "Users",
    feature: "users:view",
  },
  {
    title: "Здания",
    href: "/admin/buildings",
    icon: "Building2",
    feature: "buildings:view",
  },
  {
    title: "Заявки",
    href: "/admin/claims",
    icon: "ClipboardList",
    feature: "claims:view",
  },
  {
    title: "Объявления",
    href: "/admin/listings",
    icon: "Megaphone",
    feature: "listings:view",
  },
  {
    title: "Контент",
    href: "/admin/content",
    icon: "FileText",
    feature: "content:view",
  },
  {
    title: "Справочная",
    href: "/admin/directory",
    icon: "BookOpen",
    feature: "directory:manage",
  },
  {
    title: "Настройки",
    href: "/admin/settings",
    icon: "Settings",
    feature: "system:settings",
  },
  {
    title: "Логи",
    href: "/admin/logs",
    icon: "ScrollText",
    feature: "system:logs",
  },
];

/**
 * Get navigation items available for user based on their roles
 */
export function getAdminNavItems(userRoles: UserRole[]): AdminNavItem[] {
  return ADMIN_NAV_ITEMS.filter((item) =>
    hasFeatureAccess(userRoles, item.feature),
  );
}
