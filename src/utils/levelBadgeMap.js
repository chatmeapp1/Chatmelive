/**
 * Level Badge Mapping - Maps level ranges to PNG badge icons
 */

export const LEVEL_BADGE_MAP = {
  0: {
    icon: require("../../assets/badge/level/lv_gray.png"),
    label: "No Level",
    range: "Level 0",
    color: "#999999",
  },
  1: {
    icon: require("../../assets/badge/level/lv_blue.png"),
    label: "Level 1-10",
    range: "1-10",
    color: "#2196F3",
  },
  11: {
    icon: require("../../assets/badge/level/lv_green.png"),
    label: "Level 11-20",
    range: "11-20",
    color: "#4CAF50",
  },
  21: {
    icon: require("../../assets/badge/level/lv_yellow.png"),
    label: "Level 21-30",
    range: "21-30",
    color: "#FFC107",
  },
  31: {
    icon: require("../../assets/badge/level/lv_orange.png"),
    label: "Level 31-50",
    range: "31-50",
    color: "#FF9800",
  },
  51: {
    icon: require("../../assets/badge/level/lv_red.png"),
    label: "Level 51-75",
    range: "51-75",
    color: "#F44336",
  },
  76: {
    icon: require("../../assets/badge/level/lv_black.png"),
    label: "Level 76-100",
    range: "76-100",
    color: "#212121",
  },
};

/**
 * Get badge icon for a specific level
 * @param {number} level - User level
 * @returns {object} Badge config with icon, label, range, and color
 */
export function getLevelBadge(level) {
  if (level === 0 || !level) return LEVEL_BADGE_MAP[0];
  
  if (level >= 1 && level <= 10) return LEVEL_BADGE_MAP[1];
  if (level >= 11 && level <= 20) return LEVEL_BADGE_MAP[11];
  if (level >= 21 && level <= 30) return LEVEL_BADGE_MAP[21];
  if (level >= 31 && level <= 50) return LEVEL_BADGE_MAP[31];
  if (level >= 51 && level <= 75) return LEVEL_BADGE_MAP[51];
  if (level >= 76 && level <= 100) return LEVEL_BADGE_MAP[76];
  
  // Default to highest level if exceeds 100
  return LEVEL_BADGE_MAP[76];
}

/**
 * Get all level ranges
 * @returns {array} Array of badge configs
 */
export function getAllLevelBadges() {
  return Object.values(LEVEL_BADGE_MAP);
}

/**
 * Get level tier info (untuk display progress ke tier berikutnya)
 * @param {number} level - Current level
 * @returns {object} { currentTier, currentRange, nextTier, nextRange }
 */
export function getLevelTierInfo(level) {
  const badges = [0, 1, 11, 21, 31, 51, 76];
  
  let currentBadgeKey = 0;
  let nextBadgeKey = 1;
  
  for (let i = 0; i < badges.length; i++) {
    if (level >= badges[i]) {
      currentBadgeKey = badges[i];
      nextBadgeKey = badges[i + 1] || badges[badges.length - 1];
    }
  }
  
  return {
    currentTier: currentBadgeKey,
    currentRange: LEVEL_BADGE_MAP[currentBadgeKey].range,
    nextTier: nextBadgeKey,
    nextRange: LEVEL_BADGE_MAP[nextBadgeKey].range,
  };
}
