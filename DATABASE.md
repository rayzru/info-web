# Database Management Guide

## Overview

This project uses **PostgreSQL** with **Drizzle ORM** for type-safe database operations. The database runs in a Docker container and includes comprehensive seed data for development.

## Quick Start

### First Time Setup

1. **Start PostgreSQL** (Docker):
```bash
docker-compose up -d
```

2. **Initialize Database** (push schema + seed data):
```bash
bun run db:init
```

3. **Open Drizzle Studio** (optional - visual database browser):
```bash
bun run db:studio
```

Visit http://localhost:4983 to browse your database visually.

## Available Commands

### Development Commands

```bash
# Push schema changes to database (development)
bun run db:push

# Generate migration files from schema changes
bun run db:generate

# Run pending migrations
bun run db:migrate

# Open Drizzle Studio (visual database browser)
bun run db:studio
```

### Data Management Commands

```bash
# Seed database with initial data
bun run db:seed

# Drop all tables and reset database
bun run db:reset

# Complete reset: drop tables + push schema + seed data
bun run db:reset:full

# Initialize fresh database (push schema + seed data)
bun run db:init
```

## Database Schema

### Core Tables

**Buildings & Structure:**
- `building` - Building information (Строение 1-7)
- `entrance` - Building entrances (подъезды)
- `floor` - Floors in each entrance
- `apartment` - Individual apartments with types (studio, 1k, 2k, 3k)

**Parking:**
- `parking` - Parking structures
- `parking_floor` - Parking levels (typically -1)
- `parking_spot` - Individual parking spaces (standard, wide, moto)

**Users & Property Management:**
- `user` - User accounts (NextAuth)
- `account` - OAuth accounts (NextAuth)
- `session` - User sessions (NextAuth)
- `verification_token` - Email verification (NextAuth)
- `user_apartment` - User-apartment relationships
- `user_parking_spot` - User-parking relationships

**Community:**
- `post` - Community posts
- `organization` - HOA and management companies
- `contact` - Contact information

### Relationships

```
buildings (1) ──→ (n) entrances ──→ (n) floors ──→ (n) apartments
buildings (1) ──→ (n) parkings ──→ (n) parking_floors ──→ (n) parking_spots

users (1) ──→ (n) user_apartments (n) ←── (1) apartments
users (1) ──→ (n) user_parking_spots (n) ←── (1) parking_spots
```

## Seed Data

The database includes comprehensive seed data for development:

### Buildings
- **7 Buildings** (Строение 1-7)
  - Buildings 1, 2, 6, 7 are active with full data
  - Buildings 3, 4, 5 are inactive (placeholders)

### Apartments
- **Hundreds of apartments** across active buildings
- **Types**: Studio, 1-комнатная (1k), 2-комнатная (2k), 3-комнатная (3k)
- **Numbering**: Logical numbering per entrance

| Building | Entrances | Floors | Apartments per Floor | Total Apartments |
|----------|-----------|--------|---------------------|------------------|
| 1        | 2         | 24     | 11                  | 484              |
| 2        | 2         | 12     | 11                  | 242              |
| 6        | 2         | 24     | 11-12               | ~552             |
| 7        | 2         | 24     | 11-12               | ~552             |

### Parking
- **4 Underground parking structures**
- **794 total parking spots**

| Building | Parking Spots |
|----------|--------------|
| 1        | 210          |
| 2        | 259          |
| 6        | 99           |
| 7        | 226          |

## Common Tasks

### Reset Database Completely

If you need to start fresh (⚠️ **destroys all data**):

```bash
bun run db:reset:full
```

This will:
1. Drop all tables
2. Push fresh schema
3. Populate with seed data

### Add New Seed Data

To add new seed data:

1. Edit `drizzle/0001_seed-data.sql`
2. Run: `bun run db:reset:full`

### Create New Migration

When you change the schema:

```bash
# 1. Update schema files in src/server/db/schemas/
# 2. Generate migration
bun run db:generate

# 3. Review generated SQL in drizzle/
# 4. Apply migration
bun run db:migrate
```

### Development vs Production

