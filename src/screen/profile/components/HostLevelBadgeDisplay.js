import React from "react";
import { View, Text, Image, StyleSheet, Dimensions } from "react-native";
import { getHostLevelBadge, getHostLevelTier } from "../../../utils/hostLevelCalculator";

const { width } = Dimensions.get("window");

export default function HostLevelBadgeDisplay({ hostLevel = 0, totalHostIncome = 0 }) {
  const badge = getHostLevelBadge(hostLevel);
  const tierInfo = getHostLevelTier(hostLevel);
  
  // Calculate progress to next tier
  let progressPercent = 0;
  if (hostLevel === 0) {
    progressPercent = 0;
  } else if (hostLevel >= 100) {
    progressPercent = 100;
  } else {
    // Simple progress calculation based on diamonds
    const levelInTier = hostLevel % 10;
    progressPercent = (levelInTier / 10) * 100;
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.headerLabel}>🎙️ HOST LEVEL</Text>
      </View>

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
            Host Level {hostLevel}
          </Text>
        </View>
      </View>

      {/* Progress bar to next level */}
      {hostLevel < 100 && (
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
      {hostLevel >= 100 && (
        <Text style={styles.maxLevelText}>🏆 TOP HOST 🏆</Text>
      )}

      {/* Income info */}
      <View style={styles.incomeInfo}>
        <Text style={styles.incomeLabel}>💎 Total Income: </Text>
        <Text style={styles.incomeValue}>{totalHostIncome.toLocaleString()}</Text>
        <Text style={styles.incomeCurrency}> diamonds</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 12,
    padding: 12,
    backgroundColor: "rgba(255, 215, 0, 0.08)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 215, 0, 0.2)",
  },
  headerRow: {
    marginBottom: 8,
  },
  headerLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#FFD700",
    letterSpacing: 0.5,
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
    backgroundColor: "rgba(255, 215, 0, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(255, 215, 0, 0.2)",
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
    backgroundColor: "rgba(255, 215, 0, 0.1)",
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
  incomeInfo: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 215, 0, 0.15)",
  },
  incomeLabel: {
    fontSize: 12,
    color: "#FFD700",
    fontWeight: "600",
  },
  incomeValue: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FFD700",
  },
  incomeCurrency: {
    fontSize: 12,
    color: "#FFD700",
  },
});
