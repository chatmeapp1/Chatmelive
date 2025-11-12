
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import pkg from 'pg';
const { Pool } = pkg;

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

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

// Test koneksi dan buat tabel jika belum ada
async function initDatabase() {
  try {
    const client = await pool.connect();
    console.log("✅ PostgreSQL connected successfully");

    // Buat tabel users jika belum ada
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        phone VARCHAR(20) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(100) DEFAULT 'Pengguna Baru',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    console.log("✅ Tabel users siap digunakan");
    client.release();
  } catch (err) {
    console.error("❌ Database initialization error:", err);
    process.exit(1);
  }
}

initDatabase();

// ====================================================
// ✅ JWT Secret
// ====================================================
const JWT_SECRET = process.env.JWT_SECRET || "chatme_secret_key";

// ====================================================
// ✅ Root Route
// ====================================================
app.get("/", (req, res) => {
  res.send("🚀 ChatMe API aktif di Replit + NeonDB (PostgreSQL)!");
});

// ====================================================
// ✅ REGISTER
// ====================================================
app.post("/api/register", async (req, res) => {
  const client = await pool.connect();
  try {
    let { phone, password, name } = req.body;

    if (!phone || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Nomor dan sandi wajib diisi!" });
    }

    // Normalisasi nomor HP
    phone = phone.trim();
    if (phone.startsWith("+62")) phone = "0" + phone.slice(3);
    if (phone.startsWith("62") && !phone.startsWith("0"))
      phone = "0" + phone.slice(2);

    // Cek apakah nomor sudah terdaftar
    const checkUser = await client.query(
      "SELECT id FROM users WHERE phone = $1",
      [phone]
    );

    if (checkUser.rows.length > 0) {
      return res
        .status(400)
        .json({ success: false, message: "Nomor sudah terdaftar!" });
    }

    // Enkripsi password
    const hashed = await bcrypt.hash(password, 10);
    
    // Insert user baru
    await client.query(
      "INSERT INTO users (phone, password, name) VALUES ($1, $2, $3)",
      [phone, hashed, name || `User-${phone.slice(-4)}`]
    );

    console.log("✅ Registrasi berhasil:", phone);
    res.json({ success: true, message: "Registrasi berhasil!" });
  } catch (err) {
    console.error("❌ Error register:", err);
    res.status(500).json({ success: false, message: "Server error" });
  } finally {
    client.release();
  }
});

// ====================================================
// ✅ LOGIN
// ====================================================
app.post("/api/login", async (req, res) => {
  console.log("📩 [LOGIN REQUEST]", req.body);

  let { phone, password } = req.body || {};
  if (!phone || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Nomor HP dan password wajib diisi" });
  }

  // Normalisasi nomor HP
  phone = phone.trim().replace(/\s+/g, "");
  if (phone.startsWith("+62")) phone = "0" + phone.slice(3);
  if (phone.startsWith("62") && !phone.startsWith("0"))
    phone = "0" + phone.slice(2);

  const client = await pool.connect();
  try {
    const result = await client.query(
      "SELECT * FROM users WHERE phone = $1",
      [phone]
    );

    if (result.rows.length === 0) {
      console.log("❌ Login gagal: user tidak ditemukan.");
      return res
        .status(401)
        .json({ success: false, message: "Nomor HP atau sandi salah!" });
    }

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      console.log("❌ Login gagal: password salah.");
      return res
        .status(401)
        .json({ success: false, message: "Nomor HP atau sandi salah!" });
    }

    const token = jwt.sign({ id: user.id, phone: user.phone }, JWT_SECRET, {
      expiresIn: "7d",
    });

    console.log("✅ Login berhasil:", user.name);
    return res.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        phone: user.phone,
      },
    });
  } catch (err) {
    console.error("❌ Error saat login:", err);
    res.status(500).json({ success: false, message: "Server error" });
  } finally {
    client.release();
  }
});

// ====================================================
// ✅ PROFILE
// ====================================================
app.get("/api/profile", (req, res) => {
  const auth = req.headers.authorization;
  if (!auth)
    return res.status(401).json({ message: "Token tidak ditemukan" });

  const token = auth.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    res.json({ success: true, user: decoded });
  } catch (err) {
    res.status(403).json({ success: false, message: "Token tidak valid" });
  }
});

// ====================================================
// ✅ 404 Handler
// ====================================================
app.all("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: `Endpoint ${req.originalUrl} tidak ditemukan.`,
  });
});

// ====================================================
// ✅ Jalankan server (auto detect port Replit)
// ====================================================
const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ ChatMe API running on port ${PORT}`);
  console.log(`🌍 Public URL (Replit): ${process.env.REPLIT_URL || "⚠️ belum tersedia"}`);
});
