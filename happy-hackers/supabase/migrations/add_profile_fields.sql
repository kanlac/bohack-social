-- Add new fields to users table for richer profile content
ALTER TABLE users ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';
ALTER TABLE users ADD COLUMN IF NOT EXISTS unique_quote TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS background TEXT;
