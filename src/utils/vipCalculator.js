/**
 * VIP Calculator - Determines VIP level based on ACCUMULATED top-ups in last 5 days
 */

export const VIP_TIERS = {
  1: 110000,        // 110k accumulated
  2: 5000000,       // 5m accumulated
  3: 10000000,      // 10m accumulated
  4: 40000000,      // 40m accumulated
  5: 100000000,     // 100m accumulated
};

export const VIP_DURATION_DAYS = 5;

/**
 * Calculate VIP level from accumulated top-ups in last 5 days
 * @param {number} accumulatedCoins - Total coins top-uped in last 5 days
 * @returns {number} VIP level (0-5)
 */
export function calculateVipLevel(accumulatedCoins) {
  if (!accumulatedCoins || accumulatedCoins < VIP_TIERS[1]) return 0;
  if (accumulatedCoins >= VIP_TIERS[5]) return 5;
  if (accumulatedCoins >= VIP_TIERS[4]) return 4;
  if (accumulatedCoins >= VIP_TIERS[3]) return 3;
  if (accumulatedCoins >= VIP_TIERS[2]) return 2;
  if (accumulatedCoins >= VIP_TIERS[1]) return 1;
  return 0;
}

/**
 * Get VIP label
 * @param {number} vipLevel - VIP level (0-5)
 * @returns {string} Human readable label
 */
export function getVipLabel(vipLevel) {
  const labels = {
    0: "Regular",
    1: "VIP 1",
    2: "VIP 2",
    3: "VIP 3",
    4: "VIP 4",
    5: "VIP 5",
  };
  return labels[vipLevel] || "Regular";
}

/**
 * Get coin requirement for next VIP tier
 * @param {number} currentCoins - Current accumulated coins
 * @returns {number|null} Coins needed for next tier
 */
export function getNextVipRequirement(currentCoins) {
  if (!currentCoins) currentCoins = 0;
  
  if (currentCoins >= VIP_TIERS[5]) return null; // Max VIP
  if (currentCoins >= VIP_TIERS[4]) return VIP_TIERS[5];
  if (currentCoins >= VIP_TIERS[3]) return VIP_TIERS[4];
  if (currentCoins >= VIP_TIERS[2]) return VIP_TIERS[3];
  if (currentCoins >= VIP_TIERS[1]) return VIP_TIERS[2];
  return VIP_TIERS[1];
}
