---
"info-web": patch
---

## Security: Git History Cleanup

**Critical Security Fix**

Completely removed exposed SMTP credentials from entire git history using BFG Repo-Cleaner:

### Changes
- Removed old SMTP password `:-)dbTwnei}?cI)4` from all commits (132 objects cleaned)
- Generated and deployed new SMTP password across all environments
- Force-pushed cleaned history to GitHub repository
- Repository renamed: `info-web` → `sr2.ru` on GitHub

### Security Actions Taken
1. ✅ Rotated SMTP password on mail server (Dovecot)
2. ✅ Updated GitHub secrets (Production and Beta environments)
3. ✅ Updated local `.env` files with new password
4. ✅ Cleaned git history using BFG Repo-Cleaner
5. ✅ Force-pushed to remote with `git push --force --all origin`
6. ✅ Verified old password completely removed from history

### Impact
- **Breaking**: Requires fresh clone of repository for all developers
- **Security**: No exposed credentials remain in version control
- All deployments continue working with new password

### Verification
```bash
# Verify password is not in history
git log --all --full-history -S':-)dbTwnei}?cI)4'
# Should return no results
```

**Note**: This is a one-time security fix. All team members must clone fresh repository.