**Development** (use `db:push` for rapid iteration):
```bash
bun run db:push  # Directly pushes schema changes
```

**Production** (use migrations for version control):
```bash
bun run db:generate  # Generate migration files
bun run db:migrate   # Apply migrations
```

## Docker Configuration

### docker-compose.yml

```yaml
services:
  database:
    image: postgres:latest
    restart: always
    ports:
      - 5432:5432
    volumes:
      - database-volume:/var/lib/postgresql/data
    environment:
      POSTGRES_DB: sr2-community
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
```

### Commands

```bash
# Start database
docker-compose up -d

# Stop database
docker-compose down

# Stop and remove data (⚠️ destroys all data)
docker-compose down -v

# View logs
docker logs -f <container-id>

# Access PostgreSQL CLI
docker exec -it <container-id> psql -U postgres -d sr2-community
```

## Environment Variables

Required in `.env`:

```bash
# Database Configuration
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/sr2-community"
DATABASE_NAME="sr2-community"
```

## Troubleshooting

### Database Won't Start

```bash
# Check if PostgreSQL is running
docker ps

# Check logs
docker-compose logs database

# Restart container
docker-compose restart database
```

### Schema Push Fails

```bash
# Make sure database is running
docker ps

# Check connection
bun run db:studio

# Try resetting
bun run db:reset:full
```

### Seed Data Already Exists

If you see "duplicate key" errors:

```bash
# Reset database completely
bun run db:reset:full
```

### Drizzle Studio Won't Open

```bash
# Check if port 4983 is available
lsof -i :4983

# Kill existing process if needed
kill -9 <PID>

# Restart Drizzle Studio
bun run db:studio
```

## Database Schema Files

```
src/server/db/
├── index.ts           # Database connection (Drizzle)
├── schema.ts          # Schema exports (re-exports all schemas)
├── model.ts           # Model layer (custom abstractions)
├── reset.ts           # Reset script (drops all tables)
├── seed.ts            # Seed script (uses postgres driver for multi-statement SQL)
├── schemas/           # Individual schema definitions
│   ├── buildings.ts   # Buildings, entrances, floors, apartments
│   ├── parkings.ts    # Parking structures and spots
│   ├── users.ts       # User accounts (NextAuth tables)
│   ├── users-property.ts  # User-property relationships
│   ├── posts.ts       # Community posts
│   ├── organizations.ts   # HOA/management
│   └── contacts.ts    # Contact information
└── models/            # Custom model layer
    ├── buildings.ts   # Building queries
    ├── users.ts       # User queries
    └── users-property.ts  # Property relationship queries
```

### Note on Seed Script Implementation

The `seed.ts` script uses the `postgres` driver directly (not Drizzle) because:
- The seed SQL file contains multiple statements
- Drizzle's `db.execute(sql.raw())` can only handle single statements
- The `postgres` driver's `sql.unsafe()` method supports multi-statement execution
- This is a common pattern for running migration/seed files

## Migration Files

```
drizzle/
├── 0000_tense_white_queen.sql   # Initial schema
├── 0001_seed-data.sql           # Seed data
└── meta/                        # Drizzle metadata
    ├── _journal.json
    ├── 0000_snapshot.json
    └── 0001_snapshot.json
```

## Best Practices

1. **Use `db:push` for development** - Fast schema iteration
2. **Use `db:generate` + `db:migrate` for production** - Version-controlled migrations
3. **Always test migrations locally first**
4. **Keep seed data up to date** - Update `0001_seed-data.sql` as needed
5. **Use Drizzle Studio** for quick database inspection
6. **Document schema changes** - Add comments to migration files
7. **Backup production data** before running migrations

## Related Documentation

- [ARCHITECTURE.md](ARCHITECTURE.md) - Overall project architecture
- [drizzle.config.ts](drizzle.config.ts) - Drizzle configuration
- [docker-compose.yml](docker-compose.yml) - Docker setup
- [Drizzle ORM Docs](https://orm.drizzle.team/) - Official documentation

---

**Need Help?** Check the Drizzle ORM documentation or ask in the team chat.
