import express from "express";
import jwt from "jsonwebtoken";
import { pool } from "../db.js";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "chatme_secret_key";

// Super admin verification middleware
const verifySuperAdmin = async (req, res, next) => {
  try {
    const auth = req.headers.authorization;
    if (!auth) return res.status(401).json({ success: false, message: "No token" });
    
    const token = auth.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Check if user is super admin
    const SUPER_ADMIN_IDS = (process.env.SUPER_ADMIN_IDS || "260125").split(",");
    if (!SUPER_ADMIN_IDS.includes(String(decoded.id))) {
      return res.status(403).json({ success: false, message: "Not authorized as super admin" });
    }
    
    req.userId = decoded.id;
    next();
  } catch (error) {
    return res.status(403).json({ success: false, message: "Invalid token" });
  }
};

// POST: Transfer coin to user by user ID (6+ digits)
router.post("/transfer-coin", verifySuperAdmin, async (req, res) => {
  const { toUserId, amount, reason } = req.body;
  
  if (!toUserId || !amount || amount <= 0) {
    return res.status(400).json({ success: false, message: "Invalid toUserId or amount" });
  }
  
  if (String(toUserId).length < 6) {
    return res.status(400).json({ success: false, message: "User ID must be 6+ digits" });
  }
  
  const client = await pool.connect();
  try {
    const userCheck = await client.query("SELECT id, username, coin FROM users WHERE id = $1", [toUserId]);
    if (userCheck.rows.length === 0) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    
    const currentCoin = userCheck.rows[0].coin || 0;
    const newCoin = currentCoin + amount;
    
    await client.query("UPDATE users SET coin = $1 WHERE id = $2", [newCoin, toUserId]);
    
    res.json({ 
      success: true, 
      message: `Transferred ${amount} coin to ${userCheck.rows[0].username}`,
      userId: toUserId,
      username: userCheck.rows[0].username,
      previousCoin: currentCoin,
      newCoin: newCoin,
      reason: reason || "Manual transfer"
    });
  } catch (error) {
    console.error("Error transferring coin:", error);
    res.status(500).json({ success: false, message: "Server error" });
  } finally {
    client.release();
  }
});

// GET: JP gift settings
router.get("/jp-settings", verifySuperAdmin, async (req, res) => {
  res.json({ 
    success: true, 
    data: {
      jpLevels: [
        { level: 20, chance: 0.18, rewardMultiplier: 20 },
        { level: 50, chance: 0.10, rewardMultiplier: 50 },
        { level: 100, chance: 0.05, rewardMultiplier: 100 },
        { level: 200, chance: 0.02, rewardMultiplier: 200 },
        { level: 500, chance: 0.003, rewardMultiplier: 500 },
        { level: 1000, chance: 0.0005, rewardMultiplier: 1000 }
      ],
      comboOptions: [1, 3, 9, 19, 66, 199],
      cooldownMinutes: 30
    }
  });
});

// POST: Update JP gift settings (saved to env/config in production)
router.post("/jp-settings", verifySuperAdmin, async (req, res) => {
  const { jpLevels, comboOptions, cooldownMinutes } = req.body;
  
  if (!jpLevels || !Array.isArray(jpLevels) || jpLevels.length === 0) {
    return res.status(400).json({ success: false, message: "Invalid jpLevels" });
  }
  
  res.json({ 
    success: true, 
    message: "JP settings updated (implement persistent storage in production)",
    settings: { jpLevels, comboOptions, cooldownMinutes }
  });
});

// GET: Verify super admin status
router.get("/verify", verifySuperAdmin, async (req, res) => {
  res.json({ success: true, message: "Super admin verified" });
});

export default router;
