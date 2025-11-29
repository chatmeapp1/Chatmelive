
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

// ====================================================
// ✅ FOLLOW USER
// ====================================================
router.post("/follow", verifyToken, async (req, res) => {
  const { targetUserId } = req.body;
  const client = await pool.connect();
  
  try {
    // Check if already following
    const checkFollow = await client.query(
      "SELECT * FROM follows WHERE follower_id = $1 AND following_id = $2",
      [req.userId, targetUserId]
    );

    if (checkFollow.rows.length > 0) {
      return res.status(400).json({ success: false, message: "Sudah mengikuti user ini" });
    }

    // Insert follow
    await client.query(
      "INSERT INTO follows (follower_id, following_id, created_at) VALUES ($1, $2, NOW())",
      [req.userId, targetUserId]
    );

    console.log(`✅ User ${req.userId} followed user ${targetUserId}`);
    res.json({ success: true, message: "Berhasil mengikuti" });
  } catch (err) {
    console.error("❌ Error follow user:", err);
    res.status(500).json({ success: false, message: "Server error" });
  } finally {
    client.release();
  }
});

// ====================================================
// ✅ UNFOLLOW USER
// ====================================================
router.post("/unfollow", verifyToken, async (req, res) => {
  const { targetUserId } = req.body;
  const client = await pool.connect();
  
  try {
    const result = await client.query(
      "DELETE FROM follows WHERE follower_id = $1 AND following_id = $2 RETURNING *",
      [req.userId, targetUserId]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ success: false, message: "Tidak sedang mengikuti user ini" });
    }

    console.log(`✅ User ${req.userId} unfollowed user ${targetUserId}`);
    res.json({ success: true, message: "Berhasil berhenti mengikuti" });
  } catch (err) {
    console.error("❌ Error unfollow user:", err);
    res.status(500).json({ success: false, message: "Server error" });
  } finally {
    client.release();
  }
});

// ====================================================
// ✅ GET FOLLOWING LIST (users that I follow)
// ====================================================
router.get("/following", verifyToken, async (req, res) => {
  const client = await pool.connect();
  
  try {
    const result = await client.query(
      `SELECT 
        u.id, 
        u.name, 
        u.avatar_url, 
        u.level,
        u.vip_level,
        COALESCE(fc.fans_count, 0) as fans_count,
        CASE 
          WHEN ls.id IS NOT NULL AND ls.end_time IS NULL 
          THEN true 
          ELSE false 
        END as is_live
      FROM follows f
      INNER JOIN users u ON f.following_id = u.id
      LEFT JOIN (
        SELECT following_id, COUNT(*) as fans_count 
        FROM follows 
        GROUP BY following_id
      ) fc ON fc.following_id = u.id
      LEFT JOIN live_sessions ls ON ls.host_id = u.id AND ls.end_time IS NULL
      WHERE f.follower_id = $1
      ORDER BY is_live DESC, f.created_at DESC`,
      [req.userId]
    );

    res.json({ 
      success: true, 
      data: result.rows 
    });
  } catch (err) {
    console.error("❌ Error get following list:", err);
    res.status(500).json({ success: false, message: "Server error" });
  } finally {
    client.release();
  }
});

// ====================================================
// ✅ GET FOLLOWERS LIST (users who follow me)
// ====================================================
router.get("/followers", verifyToken, async (req, res) => {
  const client = await pool.connect();
  
  try {
    const result = await client.query(
      `SELECT 
        u.id, 
        u.name, 
        u.avatar_url, 
        u.level,
        u.vip_level,
        COALESCE(fc.fans_count, 0) as fans_count
      FROM follows f
      INNER JOIN users u ON f.follower_id = u.id
      LEFT JOIN (
        SELECT following_id, COUNT(*) as fans_count 
        FROM follows 
        GROUP BY following_id
      ) fc ON fc.following_id = u.id
      WHERE f.following_id = $1
      ORDER BY f.created_at DESC`,
      [req.userId]
    );

    res.json({ 
      success: true, 
      data: result.rows 
    });
  } catch (err) {
    console.error("❌ Error get followers list:", err);
    res.status(500).json({ success: false, message: "Server error" });
  } finally {
    client.release();
  }
});

// ====================================================
// ✅ GET FOLLOW COUNTS
// ====================================================
router.get("/counts", verifyToken, async (req, res) => {
  const client = await pool.connect();
  
  try {
    const followingCount = await client.query(
      "SELECT COUNT(*) as count FROM follows WHERE follower_id = $1",
      [req.userId]
    );

    const followersCount = await client.query(
      "SELECT COUNT(*) as count FROM follows WHERE following_id = $1",
      [req.userId]
    );

    res.json({ 
      success: true, 
      data: {
        following: parseInt(followingCount.rows[0].count),
        followers: parseInt(followersCount.rows[0].count)
      }
    });
  } catch (err) {
    console.error("❌ Error get follow counts:", err);
    res.status(500).json({ success: false, message: "Server error" });
  } finally {
    client.release();
  }
});

export default router;
