import React from "react";
import { View, Text, Image, StyleSheet, Dimensions } from "react-native";
import { getLevelBadge } from "../../../utils/levelCalculator";

const { width } = Dimensions.get("window");

export default function LevelBadgeDisplay({ level = 0, totalXp = 0 }) {
  const badge = getLevelBadge(level);
  
  // Calculate progress to next tier
  let progressPercent = 0;
  if (level === 0) {
    progressPercent = 0;
  } else if (level >= 100) {
    progressPercent = 100;
  } else {
    // Simple progress calculation
    const levelInTier = level % 10;
    progressPercent = (levelInTier / 10) * 100;
  }

  return (
    <View style={styles.container}>
      <View style={styles.badgeRow}>
        <Image
          source={badge.icon}
          style={styles.badgeIcon}
        />
        <View style={styles.badgeInfo}>
          <Text style={styles.levelLabel}>
            {badge.label}
          </Text>
          <Text style={[styles.levelNumber, { color: badge.color }]}>
            Level {level}
          </Text>
        </View>
      </View>

      {/* Progress bar ke level berikutnya */}
      {level < 100 && (
        <View style={styles.progressContainer}>
          <View style={styles.progressBackground}>
            <View
              style={[
                styles.progressBar,
                {
                  width: `${progressPercent}%`,
                  backgroundColor: badge.color,
                },
              ]}
            />
          </View>
          <Text style={styles.progressText}>
            {Math.floor(progressPercent)}% to next level
          </Text>
        </View>
      )}

      {/* Max level indicator */}
      {level >= 100 && (
        <Text style={styles.maxLevelText}>🏆 MAX LEVEL REACHED 🏆</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 12,
    padding: 12,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
  },
  badgeRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  badgeIcon: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  badgeInfo: {
    flex: 1,
  },
  levelLabel: {
    fontSize: 12,
    color: "#999",
    marginBottom: 2,
  },
  levelNumber: {
    fontSize: 18,
    fontWeight: "700",
  },
  progressContainer: {
    marginTop: 8,
  },
  progressBackground: {
    height: 6,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 3,
    overflow: "hidden",
    marginBottom: 6,
  },
  progressBar: {
    height: "100%",
    borderRadius: 3,
  },
  progressText: {
    fontSize: 11,
    color: "#999",
    textAlign: "center",
  },
  maxLevelText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#FFD700",
    textAlign: "center",
    marginTop: 8,
  },
});
