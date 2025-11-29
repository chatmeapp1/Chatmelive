
-- Migration to update user ID format to 6-digit date-based format
-- This will update existing users and modify the table structure

-- First, create a temporary column for new IDs
ALTER TABLE users ADD COLUMN IF NOT EXISTS new_id INTEGER;

-- Generate new IDs for existing users based on their creation date
-- Format: DDMMYY (e.g., 260125)
UPDATE users 
SET new_id = (
  EXTRACT(DAY FROM created_at)::INTEGER * 10000 +
  EXTRACT(MONTH FROM created_at)::INTEGER * 100 +
  (EXTRACT(YEAR FROM created_at)::INTEGER % 100)
)
WHERE new_id IS NULL;

-- Handle duplicates by adding sequential numbers
WITH ranked_users AS (
  SELECT id, new_id,
    ROW_NUMBER() OVER (PARTITION BY new_id ORDER BY created_at) - 1 as row_num
  FROM users
)
UPDATE users u
SET new_id = r.new_id + r.row_num
FROM ranked_users r
WHERE u.id = r.id AND r.row_num > 0;

-- Update foreign key references in other tables
ALTER TABLE gifts DROP CONSTRAINT IF EXISTS gifts_sender_id_fkey;
ALTER TABLE gifts DROP CONSTRAINT IF EXISTS gifts_receiver_id_fkey;
ALTER TABLE host_income DROP CONSTRAINT IF EXISTS host_income_host_id_fkey;
ALTER TABLE live_sessions DROP CONSTRAINT IF EXISTS live_sessions_host_id_fkey;
ALTER TABLE agency DROP CONSTRAINT IF EXISTS agency_user_id_fkey;
ALTER TABLE host_applications DROP CONSTRAINT IF EXISTS host_applications_host_id_fkey;
ALTER TABLE salary_requests DROP CONSTRAINT IF EXISTS salary_requests_host_id_fkey;

-- Create a mapping table temporarily
CREATE TEMP TABLE id_mapping AS
SELECT id as old_id, new_id FROM users;

-- Update all foreign key references
UPDATE gifts g SET sender_id = m.new_id FROM id_mapping m WHERE g.sender_id = m.old_id;
UPDATE gifts g SET receiver_id = m.new_id FROM id_mapping m WHERE g.receiver_id = m.old_id;
UPDATE host_income h SET host_id = m.new_id FROM id_mapping m WHERE h.host_id = m.old_id;
UPDATE live_sessions l SET host_id = m.new_id FROM id_mapping m WHERE l.host_id = m.old_id;
UPDATE agency a SET user_id = m.new_id FROM id_mapping m WHERE a.user_id = m.old_id;
UPDATE host_applications ha SET host_id = m.new_id FROM id_mapping m WHERE ha.host_id = m.old_id;
UPDATE salary_requests sr SET host_id = m.new_id FROM id_mapping m WHERE sr.host_id = m.old_id;

-- Drop the old id column and rename new_id to id
ALTER TABLE users DROP CONSTRAINT users_pkey;
ALTER TABLE users DROP COLUMN id;
ALTER TABLE users RENAME COLUMN new_id TO id;
ALTER TABLE users ADD PRIMARY KEY (id);

-- Recreate foreign key constraints
ALTER TABLE gifts ADD CONSTRAINT gifts_sender_id_fkey FOREIGN KEY (sender_id) REFERENCES users(id);
ALTER TABLE gifts ADD CONSTRAINT gifts_receiver_id_fkey FOREIGN KEY (receiver_id) REFERENCES users(id);
ALTER TABLE host_income ADD CONSTRAINT host_income_host_id_fkey FOREIGN KEY (host_id) REFERENCES users(id);
ALTER TABLE live_sessions ADD CONSTRAINT live_sessions_host_id_fkey FOREIGN KEY (host_id) REFERENCES users(id);
ALTER TABLE agency ADD CONSTRAINT agency_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id);
ALTER TABLE host_applications ADD CONSTRAINT host_applications_host_id_fkey FOREIGN KEY (host_id) REFERENCES users(id);
ALTER TABLE salary_requests ADD CONSTRAINT salary_requests_host_id_fkey FOREIGN KEY (host_id) REFERENCES users(id);
