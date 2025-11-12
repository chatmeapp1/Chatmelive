import React, { useState } from "react";
import { FlatList, StyleSheet, Alert } from "react-native";
import ChatItem from "./ChatItem";
import { useNavigation } from "@react-navigation/native";

const initialChats = [
  {
    id: 1,
    name: "Sonic Family",
    message: "Keluarga saya tidak masuk daftar...",
    time: "Kemarin 10:03",
    unread: 7,
    avatar: "https://i.pravatar.cc/100?img=65",
  },
  {
    id: 2,
    name: "Official Messages",
    message: "Trick or Treat!",
    time: "08:31",
    unread: 9,
    avatar: "https://i.pravatar.cc/100?img=4",
  },
  {
    id: 3,
    name: "Anggie 💕",
    message: "hai, salam kenal",
    time: "08:21",
    avatar: "https://i.pravatar.cc/100?img=6",
  },
  {
    id: 4,
    name: "Raquelle ღ",
    message: "[picture]",
    time: "08:19",
    avatar: "https://i.pravatar.cc/100?img=7",
  },
];

export default function ChatList() {
  const [chats, setChats] = useState(initialChats);
  const navigation = useNavigation();

  const handleDelete = (id) => {
    setChats((prev) => prev.filter((chat) => chat.id !== id));
  };

  const handlePress = (chat) => {
    navigation.navigate("PrivateChat", { user: chat });
  };

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
    />
  );
}

const styles = StyleSheet.create({
  list: {
    paddingHorizontal: 15,
    paddingTop: 5,
  },
});