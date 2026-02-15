# Root Cleanup Plan - Organize Markdown Files

**Date**: 2026-02-15
**Status**: ACTIVE
**Priority**: P1

---

## Problem

20 markdown files in project root without organization:

```
/
├── AGENT_LIST.md                        # 6KB  - Agents catalog
├── ARCHITECTURE.md                      # 15KB - Architecture docs
├── BUILDING4_MIGRATION_SUMMARY.md       # 7KB  - Migration report
├── BUILDING5_MIGRATION_SUMMARY.md       # 9KB  - Migration report
├── CHANGELOG.md                         # 7KB  - Changesets changelog
├── CLAUDE.md                            # 5KB  - Main entry point ✅ KEEP
├── DATABASE.md                          # 9KB  - Database docs
├── DEPLOYMENT_FIX_PLAN.md               # 12KB - Deployment plan
├── DEPLOYMENT_WORKFLOW.md               # 8KB  - Deployment workflow
├── ESLINT_MIGRATION.md                  # 7KB  - ESLint migration
├── ESLINT_SETUP.md                      # 1KB  - ESLint setup
├── MCP_GUIDE.md                         # 21KB - MCP setup
├── MIGRATIONS_COMPLETE_SUMMARY.md       # 11KB - Migration report
├── RELEASE_CHANGES_main_to_HEAD.md      # 9KB  - Release changes
├── RELEASE_GUIDE.md                     # 4KB  - Release guide
├── RELEASE_SUMMARY.md                   # 2KB  - Release summary
├── RELEASE_SUMMARY_main_to_HEAD.md      # 2KB  - Release summary (duplicate?)
├── TODO.md                              # 2KB  - Project TODO
├── VERSIONING.md                        # 7KB  - Versioning guide
└── ДОБАВЛЕНИЕ_САНТЕХНИКА.md             # 5KB  - Plumber instructions
```

**Total**: ~150KB of unorganized documentation

---

## Proposed Organization

### Files to KEEP in Root (4 files)

✅ **CLAUDE.md** - Main entry point (DO NOT MOVE)
✅ **README.md** - Project readme (will create)
✅ **CHANGELOG.md** - Standard location for changelogs
✅ **TODO.md** - Project roadmap (temporary, will move to issues)

### Files to MOVE

#### → docs/architecture/ (2 files)

- `ARCHITECTURE.md` → `docs/architecture/overview.md`
- Already has architecture-context.md, will consolidate

#### → docs/development/ (4 files)

- `DATABASE.md` → `docs/development/database.md`
- `MCP_GUIDE.md` → `docs/development/mcp-setup.md`
- `ESLINT_SETUP.md` → `docs/development/eslint-setup.md`
- `ESLINT_MIGRATION.md` → `docs/development/eslint-migration.md`

#### → docs/deployment/ (NEW, 2 files)

- `DEPLOYMENT_WORKFLOW.md` → `docs/deployment/workflow.md`
- `DEPLOYMENT_FIX_PLAN.md` → `docs/deployment/fix-plan-2026-02-14.md`

#### → docs/releases/ (NEW, 6 files)

- `VERSIONING.md` → `docs/releases/versioning.md`
- `RELEASE_GUIDE.md` → `docs/releases/guide.md`
- `RELEASE_SUMMARY.md` → Archive or delete (old)
- `RELEASE_SUMMARY_main_to_HEAD.md` → Archive or delete (duplicate)
- `RELEASE_CHANGES_main_to_HEAD.md` → `docs/releases/changes-2026-02-14.md`

#### → .claude/tracking/reports/ (4 files)

- `BUILDING4_MIGRATION_SUMMARY.md` → `.claude/tracking/reports/building4-migration-2026-02-14.md`
- `BUILDING5_MIGRATION_SUMMARY.md` → `.claude/tracking/reports/building5-migration-2026-02-14.md`
- `MIGRATIONS_COMPLETE_SUMMARY.md` → `.claude/tracking/reports/migrations-complete-2026-02-14.md`

#### → .claude/agents/ (1 file)

- `AGENT_LIST.md` → Consolidate with `.claude/agents/README.md` (already exists)

#### → docs/guides/ or Archive (1 file)

- `ДОБАВЛЕНИЕ_САНТЕХНИКА.md` → `docs/guides/add-plumber-ru.md` or Archive

---

## Detailed Migration Plan

### Step 1: Create new directories

```bash
mkdir -p docs/deployment
mkdir -p docs/releases
```

