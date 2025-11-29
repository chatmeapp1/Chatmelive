// src/screen/home/components/HostCard.js
import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width / 2 - 20;
const CARD_HEIGHT = CARD_WIDTH * 1.45;

export default function HostCard({ host }) {
  const navigation = useNavigation();

  const handlePress = () => {
    navigation.navigate("LiveNavigator", {
      screen: "ViewerLiveScreen",
      params: {
        host: {
          ...host,
          title: host.title || "Live Streaming",
        },
        liveTitle: host.title || "Live Streaming",
      },
    });
  };

  return (
    <TouchableOpacity activeOpacity={0.85} style={styles.card} onPress={handlePress}>
      <View style={styles.imageWrapper}>
        
        {/* ✅ Neon Glow */}
        <LinearGradient
          colors={["#9CFFAC", "transparent"]}
          style={styles.glow}
        />

        {/* ✅ Foto Host */}
        <Image source={{ uri: host.image }} style={styles.image} />

        {/* ✅ Overlay bawah */}
        <View style={styles.bottomOverlay}>
          {host.title && (
            <Text style={styles.liveTitle} numberOfLines={1}>
              {host.title}
            </Text>
          )}

          <View style={styles.bottomRow}>
            <Text style={styles.name}>{host.name}</Text>

            <View style={styles.viewerRow}>
              <Ionicons name="eye" size={13} color="#fff" />
              <Text style={styles.viewerText}>{host.viewers}</Text>
            </View>
          </View>
        </View>

        {/* ✅ Badge LIVE */}
        <View style={styles.liveBadge}>
          <Text style={styles.liveText}>LIVE</Text>
        </View>

      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    margin: 6,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#000",
  },

  imageWrapper: {
    width: "100%",
    height: "100%",
    position: "relative",
  },

  glow: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 12,
    zIndex: 3,
  },

  image: {
    width: "100%",
    height: "100%",
  },

  bottomOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 6,
    backgroundColor: "rgba(0,0,0,0.35)",
  },

  liveTitle: {
    color: "#fff",
    fontSize: 12,
    marginBottom: 2,
  },

  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  name: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },

  viewerRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  viewerText: {
    color: "#fff",
    fontSize: 11,
    marginLeft: 4,
  },

  liveBadge: {
    position: "absolute",
    top: 8,
    left: 8,
    backgroundColor: "red",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    zIndex: 5,
  },

  liveText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "bold",
  },
});