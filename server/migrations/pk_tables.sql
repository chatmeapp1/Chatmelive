
-- Table for PK battles
CREATE TABLE IF NOT EXISTS pk_battles (
  id SERIAL PRIMARY KEY,
  host_id INTEGER NOT NULL,
  opponent_id INTEGER NOT NULL,
  room_id VARCHAR(255),
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP,
  duration_seconds INTEGER,
  host_score INTEGER DEFAULT 0,
  opponent_score INTEGER DEFAULT 0,
  winner VARCHAR(20),
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_pk_room_status ON pk_battles(room_id, status);
CREATE INDEX idx_pk_host ON pk_battles(host_id);
CREATE INDEX idx_pk_opponent ON pk_battles(opponent_id);
