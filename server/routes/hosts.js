import express from "express";
import jwt from "jsonwebtoken";
import { pool } from "../db.js";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "chatme_secret_key";

// Middleware to verify token
const verifyToken = (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth) {
    return res.status(401).json({ success: false, message: "Token tidak ditemukan" });
  }

  const token = auth.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    return res.status(403).json({ success: false, message: "Token tidak valid" });
  }
};

/**
 * ⭐ GET LIVE HOSTS (for PK matching)
 */
router.get("/live", async (req, res) => {
  const client = await pool.connect();
  try {
    const result = await client.query(
      `SELECT DISTINCT u.id, u.name, u.level, u.avatar_url, u.vip_level
       FROM users u
       INNER JOIN live_sessions ls ON u.id = ls.host_id
       WHERE ls.status = 'live'
       ORDER BY u.level DESC
       LIMIT 20`
    );

    res.json({
      success: true,
      data: result.rows,
    });
  } catch (err) {
    console.error("Get live hosts error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  } finally {
    client.release();
  }
});


// ====================================================
// ✅ GET FOLLOWED HOSTS (hosts yang sedang live dan diikuti user)
// ====================================================
router.get("/followed", verifyToken, async (req, res) => {
  const client = await pool.connect();

  try {
    const result = await client.query(
      `SELECT 
        u.id,
        u.name,
        u.avatar_url,
        u.level,
        u.vip_level,
        ls.room_id,
        ls.start_time,
        COALESCE(viewer_count.count, 0) as viewers
      FROM follows f
      INNER JOIN users u ON f.following_id = u.id
      INNER JOIN live_sessions ls ON ls.host_id = u.id AND ls.end_time IS NULL
      LEFT JOIN (
        SELECT host_id, COUNT(DISTINCT viewer_id) as count
        FROM live_viewers
        WHERE left_at IS NULL
        GROUP BY host_id
      ) viewer_count ON viewer_count.host_id = u.id
      WHERE f.follower_id = $1
      ORDER BY ls.start_time DESC`,
      [req.userId]
    );

    const hosts = result.rows.map(row => ({
      id: row.id.toString(),
      name: row.name,
      viewers: parseInt(row.viewers),
      image: row.avatar_url ? `${process.env.API_URL || 'http://localhost:8000'}${row.avatar_url}` : `https://i.pravatar.cc/150?img=${row.id}`,
      title: `Live sekarang!`,
      level: row.level || 1,
      vipLevel: row.vip_level || 0,
      roomId: row.room_id,
      isLive: true
    }));

    res.json({ 
      success: true, 
      data: hosts 
    });
  } catch (err) {
    console.error("❌ Error get followed hosts:", err);
    res.status(500).json({ success: false, message: "Server error" });
  } finally {
    client.release();
  }
});

// ====================================================
// ✅ GET HOT HOSTS (host dengan income tinggi + viewer banyak + yang baru mulai live < 10 menit)
// ====================================================
router.get("/hot", async (req, res) => {
  const client = await pool.connect();

  try {
    const result = await client.query(
      `SELECT 
        u.id,
        u.name,
        u.avatar_url,
        u.level,
        u.vip_level,
        ls.room_id,
        ls.start_time,
        COALESCE(viewer_count.count, 0) as viewers,
        COALESCE(income.total, 0) as total_income,
        EXTRACT(EPOCH FROM (NOW() - ls.start_time))/60 as minutes_live
      FROM users u
      INNER JOIN live_sessions ls ON ls.host_id = u.id AND ls.end_time IS NULL
      LEFT JOIN (
        SELECT host_id, COUNT(DISTINCT viewer_id) as count
        FROM live_viewers
        WHERE left_at IS NULL
        GROUP BY host_id
      ) viewer_count ON viewer_count.host_id = u.id
      LEFT JOIN (
        SELECT receiver_id, SUM(coin_value * quantity) as total
        FROM gifts
        WHERE created_at >= NOW() - INTERVAL '24 hours'
        GROUP BY receiver_id
      ) income ON income.receiver_id = u.id
      ORDER BY 
        CASE 
          WHEN EXTRACT(EPOCH FROM (NOW() - ls.start_time))/60 < 10 THEN 1
          ELSE 2
        END,
        total_income DESC,
        viewers DESC
      LIMIT 50`
    );

    const hosts = result.rows.map(row => ({
      id: row.id.toString(),
      name: row.name,
      viewers: parseInt(row.viewers),
      image: row.avatar_url ? (row.avatar_url.startsWith('http') ? row.avatar_url : `${process.env.API_URL || 'http://localhost:8000'}${row.avatar_url}`) : `https://i.pravatar.cc/150?img=${row.id}`,
      title: row.minutes_live < 10 ? '🔥 Baru mulai live!' : `${Math.floor(row.minutes_live)} menit`,
      level: row.level || 1,
      vipLevel: row.vip_level || 0,
      roomId: row.room_id,
      totalIncome: parseFloat(row.total_income),
      isLive: true
    }));

    res.json({ 
      success: true, 
      data: hosts 
    });
  } catch (err) {
    console.error("❌ Error get hot hosts:", err);
    res.status(500).json({ success: false, message: "Server error" });
  } finally {
    client.release();
  }
});

// ====================================================
// ✅ GET NEW HOSTS (host baru mendaftar dalam 7 hari terakhir dan sedang live)
// ====================================================
router.get("/new", async (req, res) => {
  const client = await pool.connect();

  try {
    const result = await client.query(
      `SELECT 
        u.id,
        u.name,
        u.avatar_url,
        u.level,
        u.vip_level,
        u.created_at,
        ls.room_id,
        ls.start_time,
        COALESCE(viewer_count.count, 0) as viewers
      FROM users u
      INNER JOIN live_sessions ls ON ls.host_id = u.id AND ls.end_time IS NULL
      LEFT JOIN (
        SELECT host_id, COUNT(DISTINCT viewer_id) as count
        FROM live_viewers
        WHERE left_at IS NULL
        GROUP BY host_id
      ) viewer_count ON viewer_count.host_id = u.id
      WHERE u.created_at >= NOW() - INTERVAL '7 days'
      ORDER BY u.created_at DESC
      LIMIT 50`
    );

    const hosts = result.rows.map(row => ({
      id: row.id.toString(),
      name: row.name,
      viewers: parseInt(row.viewers),
      image: row.avatar_url ? `${process.env.API_URL || 'http://localhost:8000'}${row.avatar_url}` : `https://i.pravatar.cc/150?img=${row.id}`,
      title: '✨ Host baru!',
      level: row.level || 1,
      vipLevel: row.vip_level || 0,
      roomId: row.room_id,
      isLive: true
    }));

    res.json({ 
      success: true, 
      data: hosts 
    });
  } catch (err) {
    console.error("❌ Error get new hosts:", err);
    res.status(500).json({ success: false, message: "Server error" });
  } finally {
    client.release();
  }
});

// ====================================================
// ✅ SEARCH HOSTS/USERS by username or ID
// ====================================================
router.get("/search", async (req, res) => {
  const { q } = req.query;

  if (!q || q.trim().length === 0) {
    return res.json({ success: true, data: [] });
  }

  const client = await pool.connect();

  try {
    const searchTerm = q.trim();
    const isNumeric = /^\d+$/.test(searchTerm);

    let query;
    let params;

    if (isNumeric) {
      // Search by ID
      query = `
        SELECT 
          u.id,
          u.name,
          u.avatar_url,
          u.level,
          u.vip_level,
          ls.room_id,
          CASE 
            WHEN ls.id IS NOT NULL AND ls.end_time IS NULL THEN true 
            ELSE false 
          END as is_live,
          COALESCE(viewer_count.count, 0) as viewers
        FROM users u
        LEFT JOIN live_sessions ls ON ls.host_id = u.id AND ls.end_time IS NULL
        LEFT JOIN (
          SELECT host_id, COUNT(DISTINCT viewer_id) as count
          FROM live_viewers
          WHERE left_at IS NULL
          GROUP BY host_id
        ) viewer_count ON viewer_count.host_id = u.id
        WHERE u.id = $1
        LIMIT 10
      `;
      params = [parseInt(searchTerm)];
    } else {
      // Search by name (case-insensitive)
      query = `
        SELECT 
          u.id,
          u.name,
          u.avatar_url,
          u.level,
          u.vip_level,
          ls.room_id,
          CASE 
            WHEN ls.id IS NOT NULL AND ls.end_time IS NULL THEN true 
            ELSE false 
          END as is_live,
          COALESCE(viewer_count.count, 0) as viewers
        FROM users u
        LEFT JOIN live_sessions ls ON ls.host_id = u.id AND ls.end_time IS NULL
        LEFT JOIN (
          SELECT host_id, COUNT(DISTINCT viewer_id) as count
          FROM live_viewers
          WHERE left_at IS NULL
          GROUP BY host_id
        ) viewer_count ON viewer_count.host_id = u.id
        WHERE LOWER(u.name) LIKE LOWER($1)
        ORDER BY is_live DESC, u.level DESC
        LIMIT 10
      `;
      params = [`%${searchTerm}%`];
    }

    const result = await client.query(query, params);

    const users = result.rows.map(row => ({
      id: row.id.toString(),
      name: row.name,
      viewers: parseInt(row.viewers),
      image: row.avatar_url ? `${process.env.API_URL || 'http://localhost:8000'}${row.avatar_url}` : `https://i.pravatar.cc/150?img=${row.id}`,
      title: row.is_live ? 'Sedang live' : 'Offline',
      level: row.level || 1,
      vipLevel: row.vip_level || 0,
      roomId: row.room_id,
      isLive: row.is_live
    }));

    res.json({ 
      success: true, 
      data: users 
    });
  } catch (err) {
    console.error("❌ Error search hosts:", err);
    res.status(500).json({ success: false, message: "Server error" });
  } finally {
    client.release();
  }
});

export default router;