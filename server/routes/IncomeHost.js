// server/routes/incomeHost.js
import express from "express";
import { pool } from "../db.js";

const router = express.Router();

/**
 * Helper untuk convert rows ke angka atau 0
 */
const toNumber = (value) => (value ? parseInt(value) : 0);

/**
 * ================================
 * 1️⃣ TOTAL INCOME HARI INI
 * ================================
 */
router.get("/today/:hostId", async (req, res) => {
  const { hostId } = req.params;

  const client = await pool.connect();
  try {
    const result = await client.query(
      `
      SELECT SUM(income) AS total
      FROM host_income
      WHERE host_id = $1
        AND DATE(created_at) = CURRENT_DATE;
      `,
      [hostId]
    );

    res.json({
      success: true,
      total: toNumber(result.rows[0].total),
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false });
  } finally {
    client.release();
  }
});

/**
 * ================================
 * 2️⃣ TOTAL INCOME MINGGU INI
 * ================================
 */
router.get("/week/:hostId", async (req, res) => {
  const { hostId } = req.params;

  const client = await pool.connect();
  try {
    const result = await client.query(
      `
      SELECT SUM(income) AS total
      FROM host_income
      WHERE host_id = $1
        AND created_at >= NOW() - INTERVAL '7 days';
      `,
      [hostId]
    );

    res.json({
      success: true,
      total: toNumber(result.rows[0].total),
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false });
  } finally {
    client.release();
  }
});

/**
 * ================================
 * 3️⃣ TOTAL INCOME BULAN INI
 * ================================
 */
router.get("/month/:hostId", async (req, res) => {
  const { hostId } = req.params;

  const client = await pool.connect();
  try {
    const result = await client.query(
      `
      SELECT SUM(income) AS total
      FROM host_income
      WHERE host_id = $1
        AND DATE_TRUNC('month', created_at) = DATE_TRUNC('month', CURRENT_DATE);
      `,
      [hostId]
    );

    res.json({
      success: true,
      total: toNumber(result.rows[0].total),
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false });
  } finally {
    client.release();
  }
});

/**
 * ================================
 * 4️⃣ TOTAL INCOME PER KATEGORI
 * ================================
 */
router.get("/category/:hostId", async (req, res) => {
  const { hostId } = req.params;

  const client = await pool.connect();
  try {
    const result = await client.query(
      `
      SELECT type, SUM(income) AS total
      FROM host_income
      WHERE host_id = $1
      GROUP BY type;
      `,
      [hostId]
    );

    const data = {
      lucky: 0,
      "s-lucky": 0,
      luxury: 0,
      normal: 0,
    };

    result.rows.forEach((row) => {
      data[row.type] = toNumber(row.total);
    });

    res.json({
      success: true,
      data,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false });
  } finally {
    client.release();
  }
});

/**
 * ================================
 * 5️⃣ HISTORY INCOME (LIMIT 50)
 * ================================
 */
router.get("/history/:hostId", async (req, res) => {
  const { hostId } = req.params;

  const client = await pool.connect();
  try {
    const result = await client.query(
      `
      SELECT h.*, g.gift_name, g.coin_value, g.quantity
      FROM host_income h
      JOIN gifts g ON g.id = h.gift_id
      WHERE h.host_id = $1
      ORDER BY h.created_at DESC
      LIMIT 50;
      `,
      [hostId]
    );

    res.json({
      success: true,
      data: result.rows,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false });
  } finally {
    client.release();
  }
});

/**
 * ================================
 * 6️⃣ INCOME SELAMA LIVE SESSION
 * ================================
 */
router.get("/live/:sessionId", async (req, res) => {
  const { sessionId } = req.params;

  const client = await pool.connect();
  try {
    const result = await client.query(
      `
      SELECT SUM(income) AS total
      FROM host_income
      WHERE created_at >= 
        (SELECT started_at FROM live_sessions WHERE id = $1)
        AND created_at <= 
        (SELECT COALESCE(ended_at, NOW()) FROM live_sessions WHERE id = $1);
      `,
      [sessionId]
    );

    res.json({
      success: true,
      total: toNumber(result.rows[0].total),
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false });
  } finally {
    client.release();
  }
});

export default router;