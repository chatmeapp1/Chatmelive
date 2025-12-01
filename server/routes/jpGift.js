// server/routes/jpGift.js - JP Jackpot Gift System (BALANCED v2)
import express from "express";
import jwt from "jsonwebtoken";
import { pool } from "../db.js";
import jpEngine from "../utils/jpProbabilityEngine.js";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "chatme_secret_key";

// POST /api/jp-gift/send (BALANCED v2 dengan jpProbabilityEngine)
// ONLY FOR S-LUCKY & LUCKY GIFTS - NOT FOR LUXURY
router.post("/send", async (req, res) => {
  const auth = req.headers.authorization;
  if (!auth) {
    return res.status(401).json({ success: false, message: "Token tidak ditemukan" });
  }

  const token = auth.split(" ")[1];
  const client = await pool.connect();

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const senderId = decoded.id;

    const { receiverId, giftPrice, combo, roomId, category } = req.body;

    if (!receiverId || !giftPrice || !combo || !roomId) {
      return res.status(400).json({
        success: false,
        message: "Data tidak lengkap (receiverId, giftPrice, combo, roomId required)",
      });
    }

    // 🚫 REJECT LUXURY GIFTS - JP ONLY FOR S-LUCKY & LUCKY
    if (category === "luxury") {
      return res.status(400).json({
        success: false,
        message: "Luxury gifts tidak bisa masuk JP system",
      });
    }

    // Cek saldo sender
    const userResult = await client.query(
      "SELECT balance FROM users WHERE id = $1",
      [senderId]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ success: false, message: "User tidak ditemukan" });
    }

    const userBalance = userResult.rows[0].balance;

    // 🎯 Process JP dengan NEW BALANCED ENGINE
    const jpResult = jpEngine.processGift(senderId, roomId, giftPrice, combo, userBalance);

    if (!jpResult.valid) {
      return res.status(400).json({ success: false, ...jpResult });
    }

    // Update database
    await client.query("BEGIN");

    // Potong saldo pengirim (HANYA harga gift, tidak dikali combo)
    await client.query(
      "UPDATE users SET balance = balance - $1 WHERE id = $2",
      [jpResult.totalPrice, senderId]
    );

    // Berikan reward JP jika menang
    if (jpResult.jpWin) {
      await client.query(
        "UPDATE users SET balance = balance + $1 WHERE id = $2",
        [jpResult.jpWinAmount, senderId]
      );
    }

    // Record JP gift transaction
    await client.query(
      "INSERT INTO jp_gift_history (sender_id, receiver_id, room_id, combo, gift_price, total_price, jp_win, jp_level, jp_win_amount, host_income) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)",
      [senderId, receiverId, roomId, combo, giftPrice, jpResult.totalPrice, jpResult.jpWin, jpResult.jpLevel || null, jpResult.jpWinAmount || 0, Math.floor(jpResult.totalPrice * 0.10)]
    );

    // Host income (10% dari gift price)
    const hostIncome = Math.floor(jpResult.totalPrice * 0.10);
    await client.query(
      `INSERT INTO host_income (host_id, income, type) VALUES ($1, $2, $3)`,
      [receiverId, hostIncome, "jp-gift"]
    );

    // Update host balance
    await client.query(
      "UPDATE users SET balance = balance + $1 WHERE id = $2",
      [hostIncome, receiverId]
    );

    // Update hourly ranking cache
    function getHourlyRankCache() {
      if (!global.hourlyRankCache) {
        global.hourlyRankCache = new Map();
      }
      return global.hourlyRankCache;
    }
    const hourlyRankCache = getHourlyRankCache();
    const currentHour = new Date().toISOString().slice(0, 13);
    if (hourlyRankCache.get("currentHour") !== currentHour) {
      hourlyRankCache.set("currentHour", currentHour);
      hourlyRankCache.set("data", {});
    }
    const currentData = hourlyRankCache.get("data") || {};
    if (!currentData[receiverId]) {
      currentData[receiverId] = 0;
    }
    currentData[receiverId] += hostIncome;
    hourlyRankCache.set("data", currentData);

    await client.query("COMMIT");

    console.log(`✅ JP Gift: User ${senderId} → Host ${receiverId} | Combo x${combo} | JP: ${jpResult.jpWin ? jpResult.jpLevel : "❌"}`);

    res.json({
      success: true,
      ...jpResult,
      hostIncome: hostIncome,
    });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("❌ JP Gift Error:", err);
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  } finally {
    client.release();
  }
});

// GET /api/jp-gift/stats/:roomId (NEW - JP Statistics per room)
router.get("/stats/:roomId", (req, res) => {
  const { roomId } = req.params;
  const stats = jpEngine.getJPStats(roomId);
  res.json({ success: true, ...stats });
});

export default router;
