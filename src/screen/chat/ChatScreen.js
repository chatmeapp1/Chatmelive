import React from "react";
import { SafeAreaView, StyleSheet, View } from "react-native";
import ChatHeader from "./components/ChatHeader";
import ChatList from "./components/ChatList";

export default function ChatScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ChatHeader />
      <View style={{ flex: 1 }}>
        <ChatList />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});