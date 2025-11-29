import React from "react";
import {
  Modal,
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback,
} from "react-native";

const { height } = Dimensions.get("window");

const CHAT_DATA = [
  {
    id: "1",
    name: "Chatme Secretary",
    message: "Great Voyage",
    time: "AM 06:35",
    unread: 2,
    avatars: [
      "https://picsum.photos/id/1011/100",
      "https://picsum.photos/id/1027/100",
    ],
  },
  {
    id: "2",
    name: "elleNA💕",
    message: "bisa wae",
    time: "dua hari yang lalu",
    unread: 0,
    avatars: ["https://picsum.photos/id/1012/100"],
  },
  {
    id: "3",
    name: "Felly🌸kstr",
    message: "[Undangan Kamar]",
    time: "2025-08-09",
    unread: 0,
    avatars: ["https://picsum.photos/id/1020/100"],
  },
];

export default function ChatListScreen({ visible, onClose }) {
  if (!visible) return null;

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.chatItem} activeOpacity={0.8}>
      <View style={styles.avatarSection}>
        <View style={styles.avatarContainer}>
          {item.avatars.slice(0, 2).map((uri, i) => (
            <Image
              key={i}
              source={{ uri }}
              style={[
                styles.avatar,
                { left: i * 18, zIndex: 2 - i }, // tumpukan 2 foto
              ]}
            />
          ))}
        </View>
      </View>

      <View style={styles.chatInfo}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.message}>{item.message}</Text>
      </View>

      <View style={styles.rightInfo}>
        <Text style={styles.time}>{item.time}</Text>
        {item.unread > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{item.unread}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.backdrop} />
      </TouchableWithoutFeedback>

      <View style={styles.modalContainer}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Recent</Text>
        </View>

        <FlatList
          data={CHAT_DATA}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  modalContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: height * 0.55,
    backgroundColor: "rgba(20,20,20,0.95)", // ✅ hitam transparan elegan
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    paddingTop: 14,
  },
  header: {
    alignItems: "center",
    marginBottom: 10,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "600",
  },
  listContainer: {
    paddingHorizontal: 18,
    paddingBottom: 25,
  },
  chatItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 0.4,
    borderColor: "rgba(255,255,255,0.1)",
  },
  avatarSection: {
    width: 58,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  avatarContainer: {
    flexDirection: "row",
    position: "relative",
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#222",
    position: "absolute",
  },
  chatInfo: {
    flex: 1,
    marginLeft: 12,
  },
  name: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },
  message: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 13,
    marginTop: 2,
  },
  rightInfo: {
    alignItems: "flex-end",
  },
  time: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 11,
  },
  badge: {
    backgroundColor: "#ff3366",
    borderRadius: 10,
    paddingHorizontal: 6,
    marginTop: 6,
  },
  badgeText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 11,
  },
});