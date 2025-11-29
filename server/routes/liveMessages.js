import express from "express";
import { getLiveMessages, clearLiveMessages } from "../redis.js";

const router = express.Router();

/**
 * Get all chat messages from live room
 */
router.get("/:roomId", async (req, res) => {
  const { roomId } = req.params;

  try {
    const messages = await getLiveMessages(roomId);
    res.json({ success: true, roomId, messages });
  } catch (err) {
    console.error("Error fetching messages:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

/**
 * Clear messages from room (when stream ends)
 */
router.post("/:roomId/clear", async (req, res) => {
  const { roomId } = req.params;

  try {
    await clearLiveMessages(roomId);
    res.json({ success: true, message: "Messages cleared" });
  } catch (err) {
    console.error("Error clearing messages:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;
