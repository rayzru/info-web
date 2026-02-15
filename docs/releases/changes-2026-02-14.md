# 📋 Release Changes Analysis

**Period**: `main` → `HEAD`
**Date**: 2026-02-14

## 📊 Summary Statistics

- **Files changed**: 391
- **Lines added**: +41,816
- **Lines deleted**: -12,687
- **Net change**: +29,129
- **Commits**: 20

## 🗂️ Changes by Category

### Database & Migrations

**Impact**: +25072 -960 lines | 48 files

**New files** (20):
- ✨ `drizzle/0024_cloudy_bishop.sql` (+63)
- ✨ `drizzle/0025_add_media_tags.sql` (+27)
- ✨ `drizzle/0025b_README.md` (+109)
- ✨ `drizzle/0025b_add_4k_apartment_type.sql` (+11)
- ✨ `drizzle/0026_README.md` (+200)
- ✨ `drizzle/0026_add_building5_apartments.sql` (+226)
- ✨ `drizzle/0027_README.md` (+226)
- ✨ `drizzle/0027_add_building4_apartments.sql` (+45)
- ✨ `drizzle/building5-apartments-analysis.md` (+110)
- ✨ `drizzle/meta/0024_snapshot.json` (+9373)
- *... and 10 more*

**Modified files** (28):
- 📝 `src/server/db/seed-directory.ts` (+454 -77)
- 📝 `src/server/db/schemas/messages.ts` (+133 -161)
- 📝 `src/server/db/schemas/directory.ts` (+124 -162)
- 📝 `src/server/db/schemas/publications.ts` (+68 -85)
- 📝 `src/server/db/migrate-directory.ts` (+93 -32)
- 📝 `src/server/db/schemas/users.ts` (+41 -61)
- 📝 `src/server/db/schemas/claims.ts` (+38 -57)
- 📝 `src/server/db/schemas/feedback.ts` (+33 -46)
- 📝 `src/server/db/schemas/media.ts` (+71 -7)
- 📝 `src/server/db/schemas/analytics.ts` (+27 -41)
- *... and 7 files with minor changes*

### UI Components

**Impact**: +4882 -3448 lines | 141 files

**New files** (12):
- ✨ `src/components/emergency-phone-button.tsx` (+36)
- ✨ `src/components/property-card.tsx` (+363)
- ✨ `src/components/property-wizard.tsx` (+2)
- ✨ `src/components/property-wizard/forms.tsx` (+393)
- ✨ `src/components/property-wizard/index.tsx` (+343)
- ✨ `src/components/property-wizard/step-header.tsx` (+58)
- ✨ `src/components/pwa-install-prompt.tsx` (+55)
- ✨ `src/components/ui/app-download-links.tsx` (+242)
- ✨ `src/components/ui/phone-number.tsx` (+182)
- ✨ `src/components/ui/property-number-grid.tsx` (+193)
- *... and 2 more*

**Modified files** (129):
- 📝 `src/components/profile-form.tsx` (+167 -190)
- 📝 `src/components/admin/users-table.tsx` (+224 -56)
- 📝 `src/components/claim-form.tsx` (+116 -152)
- 📝 `src/components/community/guide-content.tsx` (+100 -126)
- 📝 `src/components/editor/extensions/mention.tsx` (+92 -98)
- 📝 `src/components/editor/extensions/structure-mention.tsx` (+87 -92)
- 📝 `src/components/listings-view.tsx` (+56 -96)
- 📝 `src/components/editor/toolbar.tsx` (+123 -28)
- 📝 `src/components/owner-claims.tsx` (+56 -92)
- 📝 `src/components/media/media-library.tsx` (+99 -39)
- *... and 35 files with minor changes*

### Pages & Routes

**Impact**: +3741 -4637 lines | 96 files

