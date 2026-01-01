#!/bin/bash
# Export database for beta environment (without user data)
# Usage: ./scripts/export-db-for-beta.sh

set -e

# Load environment variables
source .env

# Extract connection details from DATABASE_URL
# Format: postgresql://user:pass@host:port/dbname
DB_URL="${DATABASE_URL}"
DB_NAME="${DATABASE_NAME}"

# Parse connection string
if [[ $DB_URL =~ postgresql://([^:]+):([^@]+)@([^:]+):([^/]+)/(.+) ]]; then
    DB_USER="${BASH_REMATCH[1]}"
    DB_PASS="${BASH_REMATCH[2]}"
    DB_HOST="${BASH_REMATCH[3]}"
    DB_PORT="${BASH_REMATCH[4]}"
    DB_NAME="${BASH_REMATCH[5]}"
else
    echo "Error: Could not parse DATABASE_URL"
    exit 1
fi

export PGPASSWORD="$DB_PASS"

OUTPUT_DIR="./db-export"
mkdir -p "$OUTPUT_DIR"

TIMESTAMP=$(date +%Y%m%d_%H%M%S)
SCHEMA_FILE="$OUTPUT_DIR/schema_${TIMESTAMP}.sql"
DATA_FILE="$OUTPUT_DIR/data_${TIMESTAMP}.sql"
FULL_FILE="$OUTPUT_DIR/beta_db_${TIMESTAMP}.sql"

echo "=== Exporting database for beta environment ==="
echo "Source: $DB_NAME @ $DB_HOST"
echo ""

# Tables to EXCLUDE (user data and related)
EXCLUDE_TABLES=(
    # User accounts and auth
    "sr2_user"
    "sr2_user_role"
    "sr2_user_profile"
    "sr2_account"
    "sr2_session"
    "sr2_verification_token"
    "sr2_password_reset_token"
    "sr2_email_verification_token"
    "sr2_telegram_auth_token"
    "sr2_user_block"
    "sr2_user_interest_building"
    # User activity and submissions
    "sr2_audit_log"
    "sr2_feedback"
    "sr2_feedback_history"
    "sr2_deletion_request"
    "sr2_claim"
    "sr2_notification"
    # User-generated content
    "sr2_listing"
    "sr2_post"
    "sr2_message"
    "sr2_publication"
)

# Build exclude arguments for pg_dump
EXCLUDE_ARGS=""
for table in "${EXCLUDE_TABLES[@]}"; do
    EXCLUDE_ARGS="$EXCLUDE_ARGS --exclude-table=$table"
done

echo "=== Step 1: Exporting full schema (structure only) ==="
pg_dump -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" \
    --schema-only \
    --no-owner \
    --no-privileges \
    > "$SCHEMA_FILE"
echo "Schema exported to: $SCHEMA_FILE"

echo ""
echo "=== Step 2: Exporting data (excluding user tables) ==="
pg_dump -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" \
    --data-only \
    --no-owner \
    --no-privileges \
    $EXCLUDE_ARGS \
    > "$DATA_FILE"
echo "Data exported to: $DATA_FILE"

echo ""
echo "=== Step 3: Combining into single file ==="
{
    echo "-- Beta database export"
    echo "-- Generated: $(date)"
    echo "-- Source: $DB_NAME"
    echo "-- Note: User data excluded"
    echo ""
    echo "-- ============================================"
    echo "-- SCHEMA"
    echo "-- ============================================"
    echo ""
    cat "$SCHEMA_FILE"
    echo ""
    echo "-- ============================================"
    echo "-- DATA (excluding user tables)"
    echo "-- ============================================"
    echo ""
    cat "$DATA_FILE"
} > "$FULL_FILE"

echo "Combined file: $FULL_FILE"

echo ""
echo "=== Summary ==="
echo "Schema file: $(wc -l < "$SCHEMA_FILE") lines"
echo "Data file: $(wc -l < "$DATA_FILE") lines"
echo "Full file: $(wc -l < "$FULL_FILE") lines"
echo ""
echo "=== Excluded tables (user data) ==="
printf '%s\n' "${EXCLUDE_TABLES[@]}"
echo ""
echo "=== Next steps ==="
echo "1. Copy $FULL_FILE to beta server"
echo "2. On beta server, run:"
echo "   psql -h localhost -U beta_sr2_usr -d beta_sr2 < beta_db_${TIMESTAMP}.sql"
echo ""
echo "Or use scp:"
echo "   scp $FULL_FILE user@beta.sr2.ru:/tmp/"
echo "   ssh user@beta.sr2.ru 'psql -h localhost -U beta_sr2_usr -d beta_sr2 < /tmp/beta_db_${TIMESTAMP}.sql'"
