// server/utils/jpProbabilityEngine.js - Dynamic JP Probability System
// System yang balanced: 50-50 antara app dan user

import { pool } from "../db.js";

// Redis-like in-memory store (production: gunakan Redis)
const JP_STATE = {};

const CONFIG = {
  // JP Levels dan chances
  JP_LEVELS: [
    { level: 20, baseChance: 0.18, rewardMult: 20, tier: "small" },
    { level: 50, baseChance: 0.10, rewardMult: 50, tier: "small" },
    { level: 100, baseChance: 0.05, rewardMult: 100, tier: "medium" },
    { level: 200, baseChance: 0.02, rewardMult: 200, tier: "medium" },
    { level: 500, baseChance: 0.003, rewardMult: 500, tier: "large" },
    { level: 1000, baseChance: 0.0005, rewardMult: 1000, tier: "large" },
  ],

  // Dinamik timing based on pattern
  TIMING_PATTERN: {
    // [20s x5] dalam 1 menit
    quickBurst: { levels: [20], count: 5, windowSeconds: 60, cooldownAfter: 60 },
    // Medium pattern: 50s, 20s, 100s
    mediumPattern: { levels: [50, 20, 100], spacingSeconds: 20, cooldownAfter: 120 },
    // Big pattern: 500s dengan cooldown panjang
    bigPattern: { levels: [500], cooldownAfter: 600 }, // 10 minutes
  },

  // Combo settings
  COMBO_SETTINGS: {
    1: { payout: 1, specialTrigger: false, spreadToRooms: false },
    3: { payout: 10, specialTrigger: true, spreadToRooms: "all", label: "DOUBLE" },
    9: { payout: 10, specialTrigger: true, spreadToRooms: "all", label: "TRIPLE" },
    19: { payout: 1, specialTrigger: false, spreadToRooms: false },
    66: { payout: 1, specialTrigger: false, spreadToRooms: false },
    199: { payout: 1, specialTrigger: false, spreadToRooms: false },
  },

  // Balance settings
  BALANCE_SETTINGS: {
    bigWinCooldownMultiplier: 2, // 2x cooldown setelah big win
    coinDepletionThreshold: 0.3, // 30% depletion trigger JP
    maxConsecutiveJPs: 2, // Max 2 JP berturut-turut
  },
};

/**
 * Get state untuk room
 */
function getStateForRoom(roomId) {
  if (!JP_STATE[roomId]) {
    JP_STATE[roomId] = {
      lastJPTime: 0,
      lastJPLevel: null,
      consecutiveCount: 0,
      totalSpent: 0,
      lastSpendTime: 0,
      activePattern: null,
      patternStartTime: 0,
      bigWinCooldown: 0,
    };
  }
  return JP_STATE[roomId];
}

/**
 * Calculate adjusted probability based on:
 * - Consecutive JP count
 * - Time since last JP
 * - Total spend in room
 * - Big win cooldown
 */
function getAdjustedProbability(baseChance, roomId, combo) {
  const state = getStateForRoom(roomId);
  const now = Math.floor(Date.now() / 1000);
  const timeSinceLastJP = now - state.lastJPTime;

  let adjustedChance = baseChance;

  // 1. Consecutive cooldown: Reduce chance if just got JP
  if (state.consecutiveCount > 0) {
    const cooldownFactor = 1 - (0.5 * state.consecutiveCount); // -50% per consecutive
    adjustedChance *= Math.max(0.1, cooldownFactor);
  }

  // 2. Big win cooldown: Significantly reduce chance
  if (state.bigWinCooldown > now) {
    const cooldownPercent = (state.bigWinCooldown - now) / 600; // 0-1
    adjustedChance *= (1 - 0.8 * cooldownPercent); // -80% during cooldown
  }

  // 3. Combo multiplier: x3 dan x9 dapat boost
  if ([3, 9].includes(combo)) {
    adjustedChance *= 1.5; // +50% chance untuk combo x3 dan x9
  }

  return Math.min(1.0, adjustedChance);
}

/**
 * Main: Process gift dan tentukan JP win dengan balanced probability
 */
