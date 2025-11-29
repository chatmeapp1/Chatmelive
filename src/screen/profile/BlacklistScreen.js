
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function BlacklistScreen({ navigation }) {
  const [blockedUsers, setBlockedUsers] = useState([
    {
      id: "1",
      name: "User 1",
      avatar: require("../../../assets/images/avatar1.png"),
    },
    {
      id: "2",
      name: "User 2",
      avatar: require("../../../assets/images/avatar2.png"),
    },
  ]);

  const handleUnblock = (userId, userName) => {
    Alert.alert(
      "Buka Blokir",
      `Apakah Anda yakin ingin membuka blokir ${userName}?`,
      [
        { text: "Batal", style: "cancel" },
        {
          text: "Buka Blokir",
          onPress: () => {
            setBlockedUsers(blockedUsers.filter((user) => user.id !== userId));
          },
        },
      ]
    );
  };

  const renderItem = ({ item }) => (
    <View style={styles.userItem}>
      <View style={styles.userInfo}>
        <Image source={item.avatar} style={styles.avatar} />
        <Text style={styles.userName}>{item.name}</Text>
      </View>
      <TouchableOpacity
        style={styles.unblockBtn}
        onPress={() => handleUnblock(item.id, item.name)}
      >
        <Text style={styles.unblockText}>Buka Blokir</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={26} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Daftar hitam</Text>
      </View>

      {/* Content */}
      {blockedUsers.length > 0 ? (
        <FlatList
          data={blockedUsers}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.content}
        />
      ) : (
        <View style={styles.emptyState}>
          <Ionicons name="people-outline" size={60} color="#ccc" />
          <Text style={styles.emptyText}>Tidak ada pengguna yang diblokir</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F5F5" },

  header: {
    backgroundColor: "#6EE096",
    paddingTop: 45,
    paddingBottom: 20,
    alignItems: "center",
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  },
  backBtn: { position: "absolute", left: 15, top: 45 },
  headerText: { color: "#fff", fontSize: 18, fontWeight: "600" },

  content: { paddingTop: 10 },

  userItem: {
    backgroundColor: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    marginRight: 12,
  },
  userName: {
    fontSize: 15,
    color: "#333",
  },

  unblockBtn: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#6EE096",
  },
  unblockText: {
    fontSize: 14,
    color: "#6EE096",
  },

  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 100,
  },
  emptyText: {
    fontSize: 15,
    color: "#999",
    marginTop: 15,
  },
});
