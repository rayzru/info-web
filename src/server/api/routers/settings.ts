import { eq } from "drizzle-orm";
import { z } from "zod";

import { type MaintenanceSettings, SETTING_KEYS, systemSettings } from "~/server/db/schema";

import { adminProcedureWithFeature, createTRPCRouter, publicProcedure } from "../trpc";

// ============================================================================
// Validation Schemas
// ============================================================================

const maintenanceSettingsSchema = z.object({
  enabled: z.boolean(),
  message: z.string().max(500).optional(),
  expectedEndTime: z.string().datetime().optional(),
  allowedIps: z.array(z.string()).optional(),
});

// ============================================================================
// Router
// ============================================================================

export const settingsRouter = createTRPCRouter({
  // ========================================
  // Public Procedures
  // ========================================

  /**
   * Check if maintenance mode is enabled
   * Used by middleware and client
   */
  isMaintenanceMode: publicProcedure.query(async ({ ctx }) => {
    const setting = await ctx.db.query.systemSettings.findFirst({
      where: eq(systemSettings.key, SETTING_KEYS.MAINTENANCE_MODE),
    });

    if (!setting) {
      return { enabled: false };
    }

    const value = setting.value as MaintenanceSettings;
    return {
      enabled: value.enabled,
      message: value.enabled ? value.message : undefined,
      expectedEndTime: value.enabled ? value.expectedEndTime : undefined,
    };
  }),

  // ========================================
  // Admin Procedures
  // ========================================

  /**
   * Get maintenance mode settings
   */
  getMaintenanceSettings: adminProcedureWithFeature("system:settings").query(async ({ ctx }) => {
    const setting = await ctx.db.query.systemSettings.findFirst({
      where: eq(systemSettings.key, SETTING_KEYS.MAINTENANCE_MODE),
    });

    if (!setting) {
      return {
        enabled: false,
        message: "",
        expectedEndTime: undefined,
        allowedIps: [],
      } satisfies MaintenanceSettings;
    }

    return setting.value as MaintenanceSettings;
  }),

  /**
   * Update maintenance mode settings
   */
  updateMaintenanceSettings: adminProcedureWithFeature("system:settings")
    .input(maintenanceSettingsSchema)
    .mutation(async ({ ctx, input }) => {
      const existing = await ctx.db.query.systemSettings.findFirst({
        where: eq(systemSettings.key, SETTING_KEYS.MAINTENANCE_MODE),
      });

      if (existing) {
        await ctx.db
          .update(systemSettings)
          .set({ value: input })
          .where(eq(systemSettings.key, SETTING_KEYS.MAINTENANCE_MODE));
      } else {
        await ctx.db.insert(systemSettings).values({
          key: SETTING_KEYS.MAINTENANCE_MODE,
          value: input,
          description: "Maintenance mode configuration",
        });
      }

      return { success: true };
    }),

  /**
   * Toggle maintenance mode on/off quickly
   */
  toggleMaintenanceMode: adminProcedureWithFeature("system:settings")
    .input(z.object({ enabled: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      const existing = await ctx.db.query.systemSettings.findFirst({
        where: eq(systemSettings.key, SETTING_KEYS.MAINTENANCE_MODE),
      });

      const currentSettings = existing
        ? (existing.value as MaintenanceSettings)
        : { enabled: false };

      const newSettings: MaintenanceSettings = {
        ...currentSettings,
        enabled: input.enabled,
      };

      if (existing) {
        await ctx.db
          .update(systemSettings)
          .set({ value: newSettings })
          .where(eq(systemSettings.key, SETTING_KEYS.MAINTENANCE_MODE));
      } else {
        await ctx.db.insert(systemSettings).values({
          key: SETTING_KEYS.MAINTENANCE_MODE,
          value: newSettings,
          description: "Maintenance mode configuration",
        });
      }

      return { success: true, enabled: input.enabled };
    }),
});
