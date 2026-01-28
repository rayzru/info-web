import { and, count, desc, eq, ilike, inArray, isNull, or, sql } from "drizzle-orm";
import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  adminProcedure,
} from "~/server/api/trpc";
import {
  directoryEntries,
  directoryContacts,
  directorySchedules,
  directoryTags,
  directoryEntryTags,
  directoryContactTags,
  directoryAnalytics,
  directoryTagStats,
  directoryEntryStats,
  buildings,
  userApartments,
  apartments,
  floors,
  entrances,
  userParkingSpots,
  parkingSpots,
  parkingFloors,
  parkings,
} from "~/server/db/schema";

// ============== SCHEMAS ==============

const directoryEntryTypeSchema = z.enum([
  "contact",
  "organization",
  "location",
  "document",
]);

const directoryContactTypeSchema = z.enum([
  "phone",
  "email",
  "address",
  "telegram",
  "whatsapp",
  "website",
  "vk",
  "other",
]);

const directoryScopeSchema = z.enum([
  "core", // ЖК-related: УК, здания, коммуникации
  "commerce", // Арендаторы на территории ЖК
  "city", // Городская инфраструктура
  "promoted", // Рекламные размещения
]);

const directoryEventTypeSchema = z.enum([
  "search", // Поисковый запрос
  "tag_click", // Клик по тегу
  "entry_view", // Просмотр записи
  "entry_call", // Клик по телефону
  "entry_link", // Клик по ссылке
]);

// ============== HELPER FUNCTIONS ==============

/**
 * Transliteration map for Cyrillic to Latin characters
 */
const TRANSLITERATION_MAP: Record<string, string> = {
  а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "yo",
  ж: "zh", з: "z", и: "i", й: "y", к: "k", л: "l", м: "m",
  н: "n", о: "o", п: "p", р: "r", с: "s", т: "t", у: "u",
  ф: "f", х: "h", ц: "ts", ч: "ch", ш: "sh", щ: "sch",
  ъ: "", ы: "y", ь: "", э: "e", ю: "yu", я: "ya",
};

/**
 * Convert text to URL-friendly slug with transliteration
 * - Transliterates Cyrillic to Latin
 * - Converts to lowercase
 * - Replaces spaces with hyphens
 * - Removes special characters
 */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .split("")
    .map((char) => TRANSLITERATION_MAP[char] ?? char)
    .join("")
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .substring(0, 100);
}


// ============== ROUTER ==============

