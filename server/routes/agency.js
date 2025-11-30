
import express from "express";
import jwt from "jsonwebtoken";
import { pool } from "../db.js";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "chatme_secret_key";

// ✅ Function to generate random 6+ digit agency ID
const generateAgencyId = async () => {
  let isUnique = false;
  let agencyId;
  
  while (!isUnique) {
    // Generate random 6+ digit ID (100000 to 999999)
    agencyId = Math.floor(Math.random() * 9000000) + 100000;
    
    // Check if ID already exists
    const client = await pool.connect();
    try {
      const result = await client.query("SELECT id FROM agency WHERE id = $1", [agencyId]);
      isUnique = result.rows.length === 0;
    } finally {
      client.release();
    }
  }
  
  return agencyId;
};

// Middleware untuk verify agency access
const verifyAgency = async (req, res, next) => {
  try {
    const auth = req.headers.authorization;
    if (!auth) {
      return res.status(401).json({ success: false, message: "No token provided" });
    }

    const token = auth.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    const client = await pool.connect();
    try {
      const result = await client.query(
        "SELECT * FROM agency WHERE user_id = $1 AND status = 'approved'",
        [decoded.id]
      );

      if (result.rows.length === 0) {
        return res.status(403).json({ success: false, message: "Not authorized as agency" });
      }

      req.agency = result.rows[0];
      req.userId = decoded.id;
      next();
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Auth error:", error);
    res.status(403).json({ success: false, message: "Invalid token" });
  }
};

// Get agency profile
router.get("/profile", verifyAgency, async (req, res) => {
  res.json({
    success: true,
    data: req.agency,
  });
});

// Get agency dashboard stats
router.get("/:agencyId/stats", verifyAgency, async (req, res) => {
  const { agencyId } = req.params;
  const client = await pool.connect();

  try {
    // Total hosts
    const hostsResult = await client.query(
      "SELECT COUNT(*) as total FROM host_applications WHERE agency_id = $1 AND status = 'approved'",
      [agencyId]
    );

    // Today income
    const todayIncomeResult = await client.query(
      `SELECT SUM(hi.income) as total
       FROM host_income hi
       JOIN host_applications ha ON ha.host_id = hi.host_id
       WHERE ha.agency_id = $1 
       AND DATE(hi.created_at) = CURRENT_DATE`,
      [agencyId]
    );

    res.json({
      success: true,
      data: {
        totalHosts: parseInt(hostsResult.rows[0].total) || 0,
        activeLives: 0,
        totalIncome: 0,
        todayIncome: parseInt(todayIncomeResult.rows[0].total) || 0,
      },
    });
  } catch (error) {
    console.error("Error fetching agency stats:", error);
    res.status(500).json({ success: false, message: "Server error" });
  } finally {
    client.release();
  }
});

// Get hosts list
router.get("/:agencyId/hosts", verifyAgency, async (req, res) => {
  const { agencyId } = req.params;
  const client = await pool.connect();

  try {
    const result = await client.query(
      `SELECT u.id, u.name, u.avatar_url, u.phone,
              COUNT(DISTINCT ls.id) as total_lives,
              COALESCE(SUM(hi.income), 0) as total_income,
              true as is_active
       FROM users u
       JOIN host_applications ha ON ha.host_id = u.id
       LEFT JOIN live_sessions ls ON ls.host_id = u.id
       LEFT JOIN host_income hi ON hi.host_id = u.id
       WHERE ha.agency_id = $1 AND ha.status = 'approved'
       GROUP BY u.id, u.name, u.avatar_url, u.phone
       ORDER BY total_income DESC`,
      [agencyId]
    );

    res.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error("Error fetching hosts:", error);
    res.status(500).json({ success: false, message: "Server error" });
  } finally {
    client.release();
  }
});

// Get host income by period
router.get("/:agencyId/income/:period", verifyAgency, async (req, res) => {
  const { agencyId, period } = req.params;
  const client = await pool.connect();

  try {
    let dateFilter = "";
    if (period === "daily") {
      dateFilter = "AND DATE(hi.created_at) = CURRENT_DATE";
    } else if (period === "weekly") {
      dateFilter = "AND hi.created_at >= NOW() - INTERVAL '7 days'";
    } else if (period === "monthly") {
      dateFilter = "AND DATE_TRUNC('month', hi.created_at) = DATE_TRUNC('month', CURRENT_DATE)";
    }

    const result = await client.query(
      `SELECT u.id as host_id, u.name as host_name,
              COUNT(DISTINCT ls.id) as live_count,
              COALESCE(SUM(hi.income), 0) as total_income,
              COALESCE(AVG(hi.income), 0) as avg_income
       FROM users u
       JOIN host_applications ha ON ha.host_id = u.id
       LEFT JOIN live_sessions ls ON ls.host_id = u.id
       LEFT JOIN host_income hi ON hi.host_id = u.id ${dateFilter}
       WHERE ha.agency_id = $1 AND ha.status = 'approved'
       GROUP BY u.id, u.name
       ORDER BY total_income DESC`,
      [agencyId]
    );

    res.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error("Error fetching income data:", error);
    res.status(500).json({ success: false, message: "Server error" });
  } finally {
    client.release();
  }
});

// Get live statistics
router.get("/:agencyId/live-stats/:period", verifyAgency, async (req, res) => {
  const { agencyId, period } = req.params;
  const client = await pool.connect();

  try {
    let dateFilter = "";
    if (period === "daily") {
      dateFilter = "AND DATE(ls.started_at) = CURRENT_DATE";
    } else if (period === "weekly") {
      dateFilter = "AND ls.started_at >= NOW() - INTERVAL '7 days'";
    }

    const statsResult = await client.query(
      `SELECT COUNT(*) as total_lives,
              COALESCE(SUM(ls.viewer_count), 0) as total_viewers,
              COALESCE(AVG(EXTRACT(EPOCH FROM (ls.ended_at - ls.started_at))/60), 0) as avg_duration
       FROM live_sessions ls
       JOIN host_applications ha ON ha.host_id = ls.host_id
       WHERE ha.agency_id = $1 ${dateFilter}`,
      [agencyId]
    );

    const topHostsResult = await client.query(
      `SELECT u.name, 
              COUNT(ls.id) as live_count,
              COALESCE(SUM(ls.viewer_count), 0) as total_viewers,
              COALESCE(SUM(EXTRACT(EPOCH FROM (ls.ended_at - ls.started_at))/60), 0) as total_duration
       FROM users u
       JOIN host_applications ha ON ha.host_id = u.id
       JOIN live_sessions ls ON ls.host_id = u.id
       WHERE ha.agency_id = $1 ${dateFilter}
       GROUP BY u.id, u.name
       ORDER BY live_count DESC
       LIMIT 5`,
      [agencyId]
    );

    res.json({
      success: true,
      data: {
        totalLives: parseInt(statsResult.rows[0].total_lives) || 0,
        activeLives: 0,
        totalViewers: parseInt(statsResult.rows[0].total_viewers) || 0,
        avgDuration: parseFloat(statsResult.rows[0].avg_duration) || 0,
        topHosts: topHostsResult.rows,
      },
    });
  } catch (error) {
    console.error("Error fetching live stats:", error);
    res.status(500).json({ success: false, message: "Server error" });
  } finally {
    client.release();
  }
});

// Get salary requests
router.get("/:agencyId/salary-requests", verifyAgency, async (req, res) => {
  const { agencyId } = req.params;
  const client = await pool.connect();

  try {
    const result = await client.query(
      `SELECT sr.id, sr.host_id, u.name as host_name, sr.week_number,
              sr.salary_amount, sr.total_lives, sr.status, sr.created_at
       FROM salary_requests sr
       JOIN users u ON u.id = sr.host_id
       JOIN host_applications ha ON ha.host_id = sr.host_id
       WHERE ha.agency_id = $1
       ORDER BY sr.created_at DESC`,
      [agencyId]
    );

    res.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error("Error fetching salary requests:", error);
    res.status(500).json({ success: false, message: "Server error" });
  } finally {
    client.release();
  }
});

// Approve salary request
router.post("/:agencyId/salary-approve", verifyAgency, async (req, res) => {
  const { requestId } = req.body;
  const client = await pool.connect();

  try {
    await client.query(
      "UPDATE salary_requests SET status = 'approved', approved_at = NOW() WHERE id = $1",
      [requestId]
    );

    res.json({
      success: true,
      message: "Salary request approved",
    });
  } catch (error) {
    console.error("Error approving salary:", error);
    res.status(500).json({ success: false, message: "Server error" });
  } finally {
    client.release();
  }
});

// Reject salary request
router.post("/:agencyId/salary-reject", verifyAgency, async (req, res) => {
  const { requestId } = req.body;
  const client = await pool.connect();

  try {
    await client.query(
      "UPDATE salary_requests SET status = 'rejected', approved_at = NOW() WHERE id = $1",
      [requestId]
    );

    res.json({
      success: true,
      message: "Salary request rejected",
    });
  } catch (error) {
    console.error("Error rejecting salary:", error);
    res.status(500).json({ success: false, message: "Server error" });
  } finally {
    client.release();
  }
});

// Get total income
router.get("/:agencyId/total-income", verifyAgency, async (req, res) => {
  const { agencyId } = req.params;
  const client = await pool.connect();

  try {
    const grandTotalResult = await client.query(
      `SELECT COALESCE(SUM(hi.income), 0) as total
       FROM host_income hi
       JOIN host_applications ha ON ha.host_id = hi.host_id
       WHERE ha.agency_id = $1`,
      [agencyId]
    );

    const todayResult = await client.query(
      `SELECT COALESCE(SUM(hi.income), 0) as total
       FROM host_income hi
       JOIN host_applications ha ON ha.host_id = hi.host_id
       WHERE ha.agency_id = $1 AND DATE(hi.created_at) = CURRENT_DATE`,
      [agencyId]
    );

    const weekResult = await client.query(
      `SELECT COALESCE(SUM(hi.income), 0) as total
       FROM host_income hi
       JOIN host_applications ha ON ha.host_id = hi.host_id
       WHERE ha.agency_id = $1 AND hi.created_at >= NOW() - INTERVAL '7 days'`,
      [agencyId]
    );

    const monthResult = await client.query(
      `SELECT COALESCE(SUM(hi.income), 0) as total
       FROM host_income hi
       JOIN host_applications ha ON ha.host_id = hi.host_id
       WHERE ha.agency_id = $1 
       AND DATE_TRUNC('month', hi.created_at) = DATE_TRUNC('month', CURRENT_DATE)`,
      [agencyId]
    );

    const topEarnersResult = await client.query(
      `SELECT u.id, u.name, COALESCE(SUM(hi.income), 0) as total_income
       FROM users u
       JOIN host_applications ha ON ha.host_id = u.id
       LEFT JOIN host_income hi ON hi.host_id = u.id
       WHERE ha.agency_id = $1
       GROUP BY u.id, u.name
       ORDER BY total_income DESC
       LIMIT 10`,
      [agencyId]
    );

    res.json({
      success: true,
      data: {
        grandTotal: parseInt(grandTotalResult.rows[0].total) || 0,
        todayTotal: parseInt(todayResult.rows[0].total) || 0,
        weekTotal: parseInt(weekResult.rows[0].total) || 0,
        monthTotal: parseInt(monthResult.rows[0].total) || 0,
        topEarners: topEarnersResult.rows,
      },
    });
  } catch (error) {
    console.error("Error fetching total income:", error);
    res.status(500).json({ success: false, message: "Server error" });
  } finally {
    client.release();
  }
});

// ✅ Get Host Applications by Agency
router.get("/:agencyId/host-applications", verifyAgency, async (req, res) => {
  const { agencyId } = req.params;
  const client = await pool.connect();
  try {
    const result = await client.query(
      `SELECT ha.id, ha.host_id, ha.name, ha.gender, ha.id_number, ha.status, ha.created_at,
              u.name as user_name
       FROM host_applications ha
       LEFT JOIN users u ON ha.host_id = u.id
       WHERE ha.agency_id = $1
       ORDER BY ha.created_at DESC`,
      [agencyId]
    );
    res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error("Error fetching host applications:", error);
    res.status(500).json({ success: false, message: "Server error" });
  } finally {
    client.release();
  }
});

// ✅ Approve Host Application (Agency)
router.post("/host-application/:appId/approve", verifyAgency, async (req, res) => {
  const { appId } = req.params;
  const client = await pool.connect();
  try {
    await client.query(
      `UPDATE host_applications SET status = 'approved', approved_at = NOW() WHERE id = $1`,
      [appId]
    );
    console.log(`✅ Host application approved by agency: ${appId}`);
    res.json({ success: true, message: "Host application approved" });
  } catch (error) {
    console.error("Error approving host application:", error);
    res.status(500).json({ success: false, message: "Server error" });
  } finally {
    client.release();
  }
});

// ✅ Reject Host Application (Agency)
router.post("/host-application/:appId/reject", verifyAgency, async (req, res) => {
  const { appId } = req.params;
  const client = await pool.connect();
  try {
    await client.query(
      `UPDATE host_applications SET status = 'rejected', approved_at = NOW() WHERE id = $1`,
      [appId]
    );
    console.log(`❌ Host application rejected by agency: ${appId}`);
    res.json({ success: true, message: "Host application rejected" });
  } catch (error) {
    console.error("Error rejecting host application:", error);
    res.status(500).json({ success: false, message: "Server error" });
  } finally {
    client.release();
  }
});

// ✅ Add Host to Agency (Send Invitation)
router.post("/add-host", verifyAgency, async (req, res) => {
  const { hostUserId, agencyId } = req.body;
  const client = await pool.connect();
  try {
    // Verify host user exists
    const hostCheck = await client.query("SELECT id FROM users WHERE id = $1", [hostUserId]);
    if (hostCheck.rows.length === 0) {
      return res.status(400).json({ success: false, message: "Host user not found" });
    }

    // Check if host already has an application for this agency
    const existingApp = await client.query(
      "SELECT id FROM host_applications WHERE host_id = $1 AND agency_id = $2",
      [hostUserId, agencyId]
    );

    if (existingApp.rows.length > 0) {
      return res.status(400).json({ 
        success: false, 
        message: "Host already has an application for this agency" 
      });
    }

    // Create invitation (pending host application)
    const result = await client.query(
      `INSERT INTO host_applications (host_id, agency_id, status)
       VALUES ($1, $2, 'pending')
       RETURNING id, host_id, agency_id, status, created_at`,
      [hostUserId, agencyId]
    );

    console.log(`✅ Host invitation sent: User ${hostUserId} to Agency ${agencyId}`);

    res.json({
      success: true,
      message: "Host invitation sent successfully!",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Error adding host to agency:", error);
    res.status(500).json({ success: false, message: "Server error" });
  } finally {
    client.release();
  }
});

// ✅ Upload Agency Logo
router.post("/:agencyId/upload-logo", verifyAgency, async (req, res) => {
  try {
    const { agencyId } = req.params;
    
    // Get file from request using express.static middleware
    if (!req.files || !req.files.logo) {
      return res.status(400).json({ success: false, message: "No file provided" });
    }

    const file = req.files.logo;
    const filename = `agency-logo-${agencyId}-${Date.now()}.jpg`;
    const uploadPath = path.join(__dirname, "../uploads/agency-logos", filename);

    // Create directory if not exists
    if (!fs.existsSync(path.dirname(uploadPath))) {
      fs.mkdirSync(path.dirname(uploadPath), { recursive: true });
    }

    // Save file
    await file.mv(uploadPath);

    const logoUrl = `/uploads/agency-logos/${filename}`;

    // Update database
    const client = await pool.connect();
    try {
      await client.query(
        `UPDATE agency SET logo_url = $1 WHERE id = $2`,
        [logoUrl, agencyId]
      );
      
      console.log(`✅ Agency logo uploaded: ${agencyId}`);
      res.json({
        success: true,
        message: "Logo uploaded successfully",
        data: { logo_url: logoUrl }
      });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Error uploading logo:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;

// Apply for Agency
router.post("/apply", async (req, res) => {
  try {
    const auth = req.headers.authorization;
    if (!auth) {
      return res.status(401).json({ success: false, message: "No token provided" });
    }

    const token = auth.split(" ")[1];
    let userId;
    
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      userId = decoded.id;
    } catch {
      return res.status(401).json({ success: false, message: "Invalid token" });
    }

    const { region, familyName, phone, idNumber } = req.body;

    // Validate 16-digit ID card
    if (!idNumber || idNumber.length !== 16 || !/^\d+$/.test(idNumber)) {
      return res.status(400).json({ success: false, message: "ID Card must be exactly 16 digits" });
    }

    const client = await pool.connect();
    try {
      // Check if ID card already exists
      const existingAgency = await client.query(
        "SELECT id FROM agency WHERE id_number = $1",
        [idNumber]
      );

      if (existingAgency.rows.length > 0) {
        return res.status(400).json({ 
          success: false, 
          message: "This ID card has already been used to create an agency" 
        });
      }

      // Generate random agency ID
      const agencyId = await generateAgencyId();
      
      // Insert new agency with random ID
      const result = await client.query(
        `INSERT INTO agency (id, user_id, family_name, region, phone, id_number, status)
         VALUES ($1, $2, $3, $4, $5, $6, 'pending')
         RETURNING id, family_name, region, phone, status, created_at`,
        [agencyId, userId, familyName, region, phone, idNumber]
      );

      console.log(`✅ Agency application submitted: ${familyName} (ID: ${idNumber})`);

      res.json({
        success: true,
        message: "Agency application submitted successfully! Please wait for approval.",
        data: result.rows[0],
      });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Error submitting agency application:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

