
import React, { useState, useEffect } from "react";
import { FlatList, StyleSheet, Alert, View, Text, ActivityIndicator } from "react-native";
import ChatItem from "./ChatItem";
import { useNavigation } from "@react-navigation/native";
import api from "../../../utils/api";

export default function ChatList() {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    try {
      const response = await api.get("/chat/conversations");
      if (response.data.success) {
        const conversations = response.data.conversations.map((conv) => ({
          id: conv.id,
          userId: conv.userId,
          name: conv.name,
          message: conv.lastMessage,
          time: formatTime(conv.time),
          unread: conv.unread,
          avatar: conv.avatar,
          badge: conv.isOfficial ? "⚙️" : null,
          level: conv.level,
          levelIcon: conv.levelIcon,
          isOfficial: conv.isOfficial,
        }));
        setChats(conversations);
      }
    } catch (error) {
      console.error("Error fetching conversations:", error);
      Alert.alert("Error", "Gagal memuat percakapan");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    const now = new Date();
    const diffInDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) {
      return date.toLocaleTimeString("id-ID", { 
        hour: "2-digit", 
        minute: "2-digit" 
      });
    } else if (diffInDays < 7) {
      return date.toLocaleDateString("id-ID", { 
        month: "2-digit", 
        day: "2-digit" 
      });
    } else {
      return date.toLocaleDateString("id-ID", { 
        month: "2-digit", 
        day: "2-digit" 
      });
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchConversations();
  };

  const handleDelete = (id) => {
    setChats((prev) => prev.filter((chat) => chat.id !== id));
  };

  const handlePress = (chat) => {
    if (chat.isOfficial) {
      navigation.navigate("PrivateChat", { 
        user: {
          id: "official",
          name: "Official Messages",
          avatar: chat.avatar,
          isOfficial: true
        },
        conversationId: chat.id
      });
    } else {
      navigation.navigate("PrivateChat", { 
        user: {
          id: chat.userId,
          name: chat.name,
          avatar: chat.avatar
        },
        conversationId: chat.id
      });
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#7C3AED" />
        <Text style={styles.loadingText}>Memuat percakapan...</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={chats}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <ChatItem
          chat={item}
          onDelete={() => handleDelete(item.id)}
          onPress={() => handlePress(item)}
        />
      )}
      style={styles.list}
      showsVerticalScrollIndicator={false}
      refreshing={refreshing}
      onRefresh={handleRefresh}
      ListEmptyComponent={
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Belum ada percakapan</Text>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  list: {
    paddingHorizontal: 15,
    paddingTop: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 100,
  },
  loadingText: {
    marginTop: 10,
    color: "#666",
    fontSize: 14,
  },
  emptyContainer: {
    paddingTop: 100,
    alignItems: "center",
  },
  emptyText: {
    color: "#999",
    fontSize: 15,
  },
});
