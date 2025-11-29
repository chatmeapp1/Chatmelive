import pkg from 'pg';
const { Pool } = pkg;
import dotenv from "dotenv";

dotenv.config();

// ====================================================
// ✅ Koneksi NeonDB (PostgreSQL)
// ====================================================
let DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("❌ DATABASE_URL belum diset di .env!");
  process.exit(1);
}

// Remove "psql " prefix if exists (Replit adds this sometimes)
if (DATABASE_URL.startsWith('psql ')) {
  DATABASE_URL = DATABASE_URL.substring(5);
}

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  max: 10
});

async function initDatabase() {
  try {
    const client = await pool.connect();
    console.log("✅ PostgreSQL connected successfully");

    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY,
        phone VARCHAR(20) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(100) DEFAULT 'Pengguna Baru',
        avatar_url TEXT,
        gender VARCHAR(20),
        age INTEGER,
        signature TEXT,
        balance INTEGER DEFAULT 0,
        topup_balance INTEGER DEFAULT 0,
        level INTEGER DEFAULT 1,
        vip_level INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Add topup_balance column if it doesn't exist (for existing databases)
    await client.query(`
      ALTER TABLE users ADD COLUMN IF NOT EXISTS topup_balance INTEGER DEFAULT 0
    `);

    console.log("✅ Tabel users siap digunakan");

    await client.query(`
      CREATE TABLE IF NOT EXISTS gifts (
        id SERIAL PRIMARY KEY,
        sender_id INTEGER NOT NULL REFERENCES users(id),
        receiver_id INTEGER NOT NULL REFERENCES users(id),
        gift_name VARCHAR(100) NOT NULL,
        coin_value INTEGER NOT NULL,
        quantity INTEGER DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_gifts_sender ON gifts(sender_id);
      CREATE INDEX IF NOT EXISTS idx_gifts_receiver ON gifts(receiver_id);
      CREATE INDEX IF NOT EXISTS idx_gifts_created_at ON gifts(created_at);
    `);

    console.log("✅ Tabel gifts dan indexes siap digunakan");

    await client.query(`
      CREATE TABLE IF NOT EXISTS host_income (
        id SERIAL PRIMARY KEY,
        host_id INTEGER NOT NULL REFERENCES users(id),
        gift_id INTEGER,
        income INTEGER NOT NULL,
        type VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_host_income_host ON host_income(host_id);
      CREATE INDEX IF NOT EXISTS idx_host_income_created ON host_income(created_at);
    `);

    console.log("✅ Tabel host_income siap digunakan");

    await client.query(`
      CREATE TABLE IF NOT EXISTS live_sessions (
        id SERIAL PRIMARY KEY,
        host_id INTEGER NOT NULL REFERENCES users(id),
        room_id VARCHAR(100),
        start_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        end_time TIMESTAMP,
        duration_seconds INTEGER DEFAULT 0,
        total_income INTEGER DEFAULT 0,
        total_viewers INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_live_sessions_host ON live_sessions(host_id);
      CREATE INDEX IF NOT EXISTS idx_live_sessions_start ON live_sessions(start_time);
    `);

    console.log("✅ Tabel live_sessions siap digunakan");

    await client.query(`
      CREATE TABLE IF NOT EXISTS agency (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        family_name VARCHAR(255) NOT NULL,
        region VARCHAR(100),
        phone VARCHAR(20),
        status VARCHAR(20) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT NOW(),
        approved_at TIMESTAMP
      )
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS host_applications (
        id SERIAL PRIMARY KEY,
        host_id INTEGER REFERENCES users(id),
        agency_id INTEGER REFERENCES agency(id),
        name VARCHAR(255),
        gender VARCHAR(10),
        id_number VARCHAR(50),
        status VARCHAR(20) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT NOW(),
        approved_at TIMESTAMP
      )
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS salary_requests (
        id SERIAL PRIMARY KEY,
        host_id INTEGER REFERENCES users(id),
        week_number INTEGER,
        salary_amount INTEGER DEFAULT 0,
        total_lives INTEGER DEFAULT 0,
        status VARCHAR(20) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT NOW(),
        approved_at TIMESTAMP
      )
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_agency_user ON agency(user_id);
      CREATE INDEX IF NOT EXISTS idx_agency_status ON agency(status);
      CREATE INDEX IF NOT EXISTS idx_host_applications_agency ON host_applications(agency_id);
      CREATE INDEX IF NOT EXISTS idx_host_applications_host ON host_applications(host_id);
      CREATE INDEX IF NOT EXISTS idx_salary_requests_host ON salary_requests(host_id);
      CREATE INDEX IF NOT EXISTS idx_salary_requests_status ON salary_requests(status);
    `);

    console.log("✅ Tabel agency, host_applications, dan salary_requests siap digunakan");

    await client.query(`
      CREATE TABLE IF NOT EXISTS exchange_history (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        diamond_amount INTEGER NOT NULL,
        coin_amount INTEGER NOT NULL,
        exchange_rate DECIMAL(5,2) DEFAULT 0.30,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);
    console.log("✅ Tabel exchange_history siap digunakan");

    // ✅ Tabel live_viewers
    await pool.query(`
      CREATE TABLE IF NOT EXISTS live_viewers (
        id SERIAL PRIMARY KEY,
        host_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        viewer_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        joined_at TIMESTAMP DEFAULT NOW(),
        left_at TIMESTAMP,
        UNIQUE(host_id, viewer_id)
      );

      CREATE INDEX IF NOT EXISTS idx_live_viewers_host ON live_viewers(host_id);
      CREATE INDEX IF NOT EXISTS idx_live_viewers_active ON live_viewers(host_id, left_at) WHERE left_at IS NULL;
    `);
    console.log("✅ Tabel live_viewers siap digunakan");

    // ✅ Tabel party_rooms
    await pool.query(`
      CREATE TABLE IF NOT EXISTS party_rooms (
        room_id VARCHAR(50) PRIMARY KEY,
        host_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        room_name VARCHAR(100),
        country VARCHAR(10),
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT NOW(),
        ended_at TIMESTAMP
      );

      CREATE INDEX IF NOT EXISTS idx_party_rooms_host ON party_rooms(host_id);
      CREATE INDEX IF NOT EXISTS idx_party_rooms_active ON party_rooms(is_active) WHERE is_active = true;
    `);
    console.log("✅ Tabel party_rooms siap digunakan");

    // ✅ Tabel party_room_members
    await pool.query(`
      CREATE TABLE IF NOT EXISTS party_room_members (
        id SERIAL PRIMARY KEY,
        room_id VARCHAR(50) REFERENCES party_rooms(room_id) ON DELETE CASCADE,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        joined_at TIMESTAMP DEFAULT NOW(),
        left_at TIMESTAMP,
        UNIQUE(room_id, user_id)
      );

      CREATE INDEX IF NOT EXISTS idx_party_members_room ON party_room_members(room_id);
      CREATE INDEX IF NOT EXISTS idx_party_members_active ON party_room_members(room_id, left_at) WHERE left_at IS NULL;
    `);
    console.log("✅ Tabel party_room_members siap digunakan");

    // Chat tables
    await client.query(`
      CREATE TABLE IF NOT EXISTS conversations (
        id SERIAL PRIMARY KEY,
        user1_id INTEGER REFERENCES users(id),
        user2_id INTEGER REFERENCES users(id),
        is_official BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT unique_user_pair UNIQUE (user1_id, user2_id),
        CONSTRAINT different_users CHECK (user1_id != user2_id OR is_official = true),
        CONSTRAINT ordered_users CHECK (user1_id < user2_id OR is_official = true)
      )
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_conversations_user1 ON conversations(user1_id);
      CREATE INDEX IF NOT EXISTS idx_conversations_user2 ON conversations(user2_id);
      CREATE INDEX IF NOT EXISTS idx_conversations_official ON conversations(is_official);
      CREATE INDEX IF NOT EXISTS idx_conversations_updated ON conversations(updated_at DESC);
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS messages (
        id SERIAL PRIMARY KEY,
        conversation_id INTEGER NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
        sender_id INTEGER REFERENCES users(id),
        content TEXT NOT NULL,
        is_read BOOLEAN DEFAULT false,
        is_official BOOLEAN DEFAULT false,
        message_type VARCHAR(50) DEFAULT 'text',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages(conversation_id);
      CREATE INDEX IF NOT EXISTS idx_messages_sender ON messages(sender_id);
      CREATE INDEX IF NOT EXISTS idx_messages_created ON messages(created_at DESC);
      CREATE INDEX IF NOT EXISTS idx_messages_official ON messages(is_official);
      CREATE INDEX IF NOT EXISTS idx_messages_conversation_created ON messages(conversation_id, created_at DESC);
    `);

    // Create official conversation if not exists
    const officialCheck = await client.query(
      `SELECT id FROM conversations WHERE is_official = true LIMIT 1`
    );

    if (officialCheck.rows.length === 0) {
      await client.query(
        `INSERT INTO conversations (is_official, created_at) VALUES (true, NOW())`
      );
      console.log("✅ Official conversation dibuat");
    }

    console.log("✅ Tabel conversations dan messages siap digunakan");

    // ✅ Tabel vip_topups - untuk tracking accumulated top-ups dalam 5 hari
    await client.query(`
      CREATE TABLE IF NOT EXISTS vip_topups (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        coin_amount INTEGER NOT NULL,
        topup_date TIMESTAMP DEFAULT NOW()
      )
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_vip_topups_user ON vip_topups(user_id);
      CREATE INDEX IF NOT EXISTS idx_vip_topups_date ON vip_topups(topup_date);
      CREATE INDEX IF NOT EXISTS idx_vip_topups_user_date ON vip_topups(user_id, topup_date);
    `);

    console.log("✅ Tabel vip_topups siap digunakan");

    // ✅ JP GIFT HISTORY TABLE
    await client.query(`
      CREATE TABLE IF NOT EXISTS jp_gift_history (
        id SERIAL PRIMARY KEY,
        sender_id INTEGER NOT NULL REFERENCES users(id),
        receiver_id INTEGER NOT NULL REFERENCES users(id),
        room_id VARCHAR(100),
        gift_price INTEGER NOT NULL,
        total_price INTEGER NOT NULL,
        jp_win BOOLEAN DEFAULT FALSE,
        jp_level INTEGER,
        jp_win_amount INTEGER DEFAULT 0,
        host_income INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_jp_history_sender ON jp_gift_history(sender_id);
      CREATE INDEX IF NOT EXISTS idx_jp_history_receiver ON jp_gift_history(receiver_id);
      CREATE INDEX IF NOT EXISTS idx_jp_history_room ON jp_gift_history(room_id);
      CREATE INDEX IF NOT EXISTS idx_jp_history_created ON jp_gift_history(created_at);
      CREATE INDEX IF NOT EXISTS idx_jp_history_jp_win ON jp_gift_history(jp_win);
    `);

    console.log("✅ Tabel jp_gift_history siap digunakan");

    // ✅ PAYMENT TRANSACTIONS TABLE
    await client.query(`
      CREATE TABLE IF NOT EXISTS payment_transactions (
        id SERIAL PRIMARY KEY,
        order_id VARCHAR(100) UNIQUE NOT NULL,
        user_id INTEGER NOT NULL REFERENCES users(id),
        package_id INTEGER NOT NULL,
        coins_amount INTEGER NOT NULL,
        bonus_coins INTEGER DEFAULT 0,
        price INTEGER NOT NULL,
        payment_method VARCHAR(50),
        snap_token TEXT,
        status VARCHAR(20) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_payment_user ON payment_transactions(user_id);
      CREATE INDEX IF NOT EXISTS idx_payment_order ON payment_transactions(order_id);
      CREATE INDEX IF NOT EXISTS idx_payment_status ON payment_transactions(status);
      CREATE INDEX IF NOT EXISTS idx_payment_created ON payment_transactions(created_at);
    `);

    console.log("✅ Tabel payment_transactions siap digunakan");

    // Google Play Billing transactions table
    await client.query(`
      CREATE TABLE IF NOT EXISTS google_play_transactions (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id),
        product_sku VARCHAR(100) NOT NULL,
        transaction_id VARCHAR(255) UNIQUE NOT NULL,
        coins_amount INTEGER NOT NULL,
        price_in_cents INTEGER,
        status VARCHAR(50) DEFAULT 'pending',
        receipt_data TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_gplay_user ON google_play_transactions(user_id);
      CREATE INDEX IF NOT EXISTS idx_gplay_transaction_id ON google_play_transactions(transaction_id);
      CREATE INDEX IF NOT EXISTS idx_gplay_status ON google_play_transactions(status);
      CREATE INDEX IF NOT EXISTS idx_gplay_created ON google_play_transactions(created_at);
    `);

    console.log("✅ Tabel google_play_transactions siap digunakan");

    // ADMIN USERS TABLE
    await client.query(`
      CREATE TABLE IF NOT EXISTS admin_users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'admin',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log("✅ Tabel admin_users siap digunakan");

    client.release();
  } catch (err) {
    console.error("❌ Database initialization error:", err);
    process.exit(1);
  }
}

export { pool, initDatabase };