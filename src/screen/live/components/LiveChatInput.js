// src/live/components/LiveChatInput.js

import React, { useState, useEffect, useRef } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Animated,
  Keyboard
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

export default function LiveChatInput({ onSend, onClose }) {
  const [text, setText] = useState("");
  const keyboardHeight = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const keyboardWillShow = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
      (e) => {
        Animated.timing(keyboardHeight, {
          toValue: e.endCoordinates.height,
          duration: Platform.OS === "ios" ? e.duration : 250,
          useNativeDriver: false,
        }).start();
      }
    );

    const keyboardWillHide = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide",
      (e) => {
        Animated.timing(keyboardHeight, {
          toValue: 0,
          duration: Platform.OS === "ios" ? e.duration : 250,
          useNativeDriver: false,
        }).start();
        
        // Auto-close when keyboard dismisses
        setTimeout(() => {
          if (text.trim().length === 0) {
            onClose();
          }
        }, 100);
      }
    );

    return () => {
      keyboardWillShow.remove();
      keyboardWillHide.remove();
    };
  }, [text, onClose]);

  const handleSend = () => {
    if (text.trim().length > 0) {
      onSend(text);
      setText("");
      Keyboard.dismiss();
      onClose();
    }
  };

  return (
    <Animated.View
      style={[styles.wrapper, { bottom: keyboardHeight }]}
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
          returnKeyType="send"
          onSubmitEditing={handleSend}
        />

        {/* ✅ Send */}
        <TouchableOpacity onPress={handleSend}>
          <LinearGradient
            colors={["#00e676", "#00c853"]}
            style={styles.sendButton}
          >
            <Ionicons name="arrow-forward" size={22} color="#fff" />
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    </Animated.View>
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