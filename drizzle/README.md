# Drizzle Migrations

This directory contains database migrations managed by Drizzle ORM.

## Migration Files

### Active Migrations (Applied via Drizzle)

All migrations numbered `0000_*.sql` through `0026_*.sql` are tracked in `meta/_journal.json` and have been applied to the database.

**Current migration**: `0026_wealthy_loa.sql` (adds 'deleted' action to feedback history)

### Manual Migration Scripts (One-time use)

These scripts were used for one-time data migrations and are kept for historical reference:

- `migrate-buildings-safe.sql` - Safe migration of apartment/parking data with preserved user relationships (applied 2026-01-28)
- `rebuild-buildings.sql` - Complete rebuild of building structure (applied 2026-01-28)

**Note**: These scripts are **generated** by TypeScript files in `src/server/db/`:
- `safe-migrate-buildings.ts` → generates `migrate-buildings-safe.sql`
- `rebuild-buildings-structure.ts` → generates `rebuild-buildings.sql`

## Creating New Migrations

```bash
# Generate a new migration
bun run db:generate

# Apply migrations to database
bun run db:migrate

# Push schema changes directly (development only)
bun run db:push
```

## Migration Workflow

1. **Development**: Make schema changes in `src/server/db/schemas/`
2. **Generate**: Run `bun run db:generate` to create migration SQL
3. **Review**: Check generated SQL in `drizzle/NNNN_*.sql`
4. **Apply**: Run `bun run db:migrate` or `bun run db:push`
5. **Commit**: Commit both schema changes and migration files

## Drizzle Studio

View and edit database data:

```bash
bun run db:studio
```

Opens Drizzle Studio at https://local.drizzle.studio

## Important Notes

- **Never** manually edit applied migration files
- **Always** use Drizzle to generate migrations for schema changes
- Manual SQL scripts (like `migrate-buildings-safe.sql`) are for one-time use only
- Check `meta/_journal.json` to see which migrations have been applied
