-- Add plumber contact: Kashchev Alexey Petrovich
-- Address: Larina 45/6
-- Phone: 8-951-516-26-46

-- Using WITH clause for atomicity
WITH new_entry AS (
  INSERT INTO directory_entry (
    id,
    slug,
    type,
    title,
    subtitle,
    description,
    is_active,
    "order",
    created_at,
    updated_at
  ) VALUES (
    gen_random_uuid()::text,
    'santehnik-kashchev',
    'contact',
    'Сантехник',
    'Кащеев Алексей Петрович',
    'Сантехник управляющей компании',
    1,
    0,
    NOW(),
    NOW()
  ) RETURNING id
)
INSERT INTO directory_contact (
  id,
  entry_id,
  type,
  value,
  label,
  subtitle,
  is_primary,
  "order",
  has_whatsapp,
  has_telegram,
  is_24h
)
SELECT
  gen_random_uuid()::text,
  id,
  'phone',
  '8-951-516-26-46',
  'Телефон',
  'Кащеев Алексей Петрович',
  1,
  0,
  0,
  0,
  0
FROM new_entry
UNION ALL
SELECT
  gen_random_uuid()::text,
  id,
  'address',
  'Ларина 45/6',
  'Адрес',
  '',
  0,
  1,
  0,
  0,
  0
FROM new_entry;
