import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function ChatItem({ chat, onPress, onDelete }) {
  return (
    <View style={styles.wrapper}>
      <TouchableOpacity
        style={styles.container}
        activeOpacity={0.8}
        onPress={onPress}
      >
        <Image source={{ uri: chat.avatar }} style={styles.avatar} />

        <View style={styles.info}>
          <View style={styles.topRow}>
            <Text numberOfLines={1} style={styles.name}>
              {chat.name}
            </Text>
            <Text style={styles.time}>{chat.time}</Text>
          </View>

          <Text numberOfLines={1} style={styles.message}>
            {chat.message}
          </Text>
        </View>

        {chat.unread > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{chat.unread}</Text>
          </View>
        )}
      </TouchableOpacity>

      {/* Tombol hapus di kanan bawah */}
      <TouchableOpacity
        style={styles.deleteButton}
        activeOpacity={0.7}
        onPress={onDelete}
      >
        <Ionicons name="trash-outline" size={20} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "relative",
    marginBottom: 12,
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    elevation: 2,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
  },
  info: {
    flex: 1,
    marginLeft: 12,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  name: {
    fontSize: 15,
    fontWeight: "600",
    color: "#222",
    maxWidth: "70%",
  },
  message: {
    color: "#555",
    marginTop: 2,
    fontSize: 13,
  },
  time: {
    color: "#aaa",
    fontSize: 11,
  },
  badge: {
    backgroundColor: "#ff5252",
    borderRadius: 12,
    minWidth: 22,
    height: 22,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  badgeText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 12,
  },
  deleteButton: {
    position: "absolute",
    right: 15,
    bottom: -5,
    backgroundColor: "#ff4444",
    borderRadius: 20,
    padding: 8,
    elevation: 3,
  },
});