**New files** (4):
- ✨ `src/app/(admin)/admin/media/[id]/page.tsx` (+311)
- ✨ `src/app/manifest.ts` (+37)
- ✨ `src/app/sitemap.ts` (+134)
- ✨ `src/app/sw.ts` (+21)

**Modified files** (92):
- 📝 `src/app/(main)/my/(cabinet)/property/page.tsx` (+76 -958)
- 📝 `src/app/(admin)/admin/media/page.tsx` (+237 -256)
- 📝 `src/app/(admin)/admin/news/page.tsx` (+294 -184)
- 📝 `src/app/(main)/info/directory-content.tsx` (+129 -161)
- 📝 `src/app/(admin)/admin/events/[id]/page.tsx` (+74 -158)
- 📝 `src/app/(admin)/admin/events/new/page.tsx` (+123 -97)
- 📝 `src/app/(admin)/admin/directory/page.tsx` (+118 -99)
- 📝 `src/app/(main)/feedback/page.tsx` (+87 -77)
- 📝 `src/app/(admin)/admin/analytics/page.tsx` (+82 -79)
- 📝 `src/app/(main)/my/(cabinet)/publications/new/page.tsx` (+79 -79)
- *... and 16 files with minor changes*

### API & Backend

**Impact**: +2526 -2065 lines | 19 files

**New files** (1):
- ✨ `src/server/api/routers/tags.ts` (+362)

**Modified files** (18):
- 📝 `src/server/api/routers/directory.ts` (+661 -707)
- 📝 `src/server/api/routers/admin.ts` (+260 -367)
- 📝 `src/server/api/routers/publications.ts` (+318 -243)
- 📝 `src/server/api/routers/media.ts` (+273 -68)
- 📝 `src/server/api/routers/knowledge.ts` (+117 -132)
- 📝 `src/server/api/routers/feedback.ts` (+97 -112)
- 📝 `src/server/api/routers/news.ts` (+121 -67)
- 📝 `src/server/api/routers/claims.ts` (+95 -75)
- 📝 `src/server/api/routers/auth.ts` (+85 -69)
- 📝 `src/server/api/trpc.ts` (+49 -62)
- *... and 1 files with minor changes*

### Other

**Impact**: +1844 -659 lines | 44 files

**New files** (19):
- ✨ `.eslintrc.cjs.deprecated` (+1)
- ✨ `.prettierignore` (+46)
- ✨ `public/humans.txt` (+13)
- ✨ `public/icons/apple-touch-icon.png` (+0)
- ✨ `public/icons/icon-192x192.png` (+0)
- ✨ `public/icons/icon-384x384.png` (+0)
- ✨ `public/icons/icon-512x512.png` (+0)
- ✨ `public/robots.txt` (+14)
- ✨ `public/sr2-block-banner.png` (+0)
- ✨ `src/hooks/use-mobile.ts` (+28)
- *... and 9 more*

**Modified files** (25):
- 📝 `data/index.ts` (+325 -325)
- 📝 `src/hooks/use-image-upload.ts` (+73 -73)
- 📝 `src/hooks/use-analytics.tsx` (+66 -59)
- 📝 `src/lib/upload/document-processor.ts` (+56 -45)
- 📝 `src/lib/telegram.ts` (+41 -58)
- 📝 `src/lib/upload/image-processor.ts` (+40 -36)
- 📝 `src/lib/editor/extensions.ts` (+53 -8)
- 📝 `src/env.js` (+20 -7)
- 📝 `src/lib/ranks.ts` (+13 -10)
- 📝 `.github/workflows/deploy-production.yml` (+15 -1)
- *... and 14 files with minor changes*

### Documentation

**Impact**: +1647 -255 lines | 11 files

