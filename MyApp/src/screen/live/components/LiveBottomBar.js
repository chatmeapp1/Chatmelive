// src/live/components/LiveBottomBar.js
import React from "react";
import { View, TouchableOpacity, StyleSheet, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function LiveBottomBar({
  hidden = false,
  onChatPress,
  onGiftPress,
  onPressInbox,
  onPressMenu,
  inboxCount = 0,
}) {
  const insets = useSafeAreaInsets();

  if (hidden) return null; // ✅ Hilang saat chat input tampil

  return (
    <View style={[styles.container, { bottom: insets.bottom + 6 }]}>
      <View style={styles.row}>
        <TouchableOpacity onPress={onChatPress} style={styles.circle}>
          <Ionicons name="chatbubble-ellipses" size={26} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity onPress={onPressInbox} style={styles.circle}>
          <Ionicons name="mail-outline" size={26} color="#fff" />
          {inboxCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{inboxCount}</Text>
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={onPressMenu} style={styles.circle}>
          <Ionicons name="reorder-three" size={30} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity onPress={onGiftPress} style={styles.circle}>
          <Ionicons name="gift-outline" size={26} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 5000,
    backgroundColor: "transparent",
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "85%",
  },

  circle: {
    width: 58,
    height: 58,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.38)",
  },

  badge: {
    position: "absolute",
    top: -3,
    right: -3,
    backgroundColor: "red",
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },

  badgeText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "bold",
  },
});