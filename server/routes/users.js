import express from "express";
import { pool } from "../db.js";

const router = express.Router();

// ====================================================
// ✅ GET USER MINI PROFILE
// ====================================================
/**
 * GET /api/users/:userId/mini-profile
 * Get user profile data for display in live room (avatar, level, vip, name, id)
 */
router.get("/:userId/mini-profile", async (req, res) => {
  const client = await pool.connect();
  try {
    const { userId } = req.params;

    const result = await client.query(
      `SELECT 
        id,
        name,
        avatar_url,
        level,
        vip_level as vip,
        phone,
        created_at
       FROM users 
       WHERE id = $1`,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: "User tidak ditemukan" 
      });
    }

    const user = result.rows[0];
    console.log(`✅ Mini profile loaded for user: ${user.name}`);

    res.json({
      success: true,
      data: {
        id: user.id.toString(),
        name: user.name,
        avatar_url: user.avatar_url,
        level: user.level || 1,
        vip: user.vip || 0,
        phone: user.phone,
        created_at: user.created_at
      }
    });
  } catch (error) {
    console.error("❌ Error loading mini profile:", error);
    res.status(500).json({ 
      success: false, 
      message: "Server error" 
    });
  } finally {
    client.release();
  }
});

export default router;
