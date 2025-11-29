import express from "express";
import { pool } from "../db.js";

const router = express.Router();

/**
 * ⭐ START SESSION
 */
router.post("/start", async (req, res) => {
  const { hostId, roomId } = req.body;

  if (!hostId) {
    return res.status(400).json({ success: false, message: "hostId wajib" });
  }

  const client = await pool.connect();
  try {
    const result = await client.query(
      `INSERT INTO live_sessions (host_id, room_id, start_time)
       VALUES ($1, $2, NOW())
       RETURNING id, start_time`,
      [hostId, roomId || null]
    );

    res.json({
      success: true,
      sessionId: result.rows[0].id,
      start: result.rows[0].start_time,
    });
  } catch (err) {
    console.error("Start session error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  } finally {
    client.release();
  }
});

/**
 * ⭐ END SESSION
 */
router.post("/end", async (req, res) => {
  const { sessionId, totalIncome, totalViewers } = req.body;

  if (!sessionId) {
    return res.status(400).json({ success: false, message: "sessionId wajib" });
  }

  const client = await pool.connect();
  try {
    const result = await client.query(
      `UPDATE live_sessions
       SET end_time = NOW(),
           duration_seconds = EXTRACT(EPOCH FROM (NOW() - start_time)),
           total_income = $1,
           total_viewers = $2
       WHERE id = $3
       RETURNING *`,
      [totalIncome || 0, totalViewers || 0, sessionId]
    );

    res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (err) {
    console.error("End session error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  } finally {
    client.release();
  }
});

/**
 * ⭐ GET LIVE SESSION STATS
 */
router.get("/stats/:sessionId", async (req, res) => {
  const { sessionId } = req.params;

  if (!sessionId) {
    return res.status(400).json({ success: false, message: "sessionId wajib" });
  }

  const client = await pool.connect();
  try {
    // Get session data with host info
    const sessionResult = await client.query(
      `SELECT 
        ls.id, 
        ls.host_id,
        ls.total_viewers,
        ls.total_income,
        ls.duration_seconds,
        u.name as host_name,
        u.avatar as host_avatar,
        u.id as user_id
       FROM live_sessions ls
       LEFT JOIN users u ON ls.host_id = u.id
       WHERE ls.id = $1`,
      [sessionId]
    );

    if (sessionResult.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Session not found" });
    }

    const session = sessionResult.rows[0];

    // Get new followers during this session (stub - can be enhanced)
    const newFansResult = await client.query(
      `SELECT COUNT(*) as count
       FROM follows
       WHERE follower_id = $1 
         AND created_at >= (SELECT start_time FROM live_sessions WHERE id = $2)
         AND created_at <= COALESCE((SELECT end_time FROM live_sessions WHERE id = $2), NOW())`,
      [session.host_id, sessionId]
    );

    // Get likes/reactions during session (stub - can be enhanced)
    const likesResult = await client.query(
      `SELECT COUNT(*) as count
       FROM gifts
       WHERE receiver_id = $1
         AND created_at >= (SELECT start_time FROM live_sessions WHERE id = $2)
         AND created_at <= COALESCE((SELECT end_time FROM live_sessions WHERE id = $2), NOW())
         AND gift_name LIKE '%like%'`,
      [session.host_id, sessionId]
    );

    // Get total live hours
    const totalLiveResult = await client.query(
      `SELECT COALESCE(SUM(duration_seconds), 0) as total_seconds
       FROM live_sessions
       WHERE host_id = $1`,
      [session.host_id]
    );

    const stats = {
      sessionId: session.id,
      hostName: session.host_name || "Host",
      hostAvatar: session.host_avatar || "https://picsum.photos/200",
      totalViewers: parseInt(session.total_viewers) || 0,
      diamonds: parseInt(session.total_income) || 0,
      newFans: parseInt(newFansResult.rows[0]?.count || 0),
      thumbsUp: parseInt(likesResult.rows[0]?.count || 0),
      durationSeconds: parseInt(session.duration_seconds) || 0,
      totalLiveHours: Math.floor(parseInt(totalLiveResult.rows[0].total_seconds || 0) / 3600),
    };

    res.json({
      success: true,
      data: stats,
    });
  } catch (err) {
    console.error("Get stats error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  } finally {
    client.release();
  }
});

/**
 * ⭐ DURASI LIVE PER HARI
 */
router.get("/duration/today/:hostId", async (req, res) => {
  const { hostId } = req.params;

  const client = await pool.connect();
  try {
    const result = await client.query(
      `SELECT COALESCE(SUM(duration_seconds), 0) AS total_seconds
       FROM live_sessions
       WHERE host_id = $1
         AND start_time::date = CURRENT_DATE`,
      [hostId]
    );

    res.json({
      success: true,
      totalSeconds: parseInt(result.rows[0].total_seconds),
    });
  } catch (err) {
    console.error("Duration query error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  } finally {
    client.release();
  }
});

export default router;
