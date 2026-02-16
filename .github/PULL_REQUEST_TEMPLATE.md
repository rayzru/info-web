## Change Summary
<!-- Brief description of what this PR does -->

## Type of Change
- [ ] 🐛 Bug fix (patch)
- [ ] ✨ New feature (minor)
- [ ] 💥 Breaking change (major)
- [ ] 📝 Documentation update
- [ ] 🔧 Configuration/tooling change

## Git Flow Checklist

### ✅ Branch Strategy
- [ ] Feature branch created from `development` (not `main`)
- [ ] PR targets `development` (not `main` directly)
- [ ] Branch name follows convention: `feature/*`, `fix/*`, `docs/*`

### ✅ Pre-Merge Checks
- [ ] `bun run check` passes locally
- [ ] `bun run build` passes locally
- [ ] No console.log statements in code
- [ ] Error states handled
- [ ] Loading states implemented

### ✅ For Features Requiring Database Changes
- [ ] Changeset created (if using Changesets)
- [ ] Migration files included in commit
- [ ] Migration is backward-compatible with current production code

### ✅ Deployment Path
This PR will deploy to:
- [ ] **Beta** (merge to `development` → auto-deploy)
- [ ] **Production** (after beta verification, PR: `development` → `main`)

## Testing
<!-- How was this tested? -->
- [ ] Local testing completed
- [ ] Integration tests pass
- [ ] Manual testing on feature branch

## Screenshots/Demo
<!-- If applicable, add screenshots or demo -->

---

**Read before merging**: [Git Flow & Deployment Guide](../CLAUDE.md#git-flow--deployment)