**New files** (10):
- ✨ `.changeset/README.md` (+8)
- ✨ `BUILDING4_MIGRATION_SUMMARY.md` (+201)
- ✨ `BUILDING5_MIGRATION_SUMMARY.md` (+217)
- ✨ `CHANGELOG.md` (+66)
- ✨ `ESLINT_MIGRATION.md` (+205)
- ✨ `ESLINT_SETUP.md` (+54)
- ✨ `MIGRATIONS_COMPLETE_SUMMARY.md` (+327)
- ✨ `RELEASE_GUIDE.md` (+176)
- ✨ `VERSIONING.md` (+278)
- ✨ `src/lib/s3/README.md` (+115)

**Deleted files** (1):
- 🗑️ `SITE_INVENTORY.md`

### Scripts & Tools

**Impact**: +765 -59 lines | 7 files

**New files** (6):
- ✨ `.claude/scripts/mcp_verification.log` (+142)
- ✨ `scripts/add-santehnik-kashchev.sql` (+70)
- ✨ `scripts/add-santehnik.ts` (+79)
- ✨ `scripts/generate-pwa-icons.mjs` (+27)
- ✨ `scripts/test-building5-migration-simple.ts` (+192)
- ✨ `scripts/test-building5-migration.ts` (+186)

**Modified files** (1):
- 📝 `.claude/scripts/verify_mcp.sh` (+69 -59)

### Dependencies

**Impact**: +550 -233 lines | 1 files

**Modified files** (1):
- 📝 `bun.lock` (+550 -233)

### Configuration

**Impact**: +409 -115 lines | 10 files

**New files** (2):
- ✨ `.changeset/config.json` (+14)
- ✨ `data/santehnik-kashchev.json` (+25)

**Modified files** (7):
- 📝 `eslint.config.js` (+157 -35)
- 📝 `package.json` (+73 -51)
- 📝 `.vscode/settings.json` (+89 -18)
- 📝 `next.config.js` (+22 -1)
- 📝 `prettier.config.js` (+20 -0)
- 📝 `.vscode/extensions.json` (+7 -4)
- *... and 1 files with minor changes*

**Deleted files** (1):
- 🗑️ `vercel.json`

### Server Logic

**Impact**: +375 -237 lines | 13 files

**New files** (1):
- ✨ `src/server/notifications/telegram.ts` (+154)

**Modified files** (12):
- 📝 `src/server/auth/config.ts` (+130 -63)
- 📝 `src/server/lib/audit-logger.ts` (+13 -39)
- 📝 `src/server/auth/providers/odnoklassniki.ts` (+29 -21)
- 📝 `src/server/auth/rbac.ts` (+6 -35)
- 📝 `src/server/lib/feedback-logger.ts` (+10 -23)
- 📝 `src/server/notifications/index.ts` (+12 -13)
- 📝 `src/server/notifications/service.ts` (+9 -8)
- 📝 `src/server/email/send.ts` (+3 -13)
- 📝 `src/server/lib/publication-logger.ts` (+5 -10)
- *... and 3 files with minor changes*

### Authentication

**Impact**: +5 -19 lines | 1 files

**Modified files** (1):
- 📝 `src/lib/validations/auth.ts` (+5 -19)

## 📝 Recent Commits

<details>
<summary>Show 20 commits</summary>

- 2b03871 docs: add quick release guide
- bd65567 chore: add versioning infrastructure with changesets
- cf91d08 RELEASING: Releasing 1 package(s)
- 43542d1 Massive updates
- 18203d6 Massive fixes
- 90d2f29 Prune old releases fix
- cd6bd26 Packages updates
- 7c05cb5 Fixes logs
- f294fd6 Update banner
- a4f6b74 WEB App
- 39be734 Avatar deployment changes
- 284695f Footer updates
- 99ad407 Deploy process updated, images cache symlinks
- 63dd6cb Update avatar process fix
- 49c52a2 Main PIC
- 40e7334 Meta improvements
- ae1d5ce Meta improvements
- 2c13b21 force-dynamic for sitemap
- 531346f Another pack of issues for the attachments fixed
- a1a3a97 Meta info improvements

</details>

---

*Generated with `scripts/analyze-release-changes.ts`*
