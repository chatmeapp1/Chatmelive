import express from "express";
import { pool } from "../db.js";
import jwt from "jsonwebtoken";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "chatme-secret-key-2024";

// ✅ In-memory storage untuk hourly rankings (menggunakan global cache yang sama dengan jpGift.js)
const CACHE_DURATION = 60 * 1000; // 1 menit cache

// Initialize global cache if not exists
function getHourlyRankCache() {
  if (!global.hourlyRankCache) {
    global.hourlyRankCache = new Map();
  }
  return global.hourlyRankCache;
}

// Reset ranking setiap jam baru
function checkAndResetHourlyRanking() {
  const hourlyRankCache = getHourlyRankCache();
  const currentHour = new Date().toISOString().slice(0, 13); // YYYY-MM-DDTHH

  if (hourlyRankCache.get("currentHour") !== currentHour) {
    console.log(`⏰ Reset hourly ranking: ${hourlyRankCache.get("currentHour")} → ${currentHour}`);
    hourlyRankCache.set("currentHour", currentHour);
    hourlyRankCache.set("data", {}); // Clear previous data
  }
}

// Middleware untuk verify token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ success: false, message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
};

/**
 * POST /api/income/live-update
 * Update live income in real-time (called when gift received)
 */
router.post("/live-update", verifyToken, async (req, res) => {
  const { hostId, giftValue, giftType } = req.body;

  if (!hostId || !giftValue) {
    return res.status(400).json({
      success: false,
      message: "hostId and giftValue required"
    });
  }

  try {
    checkAndResetHourlyRanking();
    const hourlyRankCache = getHourlyRankCache();

    // Update ranking per jam di memory
    const currentData = hourlyRankCache.get("data") || {};
    if (!currentData[hostId]) {
      currentData[hostId] = 0;
    }
    currentData[hostId] += giftValue;
    hourlyRankCache.set("data", currentData);

    // Simpan ke database untuk history
    const client = await pool.connect();
    try {
      await client.query(
        `INSERT INTO host_income (host_id, income, type, created_at) 
         VALUES ($1, $2, $3, NOW())`,
        [hostId, giftValue, giftType || 'normal']
      );
    } finally {
      client.release();
    }

    res.json({
      success: true,
      totalIncome: currentData[hostId],
      hour: hourlyRankCache.get("currentHour")
    });
  } catch (error) {
    console.error("Error updating live income:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

/**
 * GET /api/income/live-current/:hostId
 * Get current live session income (hourly)
 */
router.get("/live-current/:hostId", async (req, res) => {
  const { hostId } = req.params;

  if (!hostId || hostId === "undefined") {
    return res.status(400).json({
      success: false,
      message: "Invalid hostId"
    });
  }

  try {
    checkAndResetHourlyRanking();
    const hourlyRankCache = getHourlyRankCache();

    const currentData = hourlyRankCache.get("data") || {};
    const income = currentData[hostId] || 0;

    res.json({
      success: true,
      income: income,
      hour: hourlyRankCache.get("currentHour")
    });
  } catch (error) {
    console.error("Error getting live income:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

/**
 * GET /api/income/live-ranking
 * Get live ranking per hour (from memory)
 */
router.get("/live-ranking", async (req, res) => {
  try {
    checkAndResetHourlyRanking();
    const hourlyRankCache = getHourlyRankCache();

    const currentData = hourlyRankCache.get("data") || {};
    // Convert object to array dan sort
    const rankingArray = Object.entries(currentData)
      .map(([hostId, income]) => ({
        hostId: parseInt(hostId),
        income: income
      }))
      .sort((a, b) => b.income - a.income)
      .slice(0, 100); // Top 100

    // Get host info from database
    const formattedRankings = [];
    const client = await pool.connect();

    try {
      for (let i = 0; i < rankingArray.length; i++) {
        const { hostId, income } = rankingArray[i];

        const result = await client.query(
          'SELECT id, name, avatar_url, level FROM users WHERE id = $1',
          [hostId]
        );

        if (result.rows.length > 0) {
          const host = result.rows[0];
          formattedRankings.push({
            rank: i + 1,
            hostId: host.id,
            name: host.name,
            avatar: host.avatar_url || `https://i.pravatar.cc/150?img=${host.id}`,
            level: host.level || 1,
            income: income
          });
        }
      }
    } finally {
      client.release();
    }

    res.json({
      success: true,
      data: formattedRankings,
      hour: hourlyRankCache.get("currentHour")
    });
  } catch (error) {
    console.error("Error getting live ranking:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

/**
 * GET /api/income/balance
 * Get user's diamond balance
 */
router.get("/balance", verifyToken, async (req, res) => {
  const client = await pool.connect();
  try {
    const result = await client.query(
      "SELECT SUM(income) as total_diamonds FROM host_income WHERE host_id = $1",
      [req.userId]
    );

    const totalDiamonds = parseInt(result.rows[0].total_diamonds) || 0;

    res.json({
      success: true,
      diamonds: totalDiamonds,
    });
  } catch (error) {
    console.error("Error fetching balance:", error);
    res.status(500).json({ success: false, message: "Server error" });
  } finally {
    client.release();
  }
});

/**
 * GET /api/income/history
 * Get income history with date range filter
 */
router.get("/history", verifyToken, async (req, res) => {
  const { startDate, endDate } = req.query;
  const client = await pool.connect();

  try {
    let query = `
      SELECT 
        DATE(created_at) as date,
        SUM(CASE WHEN type = 'normal' THEN income ELSE 0 END) as poin,
        SUM(CASE WHEN type = 'luxury' THEN income ELSE 0 END) as luxury,
        SUM(CASE WHEN type = 'lucky' THEN income ELSE 0 END) as lucky,
        SUM(CASE WHEN type = 's-lucky' THEN income ELSE 0 END) as s_lucky
      FROM host_income
      WHERE host_id = $1
    `;

    const params = [req.userId];

    if (startDate && endDate) {
      query += " AND DATE(created_at) BETWEEN $2 AND $3";
      params.push(startDate, endDate);
    }

    query += " GROUP BY DATE(created_at) ORDER BY date DESC LIMIT 50";

    const result = await client.query(query, params);

    res.json({
      success: true,
      data: result.rows.map(row => ({
        date: row.date,
        poin: parseInt(row.poin) || 0,
        luxury: parseInt(row.luxury) || 0,
        lucky: parseInt(row.lucky) || 0,
        sLucky: parseInt(row.s_lucky) || 0,
      })),
    });
  } catch (error) {
    console.error("Error fetching history:", error);
    res.status(500).json({ success: false, message: "Server error" });
  } finally {
    client.release();
  }
});

/**
 * POST /api/income/exchange
 * Exchange diamonds to coins (30% conversion rate)
 */
router.post("/exchange", verifyToken, async (req, res) => {
  const { amount } = req.body;
  const client = await pool.connect();

  try {
    // Validate amount
    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid amount",
      });
    }

    await client.query("BEGIN");

    // Check user's diamond balance
    const diamondResult = await client.query(
      "SELECT SUM(income) as total_diamonds FROM host_income WHERE host_id = $1",
      [req.userId]
    );

    const totalDiamonds = parseInt(diamondResult.rows[0].total_diamonds) || 0;

    if (totalDiamonds < amount) {
      await client.query("ROLLBACK");
      return res.status(400).json({
        success: false,
        message: "Insufficient diamond balance",
      });
    }

    // Calculate coins (30% of diamonds)
    const coinsToAdd = Math.floor(amount * 0.3);

    // Deduct diamonds by inserting negative income record
    await client.query(
      `INSERT INTO host_income (host_id, income, type, created_at) 
       VALUES ($1, $2, 'exchange', NOW())`,
      [req.userId, -amount]
    );

    // Add coins to user balance
    await client.query(
      "UPDATE users SET balance = balance + $1 WHERE id = $2",
      [coinsToAdd, req.userId]
    );

    // Record exchange transaction
    await client.query(
      `INSERT INTO exchange_history (user_id, diamonds, coins, created_at)
       VALUES ($1, $2, $3, NOW())`,
      [req.userId, amount, coinsToAdd]
    );

    await client.query("COMMIT");

    res.json({
      success: true,
      message: "Exchange successful",
      exchanged_diamonds: amount,
      received_coins: coinsToAdd,
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error exchanging:", error);
    res.status(500).json({ success: false, message: "Server error" });
  } finally {
    client.release();
  }
});

/**
 * GET /api/income/exchange-history
 * Get exchange history
 */
router.get("/exchange-history", verifyToken, async (req, res) => {
  const client = await pool.connect();
  try {
    const result = await client.query(
      `SELECT diamonds, coins, created_at 
       FROM exchange_history 
       WHERE user_id = $1 
       ORDER BY created_at DESC 
       LIMIT 50`,
      [req.userId]
    );

    res.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error("Error fetching exchange history:", error);
    res.status(500).json({ success: false, message: "Server error" });
  } finally {
    client.release();
  }
});

export default router;