import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import multer from "multer";
import path from "path";
import fs from "fs";
import { pool } from "../db.js";
import { sendOfficialNotification } from "./chat.js";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "chatme_secret_key";

// Function to generate 6-digit user ID based on date (DDMMYY format)
function generateUserId() {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const year = String(now.getFullYear()).slice(-2);

  // Format: DDMMYY (e.g., 260125 for January 26, 2025)
  const dateId = parseInt(`${day}${month}${year}`);
  return dateId;
}

// Function to get next available ID for the same date
async function getNextAvailableId(client, baseId) {
  let userId = baseId;
  let counter = 0;

  while (counter < 1000) { // Safety limit
    const exists = await client.query('SELECT id FROM users WHERE id = $1', [userId]);
    if (exists.rows.length === 0) {
      return userId;
    }
    // If ID exists, increment by adding to the base
    counter++;
    userId = baseId + counter;
  }

  throw new Error('Unable to generate unique user ID');
}

// Setup multer for avatar uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = "./uploads/avatars";
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "avatar-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error("Only .png, .jpg and .jpeg format allowed!"));
  },
});

// ====================================================
// ✅ REGISTER
// ====================================================
router.post("/register", async (req, res) => {
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

    // Generate user ID based on date (DDMMYY format)
    const baseId = generateUserId();
    const userId = await getNextAvailableId(client, baseId);

    // Insert user baru
    await client.query(
      "INSERT INTO users (id, phone, password, name) VALUES ($1, $2, $3, $4)",
      [userId, phone, hashed, name || `User-${phone.slice(-4)}`]
    );

    console.log("✅ Registrasi berhasil:", phone, "with ID:", userId);
    res.json({ success: true, message: "Registrasi berhasil!", userId: userId });
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
router.post("/login", async (req, res) => {
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
router.get("/auth/profile", async (req, res) => {
  const auth = req.headers.authorization;
  if (!auth)
    return res.status(401).json({ success: false, message: "Token tidak ditemukan" });

  const token = auth.split(" ")[1];
  const client = await pool.connect();
  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    const result = await client.query(
      "SELECT id, name, phone, balance, level, vip_level, avatar_url, gender, age, signature FROM users WHERE id = $1",
      [decoded.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "User tidak ditemukan" });
    }

    const user = result.rows[0];
    res.json({ 
      success: true, 
      data: {
        id: user.id,
        name: user.name,
        phone: user.phone,
        balance: user.balance || 0,
        level: user.level || 1,
        vipLevel: user.vip_level || 0,
        avatar_url: user.avatar_url || null,
        gender: user.gender || null,
        age: user.age || null,
        signature: user.signature || null
      }
    });
  } catch (err) {
    console.error("❌ Error get profile:", err);
    res.status(403).json({ success: false, message: "Token tidak valid" });
  } finally {
    client.release();
  }
});

// ====================================================
// ✅ UPDATE PROFILE (name, gender, age, signature)
// ====================================================
router.put("/auth/profile/update", async (req, res) => {
  const auth = req.headers.authorization;
  if (!auth)
    return res.status(401).json({ success: false, message: "Token tidak ditemukan" });

  const token = auth.split(" ")[1];
  const client = await pool.connect();

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const { name, gender, age, signature } = req.body;

    // Build dynamic update query
    const updates = [];
    const values = [];
    let paramCount = 1;

    if (name !== undefined) {
      updates.push(`name = $${paramCount++}`);
      values.push(name);
    }
    if (gender !== undefined) {
      updates.push(`gender = $${paramCount++}`);
      values.push(gender);
    }
    if (age !== undefined) {
      updates.push(`age = $${paramCount++}`);
      values.push(age);
    }
    if (signature !== undefined) {
      updates.push(`signature = $${paramCount++}`);
      values.push(signature);
    }

    if (updates.length === 0) {
      return res.status(400).json({ success: false, message: "Tidak ada data untuk diupdate" });
    }

    values.push(decoded.id);
    const query = `UPDATE users SET ${updates.join(", ")} WHERE id = $${paramCount} RETURNING *`;

    const result = await client.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "User tidak ditemukan" });
    }

    console.log("✅ Profile updated for user:", decoded.id);
    res.json({ 
      success: true, 
      message: "Profile berhasil diupdate",
      data: result.rows[0]
    });
  } catch (err) {
    console.error("❌ Error update profile:", err);
    res.status(500).json({ success: false, message: "Server error" });
  } finally {
    client.release();
  }
});

