import express from "express";
import { pool } from "../db.js";

const router = express.Router();

router.get("/fans/:hostId", async (req, res) => {
  const { hostId } = req.params;
  const { period = "daily" } = req.query;
  
  // Validasi hostId
  const parsedHostId = parseInt(hostId);
  if (!hostId || hostId === "undefined" || isNaN(parsedHostId)) {
    console.log(`❌ Invalid hostId received: ${hostId}`);
    return res.status(400).json({
      success: false,
      message: "Invalid hostId parameter. Must be a valid user ID number.",
      data: [],
    });
  }
  
  console.log(`📊 Fetching fans ranking for host ID: ${parsedHostId}, period: ${period}`);
  
  const client = await pool.connect();
  
  try {
    let dateFilter = "";
    const now = new Date();
    
    if (period === "hourly") {
      const startOfHour = new Date(now.setMinutes(0, 0, 0));
      dateFilter = `AND g.created_at >= '${startOfHour.toISOString()}'`;
    } else if (period === "daily") {
      const startOfDay = new Date(now.setHours(0, 0, 0, 0));
      dateFilter = `AND g.created_at >= '${startOfDay.toISOString()}'`;
    } else if (period === "weekly") {
      const startOfWeek = new Date(now.setDate(now.getDate() - 7));
      dateFilter = `AND g.created_at >= '${startOfWeek.toISOString()}'`;
    }

    const query = `
      SELECT 
        u.id,
        u.name,
        u.avatar_url,
        u.level,
        COALESCE(SUM(g.coin_value * g.quantity), 0) as total_coins
      FROM users u
      LEFT JOIN gifts g ON u.id = g.sender_id AND g.receiver_id = $1 ${dateFilter}
      GROUP BY u.id, u.name, u.avatar_url, u.level
      HAVING COALESCE(SUM(g.coin_value * g.quantity), 0) > 0
      ORDER BY total_coins DESC
      LIMIT 100
    `;

    const result = await client.query(query, [parsedHostId]);

    const rankings = result.rows.map((row, index) => ({
      rank: index + 1,
      id: row.id,
      name: row.name,
      avatar: row.avatar_url || `https://i.pravatar.cc/150?img=${row.id}`,
      level: row.level || 1,
      coins: parseInt(row.total_coins),
    }));

    console.log(`✅ Found ${rankings.length} fans for host ${parsedHostId}`);

    res.json({
      success: true,
      data: rankings,
      period,
      hostId: parsedHostId,
    });
  } catch (err) {
    console.error("❌ Error fetching ranking:", err);
    res.status(500).json({
      success: false,
      message: "Error fetching ranking data",
      data: [],
    });
  } finally {
    client.release();
  }
});

router.get("/hosts", async (req, res) => {
  const { period = "daily" } = req.query;
  
  const client = await pool.connect();
  
  try {
    let dateFilter = "";
    const now = new Date();
    
    if (period === "hourly") {
      const startOfHour = new Date(now.setMinutes(0, 0, 0));
      dateFilter = `AND g.created_at >= '${startOfHour.toISOString()}'`;
    } else if (period === "daily") {
      const startOfDay = new Date(now.setHours(0, 0, 0, 0));
      dateFilter = `AND g.created_at >= '${startOfDay.toISOString()}'`;
    } else if (period === "weekly") {
      const startOfWeek = new Date(now.setDate(now.getDate() - 7));
      dateFilter = `AND g.created_at >= '${startOfWeek.toISOString()}'`;
    }

    const query = `
      SELECT 
        u.id,
        u.name,
        u.avatar_url,
        u.level,
        COALESCE(SUM(g.coin_value * g.quantity), 0) as total_coins
      FROM users u
      LEFT JOIN gifts g ON u.id = g.receiver_id ${dateFilter}
      GROUP BY u.id, u.name, u.avatar_url, u.level
      HAVING COALESCE(SUM(g.coin_value * g.quantity), 0) > 0
      ORDER BY total_coins DESC
      LIMIT 100
    `;

    const result = await client.query(query);

    const rankings = result.rows.map((row, index) => ({
      rank: index + 1,
      id: row.id,
      name: row.name,
      avatar: row.avatar_url || `https://i.pravatar.cc/150?img=${row.id}`,
      level: row.level || 1,
      coins: parseInt(row.total_coins),
    }));

    res.json({
      success: true,
      data: rankings,
      period,
    });
  } catch (err) {
    console.error("❌ Error fetching hosts ranking:", err);
    res.status(500).json({
      success: false,
      message: "Error fetching ranking data",
    });
  } finally {
    client.release();
  }
});

export default router;
