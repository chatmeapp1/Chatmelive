import express from "express";
import jwt from "jsonwebtoken";
import { pool } from "../db.js";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// Admin verification middleware
const verifyAdmin = async (req, res, next) => {
  try {
    const auth = req.headers.authorization;
    if (!auth) {
      console.log("❌ No authorization header");
      return res.status(401).json({ success: false, message: "No token" });
    }
    const token = auth.split(" ")[1];
    console.log("🔑 Token received, verifying...");
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log("✅ Token verified, decoded email:", decoded.email);
    
    // Check if user is admin in admin_users table
    const client = await pool.connect();
    try {
      const result = await client.query(
        "SELECT id, email, role FROM admin_users WHERE email = $1 AND role = 'admin'",
        [decoded.email]
      );
      console.log("🔍 Admin check result:", result.rows.length, "admin(s) found");
      
      if (result.rows.length === 0) {
        console.log("❌ Admin not found for email:", decoded.email);
        return res.status(403).json({ success: false, message: "Not authorized as admin" });
      }
      
      req.adminId = result.rows[0].id;
      req.adminEmail = result.rows[0].email;
      console.log("✅ Admin verified:", req.adminEmail);
      next();
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("❌ Admin auth error:", error.message);
    return res.status(403).json({ success: false, message: "Invalid token" });
  }
};

// GET: Pending agencies
router.get("/agencies/pending", verifyAdmin, async (req, res) => {
  const client = await pool.connect();
  try {
    const result = await client.query(
      `SELECT a.*, u.name as user_name, u.phone 
       FROM agency a 
       JOIN users u ON a.user_id = u.id 
       WHERE a.status = 'pending' 
       ORDER BY a.created_at DESC`
    );
    res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error("Error fetching pending agencies:", error);
    res.status(500).json({ success: false, message: "Server error" });
  } finally {
    client.release();
  }
});

// GET: All agencies
router.get("/agencies", verifyAdmin, async (req, res) => {
  const client = await pool.connect();
  try {
    const result = await client.query(
      `SELECT a.*, u.name as user_name, u.phone, 
              COUNT(DISTINCT h.id) as total_hosts
       FROM agency a 
       JOIN users u ON a.user_id = u.id 
       LEFT JOIN host_applications h ON h.agency_id = a.id AND h.status = 'approved'
       GROUP BY a.id, u.id
       ORDER BY a.created_at DESC`
    );
    res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error("Error fetching agencies:", error);
    res.status(500).json({ success: false, message: "Server error" });
  } finally {
    client.release();
  }
});

// POST: Approve agency
router.post("/agency/:agencyId/approve", verifyAdmin, async (req, res) => {
  const { agencyId } = req.params;
  const client = await pool.connect();
  try {
    await client.query(
      `UPDATE agency SET status = 'approved', approved_at = NOW() WHERE id = $1`,
      [agencyId]
    );
    res.json({ success: true, message: "Agency approved" });
  } catch (error) {
    console.error("Error approving agency:", error);
    res.status(500).json({ success: false, message: "Server error" });
  } finally {
    client.release();
  }
});

// POST: Reject agency
router.post("/agency/:agencyId/reject", verifyAdmin, async (req, res) => {
  const { agencyId } = req.params;
  const client = await pool.connect();
  try {
    await client.query(
      `UPDATE agency SET status = 'rejected', approved_at = NOW() WHERE id = $1`,
      [agencyId]
    );
    res.json({ success: true, message: "Agency rejected" });
  } catch (error) {
    console.error("Error rejecting agency:", error);
    res.status(500).json({ success: false, message: "Server error" });
  } finally {
    client.release();
  }
});

// GET: All users
router.get("/users", verifyAdmin, async (req, res) => {
  const client = await pool.connect();
  try {
    const result = await client.query(
      `SELECT id, name as username, phone as email, balance as coin, level, vip_level, created_at FROM users ORDER BY created_at DESC`
    );
    res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ success: false, message: "Server error" });
  } finally {
    client.release();
  }
});

