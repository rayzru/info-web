import { TRPCError } from "@trpc/server";
import { and, count, desc, eq, gte, lte, sql } from "drizzle-orm";
import { z } from "zod";

import { analyticsEvents, analyticsSessions } from "~/server/db/schema";

import { adminProcedureWithFeature, createTRPCRouter, publicProcedure } from "../trpc";

// Session duration in milliseconds (30 minutes)
const SESSION_DURATION_MS = 30 * 60 * 1000;

// Device type detection
function detectDeviceType(userAgent: string): "desktop" | "mobile" | "tablet" | "unknown" {
  const ua = userAgent.toLowerCase();
  if (/tablet|ipad|playbook|silk/i.test(ua)) return "tablet";
  if (/mobile|iphone|ipod|android|blackberry|opera mini|iemobile/i.test(ua)) return "mobile";
  if (/windows|macintosh|linux/i.test(ua)) return "desktop";
  return "unknown";
}

// Browser detection
function detectBrowser(userAgent: string): string {
  const ua = userAgent.toLowerCase();
  if (ua.includes("firefox")) return "Firefox";
  if (ua.includes("edg")) return "Edge";
  if (ua.includes("chrome")) return "Chrome";
  if (ua.includes("safari")) return "Safari";
  if (ua.includes("opera") || ua.includes("opr")) return "Opera";
  return "Other";
}

// OS detection
function detectOS(userAgent: string): string {
  const ua = userAgent.toLowerCase();
  if (ua.includes("windows")) return "Windows";
  if (ua.includes("mac os") || ua.includes("macos")) return "macOS";
  if (ua.includes("linux")) return "Linux";
  if (ua.includes("android")) return "Android";
  if (ua.includes("iphone") || ua.includes("ipad")) return "iOS";
  return "Other";
}

