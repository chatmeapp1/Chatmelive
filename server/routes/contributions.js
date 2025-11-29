
import express from "express";
import { pool } from "../db.js";

const router = express.Router();

router.get("/:hostId", async (req, res) => {
  const { hostId } = req.params;
  const { period = "daily" } = req.query;
  
  const parsedHostId = parseInt(hostId);
  if (!hostId || hostId === "undefined" || isNaN(parsedHostId)) {
    console.log(`❌ Invalid hostId received: ${hostId}`);
    return res.status(400).json({
      success: false,
      message: "Invalid hostId parameter",
      data: [],
      totalCoins: 0,
    });
  }
  
  console.log(`💰 Fetching contributions for host ID: ${parsedHostId}, period: ${period}`);
  
  const client = await pool.connect();
  
  try {
    let dateFilter = "";
    const now = new Date();
    
    if (period === "daily") {
      const startOfDay = new Date(now.setHours(0, 0, 0, 0));
      dateFilter = `AND g.created_at >= '${startOfDay.toISOString()}'`;
    } else if (period === "weekly") {
      const startOfWeek = new Date(now.setDate(now.getDate() - 7));
      dateFilter = `AND g.created_at >= '${startOfWeek.toISOString()}'`;
    } else if (period === "monthly") {
      const startOfMonth = new Date(now.setDate(now.getDate() - 30));
      dateFilter = `AND g.created_at >= '${startOfMonth.toISOString()}'`;
    }

    const query = `
      SELECT 
        g.id,
        g.gift_name,
        g.coin_value,
        g.quantity,
        g.created_at,
        u.name as sender_name
      FROM gifts g
      LEFT JOIN users u ON g.sender_id = u.id
      WHERE g.receiver_id = $1 ${dateFilter}
      ORDER BY g.created_at DESC
      LIMIT 100
    `;

    const result = await client.query(query, [parsedHostId]);

    const contributions = result.rows.map((row) => ({
      id: row.id,
      giftName: row.gift_name,
      coins: row.coin_value * row.quantity,
      senderName: row.sender_name || "Anonymous",
      time: formatTime(row.created_at),
      timestamp: row.created_at,
    }));

    const totalCoins = contributions.reduce((sum, item) => sum + item.coins, 0);

    console.log(`✅ Found ${contributions.length} contributions, total: ${totalCoins} coins`);

    res.json({
      success: true,
      data: contributions,
      totalCoins,
      period,
      hostId: parsedHostId,
    });
  } catch (err) {
    console.error("❌ Error fetching contributions:", err);
    res.status(500).json({
      success: false,
      message: "Error fetching contribution data",
      data: [],
      totalCoins: 0,
    });
  } finally {
    client.release();
  }
});

function formatTime(date) {
  const now = new Date();
  const diff = Math.floor((now - new Date(date)) / 1000);
  
  if (diff < 60) return `${diff} detik yang lalu`;
  if (diff < 3600) return `${Math.floor(diff / 60)} menit yang lalu`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} jam yang lalu`;
  return `${Math.floor(diff / 86400)} hari yang lalu`;
}

export default router;
