import React, { useEffect, useRef, useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Keyboard,
  Animated,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function ChatInput({ visible, onSend, onClose }) {
  const [message, setMessage] = useState("");
  const slideAnim = useRef(new Animated.Value(100)).current;
  const inputRef = useRef(null);

  // 🎯 Saat visible berubah → animasi muncul / sembunyi
  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: visible ? 0 : 100,
      duration: 250,
      useNativeDriver: true,
    }).start();

    if (visible) {
      // buka keyboard otomatis
      setTimeout(() => {
        inputRef.current?.focus();
      }, 200);
    } else {
      Keyboard.dismiss();
    }
  }, [visible]);

  // ✉️ Kirim pesan dan tutup input
  const handleSend = () => {
    if (message.trim().length === 0) return;
    onSend(message);
    setMessage("");
    Keyboard.dismiss();
    onClose(); // sembunyikan input
  };

  if (!visible) return null; // tidak render apapun saat hidden

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.containerWrapper}
    >
      <Animated.View
        style={[
          styles.container,
          {
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        {/* Tombol Tutup */}
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Ionicons name="close" size={22} color="#fff" />
        </TouchableOpacity>

        {/* Input Pesan */}
        <TextInput
          ref={inputRef}
          style={styles.input}
          placeholder="Ketik pesan..."
          placeholderTextColor="#ccc"
          value={message}
          onChangeText={setMessage}
          onSubmitEditing={handleSend}
          returnKeyType="send"
        />

        {/* Tombol Kirim */}
        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
          <Ionicons name="send" size={24} color="#8A2BE2" />
        </TouchableOpacity>
      </Animated.View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  containerWrapper: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    zIndex: 999,
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.8)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  input: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.1)",
    color: "#fff",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 25,
    fontSize: 14,
  },
  sendButton: {
    marginLeft: 10,
    padding: 5,
  },
  closeButton: {
    marginRight: 6,
    padding: 5,
  },
});