export const analyticsRouter = createTRPCRouter({
  // ==================== PUBLIC TRACKING API ====================

  // Get or create a session
  getSession: publicProcedure
    .input(
      z.object({
        sessionId: z.string().uuid().optional(),
        entryPage: z.string().max(500),
        referrer: z.string().max(1000).optional(),
        screenResolution: z.string().max(20).optional(),
        utmSource: z.string().max(100).optional(),
        utmMedium: z.string().max(100).optional(),
        utmCampaign: z.string().max(100).optional(),
        utmTerm: z.string().max(100).optional(),
        utmContent: z.string().max(100).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userAgent = ctx.headers.get("user-agent") ?? "";
      const userId = ctx.session?.user?.id;

      // Check if existing session is still valid
      if (input.sessionId) {
        const existingSession = await ctx.db.query.analyticsSessions.findFirst({
          where: eq(analyticsSessions.id, input.sessionId),
        });

        if (existingSession) {
          const lastActivity = new Date(existingSession.lastActivityAt).getTime();
          const now = Date.now();

          // Session still active
          if (now - lastActivity < SESSION_DURATION_MS) {
            // Update last activity
            await ctx.db
              .update(analyticsSessions)
              .set({
                lastActivityAt: new Date(),
                userId: userId ?? existingSession.userId,
              })
              .where(eq(analyticsSessions.id, input.sessionId));

            return { sessionId: input.sessionId, isNew: false };
          }
        }
      }

      // Create new session
      const [newSession] = await ctx.db
        .insert(analyticsSessions)
        .values({
          userId,
          entryPage: input.entryPage,
          referrer: input.referrer,
          deviceType: detectDeviceType(userAgent),
          browser: detectBrowser(userAgent),
          os: detectOS(userAgent),
          screenResolution: input.screenResolution,
          utmSource: input.utmSource,
          utmMedium: input.utmMedium,
          utmCampaign: input.utmCampaign,
          utmTerm: input.utmTerm,
          utmContent: input.utmContent,
        })
        .returning({ id: analyticsSessions.id });

      return { sessionId: newSession!.id, isNew: true };
    }),

  // Track an event
  track: publicProcedure
    .input(
      z.object({
        sessionId: z.string().uuid(),
        eventType: z.enum(["page_view", "action", "conversion"]),
        eventName: z.string().max(100),
        eventCategory: z.string().max(50).optional(),
        pagePath: z.string().max(500),
        pageTitle: z.string().max(200).optional(),
        referrer: z.string().max(1000).optional(),
        properties: z.record(z.string(), z.unknown()).optional(),
        loadTimeMs: z.string().max(10).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session?.user?.id;

      // Verify session exists
      const session = await ctx.db.query.analyticsSessions.findFirst({
        where: eq(analyticsSessions.id, input.sessionId),
        columns: { id: true },
      });

      if (!session) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Session not found",
        });
      }

      // Update session last activity
      await ctx.db
        .update(analyticsSessions)
        .set({
          lastActivityAt: new Date(),
          userId: userId ?? undefined,
        })
        .where(eq(analyticsSessions.id, input.sessionId));

      // Insert event
      await ctx.db.insert(analyticsEvents).values({
        sessionId: input.sessionId,
        userId,
        eventType: input.eventType,
        eventName: input.eventName,
        eventCategory: input.eventCategory,
        pagePath: input.pagePath,
        pageTitle: input.pageTitle,
        referrer: input.referrer,
        properties: input.properties,
        loadTimeMs: input.loadTimeMs,
      });

      return { success: true };
    }),

  // Batch track multiple events (for offline/batched sends)
  trackBatch: publicProcedure
    .input(
      z.object({
        sessionId: z.string().uuid(),
        events: z
          .array(
            z.object({
              eventType: z.enum(["page_view", "action", "conversion"]),
              eventName: z.string().max(100),
              eventCategory: z.string().max(50).optional(),
              pagePath: z.string().max(500),
              pageTitle: z.string().max(200).optional(),
              properties: z.record(z.string(), z.unknown()).optional(),
              timestamp: z.string().datetime().optional(),
            })
          )
          .max(50),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session?.user?.id;

      // Verify session exists
      const session = await ctx.db.query.analyticsSessions.findFirst({
        where: eq(analyticsSessions.id, input.sessionId),
        columns: { id: true },
      });

      if (!session) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Session not found",
        });
      }

      // Insert all events
      if (input.events.length > 0) {
        await ctx.db.insert(analyticsEvents).values(
          input.events.map((event) => ({
            sessionId: input.sessionId,
            userId,
            eventType: event.eventType,
            eventName: event.eventName,
            eventCategory: event.eventCategory,
            pagePath: event.pagePath,
            pageTitle: event.pageTitle,
            properties: event.properties,
            createdAt: event.timestamp ? new Date(event.timestamp) : new Date(),
          }))
        );
      }

      // Update session last activity
      await ctx.db
        .update(analyticsSessions)
        .set({ lastActivityAt: new Date() })
        .where(eq(analyticsSessions.id, input.sessionId));

      return { success: true, count: input.events.length };
    }),

  // ==================== ADMIN DASHBOARD API ====================

  // Get dashboard overview stats
  dashboard: adminProcedureWithFeature("admin:access")
    .input(
      z.object({
        period: z.enum(["today", "week", "month", "year"]).default("week"),
      })
    )
    .query(async ({ ctx, input }) => {
      const now = new Date();
      let startDate: Date;

      switch (input.period) {
        case "today":
          startDate = new Date(now.setHours(0, 0, 0, 0));
          break;
        case "week":
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case "month":
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        case "year":
          startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
          break;
      }

      // Get counts in parallel
      const [
        totalSessionsResult,
        totalEventsResult,
        pageViewsResult,
        actionsResult,
        conversionsResult,
        uniqueUsersResult,
      ] = await Promise.all([
        // Total sessions
        ctx.db
          .select({ count: count() })
          .from(analyticsSessions)
          .where(gte(analyticsSessions.startedAt, startDate)),

        // Total events
        ctx.db
          .select({ count: count() })
          .from(analyticsEvents)
          .where(gte(analyticsEvents.createdAt, startDate)),

        // Page views
        ctx.db
          .select({ count: count() })
          .from(analyticsEvents)
          .where(
            and(
              gte(analyticsEvents.createdAt, startDate),
              eq(analyticsEvents.eventType, "page_view")
            )
          ),

        // Actions
        ctx.db
          .select({ count: count() })
          .from(analyticsEvents)
          .where(
            and(gte(analyticsEvents.createdAt, startDate), eq(analyticsEvents.eventType, "action"))
          ),

        // Conversions
        ctx.db
          .select({ count: count() })
          .from(analyticsEvents)
          .where(
            and(
              gte(analyticsEvents.createdAt, startDate),
              eq(analyticsEvents.eventType, "conversion")
            )
          ),

        // Unique users (with userId)
        ctx.db
          .selectDistinct({ userId: analyticsSessions.userId })
          .from(analyticsSessions)
          .where(
            and(
              gte(analyticsSessions.startedAt, startDate),
              sql`${analyticsSessions.userId} IS NOT NULL`
            )
          ),
      ]);

      return {
        sessions: totalSessionsResult[0]?.count ?? 0,
        events: totalEventsResult[0]?.count ?? 0,
        pageViews: pageViewsResult[0]?.count ?? 0,
        actions: actionsResult[0]?.count ?? 0,
        conversions: conversionsResult[0]?.count ?? 0,
        uniqueUsers: uniqueUsersResult.length,
        period: input.period,
      };
    }),

  // Get top pages
  topPages: adminProcedureWithFeature("admin:access")
    .input(
      z.object({
        period: z.enum(["today", "week", "month"]).default("week"),
        limit: z.number().min(1).max(50).default(10),
      })
    )
    .query(async ({ ctx, input }) => {
      const now = new Date();
      let startDate: Date;

      switch (input.period) {
        case "today":
          startDate = new Date(now.setHours(0, 0, 0, 0));
          break;
        case "week":
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case "month":
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
      }

      const pages = await ctx.db
        .select({
          pagePath: analyticsEvents.pagePath,
          views: count(),
        })
        .from(analyticsEvents)
        .where(
          and(gte(analyticsEvents.createdAt, startDate), eq(analyticsEvents.eventType, "page_view"))
        )
        .groupBy(analyticsEvents.pagePath)
        .orderBy(desc(count()))
        .limit(input.limit);

      return pages;
    }),

  // Get device breakdown
  deviceStats: adminProcedureWithFeature("admin:access")
    .input(
      z.object({
        period: z.enum(["today", "week", "month"]).default("week"),
      })
    )
    .query(async ({ ctx, input }) => {
      const now = new Date();
      let startDate: Date;

      switch (input.period) {
        case "today":
          startDate = new Date(now.setHours(0, 0, 0, 0));
          break;
        case "week":
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case "month":
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
      }

      const devices = await ctx.db
        .select({
          deviceType: analyticsSessions.deviceType,
          count: count(),
        })
        .from(analyticsSessions)
        .where(gte(analyticsSessions.startedAt, startDate))
        .groupBy(analyticsSessions.deviceType);

      return devices;
    }),

  // Get browser breakdown
  browserStats: adminProcedureWithFeature("admin:access")
    .input(
      z.object({
        period: z.enum(["today", "week", "month"]).default("week"),
      })
    )
    .query(async ({ ctx, input }) => {
      const now = new Date();
      let startDate: Date;

      switch (input.period) {
        case "today":
          startDate = new Date(now.setHours(0, 0, 0, 0));
          break;
        case "week":
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case "month":
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
      }

      const browsers = await ctx.db
        .select({
          browser: analyticsSessions.browser,
          count: count(),
        })
        .from(analyticsSessions)
        .where(gte(analyticsSessions.startedAt, startDate))
        .groupBy(analyticsSessions.browser)
        .orderBy(desc(count()))
        .limit(10);

      return browsers;
    }),

  // Get conversion events
  conversionEvents: adminProcedureWithFeature("admin:access")
    .input(
      z.object({
        period: z.enum(["today", "week", "month"]).default("week"),
        limit: z.number().min(1).max(50).default(10),
      })
    )
    .query(async ({ ctx, input }) => {
      const now = new Date();
      let startDate: Date;

      switch (input.period) {
        case "today":
          startDate = new Date(now.setHours(0, 0, 0, 0));
          break;
        case "week":
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case "month":
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
      }

      const conversions = await ctx.db
        .select({
          eventName: analyticsEvents.eventName,
          count: count(),
        })
        .from(analyticsEvents)
        .where(
          and(
            gte(analyticsEvents.createdAt, startDate),
            eq(analyticsEvents.eventType, "conversion")
          )
        )
        .groupBy(analyticsEvents.eventName)
        .orderBy(desc(count()))
        .limit(input.limit);

      return conversions;
    }),

  // Get referrer sources
  referrerStats: adminProcedureWithFeature("admin:access")
    .input(
      z.object({
        period: z.enum(["today", "week", "month"]).default("week"),
        limit: z.number().min(1).max(50).default(10),
      })
    )
    .query(async ({ ctx, input }) => {
      const now = new Date();
      let startDate: Date;

      switch (input.period) {
        case "today":
          startDate = new Date(now.setHours(0, 0, 0, 0));
          break;
        case "week":
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case "month":
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
      }

      const referrers = await ctx.db
        .select({
          referrer: analyticsSessions.referrer,
          count: count(),
        })
        .from(analyticsSessions)
        .where(
          and(
            gte(analyticsSessions.startedAt, startDate),
            sql`${analyticsSessions.referrer} IS NOT NULL`
          )
        )
        .groupBy(analyticsSessions.referrer)
        .orderBy(desc(count()))
        .limit(input.limit);

      return referrers;
    }),

  // Get visits over time for charts
  visitsTimeSeries: adminProcedureWithFeature("admin:access")
    .input(
      z.object({
        period: z.enum(["today", "week", "month"]).default("week"),
      })
    )
    .query(async ({ ctx, input }) => {
      const now = new Date();
      let startDate: Date;
      let intervalLabel: string;

      // Build SQL expressions based on period (format string must be raw SQL literal)
      let sessionsPeriodExpr;
      let eventsPeriodExpr;

      switch (input.period) {
        case "today":
          startDate = new Date(now);
          startDate.setHours(0, 0, 0, 0);
          intervalLabel = "hour";
          sessionsPeriodExpr = sql<string>`to_char(${analyticsSessions.startedAt}, 'HH24')`;
          eventsPeriodExpr = sql<string>`to_char(${analyticsEvents.createdAt}, 'HH24')`;
          break;
        case "week":
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          intervalLabel = "day";
          sessionsPeriodExpr = sql<string>`to_char(${analyticsSessions.startedAt}, 'YYYY-MM-DD')`;
          eventsPeriodExpr = sql<string>`to_char(${analyticsEvents.createdAt}, 'YYYY-MM-DD')`;
          break;
        case "month":
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          intervalLabel = "day";
          sessionsPeriodExpr = sql<string>`to_char(${analyticsSessions.startedAt}, 'YYYY-MM-DD')`;
          eventsPeriodExpr = sql<string>`to_char(${analyticsEvents.createdAt}, 'YYYY-MM-DD')`;
          break;
      }

      // Get sessions over time
      const sessionsOverTime = await ctx.db
        .select({
          period: sessionsPeriodExpr,
          sessions: count(),
        })
        .from(analyticsSessions)
        .where(gte(analyticsSessions.startedAt, startDate))
        .groupBy(sessionsPeriodExpr)
        .orderBy(sessionsPeriodExpr);

      // Get page views over time
      const pageViewsOverTime = await ctx.db
        .select({
          period: eventsPeriodExpr,
          pageViews: count(),
        })
        .from(analyticsEvents)
        .where(
          and(gte(analyticsEvents.createdAt, startDate), eq(analyticsEvents.eventType, "page_view"))
        )
        .groupBy(eventsPeriodExpr)
        .orderBy(eventsPeriodExpr);

      // Merge sessions and page views data
      const dataMap = new Map<string, { sessions: number; pageViews: number }>();

      for (const s of sessionsOverTime) {
        dataMap.set(s.period, { sessions: s.sessions, pageViews: 0 });
      }

      for (const p of pageViewsOverTime) {
        const existing = dataMap.get(p.period);
        if (existing) {
          existing.pageViews = p.pageViews;
        } else {
          dataMap.set(p.period, { sessions: 0, pageViews: p.pageViews });
        }
      }

      // Sort by period and return
      const data = Array.from(dataMap.entries())
        .sort((a, b) => a[0].localeCompare(b[0]))
        .map(([period, values]) => ({
          period,
          sessions: values.sessions,
          pageViews: values.pageViews,
        }));

      return {
        data,
        intervalLabel,
        period: input.period,
      };
    }),
});
