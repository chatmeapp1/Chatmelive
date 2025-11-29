
-- Add profile fields to users table if they don't exist

ALTER TABLE users 
ADD COLUMN IF NOT EXISTS gender VARCHAR(20),
ADD COLUMN IF NOT EXISTS age INTEGER,
ADD COLUMN IF NOT EXISTS signature TEXT,
ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- Update existing records with default values if needed
UPDATE users SET gender = 'laki-laki' WHERE gender IS NULL;
UPDATE users SET age = 18 WHERE age IS NULL;
