import express from "express";
import { pool } from "../db.js";

const router = express.Router();

/**
 * GET /api/penggemar/daily
 * Top daily contributors/fans
 */
router.get("/daily", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        u.id,
        u.name,
        u.avatar_url,
        u.level,
        COUNT(DISTINCT g.id) as gifts_count,
        SUM(g.coin_value * g.quantity) as total_contribution
      FROM users u
      LEFT JOIN gifts g ON u.id = g.sender_id 
        AND g.created_at >= CURRENT_DATE
      GROUP BY u.id, u.name, u.avatar_url, u.level
      HAVING COUNT(DISTINCT g.id) > 0
      ORDER BY total_contribution DESC, gifts_count DESC
      LIMIT 10
    `);

    res.json({
      success: true,
      data: result.rows.map((u, idx) => ({
        rank: idx + 1,
        id: u.id,
        name: u.name,
        avatar_url: u.avatar_url,
        level: u.level,
        contribution: parseInt(u.total_contribution) || 0,
        gifts: parseInt(u.gifts_count) || 0
      }))
    });
  } catch (error) {
    console.error("❌ Error fetching daily penggemar:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/penggemar/weekly
 * Top weekly contributors/fans
 */
router.get("/weekly", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        u.id,
        u.name,
        u.avatar_url,
        u.level,
        COUNT(DISTINCT g.id) as gifts_count,
        SUM(g.coin_value * g.quantity) as total_contribution
      FROM users u
      LEFT JOIN gifts g ON u.id = g.sender_id 
        AND g.created_at >= CURRENT_DATE - INTERVAL '7 days'
      GROUP BY u.id, u.name, u.avatar_url, u.level
      HAVING COUNT(DISTINCT g.id) > 0
      ORDER BY total_contribution DESC, gifts_count DESC
      LIMIT 10
    `);

    res.json({
      success: true,
      data: result.rows.map((u, idx) => ({
        rank: idx + 1,
        id: u.id,
        name: u.name,
        avatar_url: u.avatar_url,
        level: u.level,
        contribution: parseInt(u.total_contribution) || 0,
        gifts: parseInt(u.gifts_count) || 0
      }))
    });
  } catch (error) {
    console.error("❌ Error fetching weekly penggemar:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/penggemar/total
 * All-time top contributors/fans
 */
router.get("/total", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        u.id,
        u.name,
        u.avatar_url,
        u.level,
        COUNT(DISTINCT g.id) as gifts_count,
        SUM(g.coin_value * g.quantity) as total_contribution
      FROM users u
      LEFT JOIN gifts g ON u.id = g.sender_id
      GROUP BY u.id, u.name, u.avatar_url, u.level
      HAVING COUNT(DISTINCT g.id) > 0
      ORDER BY total_contribution DESC, gifts_count DESC
      LIMIT 10
    `);

    res.json({
      success: true,
      data: result.rows.map((u, idx) => ({
        rank: idx + 1,
        id: u.id,
        name: u.name,
        avatar_url: u.avatar_url,
        level: u.level,
        contribution: parseInt(u.total_contribution) || 0,
        gifts: parseInt(u.gifts_count) || 0
      }))
    });
  } catch (error) {
    console.error("❌ Error fetching total penggemar:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/penggemar/my-rank/:userId
 * Get user's rank and contribution for all tabs
 */
router.get("/my-rank/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const daily = await pool.query(`
      SELECT 
        SUM(g.coin_value * g.quantity) as total_contribution,
        COUNT(DISTINCT g.id) as gifts_count
      FROM gifts g
      WHERE g.sender_id = $1 AND g.created_at >= CURRENT_DATE
    `, [userId]);

    const weekly = await pool.query(`
      SELECT 
        SUM(g.coin_value * g.quantity) as total_contribution,
        COUNT(DISTINCT g.id) as gifts_count
      FROM gifts g
      WHERE g.sender_id = $1 AND g.created_at >= CURRENT_DATE - INTERVAL '7 days'
    `, [userId]);

    const total = await pool.query(`
      SELECT 
        SUM(g.coin_value * g.quantity) as total_contribution,
        COUNT(DISTINCT g.id) as gifts_count
      FROM gifts g
      WHERE g.sender_id = $1
    `, [userId]);

    // Get daily rank
    const dailyRank = await pool.query(`
      SELECT COUNT(*) as rank FROM (
        SELECT u.id, SUM(g.coin_value * g.quantity) as total
        FROM users u
        LEFT JOIN gifts g ON u.id = g.sender_id 
          AND g.created_at >= CURRENT_DATE
        GROUP BY u.id
        HAVING SUM(g.coin_value * g.quantity) > (
          SELECT SUM(g.coin_value * g.quantity)
          FROM gifts g
          WHERE g.sender_id = $1 AND g.created_at >= CURRENT_DATE
        )
      ) t
    `, [userId]);

    res.json({
      success: true,
      data: {
        daily: {
          contribution: parseInt(daily.rows[0]?.total_contribution) || 0,
          gifts: parseInt(daily.rows[0]?.gifts_count) || 0,
          rank: parseInt(dailyRank.rows[0]?.rank) + 1 || null
        },
        weekly: {
          contribution: parseInt(weekly.rows[0]?.total_contribution) || 0,
          gifts: parseInt(weekly.rows[0]?.gifts_count) || 0
        },
        total: {
          contribution: parseInt(total.rows[0]?.total_contribution) || 0,
          gifts: parseInt(total.rows[0]?.gifts_count) || 0
        }
      }
    });
  } catch (error) {
    console.error("❌ Error fetching user penggemar rank:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
