import React, { useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function PrivateChatScreen({ route }) {
  const { user } = route.params;
  const [message, setMessage] = useState("");
  const [chats, setChats] = useState([
    { id: 1, text: "Hai 👋", fromMe: false },
    { id: 2, text: "Halo, kenal dong 😄", fromMe: true },
  ]);

  const handleSend = () => {
    if (!message.trim()) return;
    setChats([...chats, { id: Date.now(), text: message, fromMe: true }]);
    setMessage("");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="arrow-back" size={24} color="#000" />
        <Text style={styles.headerTitle}>{user.name}</Text>
      </View>

      <FlatList
        data={chats}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View
            style={[
              styles.messageBubble,
              item.fromMe ? styles.fromMe : styles.fromOther,
            ]}
          >
            <Text style={styles.messageText}>{item.text}</Text>
          </View>
        )}
        contentContainerStyle={styles.chatBody}
      />

      <View style={styles.inputArea}>
        <TextInput
          value={message}
          onChangeText={setMessage}
          placeholder="Ketik pesan..."
          style={styles.input}
        />
        <TouchableOpacity onPress={handleSend}>
          <Ionicons name="send" size={22} color="#3CD070" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderBottomWidth: 0.5,
    borderColor: "#eee",
  },
  headerTitle: { fontSize: 18, fontWeight: "600", marginLeft: 8 },
  chatBody: { padding: 12 },
  messageBubble: {
    maxWidth: "75%",
    padding: 10,
    borderRadius: 12,
    marginVertical: 4,
  },
  fromMe: {
    backgroundColor: "#DCF8C6",
    alignSelf: "flex-end",
    borderBottomRightRadius: 0,
  },
  fromOther: {
    backgroundColor: "#eee",
    alignSelf: "flex-start",
    borderBottomLeftRadius: 0,
  },
  messageText: { fontSize: 15, color: "#333" },
  inputArea: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderTopWidth: 0.5,
    borderColor: "#ddd",
  },
  input: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginRight: 8,
  },
});