// ====================================================
// ✅ UPLOAD AVATAR
// ====================================================
router.post("/auth/profile/avatar", upload.single("avatar"), async (req, res) => {
  const auth = req.headers.authorization;
  if (!auth)
    return res.status(401).json({ success: false, message: "Token tidak ditemukan" });

  const token = auth.split(" ")[1];
  const client = await pool.connect();

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    if (!req.file) {
      return res.status(400).json({ success: false, message: "Tidak ada file yang diupload" });
    }

    // Generate public URL for avatar
    const avatarUrl = `/uploads/avatars/${req.file.filename}`;

    // Get old avatar to delete
    const oldUser = await client.query("SELECT avatar_url FROM users WHERE id = $1", [decoded.id]);

    // Update avatar URL in database
    const result = await client.query(
      "UPDATE users SET avatar_url = $1 WHERE id = $2 RETURNING *",
      [avatarUrl, decoded.id]
    );

    // Delete old avatar file if exists
    if (oldUser.rows[0]?.avatar_url) {
      const oldPath = `.${oldUser.rows[0].avatar_url}`;
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }

    console.log("✅ Avatar updated for user:", decoded.id);
    res.json({ 
      success: true, 
      message: "Avatar berhasil diupload",
      data: {
        avatar_url: avatarUrl
      }
    });
  } catch (err) {
    console.error("❌ Error upload avatar:", err);

    // Delete uploaded file if error occurs
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({ success: false, message: "Server error" });
  } finally {
    client.release();
  }
});

// ====================================================
// ✅ TOP-UP (with Official Message notification)
// ====================================================
router.post("/topup", async (req, res) => {
  const client = await pool.connect();
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ success: false, message: "No token" });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const { amount, method } = req.body; // method: 'app' or 'seller'

    if (!amount || amount <= 0) {
      return res.status(400).json({ 
        success: false, 
        message: "Jumlah top-up tidak valid" 
      });
    }

    await client.query("BEGIN");

    // Update balance
    const result = await client.query(
      "UPDATE users SET balance = balance + $1 WHERE id = $2 RETURNING balance",
      [amount, decoded.id]
    );

    await client.query("COMMIT");

    const newBalance = result.rows[0].balance;

    // Send official notification
    const methodText = method === "seller" ? "dari seller" : "dari aplikasi";
    const message = `🎉 Top-up berhasil! Kamu telah menambahkan ${amount.toLocaleString()} koin ${methodText}. Saldo kamu sekarang: ${newBalance.toLocaleString()} koin.`;

    await sendOfficialNotification(decoded.id, message, "topup");

    console.log(`✅ Top-up berhasil untuk user ${decoded.id}: ${amount} koin`);

    res.json({ 
      success: true, 
      message: "Top-up berhasil!",
      newBalance: newBalance
    });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("❌ Error top-up:", err);
    res.status(500).json({ success: false, message: "Server error" });
  } finally {
    client.release();
  }
});

// ====================================================
// ✅ SEND SYSTEM NOTIFICATION
// ====================================================
router.post("/notification", async (req, res) => {
  try {
    const { userId, message, type } = req.body;

    if (!userId || !message) {
      return res.status(400).json({
        success: false,
        message: "userId dan message wajib diisi"
      });
    }

    const success = await sendOfficialNotification(
      userId, 
      message, 
      type || "notification"
    );

    if (success) {
      res.json({ 
        success: true, 
        message: "Notifikasi berhasil dikirim" 
      });
    } else {
      res.status(500).json({ 
        success: false, 
        message: "Gagal mengirim notifikasi" 
      });
    }
  } catch (err) {
    console.error("❌ Error send notification:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;