export const directoryRouter = createTRPCRouter({
  // ============== PUBLIC PROCEDURES ==============

  // Get all tags (tree structure)
  getTags: publicProcedure
    .input(
      z
        .object({
          parentId: z.string().nullish(),
          scope: directoryScopeSchema.optional(),
          includeAll: z.boolean().optional(),
        })
        .optional()
    )
    .query(async ({ ctx, input }) => {
      const parentId = input?.parentId ?? null;
      const scope = input?.scope;
      const includeAll = input?.includeAll ?? false;

      // Build conditions
      const conditions: ReturnType<typeof eq>[] = [];

      if (!includeAll) {
        if (parentId) {
          conditions.push(eq(directoryTags.parentId, parentId));
        } else {
          conditions.push(isNull(directoryTags.parentId));
        }
      }

      if (scope) {
        conditions.push(eq(directoryTags.scope, scope));
      }

      const tags = await ctx.db.query.directoryTags.findMany({
        where: conditions.length > 0 ? and(...conditions) : undefined,
        orderBy: [directoryTags.order, directoryTags.name],
      });

      // Get entry counts for each tag
      const tagsWithCounts = await Promise.all(
        tags.map(async (tag) => {
          const [result] = await ctx.db
            .select({ count: count() })
            .from(directoryEntryTags)
            .innerJoin(
              directoryEntries,
              eq(directoryEntryTags.entryId, directoryEntries.id)
            )
            .where(
              and(
                eq(directoryEntryTags.tagId, tag.id),
                eq(directoryEntries.isActive, 1)
              )
            );

          // Check if has children
          const [childCount] = await ctx.db
            .select({ count: count() })
            .from(directoryTags)
            .where(eq(directoryTags.parentId, tag.id));

          return {
            ...tag,
            synonyms: tag.synonyms ? JSON.parse(tag.synonyms) : [],
            scope: tag.scope,
            entryCount: result?.count ?? 0,
            hasChildren: (childCount?.count ?? 0) > 0,
          };
        })
      );

      return tagsWithCounts;
    }),

  // Get tag by slug with breadcrumb path
  getTag: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      const tag = await ctx.db.query.directoryTags.findFirst({
        where: eq(directoryTags.slug, input.slug),
      });

      if (!tag) return null;

      // Build breadcrumb path
      const path: typeof tag[] = [tag];
      let currentTag = tag;

      while (currentTag.parentId) {
        const parent = await ctx.db.query.directoryTags.findFirst({
          where: eq(directoryTags.id, currentTag.parentId),
        });
        if (parent) {
          path.unshift(parent);
          currentTag = parent;
        } else {
          break;
        }
      }

      return {
        ...tag,
        synonyms: tag.synonyms ? JSON.parse(tag.synonyms) : [],
        path,
      };
    }),

  // Search entries
  search: publicProcedure
    .input(
      z.object({
        query: z.string().min(2).max(100),
        type: directoryEntryTypeSchema.optional(),
        tagIds: z.array(z.string()).optional(),
        limit: z.number().min(1).max(100).default(20),
        offset: z.number().min(0).default(0),
      })
    )
    .query(async ({ ctx, input }) => {
      const { query, type, tagIds, limit, offset } = input;
      const searchPattern = `%${query}%`;

      // Build conditions
      const conditions = [
        eq(directoryEntries.isActive, 1),
        or(
          ilike(directoryEntries.title, searchPattern),
          ilike(directoryEntries.description, searchPattern)
        ),
      ];

      if (type) {
        conditions.push(eq(directoryEntries.type, type));
      }

      // Get entries
      let entriesQuery = ctx.db
        .select()
        .from(directoryEntries)
        .where(and(...conditions))
        .orderBy(directoryEntries.order, directoryEntries.title)
        .limit(limit)
        .offset(offset);

      // Filter by tags if specified
      if (tagIds && tagIds.length > 0) {
        const entryIdsWithTags = await ctx.db
          .selectDistinct({ entryId: directoryEntryTags.entryId })
          .from(directoryEntryTags)
          .where(inArray(directoryEntryTags.tagId, tagIds));

        const entryIds = entryIdsWithTags.map((e) => e.entryId);
        if (entryIds.length === 0) {
          return { results: [], total: 0, hasMore: false };
        }

        conditions.push(inArray(directoryEntries.id, entryIds));
        entriesQuery = ctx.db
          .select()
          .from(directoryEntries)
          .where(and(...conditions))
          .orderBy(directoryEntries.order, directoryEntries.title)
          .limit(limit)
          .offset(offset);
      }

      const entries = await entriesQuery;

      // Get total count
      const [totalResult] = await ctx.db
        .select({ count: count() })
        .from(directoryEntries)
        .where(and(...conditions));

      // Get contacts and tags for each entry
      const results = await Promise.all(
        entries.map(async (entry) => {
          const contacts = await ctx.db.query.directoryContacts.findMany({
            where: eq(directoryContacts.entryId, entry.id),
            orderBy: [directoryContacts.isPrimary, directoryContacts.order],
          });

          const entryTags = await ctx.db
            .select({ tag: directoryTags })
            .from(directoryEntryTags)
            .innerJoin(
              directoryTags,
              eq(directoryEntryTags.tagId, directoryTags.id)
            )
            .where(eq(directoryEntryTags.entryId, entry.id));

          return {
            ...entry,
            contacts,
            tags: entryTags.map((et) => et.tag),
          };
        })
      );

      return {
        results,
        total: totalResult?.count ?? 0,
        hasMore: offset + limit < (totalResult?.count ?? 0),
      };
    }),

  // Get entries by tag
  byTag: publicProcedure
    .input(
      z.object({
        tagSlug: z.string(),
        includeChildren: z.boolean().default(true),
        limit: z.number().min(1).max(100).default(20),
        offset: z.number().min(0).default(0),
      })
    )
    .query(async ({ ctx, input }) => {
      const { tagSlug, includeChildren, limit, offset } = input;

      // Get tag
      const tag = await ctx.db.query.directoryTags.findFirst({
        where: eq(directoryTags.slug, tagSlug),
      });

      if (!tag) {
        return { tag: null, entries: [], childTags: [], total: 0 };
      }

      // Collect all tag IDs (including children if requested)
      const tagIds = [tag.id];
      if (includeChildren) {
        const collectChildIds = async (parentId: string) => {
          const children = await ctx.db.query.directoryTags.findMany({
            where: eq(directoryTags.parentId, parentId),
          });
          for (const child of children) {
            tagIds.push(child.id);
            await collectChildIds(child.id);
          }
        };
        await collectChildIds(tag.id);
      }

      // Get entries with these tags
      const entryIdsWithTags = await ctx.db
        .selectDistinct({ entryId: directoryEntryTags.entryId })
        .from(directoryEntryTags)
        .innerJoin(
          directoryEntries,
          eq(directoryEntryTags.entryId, directoryEntries.id)
        )
        .where(
          and(
            inArray(directoryEntryTags.tagId, tagIds),
            eq(directoryEntries.isActive, 1)
          )
        );

      const entryIds = entryIdsWithTags.map((e) => e.entryId);

      if (entryIds.length === 0) {
        const childTags = await ctx.db.query.directoryTags.findMany({
          where: eq(directoryTags.parentId, tag.id),
          orderBy: [directoryTags.order, directoryTags.name],
        });

        return {
          tag,
          entries: [],
          childTags,
          total: 0,
        };
      }

      // Get entries
      const entries = await ctx.db.query.directoryEntries.findMany({
        where: and(
          inArray(directoryEntries.id, entryIds),
          eq(directoryEntries.isActive, 1)
        ),
        orderBy: [directoryEntries.order, directoryEntries.title],
        limit,
        offset,
      });

      // Get contacts for entries
      const results = await Promise.all(
        entries.map(async (entry) => {
          const contacts = await ctx.db.query.directoryContacts.findMany({
            where: eq(directoryContacts.entryId, entry.id),
            orderBy: [directoryContacts.isPrimary, directoryContacts.order],
          });

          return {
            ...entry,
            contacts,
          };
        })
      );

      // Get child tags
      const childTags = await ctx.db.query.directoryTags.findMany({
        where: eq(directoryTags.parentId, tag.id),
        orderBy: [directoryTags.order, directoryTags.name],
      });

      return {
        tag,
        entries: results,
        childTags,
        total: entryIds.length,
      };
    }),

  // Get single entry by slug
  getEntry: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      const entry = await ctx.db.query.directoryEntries.findFirst({
        where: and(
          eq(directoryEntries.slug, input.slug),
          eq(directoryEntries.isActive, 1)
        ),
      });

      if (!entry) return null;

      // Get contacts
      const contacts = await ctx.db.query.directoryContacts.findMany({
        where: eq(directoryContacts.entryId, entry.id),
        orderBy: [directoryContacts.isPrimary, directoryContacts.order],
      });

      // Get schedules
      const schedules = await ctx.db.query.directorySchedules.findMany({
        where: eq(directorySchedules.entryId, entry.id),
        orderBy: directorySchedules.dayOfWeek,
      });

      // Get tags
      const entryTags = await ctx.db
        .select({ tag: directoryTags })
        .from(directoryEntryTags)
        .innerJoin(
          directoryTags,
          eq(directoryEntryTags.tagId, directoryTags.id)
        )
        .where(eq(directoryEntryTags.entryId, entry.id));

      // Get building if linked
      let building = null;
      if (entry.buildingId) {
        building = await ctx.db.query.buildings.findFirst({
          where: eq(buildings.id, entry.buildingId),
        });
      }

      return {
        ...entry,
        contacts,
        schedules,
        tags: entryTags.map((et) => et.tag),
        building,
      };
    }),

  // Quick search suggestions
  suggest: publicProcedure
    .input(
      z.object({
        query: z.string().min(1).max(50),
        limit: z.number().min(1).max(10).default(5),
      })
    )
    .query(async ({ ctx, input }) => {
      const { query, limit } = input;
      const searchPattern = `%${query}%`;

      // Search in entries
      const entries = await ctx.db
        .select({
          title: directoryEntries.title,
          slug: directoryEntries.slug,
          type: directoryEntries.type,
        })
        .from(directoryEntries)
        .where(
          and(
            eq(directoryEntries.isActive, 1),
            ilike(directoryEntries.title, searchPattern)
          )
        )
        .limit(limit);

      // Search in tags
      const tags = await ctx.db
        .select({
          name: directoryTags.name,
          slug: directoryTags.slug,
        })
        .from(directoryTags)
        .where(ilike(directoryTags.name, searchPattern))
        .limit(limit);

      return {
        entries: entries.map((e) => ({
          title: e.title,
          slug: e.slug,
          type: e.type,
          kind: "entry" as const,
        })),
        tags: tags.map((t) => ({
          title: t.name,
          slug: t.slug,
          kind: "tag" as const,
        })),
      };
    }),

  // List all entries (paginated, for /info page)
  list: publicProcedure
    .input(
      z.object({
        type: directoryEntryTypeSchema.optional(),
        limit: z.number().min(1).max(100).default(50),
        offset: z.number().min(0).default(0),
      })
    )
    .query(async ({ ctx, input }) => {
      const { type, limit, offset } = input;

      const conditions = [eq(directoryEntries.isActive, 1)];
      if (type) {
        conditions.push(eq(directoryEntries.type, type));
      }

      const entries = await ctx.db.query.directoryEntries.findMany({
        where: and(...conditions),
        orderBy: [directoryEntries.order, directoryEntries.title],
        limit,
        offset,
      });

      // Get contacts for entries
      const results = await Promise.all(
        entries.map(async (entry) => {
          const contacts = await ctx.db.query.directoryContacts.findMany({
            where: eq(directoryContacts.entryId, entry.id),
            orderBy: [directoryContacts.isPrimary, directoryContacts.order],
          });

          const entryTags = await ctx.db
            .select({ tag: directoryTags })
            .from(directoryEntryTags)
            .innerJoin(
              directoryTags,
              eq(directoryEntryTags.tagId, directoryTags.id)
            )
            .where(eq(directoryEntryTags.entryId, entry.id));

          return {
            ...entry,
            contacts,
            tags: entryTags.map((et) => et.tag),
          };
        })
      );

      const [totalResult] = await ctx.db
        .select({ count: count() })
        .from(directoryEntries)
        .where(and(...conditions));

      return {
        entries: results,
        total: totalResult?.count ?? 0,
      };
    }),

  // ============== CONTACT-LEVEL SEARCH ==============

  // Search contacts by tags (granular search like "консьерж строение 1")
  searchContacts: publicProcedure
    .input(
      z.object({
        query: z.string().min(1).max(100),
        limit: z.number().min(1).max(100).default(50),
      })
    )
    .query(async ({ ctx, input }) => {
      const { query, limit } = input;
      const queryLower = query.toLowerCase();
      const searchWords = queryLower.split(/\s+/).filter(w => w.length >= 1);

      if (searchWords.length === 0) {
        return { contacts: [], matchedTags: [], total: 0 };
      }

      // Find tags that match the search query
      const allTags = await ctx.db.query.directoryTags.findMany();

      // Pattern for numbered tags (e.g., "подъезд 2", "строение 1", "литер 4", "стр 3")
      const numberedTagPattern = /^(подъезд|строение|литер|п|строен|лит|стр)\s*(\d+)$/i;

      // Build potential multi-word tag queries from the search words
      // e.g., for "чат строение 2", try: "чат", "строение", "2", "строение 2", "чат строение", etc.
      const potentialQueries: string[] = [];

      // First, check if any consecutive words form a numbered tag pattern
      // These get priority and exclude their component words from fuzzy matching
      const numberedPhrases = new Set<string>();
      const wordsUsedInNumberedPhrases = new Set<number>(); // indices of words used

      for (let i = 0; i < searchWords.length - 1; i++) {
        const phrase = `${searchWords[i]} ${searchWords[i + 1]}`;
        if (numberedTagPattern.test(phrase)) {
          numberedPhrases.add(phrase);
          wordsUsedInNumberedPhrases.add(i);
          wordsUsedInNumberedPhrases.add(i + 1);
        }
      }

      // Add numbered phrases first (exact match priority)
      for (const phrase of numberedPhrases) {
        potentialQueries.push(phrase);
      }

      // Add individual words only if they weren't part of a numbered phrase
      for (let i = 0; i < searchWords.length; i++) {
        const word = searchWords[i]!;
        if (word.length >= 2 && !wordsUsedInNumberedPhrases.has(i)) {
          potentialQueries.push(word);
        }
      }

      // Add other consecutive word pairs (non-numbered) for phrases like "чат строение"
      for (let i = 0; i < searchWords.length - 1; i++) {
        const phrase = `${searchWords[i]} ${searchWords[i + 1]}`;
        if (!numberedPhrases.has(phrase)) {
          potentialQueries.push(phrase);
        }
      }

      const matchedTags: typeof allTags = [];
      const matchedTagIds = new Set<string>();

      for (const potentialQuery of potentialQueries) {
        const numberedMatch = potentialQuery.match(numberedTagPattern);

        for (const tag of allTags) {
          if (matchedTagIds.has(tag.id)) continue; // Skip already matched tags

          const tagNameLower = tag.name.toLowerCase();
          const tagSlugLower = tag.slug.toLowerCase();
          const synonyms: string[] = tag.synonyms ? JSON.parse(tag.synonyms) : [];
          const synonymsLower = synonyms.map(s => s.toLowerCase());

          // If this potential query looks like a numbered tag, require exact match
          if (numberedMatch) {
            const searchNum = numberedMatch[2];
            const searchType = numberedMatch[1];

            // Check for exact match in name or synonyms
            const isExactMatch =
              tagNameLower === potentialQuery ||
              synonymsLower.some(syn => syn === potentialQuery) ||
              // Also match slug patterns like "podezd-2" or "stroenie-1"
              // Note: литер/лит should NOT map to stroenie-X directly, they use synonyms
              (searchType?.match(/^(подъезд|п)$/i) && tagSlugLower === `podezd-${searchNum}`) ||
              (searchType?.match(/^(строение|строен|стр)$/i) && tagSlugLower === `stroenie-${searchNum}`);

            if (isExactMatch) {
              matchedTags.push(tag);
              matchedTagIds.add(tag.id);
            }
          } else {
            // Regular search: check if query matches this tag
            // But skip partial matches on building/entrance patterns to avoid matching all buildings
            const isBuildingOrEntranceTag = /^(stroenie|podezd)-\d+$/.test(tagSlugLower);
            if (isBuildingOrEntranceTag) {
              // For building/entrance tags, require exact name match, not partial
              if (tagNameLower === potentialQuery || synonymsLower.some(syn => syn === potentialQuery)) {
                matchedTags.push(tag);
                matchedTagIds.add(tag.id);
              }
            } else if (
              tagNameLower.includes(potentialQuery) ||
              tagSlugLower.includes(potentialQuery) ||
              synonymsLower.some(syn => syn.includes(potentialQuery))
            ) {
              matchedTags.push(tag);
              matchedTagIds.add(tag.id);
            }
          }
        }
      }

      if (matchedTags.length === 0) {
        // Fallback: search in contact labels and entry titles
        const searchPattern = `%${query}%`;

        // Search contacts by label/value
        const contactsByLabel = await ctx.db
          .select({
            contact: directoryContacts,
            entry: directoryEntries,
          })
          .from(directoryContacts)
          .innerJoin(directoryEntries, eq(directoryContacts.entryId, directoryEntries.id))
          .where(
            and(
              eq(directoryEntries.isActive, 1),
              or(
                ilike(directoryContacts.label, searchPattern),
                ilike(directoryContacts.value, searchPattern),
                ilike(directoryContacts.subtitle, searchPattern)
              )
            )
          )
          .limit(limit);

        return {
          contacts: contactsByLabel.map(c => ({
            ...c.contact,
            entryTitle: c.entry.title,
            entrySlug: c.entry.slug,
            entryIcon: c.entry.icon,
            tags: [] as { id: string; name: string; slug: string }[],
          })),
          matchedTags: [],
          total: contactsByLabel.length,
        };
      }

      const matchedTagIdsArray = matchedTags.map(t => t.id);
      const useIntersection = matchedTags.length >= 2;

      // Strategy 1: Find contacts with direct contact-level tags
      const contactsWithDirectTags = await ctx.db
        .selectDistinct({ contactId: directoryContactTags.contactId })
        .from(directoryContactTags)
        .where(inArray(directoryContactTags.tagId, matchedTagIdsArray));

      // Strategy 2: Find entries with matching tags, then get their contacts
      const entriesWithTags = await ctx.db
        .selectDistinct({ entryId: directoryEntryTags.entryId })
        .from(directoryEntryTags)
        .innerJoin(directoryEntries, eq(directoryEntryTags.entryId, directoryEntries.id))
        .where(
          and(
            inArray(directoryEntryTags.tagId, matchedTagIdsArray),
            eq(directoryEntries.isActive, 1)
          )
        );

      const entryIds = entriesWithTags.map(e => e.entryId);

      // Get contacts from matched entries
      let contactsFromEntries: { contactId: string }[] = [];
      if (entryIds.length > 0) {
        contactsFromEntries = await ctx.db
          .select({ contactId: directoryContacts.id })
          .from(directoryContacts)
          .where(inArray(directoryContacts.entryId, entryIds));
      }

      // Combine both sources (union for candidates)
      const allContactIds = new Set<string>([
        ...contactsWithDirectTags.map(c => c.contactId),
        ...contactsFromEntries.map(c => c.contactId),
      ]);

      if (allContactIds.size === 0) {
        // Final fallback: search in contact labels and entry titles
        const searchPattern = `%${query}%`;
        const contactsByLabel = await ctx.db
          .select({
            contact: directoryContacts,
            entry: directoryEntries,
          })
          .from(directoryContacts)
          .innerJoin(directoryEntries, eq(directoryContacts.entryId, directoryEntries.id))
          .where(
            and(
              eq(directoryEntries.isActive, 1),
              or(
                ilike(directoryContacts.label, searchPattern),
                ilike(directoryContacts.subtitle, searchPattern),
                ilike(directoryEntries.title, searchPattern)
              )
            )
          )
          .limit(limit);

        return {
          contacts: contactsByLabel.map(c => ({
            ...c.contact,
            entryTitle: c.entry.title,
            entrySlug: c.entry.slug,
            entryIcon: c.entry.icon,
            tags: [] as { id: string; name: string; slug: string }[],
          })),
          matchedTags: matchedTags.map(t => ({ id: t.id, name: t.name, slug: t.slug })),
          total: contactsByLabel.length,
        };
      }

      // Get full contact data with entry info
      const contacts = await ctx.db
        .select({
          contact: directoryContacts,
          entry: directoryEntries,
        })
        .from(directoryContacts)
        .innerJoin(directoryEntries, eq(directoryContacts.entryId, directoryEntries.id))
        .where(
          and(
            inArray(directoryContacts.id, Array.from(allContactIds)),
            eq(directoryEntries.isActive, 1)
          )
        )
        .limit(limit * 2); // Get more to allow sorting

      // Identify priority building tag from matched tags (e.g., "stroenie-2")
      const buildingTagPattern = /^stroenie-(\d+)$/;
      const entranceTagPattern = /^podezd-(\d+)$/;

      // Find matched building/entrance from the matched tags
      let priorityBuildingNum: number | null = null;
      let priorityEntranceNum: number | null = null;

      for (const tag of matchedTags) {
        const buildingMatch = tag.slug.match(buildingTagPattern);
        if (buildingMatch?.[1]) {
          priorityBuildingNum = parseInt(buildingMatch[1], 10);
        }
        const entranceMatch = tag.slug.match(entranceTagPattern);
        if (entranceMatch?.[1]) {
          priorityEntranceNum = parseInt(entranceMatch[1], 10);
        }
      }

      // Get tags for each contact, filter by intersection if needed, and compute sort weight
      const contactsWithTagInfo = (await Promise.all(
        contacts.map(async (c) => {
          // Get contact-level tags
          const contactTags = await ctx.db
            .select({ tag: directoryTags })
            .from(directoryContactTags)
            .innerJoin(directoryTags, eq(directoryContactTags.tagId, directoryTags.id))
            .where(eq(directoryContactTags.contactId, c.contact.id));

          // Get entry-level tags
          const entryTags = await ctx.db
            .select({ tag: directoryTags })
            .from(directoryEntryTags)
            .innerJoin(directoryTags, eq(directoryEntryTags.tagId, directoryTags.id))
            .where(eq(directoryEntryTags.entryId, c.entry.id));

          // Combine all tag IDs (contact + entry level)
          const allTagIds = new Set([
            ...contactTags.map(ct => ct.tag.id),
            ...entryTags.map(et => et.tag.id),
          ]);

          // If using intersection mode, check if contact has ALL matched tags
          if (useIntersection) {
            const hasAllTags = matchedTagIdsArray.every(tagId => allTagIds.has(tagId));
            if (!hasAllTags) {
              return null; // Exclude contacts that don't have all tags
            }
          }

          // Extract building and entrance numbers from tags
          let buildingNum = 999;
          let entranceNum = 999;

          for (const ct of contactTags) {
            const buildingMatch = ct.tag.slug.match(buildingTagPattern);
            if (buildingMatch?.[1]) {
              buildingNum = parseInt(buildingMatch[1], 10);
            }
            const entranceMatch = ct.tag.slug.match(entranceTagPattern);
            if (entranceMatch?.[1]) {
              entranceNum = parseInt(entranceMatch[1], 10);
            }
          }

          // Compute weight: lower = higher priority
          // If priority building matches, weight = 0, else weight = 100
          // Then add building number and entrance number
          let weight = 0;
          if (priorityBuildingNum !== null && buildingNum !== priorityBuildingNum) {
            weight = 1000; // Demote non-matching buildings
          }
          if (priorityEntranceNum !== null && entranceNum !== priorityEntranceNum) {
            weight += 100; // Demote non-matching entrances
          }
          weight += buildingNum * 10 + entranceNum;

          // Combine tags for display (deduplicated)
          const combinedTags = new Map<string, { id: string; name: string; slug: string }>();
          [...contactTags, ...entryTags].forEach(t => {
            combinedTags.set(t.tag.id, { id: t.tag.id, name: t.tag.name, slug: t.tag.slug });
          });

          return {
            ...c.contact,
            entryTitle: c.entry.title,
            entrySlug: c.entry.slug,
            entryIcon: c.entry.icon,
            tags: Array.from(combinedTags.values()),
            _buildingNum: buildingNum,
            _entranceNum: entranceNum,
            _weight: weight,
          };
        })
      )).filter((c): c is NonNullable<typeof c> => c !== null);

      // Sort by weight (priority building first), then building num, then entrance num
      contactsWithTagInfo.sort((a, b) => {
        if (a._weight !== b._weight) return a._weight - b._weight;
        if (a._buildingNum !== b._buildingNum) return a._buildingNum - b._buildingNum;
        return a._entranceNum - b._entranceNum;
      });

      // Remove internal sorting fields and limit
      const sortedContacts = contactsWithTagInfo.slice(0, limit).map(c => {
        const { _buildingNum, _entranceNum, _weight, ...contact } = c;
        return contact;
      });

      return {
        contacts: sortedContacts,
        matchedTags: matchedTags.map(t => ({ id: t.id, name: t.name, slug: t.slug })),
        total: sortedContacts.length,
      };
    }),

  // Get contacts by tag slug (e.g., "konsierzh" or "stroenie-1")
  contactsByTag: publicProcedure
    .input(
      z.object({
        tagSlug: z.string(),
        limit: z.number().min(1).max(100).default(50),
      })
    )
    .query(async ({ ctx, input }) => {
      const { tagSlug, limit } = input;

      // Get tag
      const tag = await ctx.db.query.directoryTags.findFirst({
        where: eq(directoryTags.slug, tagSlug),
      });

      if (!tag) {
        return { tag: null, contacts: [], total: 0 };
      }

      // Collect all tag IDs (including children)
      const tagIds = [tag.id];
      const collectChildIds = async (parentId: string) => {
        const children = await ctx.db.query.directoryTags.findMany({
          where: eq(directoryTags.parentId, parentId),
        });
        for (const child of children) {
          tagIds.push(child.id);
          await collectChildIds(child.id);
        }
      };
      await collectChildIds(tag.id);

      // Strategy 1: Get contacts with direct contact-level tags
      const contactsWithDirectTags = await ctx.db
        .selectDistinct({ contactId: directoryContactTags.contactId })
        .from(directoryContactTags)
        .where(inArray(directoryContactTags.tagId, tagIds));

      // Strategy 2: Get entries with matching tags, then get their contacts
      const entriesWithTags = await ctx.db
        .selectDistinct({ entryId: directoryEntryTags.entryId })
        .from(directoryEntryTags)
        .innerJoin(directoryEntries, eq(directoryEntryTags.entryId, directoryEntries.id))
        .where(
          and(
            inArray(directoryEntryTags.tagId, tagIds),
            eq(directoryEntries.isActive, 1)
          )
        );

      const entryIds = entriesWithTags.map(e => e.entryId);

      // Get contacts from matched entries
      let contactsFromEntries: { contactId: string }[] = [];
      if (entryIds.length > 0) {
        contactsFromEntries = await ctx.db
          .select({ contactId: directoryContacts.id })
          .from(directoryContacts)
          .where(inArray(directoryContacts.entryId, entryIds));
      }

      // Combine both sources
      const allContactIds = new Set<string>([
        ...contactsWithDirectTags.map(c => c.contactId),
        ...contactsFromEntries.map(c => c.contactId),
      ]);

      if (allContactIds.size === 0) {
        return { tag: { id: tag.id, name: tag.name, slug: tag.slug }, contacts: [], total: 0 };
      }

      // Get full contact data with entry info
      const contacts = await ctx.db
        .select({
          contact: directoryContacts,
          entry: directoryEntries,
        })
        .from(directoryContacts)
        .innerJoin(directoryEntries, eq(directoryContacts.entryId, directoryEntries.id))
        .where(
          and(
            inArray(directoryContacts.id, Array.from(allContactIds)),
            eq(directoryEntries.isActive, 1)
          )
        )
        .limit(limit * 2); // Get more to allow sorting

      // Patterns for extracting building/entrance numbers
      const buildingTagPattern = /^stroenie-(\d+)$/;
      const entranceTagPattern = /^podezd-(\d+)$/;

      // Check if the requested tag is a building tag
      const requestedBuildingMatch = tag.slug.match(buildingTagPattern);
      const priorityBuildingNum = requestedBuildingMatch?.[1] ? parseInt(requestedBuildingMatch[1], 10) : null;

      // Get tags for each contact (both contact-level and entry-level)
      const contactsWithTagInfo = await Promise.all(
        contacts.map(async (c) => {
          // Contact-level tags
          const contactTags = await ctx.db
            .select({ tag: directoryTags })
            .from(directoryContactTags)
            .innerJoin(directoryTags, eq(directoryContactTags.tagId, directoryTags.id))
            .where(eq(directoryContactTags.contactId, c.contact.id));

          // Entry-level tags
          const entryTags = await ctx.db
            .select({ tag: directoryTags })
            .from(directoryEntryTags)
            .innerJoin(directoryTags, eq(directoryEntryTags.tagId, directoryTags.id))
            .where(eq(directoryEntryTags.entryId, c.entry.id));

          // Combine and deduplicate
          const allTags = new Map<string, { id: string; name: string; slug: string }>();
          [...contactTags, ...entryTags].forEach(t => {
            allTags.set(t.tag.id, { id: t.tag.id, name: t.tag.name, slug: t.tag.slug });
          });

          // Extract building and entrance numbers from contact tags
          let buildingNum = 999;
          let entranceNum = 999;

          for (const ct of contactTags) {
            const buildingMatch = ct.tag.slug.match(buildingTagPattern);
            if (buildingMatch?.[1]) {
              buildingNum = parseInt(buildingMatch[1], 10);
            }
            const entranceMatch = ct.tag.slug.match(entranceTagPattern);
            if (entranceMatch?.[1]) {
              entranceNum = parseInt(entranceMatch[1], 10);
            }
          }

          // Compute weight for sorting
          let weight = 0;
          if (priorityBuildingNum !== null && buildingNum !== priorityBuildingNum) {
            weight = 1000; // Demote non-matching buildings
          }
          weight += buildingNum * 10 + entranceNum;

          return {
            ...c.contact,
            entryTitle: c.entry.title,
            entrySlug: c.entry.slug,
            entryIcon: c.entry.icon,
            tags: Array.from(allTags.values()),
            _buildingNum: buildingNum,
            _entranceNum: entranceNum,
            _weight: weight,
          };
        })
      );

      // Sort by weight, then building num, then entrance num
      contactsWithTagInfo.sort((a, b) => {
        if (a._weight !== b._weight) return a._weight - b._weight;
        if (a._buildingNum !== b._buildingNum) return a._buildingNum - b._buildingNum;
        return a._entranceNum - b._entranceNum;
      });

      // Remove internal sorting fields and limit
      const sortedContacts = contactsWithTagInfo.slice(0, limit).map(c => {
        const { _buildingNum, _entranceNum, _weight, ...contact } = c;
        return contact;
      });

      return {
        tag: { id: tag.id, name: tag.name, slug: tag.slug },
        contacts: sortedContacts,
        total: sortedContacts.length,
      };
    }),

  // Get entries grouped by tag (for structured display)
  // Looks at both entry-level and contact-level tags, groups contacts by their parent entry
  entriesGroupedByTag: publicProcedure
    .input(
      z.object({
        tagSlug: z.string(),
        limit: z.number().min(1).max(100).default(50),
      })
    )
    .query(async ({ ctx, input }) => {
      const { tagSlug, limit } = input;

      // Get the requested tag
      const tag = await ctx.db.query.directoryTags.findFirst({
        where: eq(directoryTags.slug, tagSlug),
      });

      if (!tag) {
        return { tag: null, groups: [], total: 0 };
      }

      // Collect all tag IDs (including children)
      const allTags = await ctx.db.query.directoryTags.findMany();
      const collectDescendantIds = (parentId: string): string[] => {
        const children = allTags.filter(t => t.parentId === parentId);
        return [
          parentId,
          ...children.flatMap(child => collectDescendantIds(child.id)),
        ];
      };
      const tagIds = collectDescendantIds(tag.id);

      // Strategy 1: Get contacts with direct contact-level tags
      const contactsWithDirectTags = await ctx.db
        .selectDistinct({ contactId: directoryContactTags.contactId })
        .from(directoryContactTags)
        .where(inArray(directoryContactTags.tagId, tagIds));

      // Strategy 2: Get entries with matching tags, then get their contacts
      const entriesWithTags = await ctx.db
        .selectDistinct({ entryId: directoryEntryTags.entryId })
        .from(directoryEntryTags)
        .innerJoin(directoryEntries, eq(directoryEntryTags.entryId, directoryEntries.id))
        .where(
          and(
            inArray(directoryEntryTags.tagId, tagIds),
            eq(directoryEntries.isActive, 1)
          )
        );

      const entryIdsFromTags = entriesWithTags.map(e => e.entryId);

      // Get contacts from matched entries
      let contactsFromEntries: { contactId: string }[] = [];
      if (entryIdsFromTags.length > 0) {
        contactsFromEntries = await ctx.db
          .select({ contactId: directoryContacts.id })
          .from(directoryContacts)
          .where(inArray(directoryContacts.entryId, entryIdsFromTags));
      }

      // Combine both sources
      const allContactIds = new Set<string>([
        ...contactsWithDirectTags.map(c => c.contactId),
        ...contactsFromEntries.map(c => c.contactId),
      ]);

      if (allContactIds.size === 0) {
        return {
          tag: { id: tag.id, name: tag.name, slug: tag.slug },
          groups: [],
          total: 0,
        };
      }

      // Get contacts with entry info
      const contacts = await ctx.db
        .select({
          contact: directoryContacts,
          entry: directoryEntries,
        })
        .from(directoryContacts)
        .innerJoin(directoryEntries, eq(directoryContacts.entryId, directoryEntries.id))
        .where(
          and(
            inArray(directoryContacts.id, Array.from(allContactIds)),
            eq(directoryEntries.isActive, 1)
          )
        )
        .orderBy(directoryEntries.order, directoryEntries.title, desc(directoryContacts.isPrimary), directoryContacts.order)
        .limit(limit);

      // Group contacts by entry
      const entriesMap = new Map<string, {
        id: string;
        slug: string;
        title: string;
        subtitle: string | null;
        icon: string | null;
        order: number | null;
        contacts: typeof contacts[0]["contact"][];
      }>();

      for (const row of contacts) {
        const existing = entriesMap.get(row.entry.id);
        if (existing) {
          existing.contacts.push(row.contact);
        } else {
          entriesMap.set(row.entry.id, {
            id: row.entry.id,
            slug: row.entry.slug,
            title: row.entry.title,
            subtitle: row.entry.subtitle,
            icon: row.entry.icon,
            order: row.entry.order,
            contacts: [row.contact],
          });
        }
      }

      // Convert to array and sort
      const entries = Array.from(entriesMap.values()).sort((a, b) => {
        const orderA = a.order ?? 999;
        const orderB = b.order ?? 999;
        if (orderA !== orderB) return orderA - orderB;
        return a.title.localeCompare(b.title, "ru");
      });

      // Return as a single group with the tag name
      return {
        tag: { id: tag.id, name: tag.name, slug: tag.slug },
        groups: [{
          tag: { id: tag.id, name: tag.name, slug: tag.slug, order: tag.order },
          entries: entries.map(e => ({
            ...e,
            contacts: e.contacts.map(c => ({
              id: c.id,
              type: c.type,
              value: c.value,
              label: c.label,
              subtitle: c.subtitle,
              isPrimary: c.isPrimary,
              hasWhatsApp: c.hasWhatsApp,
              hasTelegram: c.hasTelegram,
              is24h: c.is24h,
              order: c.order,
            })),
          })),
        }],
        total: entries.length,
      };
    }),

  // ============== ANALYTICS PROCEDURES ==============

  // Track analytics event
  trackEvent: publicProcedure
    .input(
      z.object({
        eventType: directoryEventTypeSchema,
        searchQuery: z.string().max(255).optional(),
        tagId: z.string().optional(),
        entryId: z.string().optional(),
        contactId: z.string().optional(),
        resultsCount: z.number().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session?.user?.id;

      await ctx.db.insert(directoryAnalytics).values({
        id: crypto.randomUUID(),
        eventType: input.eventType,
        searchQuery: input.searchQuery,
        tagId: input.tagId,
        entryId: input.entryId,
        contactId: input.contactId,
        userId,
        resultsCount: input.resultsCount,
      });

      // Update aggregated stats based on event type
      if (input.eventType === "tag_click" && input.tagId) {
        // Upsert tag stats
        const existingStat = await ctx.db.query.directoryTagStats.findFirst({
          where: eq(directoryTagStats.tagId, input.tagId),
        });

        if (existingStat) {
          await ctx.db
            .update(directoryTagStats)
            .set({
              clickCount: sql`${directoryTagStats.clickCount} + 1`,
              lastClickedAt: new Date(),
              updatedAt: new Date(),
            })
            .where(eq(directoryTagStats.tagId, input.tagId));
        } else {
          await ctx.db.insert(directoryTagStats).values({
            id: crypto.randomUUID(),
            tagId: input.tagId,
            clickCount: 1,
            viewCount: 0,
            lastClickedAt: new Date(),
          });
        }
      }

      if (
        (input.eventType === "entry_view" ||
          input.eventType === "entry_call" ||
          input.eventType === "entry_link") &&
        input.entryId
      ) {
        // Upsert entry stats
        const existingStat = await ctx.db.query.directoryEntryStats.findFirst({
          where: eq(directoryEntryStats.entryId, input.entryId),
        });

        if (existingStat) {
          const updateData: {
            updatedAt: Date;
            viewCount?: ReturnType<typeof sql>;
            callCount?: ReturnType<typeof sql>;
            linkCount?: ReturnType<typeof sql>;
            lastViewedAt?: Date;
          } = {
            updatedAt: new Date(),
          };

          if (input.eventType === "entry_view") {
            updateData.viewCount = sql`${directoryEntryStats.viewCount} + 1`;
            updateData.lastViewedAt = new Date();
          } else if (input.eventType === "entry_call") {
            updateData.callCount = sql`${directoryEntryStats.callCount} + 1`;
          } else if (input.eventType === "entry_link") {
            updateData.linkCount = sql`${directoryEntryStats.linkCount} + 1`;
          }

          await ctx.db
            .update(directoryEntryStats)
            .set(updateData)
            .where(eq(directoryEntryStats.entryId, input.entryId));
        } else {
          await ctx.db.insert(directoryEntryStats).values({
            id: crypto.randomUUID(),
            entryId: input.entryId,
            viewCount: input.eventType === "entry_view" ? 1 : 0,
            callCount: input.eventType === "entry_call" ? 1 : 0,
            linkCount: input.eventType === "entry_link" ? 1 : 0,
            lastViewedAt: input.eventType === "entry_view" ? new Date() : undefined,
          });
        }
      }

      return { success: true };
    }),

  // Get popular tags (by click count)
  getPopularTags: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(20).default(10),
        scope: directoryScopeSchema.optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { limit, scope } = input;

      // Build where condition
      const whereCondition = scope ? eq(directoryTags.scope, scope) : undefined;

      // Join tag stats with tags to get popular tags
      const results = await ctx.db
        .select({
          tag: directoryTags,
          clickCount: directoryTagStats.clickCount,
          viewCount: directoryTagStats.viewCount,
          lastClickedAt: directoryTagStats.lastClickedAt,
        })
        .from(directoryTagStats)
        .innerJoin(directoryTags, eq(directoryTagStats.tagId, directoryTags.id))
        .where(whereCondition)
        .orderBy(sql`${directoryTagStats.clickCount} DESC`)
        .limit(limit);

      return results.map((r) => ({
        ...r.tag,
        clickCount: r.clickCount,
        viewCount: r.viewCount,
        lastClickedAt: r.lastClickedAt,
      }));
    }),

  // Get popular entries (by view count)
  getPopularEntries: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(20).default(10),
        type: directoryEntryTypeSchema.optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { limit, type } = input;

      const conditions = [eq(directoryEntries.isActive, 1)];
      if (type) {
        conditions.push(eq(directoryEntries.type, type));
      }

      const results = await ctx.db
        .select({
          entry: directoryEntries,
          viewCount: directoryEntryStats.viewCount,
          callCount: directoryEntryStats.callCount,
          linkCount: directoryEntryStats.linkCount,
          lastViewedAt: directoryEntryStats.lastViewedAt,
        })
        .from(directoryEntryStats)
        .innerJoin(
          directoryEntries,
          eq(directoryEntryStats.entryId, directoryEntries.id)
        )
        .where(and(...conditions))
        .orderBy(sql`${directoryEntryStats.viewCount} DESC`)
        .limit(limit);

      // Get contacts for each entry
      const entriesWithContacts = await Promise.all(
        results.map(async (r) => {
          const contacts = await ctx.db.query.directoryContacts.findMany({
            where: eq(directoryContacts.entryId, r.entry.id),
            orderBy: [directoryContacts.isPrimary, directoryContacts.order],
          });

          return {
            ...r.entry,
            contacts,
            viewCount: r.viewCount,
            callCount: r.callCount,
            linkCount: r.linkCount,
            lastViewedAt: r.lastViewedAt,
          };
        })
      );

      return entriesWithContacts;
    }),

  // ============== USER CONTEXT PROCEDURES ==============

  // Get user's building context (for personalized results)
  getUserContext: publicProcedure.query(async ({ ctx }) => {
    const userId = ctx.session?.user?.id;
    if (!userId) {
      return { isAuthenticated: false, buildingIds: [], buildings: [] };
    }

    const buildingIds = new Set<string>();

    // Get buildings from apartments
    const apartmentBuildings = await ctx.db
      .selectDistinct({ buildingId: entrances.buildingId })
      .from(userApartments)
      .innerJoin(apartments, eq(userApartments.apartmentId, apartments.id))
      .innerJoin(floors, eq(apartments.floorId, floors.id))
      .innerJoin(entrances, eq(floors.entranceId, entrances.id))
      .where(
        and(
          eq(userApartments.userId, userId),
          eq(userApartments.status, "approved"),
          isNull(userApartments.revokedAt)
        )
      );

    apartmentBuildings.forEach((b) => {
      if (b.buildingId) buildingIds.add(b.buildingId);
    });

    // Get buildings from parking spots
    const parkingBuildings = await ctx.db
      .selectDistinct({ buildingId: parkings.buildingId })
      .from(userParkingSpots)
      .innerJoin(parkingSpots, eq(userParkingSpots.parkingSpotId, parkingSpots.id))
      .innerJoin(parkingFloors, eq(parkingSpots.floorId, parkingFloors.id))
      .innerJoin(parkings, eq(parkingFloors.parkingId, parkings.id))
      .where(
        and(
          eq(userParkingSpots.userId, userId),
          eq(userParkingSpots.status, "approved"),
          isNull(userParkingSpots.revokedAt)
        )
      );

    parkingBuildings.forEach((b) => {
      if (b.buildingId) buildingIds.add(b.buildingId);
    });

    const buildingIdArray = Array.from(buildingIds);

    // Get building details
    let userBuildings: { id: string; number: number | null; title: string | null }[] = [];
    if (buildingIdArray.length > 0) {
      userBuildings = await ctx.db
        .select({ id: buildings.id, number: buildings.number, title: buildings.title })
        .from(buildings)
        .where(inArray(buildings.id, buildingIdArray));
    }

    return {
      isAuthenticated: true,
      buildingIds: buildingIdArray,
      buildings: userBuildings,
    };
  }),

  // Context-aware search (prioritizes user's buildings)
  searchWithContext: publicProcedure
    .input(
      z.object({
        query: z.string().min(2).max(100),
        type: directoryEntryTypeSchema.optional(),
        tagIds: z.array(z.string()).optional(),
        limit: z.number().min(1).max(100).default(20),
        offset: z.number().min(0).default(0),
      })
    )
    .query(async ({ ctx, input }) => {
      const { query, type, tagIds, limit, offset } = input;
      const searchPattern = `%${query}%`;
      const userId = ctx.session?.user?.id;

      // Get user's building IDs if authenticated
      let userBuildingIds: string[] = [];
      if (userId) {
        const buildingIds = new Set<string>();

        const apartmentBuildings = await ctx.db
          .selectDistinct({ buildingId: entrances.buildingId })
          .from(userApartments)
          .innerJoin(apartments, eq(userApartments.apartmentId, apartments.id))
          .innerJoin(floors, eq(apartments.floorId, floors.id))
          .innerJoin(entrances, eq(floors.entranceId, entrances.id))
          .where(
            and(
              eq(userApartments.userId, userId),
              eq(userApartments.status, "approved"),
              isNull(userApartments.revokedAt)
            )
          );

        apartmentBuildings.forEach((b) => {
          if (b.buildingId) buildingIds.add(b.buildingId);
        });

        const parkingBuildings = await ctx.db
          .selectDistinct({ buildingId: parkings.buildingId })
          .from(userParkingSpots)
          .innerJoin(parkingSpots, eq(userParkingSpots.parkingSpotId, parkingSpots.id))
          .innerJoin(parkingFloors, eq(parkingSpots.floorId, parkingFloors.id))
          .innerJoin(parkings, eq(parkingFloors.parkingId, parkings.id))
          .where(
            and(
              eq(userParkingSpots.userId, userId),
              eq(userParkingSpots.status, "approved"),
              isNull(userParkingSpots.revokedAt)
            )
          );

        parkingBuildings.forEach((b) => {
          if (b.buildingId) buildingIds.add(b.buildingId);
        });

        userBuildingIds = Array.from(buildingIds);
      }

      // Build base conditions
      const conditions = [
        eq(directoryEntries.isActive, 1),
        or(
          ilike(directoryEntries.title, searchPattern),
          ilike(directoryEntries.description, searchPattern)
        ),
      ];

      if (type) {
        conditions.push(eq(directoryEntries.type, type));
      }

      // Filter by tags if specified
      let entryIdsFilter: string[] | null = null;
      if (tagIds && tagIds.length > 0) {
        const entryIdsWithTags = await ctx.db
          .selectDistinct({ entryId: directoryEntryTags.entryId })
          .from(directoryEntryTags)
          .where(inArray(directoryEntryTags.tagId, tagIds));

        entryIdsFilter = entryIdsWithTags.map((e) => e.entryId);
        if (entryIdsFilter.length === 0) {
          return { results: [], total: 0, hasMore: false, userBuildingIds };
        }
        conditions.push(inArray(directoryEntries.id, entryIdsFilter));
      }

      // Get all matching entries
      const allEntries = await ctx.db
        .select()
        .from(directoryEntries)
        .where(and(...conditions))
        .orderBy(directoryEntries.order, directoryEntries.title);

      // Sort entries: user's buildings first, then others
      const sortedEntries = [...allEntries].sort((a, b) => {
        const aIsUserBuilding = a.buildingId && userBuildingIds.includes(a.buildingId);
        const bIsUserBuilding = b.buildingId && userBuildingIds.includes(b.buildingId);

        if (aIsUserBuilding && !bIsUserBuilding) return -1;
        if (!aIsUserBuilding && bIsUserBuilding) return 1;
        return 0;
      });

      // Apply pagination
      const paginatedEntries = sortedEntries.slice(offset, offset + limit);

      // Get contacts and tags for each entry
      const results = await Promise.all(
        paginatedEntries.map(async (entry) => {
          const contacts = await ctx.db.query.directoryContacts.findMany({
            where: eq(directoryContacts.entryId, entry.id),
            orderBy: [directoryContacts.isPrimary, directoryContacts.order],
          });

          const entryTags = await ctx.db
            .select({ tag: directoryTags })
            .from(directoryEntryTags)
            .innerJoin(
              directoryTags,
              eq(directoryEntryTags.tagId, directoryTags.id)
            )
            .where(eq(directoryEntryTags.entryId, entry.id));

          return {
            ...entry,
            contacts,
            tags: entryTags.map((et) => et.tag),
            isUserBuilding: entry.buildingId
              ? userBuildingIds.includes(entry.buildingId)
              : false,
          };
        })
      );

      return {
        results,
        total: allEntries.length,
        hasMore: offset + limit < allEntries.length,
        userBuildingIds,
      };
    }),

  // Context-aware tag filter (prioritizes user's buildings)
  byTagWithContext: publicProcedure
    .input(
      z.object({
        tagSlug: z.string(),
        includeChildren: z.boolean().default(true),
        limit: z.number().min(1).max(100).default(20),
        offset: z.number().min(0).default(0),
      })
    )
    .query(async ({ ctx, input }) => {
      const { tagSlug, includeChildren, limit, offset } = input;
      const userId = ctx.session?.user?.id;

      // Get user's building IDs if authenticated
      let userBuildingIds: string[] = [];
      if (userId) {
        const buildingIds = new Set<string>();

        const apartmentBuildings = await ctx.db
          .selectDistinct({ buildingId: entrances.buildingId })
          .from(userApartments)
          .innerJoin(apartments, eq(userApartments.apartmentId, apartments.id))
          .innerJoin(floors, eq(apartments.floorId, floors.id))
          .innerJoin(entrances, eq(floors.entranceId, entrances.id))
          .where(
            and(
              eq(userApartments.userId, userId),
              eq(userApartments.status, "approved"),
              isNull(userApartments.revokedAt)
            )
          );

        apartmentBuildings.forEach((b) => {
          if (b.buildingId) buildingIds.add(b.buildingId);
        });

        const parkingBuildings = await ctx.db
          .selectDistinct({ buildingId: parkings.buildingId })
          .from(userParkingSpots)
          .innerJoin(parkingSpots, eq(userParkingSpots.parkingSpotId, parkingSpots.id))
          .innerJoin(parkingFloors, eq(parkingSpots.floorId, parkingFloors.id))
          .innerJoin(parkings, eq(parkingFloors.parkingId, parkings.id))
          .where(
            and(
              eq(userParkingSpots.userId, userId),
              eq(userParkingSpots.status, "approved"),
              isNull(userParkingSpots.revokedAt)
            )
          );

        parkingBuildings.forEach((b) => {
          if (b.buildingId) buildingIds.add(b.buildingId);
        });

        userBuildingIds = Array.from(buildingIds);
      }

      // Get tag
      const tag = await ctx.db.query.directoryTags.findFirst({
        where: eq(directoryTags.slug, tagSlug),
      });

      if (!tag) {
        return { tag: null, entries: [], childTags: [], total: 0, userBuildingIds };
      }

      // Collect all tag IDs (including children if requested)
      const tagIds = [tag.id];
      if (includeChildren) {
        const collectChildIds = async (parentId: string) => {
          const children = await ctx.db.query.directoryTags.findMany({
            where: eq(directoryTags.parentId, parentId),
          });
          for (const child of children) {
            tagIds.push(child.id);
            await collectChildIds(child.id);
          }
        };
        await collectChildIds(tag.id);
      }

      // Get entries with these tags
      const entryIdsWithTags = await ctx.db
        .selectDistinct({ entryId: directoryEntryTags.entryId })
        .from(directoryEntryTags)
        .innerJoin(
          directoryEntries,
          eq(directoryEntryTags.entryId, directoryEntries.id)
        )
        .where(
          and(
            inArray(directoryEntryTags.tagId, tagIds),
            eq(directoryEntries.isActive, 1)
          )
        );

      const entryIds = entryIdsWithTags.map((e) => e.entryId);

      if (entryIds.length === 0) {
        const childTags = await ctx.db.query.directoryTags.findMany({
          where: eq(directoryTags.parentId, tag.id),
          orderBy: [directoryTags.order, directoryTags.name],
        });

        return {
          tag,
          entries: [],
          childTags,
          total: 0,
          userBuildingIds,
        };
      }

      // Get all entries
      const allEntries = await ctx.db.query.directoryEntries.findMany({
        where: and(
          inArray(directoryEntries.id, entryIds),
          eq(directoryEntries.isActive, 1)
        ),
        orderBy: [directoryEntries.order, directoryEntries.title],
      });

      // Sort entries: user's buildings first, then others
      const sortedEntries = [...allEntries].sort((a, b) => {
        const aIsUserBuilding = a.buildingId && userBuildingIds.includes(a.buildingId);
        const bIsUserBuilding = b.buildingId && userBuildingIds.includes(b.buildingId);

        if (aIsUserBuilding && !bIsUserBuilding) return -1;
        if (!aIsUserBuilding && bIsUserBuilding) return 1;
        return 0;
      });

      // Apply pagination
      const paginatedEntries = sortedEntries.slice(offset, offset + limit);

      // Get contacts for entries
      const results = await Promise.all(
        paginatedEntries.map(async (entry) => {
          const contacts = await ctx.db.query.directoryContacts.findMany({
            where: eq(directoryContacts.entryId, entry.id),
            orderBy: [directoryContacts.isPrimary, directoryContacts.order],
          });

          return {
            ...entry,
            contacts,
            isUserBuilding: entry.buildingId
              ? userBuildingIds.includes(entry.buildingId)
              : false,
          };
        })
      );

      // Get child tags
      const childTags = await ctx.db.query.directoryTags.findMany({
        where: eq(directoryTags.parentId, tag.id),
        orderBy: [directoryTags.order, directoryTags.name],
      });

      return {
        tag,
        entries: results,
        childTags,
        total: allEntries.length,
        userBuildingIds,
      };
    }),

  // ============== ADMIN PROCEDURES ==============

  admin: createTRPCRouter({
    // List entries for admin (includes inactive)
    list: adminProcedure
      .input(
        z.object({
          page: z.number().min(1).default(1),
          limit: z.number().min(1).max(100).default(20),
          type: directoryEntryTypeSchema.optional(),
          search: z.string().optional(),
        })
      )
      .query(async ({ ctx, input }) => {
        const { page, limit, type, search } = input;
        const offset = (page - 1) * limit;

        const conditions = [];
        if (type) {
          conditions.push(eq(directoryEntries.type, type));
        }
        if (search) {
          conditions.push(
            or(
              ilike(directoryEntries.title, `%${search}%`),
              ilike(directoryEntries.description, `%${search}%`)
            )
          );
        }

        const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

        const entries = await ctx.db.query.directoryEntries.findMany({
          where: whereClause,
          orderBy: [directoryEntries.order, directoryEntries.title],
          limit,
          offset,
        });

        // Get contacts and tags for each entry
        const results = await Promise.all(
          entries.map(async (entry) => {
            const contacts = await ctx.db.query.directoryContacts.findMany({
              where: eq(directoryContacts.entryId, entry.id),
              orderBy: [directoryContacts.isPrimary, directoryContacts.order],
            });

            const entryTags = await ctx.db
              .select({ tag: directoryTags })
              .from(directoryEntryTags)
              .innerJoin(
                directoryTags,
                eq(directoryEntryTags.tagId, directoryTags.id)
              )
              .where(eq(directoryEntryTags.entryId, entry.id));

            return {
              ...entry,
              contacts,
              tags: entryTags.map((et) => et.tag),
            };
          })
        );

        const [totalResult] = await ctx.db
          .select({ count: count() })
          .from(directoryEntries)
          .where(whereClause);

        const total = totalResult?.count ?? 0;
        const totalPages = Math.ceil(total / limit);

        return {
          entries: results,
          total,
          totalPages,
          page,
        };
      }),

    // Get entry by ID for admin
    get: adminProcedure
      .input(z.object({ id: z.string() }))
      .query(async ({ ctx, input }) => {
        const entry = await ctx.db.query.directoryEntries.findFirst({
          where: eq(directoryEntries.id, input.id),
        });

        if (!entry) return null;

        const contacts = await ctx.db.query.directoryContacts.findMany({
          where: eq(directoryContacts.entryId, entry.id),
          orderBy: [directoryContacts.isPrimary, directoryContacts.order],
        });

        // Get tags for each contact
        const contactsWithTags = await Promise.all(
          contacts.map(async (contact) => {
            const contactTags = await ctx.db
              .select({ tag: directoryTags })
              .from(directoryContactTags)
              .innerJoin(directoryTags, eq(directoryContactTags.tagId, directoryTags.id))
              .where(eq(directoryContactTags.contactId, contact.id));

            return {
              ...contact,
              tags: contactTags.map((ct) => ct.tag),
            };
          })
        );

        const schedules = await ctx.db.query.directorySchedules.findMany({
          where: eq(directorySchedules.entryId, entry.id),
          orderBy: directorySchedules.dayOfWeek,
        });

        const entryTags = await ctx.db
          .select({ tag: directoryTags })
          .from(directoryEntryTags)
          .innerJoin(
            directoryTags,
            eq(directoryEntryTags.tagId, directoryTags.id)
          )
          .where(eq(directoryEntryTags.entryId, entry.id));

        return {
          ...entry,
          contacts: contactsWithTags,
          schedules,
          tags: entryTags.map((et) => et.tag),
        };
      }),

    // Create entry
    create: adminProcedure
    .input(
      z.object({
        type: directoryEntryTypeSchema,
        title: z.string().min(1).max(255),
        description: z.string().max(500).optional(),
        content: z.string().optional(),
        buildingId: z.string().optional(),
        floorNumber: z.number().optional(),
        icon: z.string().max(50).optional(),
        order: z.number().default(0),
        contacts: z
          .array(
            z.object({
              type: directoryContactTypeSchema,
              value: z.string().max(500),
              label: z.string().max(100).optional(),
              subtitle: z.string().max(255).optional(),
              isPrimary: z.boolean().default(false),
              order: z.number().default(0),
              tagIds: z.array(z.string()).optional(),
            })
          )
          .optional(),
        schedules: z
          .array(
            z.object({
              dayOfWeek: z.number().min(0).max(6),
              openTime: z.string().optional(),
              closeTime: z.string().optional(),
              note: z.string().max(255).optional(),
            })
          )
          .optional(),
        tagIds: z.array(z.string()).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const {
        contacts,
        schedules,
        tagIds,
        ...entryData
      } = input;

      // Generate slug
      let slug = slugify(input.title);
      let counter = 1;

      // Check for existing slug
      while (true) {
        const existing = await ctx.db.query.directoryEntries.findFirst({
          where: eq(directoryEntries.slug, slug),
        });
        if (!existing) break;
        slug = `${slugify(input.title)}-${counter}`;
        counter++;
      }

      // Create entry
      const entryId = crypto.randomUUID();
      await ctx.db.insert(directoryEntries).values({
        id: entryId,
        slug,
        ...entryData,
      });

      // Create contacts
      if (contacts && contacts.length > 0) {
        const contactsWithIds = contacts.map((c, i) => ({
          id: crypto.randomUUID(),
          entryId,
          type: c.type,
          value: c.value,
          label: c.label,
          subtitle: c.subtitle,
          isPrimary: c.isPrimary ? 1 : 0,
          order: c.order ?? i,
          tagIds: c.tagIds,
        }));

        await ctx.db.insert(directoryContacts).values(
          contactsWithIds.map(({ tagIds, ...contact }) => contact)
        );

        // Create contact-level tags
        const contactTagLinks = contactsWithIds.flatMap((c) =>
          (c.tagIds ?? []).map((tagId) => ({
            contactId: c.id,
            tagId,
          }))
        );

        if (contactTagLinks.length > 0) {
          await ctx.db.insert(directoryContactTags).values(contactTagLinks);
        }
      }

      // Create schedules
      if (schedules && schedules.length > 0) {
        await ctx.db.insert(directorySchedules).values(
          schedules.map((s) => ({
            id: crypto.randomUUID(),
            entryId,
            dayOfWeek: s.dayOfWeek,
            openTime: s.openTime,
            closeTime: s.closeTime,
            note: s.note,
          }))
        );
      }

      // Link tags
      if (tagIds && tagIds.length > 0) {
        await ctx.db.insert(directoryEntryTags).values(
          tagIds.map((tagId) => ({
            entryId,
            tagId,
          }))
        );
      }

      return { id: entryId, slug };
    }),

    // Update entry
    update: adminProcedure
    .input(
      z.object({
        id: z.string(),
        type: directoryEntryTypeSchema.optional(),
        title: z.string().min(1).max(255).optional(),
        subtitle: z.string().max(255).optional(),
        description: z.string().max(500).optional(),
        content: z.string().optional(),
        buildingId: z.string().nullish(),
        floorNumber: z.number().nullish(),
        icon: z.string().max(50).nullish(),
        order: z.number().optional(),
        isActive: z.boolean().optional(),
        contacts: z
          .array(
            z.object({
              type: directoryContactTypeSchema,
              value: z.string().max(500),
              label: z.string().max(100).optional(),
              subtitle: z.string().max(255).optional(),
              isPrimary: z.boolean().default(false),
              order: z.number().default(0),
              tagIds: z.array(z.string()).optional(),
            })
          )
          .optional(),
        schedules: z
          .array(
            z.object({
              dayOfWeek: z.number().min(0).max(6),
              openTime: z.string().optional(),
              closeTime: z.string().optional(),
              note: z.string().max(255).optional(),
            })
          )
          .optional(),
        tagIds: z.array(z.string()).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, isActive, contacts, schedules, tagIds, ...updateData } = input;

      // Update entry
      await ctx.db
        .update(directoryEntries)
        .set({
          ...updateData,
          isActive: isActive === undefined ? undefined : isActive ? 1 : 0,
          updatedAt: new Date(),
        })
        .where(eq(directoryEntries.id, id));

      // Update contacts if provided
      if (contacts !== undefined) {
        // Get existing contact IDs to delete their tags
        const existingContacts = await ctx.db.query.directoryContacts.findMany({
          where: eq(directoryContacts.entryId, id),
        });

        // Delete existing contact tags
        if (existingContacts.length > 0) {
          await ctx.db
            .delete(directoryContactTags)
            .where(inArray(directoryContactTags.contactId, existingContacts.map(c => c.id)));
        }

        // Delete existing contacts
        await ctx.db
          .delete(directoryContacts)
          .where(eq(directoryContacts.entryId, id));

        // Insert new contacts with tags
        if (contacts.length > 0) {
          const contactsWithIds = contacts.map((c, i) => ({
            id: crypto.randomUUID(),
            entryId: id,
            type: c.type,
            value: c.value,
            label: c.label,
            subtitle: c.subtitle,
            isPrimary: c.isPrimary ? 1 : 0,
            order: c.order ?? i,
            tagIds: c.tagIds,
          }));

          await ctx.db.insert(directoryContacts).values(
            contactsWithIds.map(({ tagIds, ...contact }) => contact)
          );

          // Create contact-level tags
          const contactTagLinks = contactsWithIds.flatMap((c) =>
            (c.tagIds ?? []).map((tagId) => ({
              contactId: c.id,
              tagId,
            }))
          );

          if (contactTagLinks.length > 0) {
            await ctx.db.insert(directoryContactTags).values(contactTagLinks);
          }
        }
      }

      // Update schedules if provided
      if (schedules !== undefined) {
        // Delete existing schedules
        await ctx.db
          .delete(directorySchedules)
          .where(eq(directorySchedules.entryId, id));

        // Insert new schedules
        if (schedules.length > 0) {
          await ctx.db.insert(directorySchedules).values(
            schedules.map((s) => ({
              id: crypto.randomUUID(),
              entryId: id,
              dayOfWeek: s.dayOfWeek,
              openTime: s.openTime,
              closeTime: s.closeTime,
              note: s.note,
            }))
          );
        }
      }

      // Update tags if provided
      if (tagIds !== undefined) {
        // Delete existing tag links
        await ctx.db
          .delete(directoryEntryTags)
          .where(eq(directoryEntryTags.entryId, id));

        // Insert new tag links
        if (tagIds.length > 0) {
          await ctx.db.insert(directoryEntryTags).values(
            tagIds.map((tagId) => ({
              entryId: id,
              tagId,
            }))
          );
        }
      }

      return { success: true };
    }),

    // Delete entry (soft delete)
    delete: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(directoryEntries)
        .set({ isActive: 0, updatedAt: new Date() })
        .where(eq(directoryEntries.id, input.id));

      return { success: true };
    }),

    // Create tag
    createTag: adminProcedure
    .input(
      z.object({
        name: z.string().min(1).max(100),
        description: z.string().max(500).optional(),
        parentId: z.string().optional(),
        scope: directoryScopeSchema.default("core"),
        synonyms: z.array(z.string()).optional(),
        icon: z.string().max(50).optional(),
        order: z.number().default(0),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { synonyms, ...tagData } = input;
      const slug = slugify(input.name);

      // Generate tag ID in format: tag-{slug}
      const tagId = `tag-${slug}`;

      await ctx.db.insert(directoryTags).values({
        id: tagId,
        slug,
        ...tagData,
        synonyms: synonyms ? JSON.stringify(synonyms) : null,
      });

      return { id: tagId, slug };
    }),

    // Update tag
    updateTag: adminProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1).max(100).optional(),
        description: z.string().max(500).optional(),
        parentId: z.string().nullish(),
        scope: directoryScopeSchema.optional(),
        synonyms: z.array(z.string()).optional(),
        icon: z.string().max(50).nullish(),
        order: z.number().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, synonyms, name, ...updateData } = input;

      // If name is updated, regenerate slug
      const slug = name ? slugify(name) : undefined;

      await ctx.db
        .update(directoryTags)
        .set({
          ...updateData,
          ...(name && { name, slug }),
          synonyms: synonyms ? JSON.stringify(synonyms) : undefined,
        })
        .where(eq(directoryTags.id, id));

      return { success: true };
    }),

    // Delete tag
    deleteTag: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Delete tag (cascade will remove entry links)
      await ctx.db
        .delete(directoryTags)
        .where(eq(directoryTags.id, input.id));

      return { success: true };
    }),

    // Get tag by ID for admin
    getTag: adminProcedure
      .input(z.object({ id: z.string() }))
      .query(async ({ ctx, input }) => {
        const tag = await ctx.db.query.directoryTags.findFirst({
          where: eq(directoryTags.id, input.id),
        });

        if (!tag) return null;

        return {
          id: tag.id,
          name: tag.name,
          slug: tag.slug,
          description: tag.description,
          parentId: tag.parentId,
          scope: tag.scope,
          icon: tag.icon,
          order: tag.order,
          synonyms: tag.synonyms ? JSON.parse(tag.synonyms) as string[] : [],
        };
      }),

    // Get full tag tree for admin (with counts)
    getTagTree: adminProcedure
      .query(async ({ ctx }) => {
        // Get all tags
        const allTags = await ctx.db.query.directoryTags.findMany({
          orderBy: [directoryTags.scope, directoryTags.order, directoryTags.name],
        });

        // Get entry counts for each tag
        const entryCounts = await ctx.db
          .select({
            tagId: directoryEntryTags.tagId,
            count: count(),
          })
          .from(directoryEntryTags)
          .innerJoin(directoryEntries, eq(directoryEntryTags.entryId, directoryEntries.id))
          .where(eq(directoryEntries.isActive, 1))
          .groupBy(directoryEntryTags.tagId);

        // Get contact counts for each tag
        const contactCounts = await ctx.db
          .select({
            tagId: directoryContactTags.tagId,
            count: count(),
          })
          .from(directoryContactTags)
          .groupBy(directoryContactTags.tagId);

        const entryCountMap = new Map(entryCounts.map((c) => [c.tagId, c.count]));
        const contactCountMap = new Map(contactCounts.map((c) => [c.tagId, c.count]));

        return allTags.map((tag) => ({
          id: tag.id,
          name: tag.name,
          slug: tag.slug,
          description: tag.description,
          parentId: tag.parentId,
          scope: tag.scope,
          icon: tag.icon,
          order: tag.order,
          entryCount: entryCountMap.get(tag.id) ?? 0,
          contactCount: contactCountMap.get(tag.id) ?? 0,
        }));
      }),

    // List entries with extended filtering and stats
    listWithStats: adminProcedure
      .input(
        z.object({
          page: z.number().min(1).default(1),
          limit: z.number().min(1).max(100).default(20),
          type: directoryEntryTypeSchema.optional(),
          search: z.string().optional(),
          tagIds: z.array(z.string()).optional(),
          scope: directoryScopeSchema.optional(),
          hasProblems: z.enum(["noTags", "noContacts", "inactive"]).optional(),
        })
      )
      .query(async ({ ctx, input }) => {
        const { page, limit, type, search, tagIds, scope, hasProblems } = input;
        const offset = (page - 1) * limit;

        // Build base conditions
        const conditions: ReturnType<typeof eq>[] = [];

        if (type) {
          conditions.push(eq(directoryEntries.type, type));
        }

        if (search) {
          conditions.push(
            or(
              ilike(directoryEntries.title, `%${search}%`),
              ilike(directoryEntries.description, `%${search}%`)
            )!
          );
        }

        if (hasProblems === "inactive") {
          conditions.push(eq(directoryEntries.isActive, 0));
        }

        // Get entries with tag filtering
        let entryIds: string[] | null = null;

        if (tagIds && tagIds.length > 0) {
          // Get entries that have any of the specified tags
          const entriesWithTags = await ctx.db
            .selectDistinct({ entryId: directoryEntryTags.entryId })
            .from(directoryEntryTags)
            .where(inArray(directoryEntryTags.tagId, tagIds));

          entryIds = entriesWithTags.map((e) => e.entryId);
          if (entryIds.length === 0) {
            return { entries: [], total: 0, totalPages: 0, page };
          }
        }

        if (scope) {
          // Get tags with this scope
          const scopeTags = await ctx.db.query.directoryTags.findMany({
            where: eq(directoryTags.scope, scope),
          });
          const scopeTagIds = scopeTags.map((t) => t.id);

          if (scopeTagIds.length > 0) {
            const entriesWithScope = await ctx.db
              .selectDistinct({ entryId: directoryEntryTags.entryId })
              .from(directoryEntryTags)
              .where(inArray(directoryEntryTags.tagId, scopeTagIds));

            const scopeEntryIds = entriesWithScope.map((e) => e.entryId);
            if (entryIds) {
              entryIds = entryIds.filter((id) => scopeEntryIds.includes(id));
            } else {
              entryIds = scopeEntryIds;
            }

            if (entryIds.length === 0) {
              return { entries: [], total: 0, totalPages: 0, page };
            }
          }
        }

        // Build final where clause
        let whereClause = conditions.length > 0 ? and(...conditions) : undefined;

        if (entryIds) {
          const entryCondition = inArray(directoryEntries.id, entryIds);
          whereClause = whereClause ? and(whereClause, entryCondition) : entryCondition;
        }

        // Get entries
        let entries = await ctx.db.query.directoryEntries.findMany({
          where: whereClause,
          orderBy: [desc(directoryEntries.updatedAt), directoryEntries.title],
          limit: limit * 2, // Get more to filter by problems
          offset: hasProblems ? 0 : offset,
        });

        // Get contacts and tags for each entry
        const results = await Promise.all(
          entries.map(async (entry) => {
            const contacts = await ctx.db.query.directoryContacts.findMany({
              where: eq(directoryContacts.entryId, entry.id),
              orderBy: [directoryContacts.isPrimary, directoryContacts.order],
            });

            const entryTags = await ctx.db
              .select({ tag: directoryTags })
              .from(directoryEntryTags)
              .innerJoin(directoryTags, eq(directoryEntryTags.tagId, directoryTags.id))
              .where(eq(directoryEntryTags.entryId, entry.id));

            // Get stats from directoryEntryStats
            const [stats] = await ctx.db
              .select()
              .from(directoryEntryStats)
              .where(eq(directoryEntryStats.entryId, entry.id));

            return {
              ...entry,
              contacts,
              tags: entryTags.map((et) => et.tag),
              stats: stats
                ? {
                    viewCount: stats.viewCount,
                    callCount: stats.callCount,
                    linkCount: stats.linkCount,
                    lastViewedAt: stats.lastViewedAt,
                  }
                : null,
              problems: {
                noTags: entryTags.length === 0,
                noContacts: contacts.length === 0,
                inactive: entry.isActive === 0,
              },
            };
          })
        );

        // Filter by problems if needed
        let filteredResults = results;
        if (hasProblems === "noTags") {
          filteredResults = results.filter((e) => e.problems.noTags);
        } else if (hasProblems === "noContacts") {
          filteredResults = results.filter((e) => e.problems.noContacts);
        }

        // Get total count
        const [totalResult] = await ctx.db
          .select({ count: count() })
          .from(directoryEntries)
          .where(whereClause);

        let total = totalResult?.count ?? 0;

        // Adjust for problem filtering
        if (hasProblems) {
          total = filteredResults.length;
          filteredResults = filteredResults.slice(offset, offset + limit);
        } else {
          filteredResults = filteredResults.slice(0, limit);
        }

        const totalPages = Math.ceil(total / limit);

        return {
          entries: filteredResults,
          total,
          totalPages,
          page,
        };
      }),

    // Bulk update tags
    bulkUpdateTags: adminProcedure
      .input(
        z.object({
          entryIds: z.array(z.string()),
          addTagIds: z.array(z.string()).optional(),
          removeTagIds: z.array(z.string()).optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const { entryIds, addTagIds, removeTagIds } = input;

        // Remove tags
        if (removeTagIds && removeTagIds.length > 0) {
          await ctx.db
            .delete(directoryEntryTags)
            .where(
              and(
                inArray(directoryEntryTags.entryId, entryIds),
                inArray(directoryEntryTags.tagId, removeTagIds)
              )
            );
        }

        // Add tags (ignore duplicates)
        if (addTagIds && addTagIds.length > 0) {
          for (const entryId of entryIds) {
            for (const tagId of addTagIds) {
              try {
                await ctx.db
                  .insert(directoryEntryTags)
                  .values({ entryId, tagId })
                  .onConflictDoNothing();
              } catch {
                // Ignore duplicate errors
              }
            }
          }
        }

        return { success: true, affected: entryIds.length };
      }),

    // Bulk delete (soft delete)
    bulkDelete: adminProcedure
      .input(z.object({ entryIds: z.array(z.string()) }))
      .mutation(async ({ ctx, input }) => {
        await ctx.db
          .update(directoryEntries)
          .set({ isActive: 0, updatedAt: new Date() })
          .where(inArray(directoryEntries.id, input.entryIds));

        return { success: true, affected: input.entryIds.length };
      }),

    // Dashboard statistics
    getDashboardStats: adminProcedure.query(async ({ ctx }) => {
      // Total counts
      const [allEntries] = await ctx.db
        .select({ count: count() })
        .from(directoryEntries);

      const [activeEntries] = await ctx.db
        .select({ count: count() })
        .from(directoryEntries)
        .where(eq(directoryEntries.isActive, 1));

      const [totalTags] = await ctx.db
        .select({ count: count() })
        .from(directoryTags);

      const [rootTags] = await ctx.db
        .select({ count: count() })
        .from(directoryTags)
        .where(isNull(directoryTags.parentId));

      const [totalContacts] = await ctx.db
        .select({ count: count() })
        .from(directoryContacts);

      // Problem counts
      const entriesWithoutTags = await ctx.db
        .select({ id: directoryEntries.id })
        .from(directoryEntries)
        .leftJoin(directoryEntryTags, eq(directoryEntries.id, directoryEntryTags.entryId))
        .where(and(
          eq(directoryEntries.isActive, 1),
          isNull(directoryEntryTags.tagId)
        ));

      const entriesWithoutContacts = await ctx.db
        .select({ id: directoryEntries.id })
        .from(directoryEntries)
        .leftJoin(directoryContacts, eq(directoryEntries.id, directoryContacts.entryId))
        .where(and(
          eq(directoryEntries.isActive, 1),
          isNull(directoryContacts.id)
        ));

      // Popular entries (by views)
      const popularEntries = await ctx.db
        .select({
          entryId: directoryEntryStats.entryId,
          viewCount: directoryEntryStats.viewCount,
          callCount: directoryEntryStats.callCount,
          entry: directoryEntries,
        })
        .from(directoryEntryStats)
        .innerJoin(directoryEntries, eq(directoryEntryStats.entryId, directoryEntries.id))
        .where(eq(directoryEntries.isActive, 1))
        .orderBy(desc(directoryEntryStats.viewCount))
        .limit(10);

      // Popular tags (by clicks)
      const popularTags = await ctx.db
        .select({
          tagId: directoryTagStats.tagId,
          clickCount: directoryTagStats.clickCount,
          tag: directoryTags,
        })
        .from(directoryTagStats)
        .innerJoin(directoryTags, eq(directoryTagStats.tagId, directoryTags.id))
        .orderBy(desc(directoryTagStats.clickCount))
        .limit(10);

      // Recent searches (from analytics)
      const recentSearches = await ctx.db
        .select({
          query: directoryAnalytics.searchQuery,
          resultsCount: directoryAnalytics.resultsCount,
          createdAt: directoryAnalytics.createdAt,
        })
        .from(directoryAnalytics)
        .where(eq(directoryAnalytics.eventType, "search"))
        .orderBy(desc(directoryAnalytics.createdAt))
        .limit(20);

      // Group searches by query
      const searchCounts = new Map<string, { count: number; noResults: number }>();
      for (const search of recentSearches) {
        if (!search.query) continue;
        const existing = searchCounts.get(search.query) ?? { count: 0, noResults: 0 };
        existing.count++;
        if (search.resultsCount === 0) existing.noResults++;
        searchCounts.set(search.query, existing);
      }

      const topSearches = Array.from(searchCounts.entries())
        .map(([query, data]) => ({ query, ...data }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

      // Entries by type
      const entriesByType = await ctx.db
        .select({
          type: directoryEntries.type,
          count: count(),
        })
        .from(directoryEntries)
        .where(eq(directoryEntries.isActive, 1))
        .groupBy(directoryEntries.type);

      // Recent entries
      const recentEntries = await ctx.db.query.directoryEntries.findMany({
        where: eq(directoryEntries.isActive, 1),
        orderBy: [desc(directoryEntries.createdAt)],
        limit: 5,
      });

      return {
        totals: {
          entries: allEntries?.count ?? 0,
          activeEntries: activeEntries?.count ?? 0,
          tags: totalTags?.count ?? 0,
          rootTags: rootTags?.count ?? 0,
          contacts: totalContacts?.count ?? 0,
        },
        problems: {
          noTags: entriesWithoutTags.length,
          noContacts: entriesWithoutContacts.length,
        },
        popularEntries: popularEntries.map((pe) => ({
          id: pe.entry.id,
          title: pe.entry.title,
          slug: pe.entry.slug,
          type: pe.entry.type,
          viewCount: pe.viewCount,
          callCount: pe.callCount,
        })),
        popularTags: popularTags.map((pt) => ({
          id: pt.tag.id,
          name: pt.tag.name,
          slug: pt.tag.slug,
          clickCount: pt.clickCount,
        })),
        topSearches,
        entriesByType: entriesByType.map((e) => ({
          type: e.type,
          count: e.count,
        })),
        recentEntries: recentEntries.map((e) => ({
          id: e.id,
          title: e.title,
          slug: e.slug,
          type: e.type,
          createdAt: e.createdAt,
        })),
      };
    }),
  }),
});
