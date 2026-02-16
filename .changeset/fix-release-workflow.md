---
"sr2-t3": patch
---

fix(release): remove build step from release script to avoid env validation errors

The Release workflow was failing because 'bun run release' included build step that required environment variables. Release workflow only needs to create git tags via 'changeset publish', not build the app (building happens in Deploy Production workflow which has all secrets).
