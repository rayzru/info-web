# 📦 Release Workflow Instructions

## Overview

This project uses **Changesets** for semantic versioning and **automated release analysis** for generating user-friendly announcements.

## 🎯 Complete Release Workflow

### 1. During Development

When working on features/fixes:

```bash
# Create feature branch
git checkout -b feature/my-feature

# Make changes + commits
git add .
git commit -m "feat: add feature"

# Create changeset
bun run changeset:add
# Choose type: minor (feature) or patch (bugfix)
# Write description for changelog

# Commit changeset
git add .changeset/
git commit -m "chore: add changeset"
```

### 2. Before Creating Release

Analyze changes and generate summaries:

```bash
# 1. Detailed technical analysis (all files, categories, stats)
bun run release:analyze main HEAD
# → Creates RELEASE_CHANGES_main_to_HEAD.md

# 2. User-friendly summary for announcements
bun run release:summarize main HEAD
# → Creates RELEASE_SUMMARY.md

# Review both files:
# - RELEASE_CHANGES_* for technical review
# - RELEASE_SUMMARY.md for website announcement
```

### 3. Create Release

```bash
# 1. Apply changesets and bump version
bun run version
# → Updates package.json
# → Updates CHANGELOG.md
# → Deletes applied changesets

# 2. Create git tag
git tag -a "v$(node -p "require('./package.json').version")" -m "Release v$(node -p "require('./package.json').version")"

# 3. Push changes and tags
git push origin main --follow-tags

# 4. Create GitHub release
bun run release:github
# → Creates release on GitHub using CHANGELOG.md
```

### 4. Publish Announcement

Use `RELEASE_SUMMARY.md` content for:
- Website announcement
- User communication
- Social media posts

## 📋 Available Scripts

| Script | Purpose |
|--------|---------|
| `bun run changeset:add` | Create new changeset |
| `bun run changeset:status` | View pending changesets |
| `bun run version` | Apply changesets, bump version |
| `bun run release:analyze [from] [to]` | Detailed technical analysis |
| `bun run release:summarize [from] [to]` | User-friendly summary |
| `bun run release:github` | Create GitHub release |

## 📁 Generated Files

| File | Purpose | Commit |
|------|---------|--------|
| `CHANGELOG.md` | Full changelog (auto-generated) | ✅ Yes |
| `RELEASE_CHANGES_*.md` | Technical analysis | ❌ No (temporary) |
| `RELEASE_SUMMARY.md` | User announcement | ❌ No (temporary) |
| `.changeset/*.md` | Individual changesets | ✅ Yes |

## 🎨 Changeset Examples

### New Feature (minor)

```markdown
---
"sr2-t3": minor
---

Added apartment data for Buildings 4 and 5 with comprehensive migration guides
```

### Bug Fix (patch)

```markdown
---
"sr2-t3": patch
---

Fixed authentication redirect loop on password reset page
```

### Multiple Changes

```markdown
---
"sr2-t3": minor
---

Multiple UI improvements:
- Added dark mode support
- Implemented real-time notifications
- Improved loading states
```

## 🤖 AI Agent Usage

When you need to create a release:

1. **Ask AI to analyze changes**:
   ```
   Analyze changes between main and current branch for release v0.3.0
   ```

2. **AI will**:
   - Run `bun run release:analyze`
   - Run `bun run release:summarize`
   - Review CHANGELOG.md
   - Create comprehensive release notes

3. **Review and approve**:
   - Check generated summaries
   - Verify version bump is correct
   - Ensure all changes are documented

## 📊 Analysis Output

### RELEASE_CHANGES_*.md

Technical analysis with:
- Files changed by category
- Top changed files
- Addition/deletion stats
- Commit history

### RELEASE_SUMMARY.md

User-friendly summary with:
- Key improvements in Russian
- User-facing benefits
- Technical overview
- Statistics

## 🔄 Workflow Diagram

```
Development
    ↓
Create Changeset
    ↓
Merge to main/develop
    ↓
Analyze Changes
    ↓
Generate Summaries
    ↓
Bump Version
    ↓
Create Tag
    ↓
Push + Create GitHub Release
    ↓
Publish Announcement
```

## ⚡ Quick Commands

```bash
# Full release workflow
bun run release:analyze main HEAD
bun run release:summarize main HEAD
bun run version
git tag -a "v$(node -p "require('./package.json').version")" -m "Release"
git push origin main --follow-tags
bun run release:github

# Or use AI agent:
# "Create release v0.3.0 from current changes"
```

## 🎯 Best Practices

1. **Always analyze before releasing** - understand impact
2. **Review RELEASE_SUMMARY.md** - ensure user-friendly
3. **Update CHANGELOG manually** if needed - AI-generated might need tweaks
4. **Test on staging** before production release
5. **Keep changesets small** - easier to review and revert

## 📚 Related Files

- [VERSIONING.md](../../VERSIONING.md) - Full versioning documentation
- [RELEASE_GUIDE.md](../../RELEASE_GUIDE.md) - Quick release guide
- [CHANGELOG.md](../../CHANGELOG.md) - Auto-generated changelog

---

**Current Version**: See `package.json`
**Last Updated**: 2026-02-14