### Step 2: Move documentation files

```bash
# Architecture
mv ARCHITECTURE.md docs/architecture/overview-old.md
# Will consolidate with architecture-context.md later

# Development
mv DATABASE.md docs/development/database.md
mv MCP_GUIDE.md docs/development/mcp-setup.md
mv ESLINT_SETUP.md docs/development/eslint-setup.md
mv ESLINT_MIGRATION.md docs/development/eslint-migration.md

# Deployment
mv DEPLOYMENT_WORKFLOW.md docs/deployment/workflow.md
mv DEPLOYMENT_FIX_PLAN.md docs/deployment/fix-plan-2026-02-14.md

# Releases
mv VERSIONING.md docs/releases/versioning.md
mv RELEASE_GUIDE.md docs/releases/guide.md
mv RELEASE_CHANGES_main_to_HEAD.md docs/releases/changes-2026-02-14.md

# Move old summaries to archive
mkdir -p docs/releases/archive
mv RELEASE_SUMMARY*.md docs/releases/archive/
```

### Step 3: Move tracking reports

```bash
mv BUILDING4_MIGRATION_SUMMARY.md .claude/tracking/reports/building4-migration-2026-02-14.md
mv BUILDING5_MIGRATION_SUMMARY.md .claude/tracking/reports/building5-migration-2026-02-14.md
mv MIGRATIONS_COMPLETE_SUMMARY.md .claude/tracking/reports/migrations-complete-2026-02-14.md
```

### Step 4: Handle special cases

**AGENT_LIST.md**:
- Review content
- Consolidate with `.claude/agents/README.md`
- Delete original after consolidation

**ДОБАВЛЕНИЕ_САНТЕХНИКА.md**:
- Option A: Move to `docs/guides/add-plumber-ru.md`
- Option B: Archive (one-time task, completed)
- Recommendation: Archive

**TODO.md**:
- Create GitHub issues from content
- Move to `.claude/tracking/roadmap.md`
- Delete from root

### Step 5: Create README.md

Create proper project README in root with:
- Project description
- Quick start
- Links to documentation
- Contributing guide
- License

---

## After Migration

### Root will have (4-5 files):

```
/
├── README.md          # NEW: Project overview
├── CLAUDE.md          # Main entry point for Claude
├── CHANGELOG.md       # Changesets changelog
├── package.json       # Package manifest
└── [other config files]
```

### Documentation structure:

```
docs/
├── architecture/
│   ├── overview.md              # Consolidated ARCHITECTURE.md
│   ├── technology-stack.md      # Already created
│   └── ...
│
├── development/
│   ├── database.md              # From DATABASE.md
│   ├── mcp-setup.md             # From MCP_GUIDE.md
│   ├── eslint-setup.md          # From ESLINT_SETUP.md
│   └── eslint-migration.md      # From ESLINT_MIGRATION.md
│
├── deployment/                   # NEW
│   ├── workflow.md              # From DEPLOYMENT_WORKFLOW.md
│   └── fix-plan-2026-02-14.md   # From DEPLOYMENT_FIX_PLAN.md
│
└── releases/                     # NEW
    ├── versioning.md            # From VERSIONING.md
    ├── guide.md                 # From RELEASE_GUIDE.md
    ├── changes-2026-02-14.md    # From RELEASE_CHANGES_main_to_HEAD.md
    └── archive/                 # Old summaries
```

---

## Benefits

✅ **Cleaner root** - Only essential files
✅ **Better organization** - Logical grouping
✅ **Easier navigation** - Clear structure
✅ **No duplicates** - Consolidate AGENT_LIST
✅ **Archival** - Old reports in tracking/

**Impact**: -16 files from root (~130KB moved to proper locations)

---

## Execution Checklist

- [ ] Create new directories (docs/deployment, docs/releases)
- [ ] Move architecture docs
- [ ] Move development docs
- [ ] Move deployment docs
- [ ] Move release docs
- [ ] Move tracking reports
- [ ] Consolidate AGENT_LIST.md
- [ ] Handle TODO.md (create issues)
- [ ] Archive ДОБАВЛЕНИЕ_САНТЕХНИКА.md
- [ ] Create README.md
- [ ] Update links in all files
- [ ] Commit changes
- [ ] Verify no broken links

---

## Risks

**Low risk** - all moves are organizational, no code changes

**Mitigation**: Keep git history, can revert if needed

---

**Status**: Ready to execute
**Estimated time**: 30 minutes
