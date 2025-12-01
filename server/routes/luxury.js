// server/routes/luxury.js - Luxury Gift Handler
import express from "express";
import jwt from "jsonwebtoken";
import { pool } from "../db.js";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "chatme_secret_key";

// POST /api/luxury/send - Simple luxury gift handler (no JP)
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

    const { receiverId, giftPrice, count, roomId } = req.body;

    if (!receiverId || !giftPrice || !count || !roomId) {
      return res.status(400).json({
        success: false,
        message: "Data tidak lengkap (receiverId, giftPrice, count, roomId required)",
      });
    }

    // Check sender balance
    const userResult = await client.query(
      "SELECT balance FROM users WHERE id = $1",
      [senderId]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ success: false, message: "User tidak ditemukan" });
    }

    const userBalance = userResult.rows[0].balance;
    const totalPrice = giftPrice * count;

    // Validate balance
    if (userBalance < totalPrice) {
      return res.status(400).json({
        success: false,
        message: "Saldo tidak cukup",
        needed: totalPrice,
        current: userBalance,
      });
    }

    // Deduct coins from sender
    await client.query("BEGIN");
    
    await client.query(
      "UPDATE users SET balance = balance - $1 WHERE id = $2",
      [totalPrice, senderId]
    );

    // Calculate host income (50% for luxury)
    const hostIncome = Math.floor(totalPrice * 0.5);

    // Add host income
    await client.query(
      "INSERT INTO host_income (host_id, income, type) VALUES ($1, $2, $3)",
      [receiverId, hostIncome, "luxury-gift"]
    );

    // Update host balance
    await client.query(
      "UPDATE users SET balance = balance + $1 WHERE id = $2",
      [hostIncome, receiverId]
    );

    await client.query("COMMIT");

    const newBalance = userBalance - totalPrice;

    console.log(`✅ Luxury Gift: User ${senderId} → Host ${receiverId} | Price: ${totalPrice} | Host Income: ${hostIncome}`);

    return res.json({
      success: true,
      message: "Luxury gift sent successfully",
      saldoAkhir: newBalance,
      hostIncome: hostIncome,
      jpWin: false,
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("❌ Luxury Gift Error:", error.message);
    return res.status(500).json({ success: false, message: error.message });
  } finally {
    client.release();
  }
});

export default router;
