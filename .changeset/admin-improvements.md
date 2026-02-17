---
"sr2-t3": patch
---

Admin improvements: feedback permissions, bulk operations, and UI refinements

**Features:**
- Added feedback-specific RBAC permissions (`feedback:view`, `feedback:manage`)
- Added hard delete functionality for users with dependency checks (blocks deletion if user has publications/listings/news)
- Added single delete option for feedback entries
- Improved bulk delete for users with UUID validation and dependency checks

**Bug Fixes:**
- Fixed feedback admin page query errors by removing orphaned `testMigrationField` from schema
- Fixed feedback endpoints using wrong permission (`users:manage` → `feedback:view`/`feedback:manage`)
- Fixed dropdown menu icon spacing (removed `mr-2` for consistent alignment)
- Fixed invalid UUID handling in bulk user deletion

**Improvements:**
- Reduced debug logging noise (removed session creation logs, only log slow tRPC procedures > 1s)
- Improved hard delete safety with comprehensive dependency validation
- Better error messages for deletion failures with dependency details
