/**
 * Level Calculator - XP-based leveling system
 * 1 Coin = 1 XP
 * 1000 XP = 1 Level
 * 
 * Level Tiers menggunakan PNG badge icons dari assets
 */

import { getLevelBadge, getLevelTierInfo } from "./levelBadgeMap.js";

// Export badge functions for use in components
export { getLevelBadge, getLevelTierInfo };

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
 * Get level badge config (icon, color, range)
 * @param {number} level - User level
 * @returns {object} Badge config with icon, label, range, color
 */
export function getLevelBadgeConfig(level) {
  return getLevelBadge(level);
}

/**
 * Get level tier info
 * @param {number} level - Current level
 * @returns {object} Tier information
 */
export function getLevelTier(level) {
  return getLevelTierInfo(level);
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
  return `Level ${level}`;
}
