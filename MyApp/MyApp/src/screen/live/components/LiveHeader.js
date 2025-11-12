import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { BlurView } from "expo-blur";

const { width } = Dimensions.get("window");

export default function LiveHeader({
  host,
  viewers,
  totalViewers,
  onPressViewers,
}) {
  // hanya tampilkan 4 viewer terakhir
  const lastViewers = viewers.slice(-4);

  return (
    <BlurView intensity={38} tint="dark" style={styles.headerBlur}>
      <View style={styles.row}>

        {/* ✅ HOST AVATAR + ID */}
        <View style={styles.hostRow}>
          <View style={styles.avatarWrap}>
            <Image source={{ uri: host.image }} style={styles.avatar} />

            <View style={styles.liveBadge}>
              <Text style={styles.liveText}>LIVE</Text>
            </View>
          </View>

          <View style={{ marginLeft: 10 }}>
            <Text style={styles.hostName}>{host.name}</Text>
            <Text style={styles.hostId}>{host.id}</Text>
          </View>
        </View>

        {/* ✅ RIGHT SIDE GROUP */}
        <View style={styles.rightGroup}>

          {/* ✅ VIEWER LIST (4 TERAKHIR) */}
          <TouchableOpacity onPress={onPressViewers} style={styles.viewerStrip}>
            {lastViewers.map((v, i) => (
              <Image
                key={v.id}
                source={{ uri: v.avatar }}
                style={[
                  styles.viewerAvatar,
                  i !== 0 && { marginLeft: -8 },
                ]}
              />
            ))}
          </TouchableOpacity>

          {/* ✅ TOTAL VIEWER BUBBLE */}
          <View style={styles.viewerCount}>
            <Text style={styles.viewerCountText}>{totalViewers}</Text>
          </View>
        </View>
      </View>
    </BlurView>
  );
}

// ============================= STYLE =============================
const styles = StyleSheet.create({
  headerBlur: {
    position: "absolute",
    top: 40,
    left: 10,
    width: width - 20,
    borderRadius: 20,
    padding: 12,
    overflow: "hidden",
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
  },

  // HOST AREA
  hostRow: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  avatarWrap: {
    position: "relative",
  },

  avatar: {
    width: 55,
    height: 55,
    borderRadius: 30,
    borderWidth: 2.5,
    borderColor: "#ffd700",
  },

  liveBadge: {
    position: "absolute",
    bottom: -4,
    left: 0,
    backgroundColor: "#ff2d55",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 6,
  },

  liveText: {
    color: "white",
    fontSize: 11,
    fontWeight: "700",
  },

  hostName: {
    color: "white",
    fontSize: 20,
    fontWeight: "800",
  },

  hostId: {
    color: "#eaeaea",
    fontSize: 14,
    fontWeight: "500",
  },

  // RIGHT GROUP
  rightGroup: {
    flexDirection: "row",
    alignItems: "center",
  },

  // ✅ BUBBLE COIN PENDAPATAN
  coinBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.22)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 18,
    marginRight: 10,
  },

  coinIcon: {
    width: 19,
    height: 19,
    resizeMode: "contain",
    marginRight: 4,
  },

  coinText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 13,
  },

  // ✅ VIEWER AVATARS
  viewerStrip: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 10,
  },

  viewerAvatar: {
    width: 33,
    height: 33,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#fff",
  },

  // ✅ TOTAL VIEWER
  viewerCount: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.20)",
    alignItems: "center",
    justifyContent: "center",
  },

  viewerCountText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
  },
});