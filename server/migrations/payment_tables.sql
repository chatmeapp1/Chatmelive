
-- Create payment_transactions table
CREATE TABLE IF NOT EXISTS payment_transactions (
  id SERIAL PRIMARY KEY,
  order_id VARCHAR(255) UNIQUE NOT NULL,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  package_id INTEGER NOT NULL,
  coins_amount INTEGER NOT NULL,
  bonus_coins INTEGER DEFAULT 0,
  price INTEGER NOT NULL,
  payment_method VARCHAR(50),
  snap_token TEXT,
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_payment_user_id ON payment_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_order_id ON payment_transactions(order_id);
CREATE INDEX IF NOT EXISTS idx_payment_status ON payment_transactions(status);