// GET: All hosts
router.get("/hosts", verifyAdmin, async (req, res) => {
  const client = await pool.connect();
  try {
    const result = await client.query(
      `SELECT u.id, u.name as username, u.name, h.agency_id, a.name as agency_name, 
              h.status, h.approved_at, COUNT(DISTINCT ls.id) as live_count
       FROM users u
       LEFT JOIN host_applications h ON h.host_id = u.id
       LEFT JOIN agency a ON h.agency_id = a.id
       LEFT JOIN live_sessions ls ON ls.host_id = u.id
       WHERE h.id IS NOT NULL
       GROUP BY u.id, h.id, a.id
       ORDER BY u.created_at DESC`
    );
    res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error("Error fetching hosts:", error);
    res.status(500).json({ success: false, message: "Server error" });
  } finally {
    client.release();
  }
});

// POST: Approve host
router.post("/host/:hostId/approve", verifyAdmin, async (req, res) => {
  const { hostId } = req.params;
  const client = await pool.connect();
  try {
    await client.query(
      `UPDATE host_applications SET status = 'approved', approved_at = NOW() WHERE host_id = $1`,
      [hostId]
    );
    res.json({ success: true, message: "Host approved" });
  } catch (error) {
    console.error("Error approving host:", error);
    res.status(500).json({ success: false, message: "Server error" });
  } finally {
    client.release();
  }
});

// GET: Daily live duration stats for all hosts
router.get("/hosts/stats/daily", verifyAdmin, async (req, res) => {
  const client = await pool.connect();
  try {
    const result = await client.query(
      `SELECT 
        u.id, 
        u.username, 
        u.name,
        COUNT(ls.id) as total_lives,
        COALESCE(SUM(ls.duration_seconds), 0) as total_duration_seconds,
        ROUND(COALESCE(SUM(ls.duration_seconds), 0)::numeric / 3600, 2) as total_hours,
        MAX(ls.start_time) as last_live
       FROM users u
       LEFT JOIN live_sessions ls ON ls.host_id = u.id 
        AND DATE(ls.start_time) = CURRENT_DATE
       WHERE EXISTS (SELECT 1 FROM host_applications ha WHERE ha.host_id = u.id)
       GROUP BY u.id
       ORDER BY total_duration_seconds DESC`
    );
    res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error("Error fetching daily stats:", error);
    res.status(500).json({ success: false, message: "Server error" });
  } finally {
    client.release();
  }
});

// GET: Weekly live duration stats for all hosts
router.get("/hosts/stats/weekly", verifyAdmin, async (req, res) => {
  const client = await pool.connect();
  try {
    const result = await client.query(
      `SELECT 
        u.id, 
        u.username, 
        u.name,
        COUNT(ls.id) as total_lives,
        COALESCE(SUM(ls.duration_seconds), 0) as total_duration_seconds,
        ROUND(COALESCE(SUM(ls.duration_seconds), 0)::numeric / 3600, 2) as total_hours,
        MAX(ls.start_time) as last_live
       FROM users u
       LEFT JOIN live_sessions ls ON ls.host_id = u.id 
        AND ls.start_time >= NOW() - INTERVAL '7 days'
       WHERE EXISTS (SELECT 1 FROM host_applications ha WHERE ha.host_id = u.id)
       GROUP BY u.id
       ORDER BY total_duration_seconds DESC`
    );
    res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error("Error fetching weekly stats:", error);
    res.status(500).json({ success: false, message: "Server error" });
  } finally {
    client.release();
  }
});

// GET: Monthly live duration stats for all hosts
router.get("/hosts/stats/monthly", verifyAdmin, async (req, res) => {
  const client = await pool.connect();
  try {
    const result = await client.query(
      `SELECT 
        u.id, 
        u.username, 
        u.name,
        COUNT(ls.id) as total_lives,
        COALESCE(SUM(ls.duration_seconds), 0) as total_duration_seconds,
        ROUND(COALESCE(SUM(ls.duration_seconds), 0)::numeric / 3600, 2) as total_hours,
        MAX(ls.start_time) as last_live
       FROM users u
       LEFT JOIN live_sessions ls ON ls.host_id = u.id 
        AND DATE_TRUNC('month', ls.start_time) = DATE_TRUNC('month', CURRENT_DATE)
       WHERE EXISTS (SELECT 1 FROM host_applications ha WHERE ha.host_id = u.id)
       GROUP BY u.id
       ORDER BY total_duration_seconds DESC`
    );
    res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error("Error fetching monthly stats:", error);
    res.status(500).json({ success: false, message: "Server error" });
  } finally {
    client.release();
  }
});

export default router;
