
-- Table untuk agency
CREATE TABLE IF NOT EXISTS agency (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  family_name VARCHAR(255) NOT NULL,
  region VARCHAR(100),
  phone VARCHAR(20),
  status VARCHAR(20) DEFAULT 'pending', -- pending, approved, rejected
  created_at TIMESTAMP DEFAULT NOW(),
  approved_at TIMESTAMP
);

-- Table untuk host applications
CREATE TABLE IF NOT EXISTS host_applications (
  id SERIAL PRIMARY KEY,
  host_id INTEGER REFERENCES users(id),
  agency_id INTEGER REFERENCES agency(id),
  name VARCHAR(255),
  gender VARCHAR(10),
  id_number VARCHAR(50),
  status VARCHAR(20) DEFAULT 'pending', -- pending, approved, rejected
  created_at TIMESTAMP DEFAULT NOW(),
  approved_at TIMESTAMP
);

-- Table untuk salary requests
CREATE TABLE IF NOT EXISTS salary_requests (
  id SERIAL PRIMARY KEY,
  host_id INTEGER REFERENCES users(id),
  week_number INTEGER,
  salary_amount INTEGER DEFAULT 0,
  total_lives INTEGER DEFAULT 0,
  status VARCHAR(20) DEFAULT 'pending', -- pending, approved, rejected
  created_at TIMESTAMP DEFAULT NOW(),
  approved_at TIMESTAMP
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_agency_user ON agency(user_id);
CREATE INDEX IF NOT EXISTS idx_agency_status ON agency(status);
CREATE INDEX IF NOT EXISTS idx_host_applications_agency ON host_applications(agency_id);
CREATE INDEX IF NOT EXISTS idx_host_applications_host ON host_applications(host_id);
CREATE INDEX IF NOT EXISTS idx_salary_requests_host ON salary_requests(host_id);
CREATE INDEX IF NOT EXISTS idx_salary_requests_status ON salary_requests(status);
