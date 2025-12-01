/**
 * Level Calculator - XP-based leveling system
 * 1 Coin = 1 XP
 * 1000 XP = 1 Level
 */

// Level colors sama dengan VIP colors
export const LEVEL_COLORS = {
  1: {
    label: "Level 1",
    colors: ["#00E676", "#00C853"],          // Hijau
    glow: "#66FFAA",
    bgColor: "#1B5E20",
  },
  2: {
    label: "Level 2",
    colors: ["#FFD700", "#FFB300"],          // Gold
    glow: "#FFE680",
    bgColor: "#F57F17",
  },
  3: {
    label: "Level 3",
    colors: ["#A86EFF", "#7F39FB"],          // Ungu
    glow: "#D3B3FF",
    bgColor: "#4527A0",
  },
  4: {
    label: "Level 4",
    colors: ["#FF80AB", "#FF4081"],          // Pink
    glow: "#FFB6CF",
    bgColor: "#880E4F",
  },
  5: {
    label: "Level 5",
    colors: ["#FF5252", "#D50000"],          // Merah
    glow: "#FF9E9E",
    bgColor: "#B71C1C",
  },
};

// Levels 6+ dengan gradient colors
export const EXTRA_LEVELS = {
  6: { label: "Level 6", colors: ["#FFD54F", "#FFC107"], glow: "#FFEB3B", bgColor: "#F57F17" },
  7: { label: "Level 7", colors: ["#4FC3F7", "#0288D1"], glow: "#81D4FA", bgColor: "#01579B" },
  8: { label: "Level 8", colors: ["#81C784", "#43A047"], glow: "#A5D6A7", bgColor: "#1B5E20" },
  9: { label: "Level 9", colors: ["#BA68C8", "#8E24AA"], glow: "#CE93D8", bgColor: "#4A148C" },
  10: { label: "Level 10", colors: ["#EF5350", "#C62828"], glow: "#EF9A9A", bgColor: "#B71C1C" },
};

export const XP_PER_LEVEL = 1000; // 1000 XP per level
export const COINS_PER_XP = 1;   // 1 coin = 1 XP

/**
 * Calculate level from total XP
 * @param {number} totalXp - Total XP accumulated
 * @returns {number} Current level (1+)
 */
export function calculateLevel(totalXp) {
  if (!totalXp || totalXp <= 0) return 0;
  return Math.floor(totalXp / XP_PER_LEVEL);
}

/**
 * Get level color config
 * @param {number} level - User level
 * @returns {object} Color config for the level
 */
export function getLevelConfig(level) {
  if (level >= 1 && level <= 5) {
    return LEVEL_COLORS[level] || LEVEL_COLORS[5];
  }
  // Untuk level 6+, use extra levels atau cycle
  if (level > 5 && level <= 10) {
    return EXTRA_LEVELS[level] || EXTRA_LEVELS[10];
  }
  // Level 10+, cycle through colors
  const cycleIndex = ((level - 1) % 5) + 1;
  return LEVEL_COLORS[cycleIndex];
}

/**
 * Calculate XP needed to reach next level
 * @param {number} currentXp - Current total XP
 * @returns {object} { currentLevel, nextLevel, xpNeeded, xpForNext, progressPercent }
 */
export function getNextLevelProgress(currentXp) {
  if (!currentXp) currentXp = 0;
  
  const currentLevel = calculateLevel(currentXp);
  const nextLevel = currentLevel + 1;
  
  const xpForCurrentLevel = currentLevel * XP_PER_LEVEL;
  const xpForNextLevel = nextLevel * XP_PER_LEVEL;
  
  const xpInCurrentLevel = currentXp - xpForCurrentLevel;
  const xpNeededForNext = XP_PER_LEVEL - xpInCurrentLevel;
  
  const progressPercent = (xpInCurrentLevel / XP_PER_LEVEL) * 100;
  
  return {
    currentLevel,
    nextLevel,
    currentXp,
    xpNeeded: xpNeededForNext,
    xpForNext: XP_PER_LEVEL,
    progressPercent: Math.min(progressPercent, 100),
    xpInCurrentLevel,
  };
}

/**
 * Convert coins to XP
 * @param {number} coins - Coins amount
 * @returns {number} XP gained
 */
export function coinsToXp(coins) {
  return Math.floor(coins * COINS_PER_XP);
}

/**
 * Get level label
 * @param {number} level - User level
 * @returns {string} Human readable label
 */
export function getLevelLabel(level) {
  if (level === 0) return "No Level";
  const config = getLevelConfig(level);
  return config.label || `Level ${level}`;
}
