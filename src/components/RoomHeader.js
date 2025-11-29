import React, { useState } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import LottieView from "lottie-react-native";
import { Ionicons } from "@expo/vector-icons";
import { scale } from "react-native-size-matters";
import UserListModal from "./UserListModal";

export default function RoomHeader({ host, level, users = [] }) {
  const [userModalVisible, setUserModalVisible] = useState(false);

  return (
    <View style={styles.container}>
      {/* === Kiri: Info Host === */}
      <View style={styles.hostInfo}>
        <View style={styles.avatarWrapper}>
          {host?.hasFrame && (
            <LottieView
              source={require("../../assets/av_frame/lottie/Avatar_frame.json")}
              autoPlay
              loop
              style={styles.lottieFrame}
            />
          )}
          <Image source={{ uri: host.avatar }} style={styles.avatar} />
        </View>

        <View style={{ marginLeft: scale(10) }}>
          <Text style={styles.name}>{host.name}</Text>
          <View style={styles.levelRow}>
            <View style={styles.levelBadgeWrapper}>
              <Image
                source={require("../../assets/level/lv_1.png")}
                style={styles.levelBadge}
                resizeMode="contain"
              />
              <Text style={styles.levelNum}>LV.{level}</Text>
            </View>
            <Text style={styles.id}>ID:{host.id}</Text>
          </View>
        </View>
      </View>

      {/* === Kanan: Hanya tombol share & setting === */}
      <View style={styles.rightSection}>
        <TouchableOpacity
          onPress={() => setUserModalVisible(true)}
          style={styles.userCountButton}
        >
          <Text style={styles.userCountText}>{users.length}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="share-social-outline" size={22} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="settings-outline" size={22} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Modal daftar user */}
      <UserListModal
        visible={userModalVisible}
        users={users}
        onClose={() => setUserModalVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: scale(10),
    paddingHorizontal: scale(15),
    justifyContent: "space-between",
  },

  // === Kiri (Host Info) ===
  hostInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarWrapper: {
    width: scale(60),
    height: scale(60),
    justifyContent: "center",
    alignItems: "center",
  },
  avatar: {
    width: "78%",
    height: "78%",
    borderRadius: 999,
  },
  lottieFrame: {
    position: "absolute",
    width: "125%",
    height: "125%",
  },
  name: {
    color: "#fff",
    fontWeight: "600",
    fontSize: scale(15),
  },
  levelRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 3,
  },
  levelBadgeWrapper: {
    width: scale(55),
    height: scale(22),
    justifyContent: "center",
    alignItems: "center",
    marginRight: scale(6),
  },
  levelBadge: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  levelNum: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: scale(12),
    textAlign: "center",
    textShadowColor: "rgba(0,0,0,0.6)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1.5,
    transform: [{ translateX: scale(4) }],
  },
  id: {
    color: "#ddd",
    fontSize: scale(12),
  },

  // === Kanan ===
  rightSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  userCountButton: {
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  userCountText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: scale(13),
  },
  iconButton: {
    marginLeft: scale(10),
  },
});