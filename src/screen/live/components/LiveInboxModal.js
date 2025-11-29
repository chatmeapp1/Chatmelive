
// src/screen/live/components/LiveInboxModal.js
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  FlatList,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";

export default function LiveInboxModal({ visible, onClose }) {
  const messages = [
    {
      id: 1,
      type: "system",
      title: "Berita system",
      message: "Versi terbaru Kiwi kini tersedia. Silakan unduh dan perbarui da...",
      time: "2 jam yang lalu",
      read: false,
    },
  ];

  const renderMessage = ({ item }) => (
    <TouchableOpacity style={styles.messageItem} activeOpacity={0.7}>
      <View style={styles.iconWrapper}>
        <Ionicons name="megaphone" size={28} color="#FF6B9D" />
      </View>
      
      <View style={styles.messageContent}>
        <Text style={styles.messageTitle}>{item.title}</Text>
        <Text style={styles.messageText} numberOfLines={2}>
          {item.message}
        </Text>
        <Text style={styles.messageTime}>{item.time}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Berita</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Messages List */}
          <FlatList
            data={messages}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderMessage}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "flex-end",
  },

  container: {
    backgroundColor: "#1a1a1a",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "80%",
    paddingBottom: 20,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.1)",
  },

  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },

  closeBtn: {
    padding: 4,
  },

  listContent: {
    paddingHorizontal: 16,
  },

  messageItem: {
    flexDirection: "row",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.05)",
  },

  iconWrapper: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(255,107,157,0.15)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  messageContent: {
    flex: 1,
  },

  messageTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },

  messageText: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 6,
  },

  messageTime: {
    color: "rgba(255,255,255,0.4)",
    fontSize: 12,
  },
});
