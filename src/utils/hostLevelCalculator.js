/**
 * Host Level Calculator - Level system based on HOST INCOME/DIAMONDS
 * Not based on XP, but on accumulated diamonds/income from gifts
 * 
 * Host Income = Diamonds earned from gifts (gifts sent by users to host)
 * Level formula: hostLevel = Math.floor(totalHostIncome / DIAMONDS_PER_LEVEL)
 */

import { getLevelBadge, getLevelTierInfo } from "./levelBadgeMap.js";

// Diamonds needed per level for host
export const DIAMONDS_PER_LEVEL = 500; // 500 diamonds = 1 level for host

/**
 * Calculate host level from total host income (diamonds)
 * @param {number} totalHostIncome - Total diamonds earned from hosting
 * @returns {number} Current host level (0+)
 */
export function calculateHostLevel(totalHostIncome) {
  if (!totalHostIncome || totalHostIncome <= 0) return 0;
  return Math.floor(totalHostIncome / DIAMONDS_PER_LEVEL);
}

/**
 * Get host level badge config (icon, color, range)
 * Uses same badge system as user level
 * @param {number} hostLevel - Host level
 * @returns {object} Badge config with icon, label, range, color
 */
export function getHostLevelBadge(hostLevel) {
  return getLevelBadge(hostLevel);
}

/**
 * Get host level tier info
 * @param {number} hostLevel - Current host level
 * @returns {object} Tier information
 */
export function getHostLevelTier(hostLevel) {
  return getLevelTierInfo(hostLevel);
}

/**
 * Calculate diamonds needed to reach next level
 * @param {number} currentHostIncome - Current total host income
 * @returns {object} { currentLevel, nextLevel, diamondsNeeded, progressPercent }
 */
export function getNextHostLevelProgress(currentHostIncome) {
  if (!currentHostIncome) currentHostIncome = 0;
  
  const currentLevel = calculateHostLevel(currentHostIncome);
  const nextLevel = currentLevel + 1;
  
  const diamondsForCurrentLevel = currentLevel * DIAMONDS_PER_LEVEL;
  const diamondsForNextLevel = nextLevel * DIAMONDS_PER_LEVEL;
  
  const diamondsInCurrentLevel = currentHostIncome - diamondsForCurrentLevel;
  const diamondsNeededForNext = DIAMONDS_PER_LEVEL - diamondsInCurrentLevel;
  
  const progressPercent = (diamondsInCurrentLevel / DIAMONDS_PER_LEVEL) * 100;
  
  return {
    currentLevel,
    nextLevel,
    currentHostIncome,
    diamondsNeeded: diamondsNeededForNext,
    diamondsForNext: DIAMONDS_PER_LEVEL,
    progressPercent: Math.min(progressPercent, 100),
    diamondsInCurrentLevel,
  };
}

/**
 * Get host level label
 * @param {number} hostLevel - Host level
 * @returns {string} Human readable label
 */
export function getHostLevelLabel(hostLevel) {
  if (hostLevel === 0) return "Novice Host";
  return `Host Level ${hostLevel}`;
}

/**
 * Calculate host income needed for specific level
 * @param {number} targetLevel - Target host level
 * @returns {number} Total diamonds needed
 */
export function getHostIncomeLevelRequirement(targetLevel) {
  return targetLevel * DIAMONDS_PER_LEVEL;
}
