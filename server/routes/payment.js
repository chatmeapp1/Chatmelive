
import express from "express";
import jwt from "jsonwebtoken";
import { pool } from "../db.js";
import crypto from "crypto";
import axios from "axios";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "chatme_secret_key";

// Midtrans Configuration
const MIDTRANS_SERVER_KEY = process.env.MIDTRANS_SERVER_KEY;
const MIDTRANS_CLIENT_KEY = process.env.MIDTRANS_CLIENT_KEY;
const MIDTRANS_IS_PRODUCTION = process.env.MIDTRANS_IS_PRODUCTION === "true";
const MIDTRANS_API_URL = MIDTRANS_IS_PRODUCTION
  ? "https://app.midtrans.com/snap/v1/transactions"
  : "https://app.sandbox.midtrans.com/snap/v1/transactions";

// Verify keys on startup
if (!MIDTRANS_SERVER_KEY || !MIDTRANS_CLIENT_KEY) {
  console.warn("⚠️ MIDTRANS_SERVER_KEY or MIDTRANS_CLIENT_KEY not set!");
} else {
  console.log(`✅ Midtrans configured - Mode: ${MIDTRANS_IS_PRODUCTION ? "PRODUCTION" : "SANDBOX"}`);
  console.log(`   Server Key: ${MIDTRANS_SERVER_KEY.substring(0, 15)}...`);
  console.log(`   Full Server Key (for debugging): "${MIDTRANS_SERVER_KEY}"`);
  console.log(`   Key length: ${MIDTRANS_SERVER_KEY.length} chars`);
  console.log(`   API URL: ${MIDTRANS_API_URL}`);
}

// Verify JWT Token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ success: false, message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.id || decoded.userId;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
};

// Coin packages configuration - Bank Transfer (All Banks)
const BANK_PACKAGES = [
  { id: 1, coins: 1140400, price: 142000, paymentMethod: "bank_transfer" },
  { id: 2, coins: 2324000, price: 284000, paymentMethod: "bank_transfer" },
  { id: 3, coins: 11752800, price: 1420000, paymentMethod: "bank_transfer" },
  { id: 4, coins: 23538800, price: 2840000, paymentMethod: "bank_transfer" },
  { id: 5, coins: 47069300, price: 5675000, paymentMethod: "bank_transfer" },
  { id: 6, coins: 93756800, price: 11300000, paymentMethod: "bank_transfer" },
  { id: 7, coins: 117204300, price: 14125000, paymentMethod: "bank_transfer" },
];

// Coin packages configuration - E-Wallet (All E-wallets)
const EWALLET_PACKAGES = [
  { id: 101, coins: 111614, price: 13750, paymentMethod: "ewallet" },
  { id: 102, coins: 202935, price: 25000, paymentMethod: "ewallet" },
  { id: 103, coins: 405870, price: 50000, paymentMethod: "ewallet" },
  { id: 104, coins: 608805, price: 75000, paymentMethod: "ewallet" },
  { id: 105, coins: 1014675, price: 125000, paymentMethod: "ewallet" },
  { id: 106, coins: 2029350, price: 250000, paymentMethod: "ewallet" },
  { id: 107, coins: 4058700, price: 500000, paymentMethod: "ewallet" },
];

// Combined packages for easier lookup
const ALL_PACKAGES = [...BANK_PACKAGES, ...EWALLET_PACKAGES];

/**
 * POST /api/payment/create-transaction
 * Create Midtrans Snap transaction
 */