function processGift(userId, roomId, giftPrice, combo, userBalance) {
  const state = getStateForRoom(roomId);
  const now = Math.floor(Date.now() / 1000);

  // Validate combo
  if (!CONFIG.COMBO_SETTINGS[combo]) {
    return { error: "Combo tidak valid", valid: false };
  }

  // Check balance
  const totalPrice = giftPrice * 1;
  if (userBalance < totalPrice) {
    return { error: "Saldo tidak cukup", valid: false, needed: totalPrice };
  }

  let jpWin = false;
  let jpLevel = null;
  let jpWinAmount = 0;
  let jpBesarCooldown = 0;

  // ==========================================
  // BALANCED JP PROBABILITY ALGORITHM
  // ==========================================

  // 1. Tentukan which JP levels are available
  let availableLevels = [...CONFIG.JP_LEVELS];

  // Filter: big JP (500, 1000) hanya jika cooldown sudah lewat
  if (state.bigWinCooldown > now) {
    availableLevels = availableLevels.filter((jp) => jp.level < 500);
  }

  // 2. Iterate through available levels (high to low untuk balanced)
  for (let jp of availableLevels.reverse()) {
    const adjustedChance = getAdjustedProbability(jp.baseChance, roomId, combo);

    if (Math.random() < adjustedChance) {
      jpWin = true;
      jpLevel = jp.level;

      // Calculate reward dengan combo multiplier
      const comboPayoutMult = CONFIG.COMBO_SETTINGS[combo].payout;
      jpWinAmount = Math.floor(giftPrice * jp.rewardMult * comboPayoutMult);

      // Set cooldown untuk big wins
      if (jp.level >= 500) {
        jpBesarCooldown = 600 * CONFIG.BALANCE_SETTINGS.bigWinCooldownMultiplier;
        state.bigWinCooldown = now + jpBesarCooldown;
      }

      // Update state
      state.lastJPTime = now;
      state.lastJPLevel = jp.level;
      state.consecutiveCount = (state.consecutiveCount % CONFIG.BALANCE_SETTINGS.maxConsecutiveJPs) + 1;

      break;
    }
  }

  // Reset consecutive count after 30 seconds tanpa JP
  if (now - state.lastJPTime > 30 && state.consecutiveCount > 0) {
    state.consecutiveCount = 0;
  }

  // Track total spend untuk depletion trigger
  state.totalSpent += totalPrice;
  state.lastSpendTime = now;

  // ==========================================
  // CALCULATE FINAL BALANCE
  // ==========================================
  const saldoAwal = userBalance;
  const saldoAkhir = userBalance - totalPrice + (jpWin ? jpWinAmount : 0);

  return {
    valid: true,
    userId,
    roomId,
    combo,
    giftPrice,
    totalPrice,
    jpWin,
    jpLevel: jpLevel || null,
    jpWinAmount,
    jpBesarCooldown,
    saldoAwal,
    saldoAkhir,
    state: {
      consecutiveCount: state.consecutiveCount,
      timeSinceLastJP: now - state.lastJPTime,
      cooldownRemaining: Math.max(0, state.bigWinCooldown - now),
    },
    message: jpWin
      ? `🎊 JP WIN ${jpLevel}! Dapat ${jpWinAmount} coin (Combo: x${combo})`
      : `❌ No JP. Kehilangan ${totalPrice} coin.`,
  };
}

/**
 * Get JP statistics untuk room
 */
function getJPStats(roomId) {
  const state = getStateForRoom(roomId);
  const now = Math.floor(Date.now() / 1000);
  return {
    roomId,
    lastJPLevel: state.lastJPLevel,
    consecutiveCount: state.consecutiveCount,
    timeSinceLastJP: now - state.lastJPTime,
    bigWinCooldownRemaining: Math.max(0, state.bigWinCooldown - now),
    totalSpentInRoom: state.totalSpent,
  };
}

/**
 * Reset room state (maintenance)
 */
function resetRoomState(roomId) {
  delete JP_STATE[roomId];
}

export default {
  CONFIG,
  processGift,
  getStateForRoom,
  getJPStats,
  resetRoomState,
};
