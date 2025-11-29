import express from "express";
import { pool } from "../db.js";

const router = express.Router();

const VIP_TIERS = {
  1: 110000,        // 110k accumulated
  2: 5000000,       // 5m accumulated
  3: 10000000,      // 10m accumulated
  4: 40000000,      // 40m accumulated
  5: 100000000,     // 100m accumulated
};

const VIP_DURATION_DAYS = 5;

/**
 * Calculate VIP level from accumulated coins
 */
function calculateVipLevel(accumulatedCoins) {
  if (!accumulatedCoins || accumulatedCoins < VIP_TIERS[1]) return 0;
  if (accumulatedCoins >= VIP_TIERS[5]) return 5;
  if (accumulatedCoins >= VIP_TIERS[4]) return 4;
  if (accumulatedCoins >= VIP_TIERS[3]) return 3;
  if (accumulatedCoins >= VIP_TIERS[2]) return 2;
  if (accumulatedCoins >= VIP_TIERS[1]) return 1;
  return 0;
}

/**
 * Get accumulated top-ups in last N days
 */
async function getAccumulatedTopups(userId, days = VIP_DURATION_DAYS) {
  try {
    const result = await pool.query(
      `SELECT COALESCE(SUM(coin_amount), 0) as total_coins
       FROM vip_topups
       WHERE user_id = $1 
       AND topup_date >= NOW() - INTERVAL '${days} days'`,
      [userId]
    );
    return result.rows[0]?.total_coins || 0;
  } catch (err) {
    console.error("Error fetching accumulated topups:", err);
    return 0;
  }
}

/**
 * Get user VIP level (from accumulated top-ups in 5 days)
 */
router.get("/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    // Get accumulated top-ups in last 5 days
    const accumulatedCoins = await getAccumulatedTopups(userId, VIP_DURATION_DAYS);
    const vipLevel = calculateVipLevel(accumulatedCoins);

    // Update vip_level in DB
    await pool.query(
      "UPDATE users SET vip_level = $1 WHERE id = $2",
      [vipLevel, userId]
    );

    res.json({
      success: true,
      userId,
      accumulatedCoins,
      vipLevel,
      vipDurationDays: VIP_DURATION_DAYS,
    });
  } catch (err) {
    console.error("Get VIP error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

/**
 * Record a top-up transaction
 */
router.post("/topup/record", async (req, res) => {
  const { userId, coinAmount } = req.body;

  if (!userId || !coinAmount) {
    return res
      .status(400)
      .json({ success: false, message: "userId dan coinAmount wajib" });
  }

  try {
    // Record the top-up
    await pool.query(
      `INSERT INTO vip_topups (user_id, coin_amount, topup_date)
       VALUES ($1, $2, NOW())`,
      [userId, coinAmount]
    );

    // Recalculate VIP level
    const accumulatedCoins = await getAccumulatedTopups(userId, VIP_DURATION_DAYS);
    const vipLevel = calculateVipLevel(accumulatedCoins);

    // Update user VIP level
    await pool.query(
      "UPDATE users SET vip_level = $1, balance = balance + $2 WHERE id = $3",
      [vipLevel, coinAmount, userId]
    );

    res.json({
      success: true,
      userId,
      coinAmount,
      accumulatedCoins,
      vipLevel,
    });
  } catch (err) {
    console.error("Record topup error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

/**
 * Get leaderboard with VIP info
 */
router.get("/list/all", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT u.id, u.name, u.avatar_url, u.balance, u.level 
       FROM users u
       ORDER BY u.balance DESC 
       LIMIT 100`
    );

    const usersWithVip = await Promise.all(
      result.rows.map(async (user) => {
        const accCoins = await getAccumulatedTopups(user.id);
        return {
          ...user,
          accumulatedCoins: accCoins,
          vipLevel: calculateVipLevel(accCoins),
        };
      })
    );

    res.json({ success: true, data: usersWithVip });
  } catch (err) {
    console.error("List users error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;
