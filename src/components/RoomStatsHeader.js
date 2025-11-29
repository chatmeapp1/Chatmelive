import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";

export default function RoomStatsHeader({ users = [], trophy = 0, hot = "50+" }) {
  return (
    <View style={styles.container}>
      {/* LEFT: Trophy & Hot */}
      <View style={styles.leftSection}>
        <View style={styles.statBox}>
          <FontAwesome5 name="trophy" size={16} color="#FFD700" />
          <Text style={styles.statText}>{trophy}</Text>
        </View>

        <View style={[styles.statBox, { backgroundColor: "rgba(255,80,80,0.15)" }]}>
          <Ionicons name="flame" size={16} color="#FF6666" />
          <Text style={styles.statText}>{hot}</Text>
        </View>
      </View>

      {/* RIGHT: Top User Avatars */}
      <View style={styles.rightSection}>
        {users.slice(0, 3).map((user, index) => (
          <View key={index} style={[styles.avatarWrapper, { zIndex: 3 - index }]}>
            <Image source={{ uri: user.image }} style={styles.avatarImage} />
            <View style={[styles.crownWrapper, { backgroundColor: index === 0 ? "#FFD700" : index === 1 ? "#A4C8FF" : "#FFB26B" }]}>
              <Text style={styles.crownText}>{index + 1}</Text>
            </View>
          </View>
        ))}
        {users.length > 3 && (
          <View style={styles.moreCircle}>
            <Text style={styles.moreText}>{users.length}</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 15,
    marginTop: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  statBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 25,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginRight: 8,
  },
  statText: {
    color: "#fff",
    fontSize: 13,
    marginLeft: 5,
  },
  rightSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarWrapper: {
    marginLeft: -10,
    borderWidth: 2,
    borderColor: "#fff",
    borderRadius: 20,
    overflow: "hidden",
  },
  avatarImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  crownWrapper: {
    position: "absolute",
    top: -4,
    right: -4,
    width: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  crownText: {
    color: "#fff",
    fontSize: 9,
    fontWeight: "bold",
  },
  moreCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: -5,
  },
  moreText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
});