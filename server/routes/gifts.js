// server/routes/gifts.js
import express from "express";
import { pool } from "../db.js";
import jwt from "jsonwebtoken";
import { redisClient } from "../redis.js";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "chatme-secret-key-2024";
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

    const { receiverId, giftId, giftName, coinValue, quantity = 1, category } = req.body;

    if (!receiverId || !giftName || !coinValue || !giftId) {
      return res.status(400).json({
        success: false,
        message: "Data gift tidak lengkap",
      });
    }

    const qty = parseInt(quantity);
    const price = parseInt(coinValue);
    const totalCost = price * qty;

    // cek saldo
    const userResult = await client.query(
      "SELECT balance FROM users WHERE id = $1",
      [senderId]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User tidak ditemukan",
      });
    }

    if (userResult.rows[0].balance < totalCost) {
      return res.status(400).json({
        success: false,
        message: "Saldo tidak cukup",
        needed: totalCost,
        current: userResult.rows[0].balance,
      });
    }

    await client.query("BEGIN");

    // Kurangi saldo pengirim
    await client.query(
      "UPDATE users SET balance = balance - $1 WHERE id = $2",
      [totalCost, senderId]
    );

    // ===========================
    // 🔥 Tentukan income host
    // ===========================
    let hostIncome = 0;

    if (category === "lucky" || category === "s-lucky") {
      hostIncome = Math.floor(totalCost * 0.10); // 10%
    } else {
      hostIncome = Math.floor(totalCost * 0.50); // 50% untuk umum & luxury
    }

    // Simpan ke tabel host_income
    await client.query(
      `
      INSERT INTO host_income (host_id, gift_id, income, type)
      VALUES ($1, $2, $3, $4)
      `,
      [receiverId, giftId, hostIncome, category]
    );

    // Tambah saldo host
    await client.query(
      "UPDATE users SET balance = balance + $1 WHERE id = $2",
      [hostIncome, receiverId]
    );

    // Simpan transaksi gift
    const giftResult = await client.query(
      `
      INSERT INTO gifts (sender_id, receiver_id, gift_name, coin_value, quantity)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, created_at
      `,
      [senderId, receiverId, giftName, price, qty]
    );

    // ===========================
    // 🔥 Update Redis Cloud for real-time income and hourly ranking
    // ===========================
    const hourTimestamp = Math.floor(Date.now() / (60 * 60 * 1000)) * (60 * 60 * 1000);
    const redisIncomeKey = `income:${receiverId}:${hourTimestamp}`;
    const redisRankKey = `ranking:hourly`;

    // Update total income for the current hour
    if (redisClient) {
      try {
        await redisClient.zIncrBy(redisIncomeKey, hostIncome, String(giftId));
        await redisClient.expire(redisIncomeKey, 60 * 60 * 2); // Expire after 2 hours

        // Update hourly ranking for the host
        await redisClient.zIncrBy(redisRankKey, hostIncome, String(receiverId));
        await redisClient.expire(redisRankKey, 60 * 60 * 2); // Expire after 2 hours
      } catch (redisErr) {
        console.warn("⚠️ Redis Cloud update failed (graceful fallback):", redisErr.message);
      }
    }

    await client.query("COMMIT");

    res.json({
      success: true,
      message: "Gift berhasil dikirim",
      data: {
        giftId: giftResult.rows[0].id,
        hostIncome,
        createdAt: giftResult.rows[0].created_at
      }
    });

  } catch (err) {
    await client.query("ROLLBACK");
    console.error("❌ Error sending gift:", err);

    if (err.name === "JsonWebTokenError") {
      return res.status(403).json({ success: false, message: "Token tidak valid" });
    }

    res.status(500).json({
      success: false,
      message: "Error mengirim gift",
    });
  } finally {
    client.release();
  }
});

export default router;