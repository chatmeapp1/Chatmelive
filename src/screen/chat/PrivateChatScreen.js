
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import socketService from "../../utils/socket";
import api from "../../utils/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function PrivateChatScreen({ route, navigation }) {
  const { user, conversationId } = route.params;
  const [message, setMessage] = useState("");
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState(null);
  const flatListRef = useRef(null);

  useEffect(() => {
    loadUserData();
    if (conversationId) {
      loadMessages();
    }
  }, [conversationId]);

  useEffect(() => {
    if (!user.isOfficial) {
      socketService.onPrivateMessage((data) => {
        if (data.fromUserId === user.id) {
          const currentTime = new Date(data.timestamp).toLocaleTimeString("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
          });
          setChats((prev) => [
            ...prev,
            {
              id: data.timestamp,
              text: data.message,
              fromMe: false,
              time: currentTime,
            },
          ]);
          scrollToBottom();
        }
      });

      return () => {
        socketService.removeListener("chat:receive");
      };
    }
  }, [user.id, user.isOfficial]);

  const loadUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem("userData");
      if (userData) {
        const user = JSON.parse(userData);
        setCurrentUserId(user.id);
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    }
  };

  const loadMessages = async () => {
    try {
      const response = await api.get(`/chat/messages/${conversationId}`);
      if (response.data.success) {
        const messages = response.data.messages.map((msg) => ({
          id: msg.id,
          text: msg.content,
          fromMe: msg.fromMe,
          time: formatTime(msg.time),
          isOfficial: msg.isOfficial,
        }));
        setChats(messages);
        scrollToBottom();
      }
    } catch (error) {
      console.error("Error loading messages:", error);
      Alert.alert("Error", "Gagal memuat pesan");
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    return date.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const handleSend = async () => {
    if (!message.trim() || user.isOfficial) return;
    
    const currentTime = new Date().toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });
    
    // Use unique ID with random suffix to avoid collisions
    const tempId = `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newMessage = {
      id: tempId,
      text: message,
      fromMe: true,
      time: currentTime,
      isOfficial: false,
    };
    
    setChats((prev) => [...prev, newMessage]);
    scrollToBottom();
    
    const messageText = message;
    setMessage("");

    try {
      // Send to backend
      const response = await api.post("/chat/send", {
        recipientId: user.id,
        content: messageText,
      });
      
      // Replace temp message with actual message from server
      if (response.data.success && response.data.message) {
        const serverMessage = {
          id: response.data.message.id,
          text: response.data.message.content,
          fromMe: true,
          time: formatTime(response.data.message.created_at),
          isOfficial: false,
        };
        setChats((prev) => 
          prev.map((msg) => msg.id === tempId ? serverMessage : msg)
        );
      }
      
      // Send via Socket.IO for real-time delivery
      socketService.sendPrivateMessage(
        user.id,
        currentUserId,
        messageText,
        "User"
      );
    } catch (error) {
      console.error("Error sending message:", error);
      Alert.alert("Error", "Gagal mengirim pesan");
      setChats((prev) => prev.filter((msg) => msg.id !== tempId));
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#7C3AED" />
          <Text style={styles.loadingText}>Memuat pesan...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Image
            source={{ uri: user.avatar }}
            style={styles.headerAvatar}
          />
          <Text style={styles.headerTitle}>{user.name}</Text>
        </View>

        <TouchableOpacity style={styles.moreButton}>
          <Ionicons name="ellipsis-vertical" size={20} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Chat Messages */}
      <FlatList
        ref={flatListRef}
        data={chats}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        renderItem={({ item, index }) => (
          <View
            style={[
              styles.messageContainer,
              item.fromMe ? styles.messageRight : styles.messageLeft,
            ]}
          >
            {!item.fromMe && !user.isOfficial && (
              <Image
                source={{ uri: user.avatar }}
                style={styles.messageAvatar}
              />
            )}
            {!item.fromMe && user.isOfficial && (
              <View style={styles.officialIcon}>
                <Ionicons name="notifications" size={20} color="#7C3AED" />
              </View>
            )}
            <View
              style={[
                styles.messageBubble,
                item.fromMe ? styles.fromMe : styles.fromOther,
                item.isOfficial && styles.officialMessage,
              ]}
            >
              <Text 
                style={[
                  styles.messageText,
                  item.fromMe && styles.messageTextMe
                ]}
              >
                {item.text}
              </Text>
              <Text style={[styles.timeText, item.fromMe && styles.timeTextMe]}>
                {item.time}
              </Text>
            </View>
          </View>
        )}
        contentContainerStyle={styles.chatBody}
        onContentSizeChange={() => scrollToBottom()}
      />

      {/* Input Area */}
      {!user.isOfficial && (
        <View style={styles.inputArea}>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="add-circle-outline" size={28} color="#666" />
          </TouchableOpacity>

          <TextInput
            value={message}
            onChangeText={setMessage}
            placeholder="Ketik pesan..."
            style={styles.input}
            multiline
            onSubmitEditing={handleSend}
          />

          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="mic-outline" size={26} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
            <Ionicons name="send" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#fff",
    borderBottomWidth: 0.5,
    borderColor: "#e0e0e0",
  },
  backButton: {
    padding: 4,
  },
  headerCenter: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginLeft: 12,
  },
  headerAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  moreButton: {
    padding: 4,
  },
  chatBody: {
    padding: 12,
    paddingBottom: 20,
  },
  messageContainer: {
    flexDirection: "row",
    marginVertical: 4,
    alignItems: "flex-end",
  },
  messageLeft: {
    justifyContent: "flex-start",
  },
  messageRight: {
    justifyContent: "flex-end",
  },
  messageAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  messageBubble: {
    maxWidth: "70%",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 18,
  },
  fromMe: {
    backgroundColor: "#7C3AED",
    borderBottomRightRadius: 4,
  },
  fromOther: {
    backgroundColor: "#fff",
    borderBottomLeftRadius: 4,
  },
  officialMessage: {
    backgroundColor: "#F3E8FF",
    borderColor: "#7C3AED",
    borderWidth: 1,
  },
  officialIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
    backgroundColor: "#F3E8FF",
    justifyContent: "center",
    alignItems: "center",
  },
  messageText: {
    fontSize: 15,
    color: "#333",
    lineHeight: 20,
    marginBottom: 4,
  },
  messageTextMe: {
    color: "#fff",
  },
  timeText: {
    fontSize: 10,
    color: "#999",
    marginTop: 2,
  },
  timeTextMe: {
    color: "#E9D5FF",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    color: "#666",
    fontSize: 14,
  },
  inputArea: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#fff",
    borderTopWidth: 0.5,
    borderColor: "#e0e0e0",
  },
  iconButton: {
    padding: 4,
    marginHorizontal: 4,
  },
  input: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 8,
    fontSize: 15,
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: "#7C3AED",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 4,
  },
});
