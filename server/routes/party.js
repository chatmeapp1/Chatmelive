
import express from "express";
import { pool } from "../db.js";

const router = express.Router();

// ====================================================
// ✅ GET HOT PARTY ROOMS (berdasarkan income + viewers)
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
        pr.room_id,
        pr.room_name,
        pr.country,
        COALESCE(viewer_count.count, 0) as viewers,
        COALESCE(income.total, 0) as total_income
      FROM users u
      INNER JOIN party_rooms pr ON pr.host_id = u.id AND pr.is_active = true
      LEFT JOIN (
        SELECT room_id, COUNT(DISTINCT user_id) as count
        FROM party_room_members
        WHERE left_at IS NULL
        GROUP BY room_id
      ) viewer_count ON viewer_count.room_id = pr.room_id
      LEFT JOIN (
        SELECT receiver_id, SUM(coin_value * quantity) as total
        FROM gifts
        WHERE created_at >= NOW() - INTERVAL '24 hours'
        GROUP BY receiver_id
      ) income ON income.receiver_id = u.id
      ORDER BY total_income DESC, viewers DESC
      LIMIT 50`
    );

    const rooms = result.rows.map(row => ({
      id: row.id.toString(),
      name: row.name,
      roomName: row.room_name,
      country: row.country || "🇮🇩",
      viewers: parseInt(row.viewers),
      image: row.avatar_url ? `${process.env.API_URL || 'http://localhost:8000'}${row.avatar_url}` : `https://picsum.photos/200/300?random=${row.id}`,
      level: row.level || 1,
      vipLevel: row.vip_level || 0,
      roomId: row.room_id,
      totalIncome: parseFloat(row.total_income)
    }));

    res.json({ 
      success: true, 
      data: rooms 
    });
  } catch (err) {
    console.error("❌ Error get hot party rooms:", err);
    res.status(500).json({ success: false, message: "Server error" });
  } finally {
    client.release();
  }
});

// ====================================================
// ✅ GET ASIA PARTY ROOMS
// ====================================================
router.get("/asia", async (req, res) => {
  const client = await pool.connect();
  
  try {
    const asiaCountries = ['🇨🇳', '🇯🇵', '🇰🇷', '🇹🇭', '🇻🇳', '🇵🇭', '🇲🇾', '🇸🇬', '🇮🇳'];
    
    const result = await client.query(
      `SELECT 
        u.id,
        u.name,
        u.avatar_url,
        u.level,
        u.vip_level,
        pr.room_id,
        pr.room_name,
        pr.country,
        COALESCE(viewer_count.count, 0) as viewers
      FROM users u
      INNER JOIN party_rooms pr ON pr.host_id = u.id AND pr.is_active = true
      LEFT JOIN (
        SELECT room_id, COUNT(DISTINCT user_id) as count
        FROM party_room_members
        WHERE left_at IS NULL
        GROUP BY room_id
      ) viewer_count ON viewer_count.room_id = pr.room_id
      WHERE pr.country = ANY($1)
      ORDER BY viewers DESC
      LIMIT 50`,
      [asiaCountries]
    );

    const rooms = result.rows.map(row => ({
      id: row.id.toString(),
      name: row.name,
      roomName: row.room_name,
      country: row.country || "🇨🇳",
      viewers: parseInt(row.viewers),
      image: row.avatar_url ? `${process.env.API_URL || 'http://localhost:8000'}${row.avatar_url}` : `https://picsum.photos/200/300?random=${row.id}`,
      level: row.level || 1,
      vipLevel: row.vip_level || 0,
      roomId: row.room_id
    }));

    res.json({ 
      success: true, 
      data: rooms 
    });
  } catch (err) {
    console.error("❌ Error get asia party rooms:", err);
    res.status(500).json({ success: false, message: "Server error" });
  } finally {
    client.release();
  }
});

// ====================================================
// ✅ GET MIDDLE EAST PARTY ROOMS
// ====================================================
router.get("/middle-east", async (req, res) => {
  const client = await pool.connect();
  
  try {
    const middleEastCountries = ['🇸🇦', '🇦🇪', '🇪🇬', '🇹🇷', '🇮🇶', '🇮🇷', '🇯🇴', '🇰🇼', '🇱🇧', '🇴🇲', '🇶🇦', '🇾🇪'];
    
    const result = await client.query(
      `SELECT 
        u.id,
        u.name,
        u.avatar_url,
        u.level,
        u.vip_level,
        pr.room_id,
        pr.room_name,
        pr.country,
        COALESCE(viewer_count.count, 0) as viewers
      FROM users u
      INNER JOIN party_rooms pr ON pr.host_id = u.id AND pr.is_active = true
      LEFT JOIN (
        SELECT room_id, COUNT(DISTINCT user_id) as count
        FROM party_room_members
        WHERE left_at IS NULL
        GROUP BY room_id
      ) viewer_count ON viewer_count.room_id = pr.room_id
      WHERE pr.country = ANY($1)
      ORDER BY viewers DESC
      LIMIT 50`,
      [middleEastCountries]
    );

    const rooms = result.rows.map(row => ({
      id: row.id.toString(),
      name: row.name,
      roomName: row.room_name,
      country: row.country || "🇸🇦",
      viewers: parseInt(row.viewers),
      image: row.avatar_url ? `${process.env.API_URL || 'http://localhost:8000'}${row.avatar_url}` : `https://picsum.photos/200/300?random=${row.id}`,
      level: row.level || 1,
      vipLevel: row.vip_level || 0,
      roomId: row.room_id
    }));

    res.json({ 
      success: true, 
      data: rooms 
    });
  } catch (err) {
    console.error("❌ Error get middle east party rooms:", err);
    res.status(500).json({ success: false, message: "Server error" });
  } finally {
    client.release();
  }
});

export default router;
