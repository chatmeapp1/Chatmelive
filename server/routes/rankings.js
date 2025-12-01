import express from "express";
import { pool } from "../db.js";

const router = express.Router();

/**
 * GET /api/rankings/top-level-users
 * Get top 5 users by level/experience score
 */
router.get("/top-level-users", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        u.id,
        u.name,
        u.avatar_url,
        u.level,
        COALESCE(SUM(CASE WHEN g.gift_type = 'received' THEN 1 ELSE 0 END), 0) as total_gifts,
        COALESCE(SUM(CASE WHEN g.gift_type = 'received' THEN g.gift_value ELSE 0 END), 0) as total_score
      FROM users u
      LEFT JOIN gifts g ON u.id = g.receiver_id
      GROUP BY u.id, u.name, u.avatar_url, u.level
      ORDER BY u.level DESC, total_score DESC
      LIMIT 5
    `);

    res.json({
      success: true,
      data: result.rows.map(u => ({
        id: u.id,
        name: u.name,
        avatar_url: u.avatar_url,
        score: u.level,
        total_gifts: u.total_gifts,
        total_score: u.total_score
      }))
    });
  } catch (error) {
    console.error("❌ Error fetching top level users:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/rankings/top-host-users
 * Get top 5 hosts by gifts received/host income
 */
router.get("/top-host-users", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        u.id,
        u.name,
        u.avatar_url,
        u.level,
        COALESCE(COUNT(DISTINCT g.id), 0) as total_gifts,
        COALESCE(SUM(CASE WHEN g.gift_type = 'received' THEN g.gift_value ELSE 0 END), 0) as total_income
      FROM users u
      LEFT JOIN gifts g ON u.id = g.receiver_id AND g.gift_type = 'received'
      LEFT JOIN host_income hi ON u.id = hi.user_id
      WHERE u.level > 0 OR hi.user_id IS NOT NULL
      GROUP BY u.id, u.name, u.avatar_url, u.level
      ORDER BY total_income DESC, total_gifts DESC
      LIMIT 5
    `);

    res.json({
      success: true,
      data: result.rows.map(u => ({
        id: u.id,
        name: u.name,
        avatar_url: u.avatar_url,
        score: u.level,
        total_gifts: u.total_gifts,
        total_income: u.total_income
      }))
    });
  } catch (error) {
    console.error("❌ Error fetching top host users:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
