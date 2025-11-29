
import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function ChatItem({ chat, onPress, onDelete }) {
  return (
    <TouchableOpacity
      style={styles.container}
      activeOpacity={0.8}
      onPress={onPress}
    >
      <Image source={{ uri: chat.avatar }} style={styles.avatar} />

      <View style={styles.info}>
        <View style={styles.topRow}>
          <View style={styles.nameRow}>
            <Text numberOfLines={1} style={styles.name}>
              {chat.name}
            </Text>
            {chat.levelIcon && <Text style={styles.levelIcon}>{chat.levelIcon}</Text>}
            {chat.level && <Text style={styles.level}>{chat.level}</Text>}
            {chat.badge && <Text style={styles.badge}>{chat.badge}</Text>}
          </View>
          <Text style={styles.time}>{chat.time}</Text>
        </View>

        <View style={styles.messageRow}>
          <Text numberOfLines={1} style={styles.message}>
            {chat.message}
          </Text>
          {chat.hasButton && (
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionButtonText}>{chat.buttonText}</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {chat.unread > 0 && (
        <View style={styles.unreadBadge}>
          <Text style={styles.unreadText}>{chat.unread}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderColor: "#f0f0f0",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  name: {
    fontSize: 15,
    fontWeight: "600",
    color: "#000",
    marginRight: 6,
    flex: 1,
  },
  levelIcon: {
    fontSize: 14,
    marginRight: 3,
  },
  level: {
    fontSize: 12,
    color: "#666",
    marginRight: 6,
    fontWeight: "500",
  },
  badge: {
    fontSize: 14,
  },
  time: {
    fontSize: 12,
    color: "#999",
  },
  messageRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  message: {
    fontSize: 14,
    color: "#666",
    flex: 1,
    marginRight: 8,
  },
  actionButton: {
    backgroundColor: "#8B5CF6",
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
  },
  actionButtonText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
  },
  unreadBadge: {
    backgroundColor: "#FF3366",
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 6,
    marginLeft: 8,
  },
  unreadText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "600",
  },
});
