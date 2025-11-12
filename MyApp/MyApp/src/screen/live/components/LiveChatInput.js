// src/live/components/LiveChatInput.js

import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Animated
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

export default function LiveChatInput({ onSend, onClose }) {
  const [text, setText] = useState("");

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={20}
      style={styles.wrapper}
    >
      <Animated.View style={styles.box}>
        {/* ✅ Close (X) */}
        <TouchableOpacity onPress={onClose} style={styles.closeWrap}>
          <Ionicons name="close" size={22} color="#999" />
        </TouchableOpacity>

        {/* ✅ Text input */}
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder="Katakan sesuatu lah ……"
          placeholderTextColor="#666"
          style={styles.input}
          autoFocus
        />

        {/* ✅ Send */}
        <TouchableOpacity
          onPress={() => {
            if (text.trim().length > 0) {
              onSend(text);
              setText("");
            }
          }}
        >
          <LinearGradient
            colors={["#00e676", "#00c853"]}
            style={styles.sendButton}
          >
            <Ionicons name="arrow-forward" size={22} color="#fff" />
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    paddingBottom: 10,
    zIndex: 3000,
  },

  box: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 25,
    marginHorizontal: 10,
    alignItems: "center",
  },

  closeWrap: {
    padding: 5,
  },

  input: {
    flex: 1,
    fontSize: 15,
    paddingHorizontal: 10,
    color: "#000",
  },

  sendButton: {
    padding: 10,
    borderRadius: 20,
  },
});