router.post("/create-transaction", verifyToken, async (req, res) => {
  const { packageId, paymentMethod } = req.body;
  const userId = req.userId;

  try {
    // Find package
    const selectedPackage = ALL_PACKAGES.find((pkg) => pkg.id === packageId);
    if (!selectedPackage) {
      return res.status(400).json({ success: false, message: "Invalid package" });
    }

    // Get user data
    const userResult = await pool.query(
      "SELECT id, name, phone FROM users WHERE id = $1",
      [userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const user = userResult.rows[0];

    // Generate unique order ID
    const orderId = `COIN-${userId}-${Date.now()}`;

    // Total coins (no bonus, all coins included in the price)
    const totalCoins = selectedPackage.coins;

    // Prepare Midtrans transaction data with proper wallet configuration
    const transactionData = {
      transaction_details: {
        order_id: orderId,
        gross_amount: selectedPackage.price,
      },
      credit_card: {
        secure: true,
      },
      customer_details: {
        first_name: user.name,
        phone: user.phone,
      },
      item_details: [
        {
          id: `PKG-${packageId}`,
          price: selectedPackage.price,
          quantity: 1,
          name: `${selectedPackage.coins.toLocaleString()} Coins`,
        },
      ],
      enabled_payments: selectedPackage.paymentMethod === "bank_transfer"
        ? ["bca_va", "bni_va", "bri_va", "mandiri_va", "permata_va"]
        : selectedPackage.paymentMethod === "ewallet"
        ? ["gopay", "shopeepay", "ovo", "dana", "linkaja"]
        : [
            "credit_card",
            "bca_va",
            "bni_va",
            "bri_va",
            "mandiri_va",
            "permata_va",
            "gopay",
            "shopeepay",
            "ovo",
            "dana",
            "linkaja",
            "qris",
          ],
      // Add wallet-specific configuration for proper app redirect
      gopay: {
        enable_callback: true,
        callback_url: `${process.env.WEBHOOK_URL || "https://api.chatme.local"}/api/payment/gopay-callback`,
      },
      callbacks: {
        finish: `${process.env.WEBHOOK_URL || "https://api.chatme.local"}/api/payment/finish`,
        error: `${process.env.WEBHOOK_URL || "https://api.chatme.local"}/api/payment/error`,
        unfinish: `${process.env.WEBHOOK_URL || "https://api.chatme.local"}/api/payment/unfinish`,
      },
      expiry: {
        unit: "minutes",
        duration: 15,
      },
    };

    // Create transaction in Midtrans
    const authString = Buffer.from(MIDTRANS_SERVER_KEY + ":").toString("base64");
    const midtransResponse = await axios.post(MIDTRANS_API_URL, transactionData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${authString}`,
      },
    });

    // Save transaction to database
    await pool.query(
      `INSERT INTO payment_transactions 
       (order_id, user_id, package_id, coins_amount, bonus_coins, price, payment_method, snap_token, status, created_at) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'pending', NOW())`,
      [
        orderId,
        userId,
        packageId,
        selectedPackage.coins,
        0,
        selectedPackage.price,
        selectedPackage.paymentMethod || "all",
        midtransResponse.data.token,
      ]
    );

    res.json({
      success: true,
      data: {
        snapToken: midtransResponse.data.token,
        orderId: orderId,
        redirectUrl: midtransResponse.data.redirect_url,
      },
    });
  } catch (error) {
    console.error("❌ Error creating transaction:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    
    // More detailed error message for debugging
    let errorMsg = "Failed to create transaction";
    if (error.response?.data?.error_messages?.[0]) {
      errorMsg = error.response.data.error_messages[0];
    }
    
    res.status(500).json({
      success: false,
      message: errorMsg,
      error: error.response?.data || error.message,
    });
  }
});

/**
 * POST /api/payment/webhook
 * Handle Midtrans payment notification
 */
router.post("/webhook", async (req, res) => {
  try {
    const notification = req.body;

    // Verify signature hash
    const orderId = notification.order_id;
    const statusCode = notification.status_code;
    const grossAmount = notification.gross_amount;
    const serverKey = MIDTRANS_SERVER_KEY;

    const hash = crypto
      .createHash("sha512")
      .update(`${orderId}${statusCode}${grossAmount}${serverKey}`)
      .digest("hex");

    if (hash !== notification.signature_key) {
      return res.status(403).json({ success: false, message: "Invalid signature" });
    }

    const transactionStatus = notification.transaction_status;
    const fraudStatus = notification.fraud_status;

    console.log(`📥 Payment notification for order: ${orderId}, status: ${transactionStatus}`);

    // Get transaction from database
    const transactionResult = await pool.query(
      "SELECT * FROM payment_transactions WHERE order_id = $1",
      [orderId]
    );

    if (transactionResult.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Transaction not found" });
    }

    const transaction = transactionResult.rows[0];

    // Handle payment status
    let paymentStatus = "pending";

    if (transactionStatus === "capture") {
      if (fraudStatus === "accept") {
        paymentStatus = "success";
      }
    } else if (transactionStatus === "settlement") {
      paymentStatus = "success";
    } else if (
      transactionStatus === "cancel" ||
      transactionStatus === "deny" ||
      transactionStatus === "expire"
    ) {
      paymentStatus = "failed";
    } else if (transactionStatus === "pending") {
      paymentStatus = "pending";
    }

    // Update transaction status
    await pool.query(
      "UPDATE payment_transactions SET status = $1, updated_at = NOW() WHERE order_id = $2",
      [paymentStatus, orderId]
    );

    // If payment successful, add coins to user's topup_balance (NOT host income) + track XP for level system
    if (paymentStatus === "success" && transaction.status !== "success") {
      const totalCoins = transaction.coins_amount;

      // Update topup_balance AND total_xp (1 coin = 1 XP)
      await pool.query(
        "UPDATE users SET topup_balance = topup_balance + $1, total_xp = COALESCE(total_xp, 0) + $1 WHERE id = $2",
        [totalCoins, transaction.user_id]
      );

      console.log(`✅ Added ${totalCoins} coins to user ${transaction.user_id} topup balance + ${totalCoins} XP for level system`);
    }

    res.json({ success: true, message: "Notification processed" });
  } catch (error) {
    console.error("Error processing webhook:", error);
    res.status(500).json({ success: false, message: "Webhook processing failed" });
  }
});

/**
 * GET /api/payment/packages
 * Get available coin packages
 */
router.get("/packages", verifyToken, async (req, res) => {
  res.json({
    success: true,
    data: {
      bank: BANK_PACKAGES,
      ewallet: EWALLET_PACKAGES,
      all: ALL_PACKAGES,
    },
  });
});

/**
 * GET /api/payment/history
 * Get user's payment history
 */
router.get("/history", verifyToken, async (req, res) => {
  const userId = req.userId;

  try {
    const result = await pool.query(
      `SELECT order_id, package_id, coins_amount, bonus_coins, price, payment_method, status, created_at 
       FROM payment_transactions 
       WHERE user_id = $1 
       ORDER BY created_at DESC 
       LIMIT 50`,
      [userId]
    );

    res.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error("Error fetching payment history:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

/**
 * GET /api/payment/status/:orderId
 * Check payment status
 */
router.get("/status/:orderId", verifyToken, async (req, res) => {
  const { orderId } = req.params;
  const userId = req.userId;

  try {
    const result = await pool.query(
      "SELECT * FROM payment_transactions WHERE order_id = $1 AND user_id = $2",
      [orderId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Transaction not found" });
    }

    res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Error checking payment status:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

/**
 * GET /api/payment/check-status/:orderId
 * Alias endpoint for payment status (used by frontend)
 */
router.get("/check-status/:orderId", verifyToken, async (req, res) => {
  const { orderId } = req.params;
  const userId = req.userId;

  try {
    const result = await pool.query(
      "SELECT * FROM payment_transactions WHERE order_id = $1 AND user_id = $2",
      [orderId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Transaction not found" });
    }

    res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Error checking payment status:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

/**
 * GET /api/payment/user-balance
 * Get user's topup balance (COIN BALANCE ONLY - untuk spending)
 */
router.get("/user-balance", verifyToken, async (req, res) => {
  const userId = req.userId;

  try {
    const result = await pool.query(
      "SELECT topup_balance FROM users WHERE id = $1",
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const user = result.rows[0];
    res.json({
      success: true,
      data: {
        topup_balance: user.topup_balance || 0,
      },
    });
  } catch (error) {
    console.error("Error fetching user balance:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

/**
 * GET /api/payment/host-income
 * Get user's host income (DIAMONDS - dari gift, untuk gaji/withdrawal)
 */
router.get("/host-income", verifyToken, async (req, res) => {
  const userId = req.userId;

  try {
    const result = await pool.query(
      "SELECT balance FROM users WHERE id = $1",
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const user = result.rows[0];
    res.json({
      success: true,
      data: {
        host_income_diamonds: user.balance || 0,
      },
    });
  } catch (error) {
    console.error("Error fetching host income:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

/**
 * POST /api/payment/verify-gplay-receipt
 * Verify Google Play receipt and add coins to user
 */
router.post("/verify-gplay-receipt", verifyToken, async (req, res) => {
  const { productId, receipt, transactionId } = req.body;
  const userId = req.userId;

  try {
    console.log(`🔍 Verifying Google Play receipt for product: ${productId}`);

    // Find package
    const selectedPackage = GOOGLE_PLAY_PACKAGES.find((pkg) => pkg.sku === productId);
    if (!selectedPackage) {
      return res.status(400).json({ success: false, message: "Invalid product ID" });
    }

    // Check if transaction already processed
    const existingTx = await pool.query(
      "SELECT id, status FROM google_play_transactions WHERE transaction_id = $1",
      [transactionId]
    );

    if (existingTx.rows.length > 0) {
      const tx = existingTx.rows[0];
      if (tx.status === "completed") {
        console.log("⚠️ Transaction already processed");
        return res.json({
          success: true,
          message: "Transaction already processed",
          alreadyProcessed: true,
        });
      }
    }

    // Insert transaction record (PENDING)
    const txResult = await pool.query(
      `INSERT INTO google_play_transactions (user_id, product_sku, transaction_id, coins_amount, receipt_data, status)
       VALUES ($1, $2, $3, $4, $5, 'pending')
       RETURNING id`,
      [userId, productId, transactionId, selectedPackage.coins, receipt]
    );

    const txId = txResult.rows[0].id;

    // Update user topup_balance
    const updateResult = await pool.query(
      `UPDATE users 
       SET topup_balance = topup_balance + $1, updated_at = CURRENT_TIMESTAMP
       WHERE id = $2
       RETURNING topup_balance`,
      [selectedPackage.coins, userId]
    );

    if (updateResult.rows.length === 0) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Mark transaction as completed
    await pool.query(
      "UPDATE google_play_transactions SET status = 'completed', updated_at = CURRENT_TIMESTAMP WHERE id = $1",
      [txId]
    );

    const newBalance = updateResult.rows[0].topup_balance;

    console.log(`✅ Added ${selectedPackage.coins} coins to user ${userId}`);
    console.log(`💰 New balance: ${newBalance}`);

    res.json({
      success: true,
      message: "Coins added successfully",
      data: {
        coinsAdded: selectedPackage.coins,
        newBalance: newBalance,
        transactionId: txId,
      },
    });
  } catch (error) {
    console.error("❌ Receipt verification error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

/**
 * GET /api/payment/gplay-transactions
 * Get user's Google Play transaction history
 */
router.get("/gplay-transactions", verifyToken, async (req, res) => {
  const userId = req.userId;

  try {
    const result = await pool.query(
      `SELECT id, product_sku, coins_amount, status, created_at
       FROM google_play_transactions
       WHERE user_id = $1
       ORDER BY created_at DESC 
       LIMIT 50`,
      [userId]
    );

    res.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error("Error fetching Google Play transactions:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Google Play coin packages (for reference)
const GOOGLE_PLAY_PACKAGES = [
  { sku: "coins_small", coins: 111614 },
  { sku: "coins_medium", coins: 405870 },
  { sku: "coins_large", coins: 1014675 },
  { sku: "coins_xlarge", coins: 2029350 },
  { sku: "coins_mega", coins: 4058700 },
];

export default router;
