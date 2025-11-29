// server/routes/jpGift.js - JP Jackpot Gift System
import express from "express";
import jwt from "jsonwebtoken";
import { pool } from "../db.js";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "chatme_secret_key";

// In-memory JP cooldown per room (production: move to Redis)
const ROOM_JP_LOG = {}; // { [roomId]: lastJpTimestamp }
const COOLDOWN_JP_BESAR = 1800; // 30 minutes

// JP level config - base reward untuk harga gift 100 coin
const JP_LEVELS = [
  { level: 20, chance: 0.18, rewardMultiplier: 20 },      // 100 × 20 = 2.000
  { level: 50, chance: 0.10, rewardMultiplier: 50 },      // 100 × 50 = 5.000
  { level: 100, chance: 0.05, rewardMultiplier: 100 },    // 100 × 100 = 10.000
  { level: 200, chance: 0.02, rewardMultiplier: 200 },    // 100 × 200 = 20.000
  { level: 500, chance: 0.003, rewardMultiplier: 500 },   // 100 × 500 = 50.000
  { level: 1000, chance: 0.0005, rewardMultiplier: 1000 }, // 100 × 1000 = 100.000
];

const COMBO_OPTIONS = [1, 3, 9, 19, 66, 199];

function randomChance(prob) {
  return Math.random() < prob;
}

function getNow() {
  return Math.floor(Date.now() / 1000);
}

function canJPBesar(roomId) {
  const last = ROOM_JP_LOG[roomId] || 0;
  return getNow() - last >= COOLDOWN_JP_BESAR;
}

function saveJPBesar(roomId) {
  ROOM_JP_LOG[roomId] = getNow();
}

function processGift(userId, roomId, giftPrice, combo, userBalance) {
  if (!COMBO_OPTIONS.includes(combo)) {
    return { error: "Combo tidak valid", valid: false };
  }

  // Harga gift TIDAK dikali combo, hanya dikali 1x saja
  let totalPrice = giftPrice * 1;

  if (userBalance < totalPrice) {
    return { error: "Saldo tidak cukup", valid: false, needed: totalPrice, current: userBalance };
  }

  let jpWin = false;
  let jpLevel = null;
  let jpWinAmount = 0;
  let jpBesarPecah = false;

  if ([1, 3, 9, 19].includes(combo)) {
    // JP kecil lebih sering, JP besar coba ketika cooldown sudah lewat
    let jpCandidates = JP_LEVELS.slice(0, 4);
    for (let jp of jpCandidates) {
      if (randomChance(jp.chance)) {
        jpWin = true;
        jpLevel = jp.level;
        // PENTING: reward dikali combo (bukan harga gift dikali combo)
        jpWinAmount = Math.floor((giftPrice * jp.rewardMultiplier) * combo);
        break;
      }
    }
    if (!jpWin && canJPBesar(roomId)) {
      let jpCandidatesBesar = JP_LEVELS.slice(4); // [500, 1000]
      for (let jp of jpCandidatesBesar) {
        if (randomChance(jp.chance)) {
          jpWin = true;
          jpLevel = jp.level;
          jpWinAmount = Math.floor((giftPrice * jp.rewardMultiplier) * combo);
          jpBesarPecah = true;
          saveJPBesar(roomId);
          break;
        }
      }
    }
  } else if ([66, 199].includes(combo)) {
    // JP kecil jarang, JP besar lebih memungkinkan
    let jpCandidates = JP_LEVELS.slice(3); // [200, 500, 1000]
    for (let jp of jpCandidates) {
      let bonusChance = jp.level >= 500 ? 1.2 : 0.5;
      if (canJPBesar(roomId) || jp.level < 500) {
        if (randomChance(jp.chance * bonusChance)) {
          jpWin = true;
          jpLevel = jp.level;
          jpWinAmount = Math.floor((giftPrice * jp.rewardMultiplier) * combo);
          if (jp.level >= 500) {
            jpBesarPecah = true;
            saveJPBesar(roomId);
          }
          break;
        }
      }
    }
  }

  const saldoAwal = userBalance;
  const saldoAkhir = userBalance - totalPrice + (jpWin ? jpWinAmount : 0);

  return {
    valid: true,
    userId: userId,
    roomId: roomId,
    combo: combo,
    giftPrice: giftPrice,
    totalPrice: totalPrice,
    jpWin: jpWin,
    jpLevel: jpLevel || null,
    jpWinAmount: jpWinAmount,
    saldoAwal: saldoAwal,
    saldoAkhir: saldoAkhir,
    jpBesarCooldown: jpBesarPecah ? COOLDOWN_JP_BESAR : 0,
    message: jpWin
      ? `🎊 JP WIN ${jpLevel}! Anda dapat ${jpWinAmount} coin (harga gift: ${totalPrice} coin)`
      : `❌ Gagal JP. Anda kehilangan ${totalPrice} coin. Coba lagi!`,
  };
}

// POST /api/jp-gift/send
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

    const { receiverId, giftPrice, combo, roomId } = req.body;

    if (!receiverId || !giftPrice || !combo || !roomId) {
      return res.status(400).json({
        success: false,
        message: "Data tidak lengkap (receiverId, giftPrice, combo, roomId required)",
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

    // Process JP logic
    const jpResult = processGift(senderId, roomId, giftPrice, combo, userBalance);

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

    // Record JP gift transaction to history table
    await client.query(
      "INSERT INTO jp_gift_history (sender_id, receiver_id, room_id, combo, gift_price, total_price, jp_win, jp_level, jp_win_amount, host_income) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)",
      [senderId, receiverId, roomId, combo, giftPrice, jpResult.totalPrice, jpResult.jpWin, jpResult.jpLevel || null, jpResult.jpWinAmount || 0, Math.floor(jpResult.totalPrice * 0.10)]
    );

    // Host income (dari totalPrice, bukan dari reward)
    const hostIncome = Math.floor(jpResult.totalPrice * 0.10); // 10% untuk lucky gift
    await client.query(
      `INSERT INTO host_income (host_id, income, type)
       VALUES ($1, $2, $3)`,
      [receiverId, hostIncome, "jp-gift"]
    );

    // Update host balance
    await client.query(
      "UPDATE users SET balance = balance + $1 WHERE id = $2",
      [hostIncome, receiverId]
    );

    // Update hourly ranking cache (in-memory for real-time display)
    // Use helper function similar to income.js
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

    res.json({
      success: true,
      ...jpResult,
      hostIncome: hostIncome,
    });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("JP Gift Error:", err);
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  } finally {
    client.release();
  }
});

// GET /api/jp-gift/cooldown/:roomId
router.get("/cooldown/:roomId", (req, res) => {
  const { roomId } = req.params;
  const lastJp = ROOM_JP_LOG[roomId] || 0;
  const now = getNow();
  const timeRemaining = Math.max(0, COOLDOWN_JP_BESAR - (now - lastJp));

  res.json({
    roomId,
    lastJpTime: lastJp,
    currentTime: now,
    cooldownSeconds: COOLDOWN_JP_BESAR,
    timeRemaining: timeRemaining,
    canJPBesar: timeRemaining === 0,
  });
});

export default router;
