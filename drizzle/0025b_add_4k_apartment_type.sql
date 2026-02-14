-- Add '4k' apartment type to apartment_type enum
-- Required for Building 5 floor 20 apartments (218, 221, 222)

-- PostgreSQL doesn't support adding values to enums in a transaction,
-- so we need to do this outside of a transaction block.

-- Add '4k' to apartment_type enum
ALTER TYPE apartment_type ADD VALUE IF NOT EXISTS '4k';

-- Verify the new type was added
-- SELECT enumlabel FROM pg_enum WHERE enumtypid = 'apartment_type'::regtype ORDER BY enumsortorder;
