import express from "express";
import { pool } from "../db.js";

const router = express.Router();

/**
 * ⭐ START PK BATTLE
 */
router.post("/start", async (req, res) => {
  const { hostId, opponentId, roomId } = req.body;

  if (!hostId || !opponentId) {
    return res.status(400).json({ success: false, message: "hostId and opponentId required" });
  }

  const client = await pool.connect();
  try {
    const result = await client.query(
      `INSERT INTO pk_battles (host_id, opponent_id, room_id, start_time, status)
       VALUES ($1, $2, $3, NOW(), 'active')
       RETURNING *`,
      [hostId, opponentId, roomId || null]
    );

    res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (err) {
    console.error("Start PK error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  } finally {
    client.release();
  }
});

/**
 * ⭐ END PK BATTLE
 */
router.post("/end", async (req, res) => {
  const { battleId, hostScore, opponentScore } = req.body;

  if (!battleId) {
    return res.status(400).json({ success: false, message: "battleId required" });
  }

  const winnerId = hostScore > opponentScore ? "host" : "opponent";

  const client = await pool.connect();
  try {
    const result = await client.query(
      `UPDATE pk_battles
       SET end_time = NOW(),
           duration_seconds = EXTRACT(EPOCH FROM (NOW() - start_time)),
           host_score = $1,
           opponent_score = $2,
           winner = $3,
           status = 'completed'
       WHERE id = $4
       RETURNING *`,
      [hostScore, opponentScore, winnerId, battleId]
    );

    res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (err) {
    console.error("End PK error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  } finally {
    client.release();
  }
});

/**
 * ⭐ GET ACTIVE PK
 */
router.get("/active/:roomId", async (req, res) => {
  const { roomId } = req.params;

  const client = await pool.connect();
  try {
    const result = await client.query(
      `SELECT * FROM pk_battles
       WHERE room_id = $1 AND status = 'active'
       ORDER BY start_time DESC
       LIMIT 1`,
      [roomId]
    );

    res.json({
      success: true,
      data: result.rows[0] || null,
    });
  } catch (err) {
    console.error("Get active PK error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  } finally {
    client.release();
  }
});

/**
 * ⭐ GET AVAILABLE HOSTS FOR PK
 */
router.get("/available-hosts/:hostId", async (req, res) => {
  const { hostId } = req.params;

  const client = await pool.connect();
  try {
    // Get live hosts except current host
    const result = await client.query(
      `SELECT u.id, u.name, u.avatar_url, u.level, u.vip_level
       FROM users u
       INNER JOIN live_sessions ls ON u.id = ls.host_id
       WHERE ls.status = 'active' 
       AND u.id != $1
       ORDER BY u.level DESC
       LIMIT 50`,
      [hostId]
    );

    res.json({
      success: true,
      data: result.rows,
    });
  } catch (err) {
    console.error("Get available hosts error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  } finally {
    client.release();
  }
});

export default router;