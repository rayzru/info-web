---
"sr2-t3": patch
---

feat(feedback): add multi-layer anti-bot protection and spam deletion

**Anti-bot Protection:**
- Honeypot field (invisible field that bots fill)
- Time token validation (minimum 3 seconds to fill form)
- Browser fingerprint check (basic bot detection)
- Prevents automated spam submissions

**Admin Features:**
- Single feedback deletion with soft delete
- Bulk delete for spam cleanup (up to 100 items)
- Deletion logging in feedback history
- Admin-only operations with proper permissions

**Security:**
- Multi-layer validation on server side
- Rate limiting per IP remains active
- All deletions are logged for audit trail
- Proper error messages without leaking details

This update addresses the spam bot issue in feedback form visible in admin panel.
