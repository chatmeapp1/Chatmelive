// === GameWebViewModal.js ===
import React from "react";
import {
  Modal,
  View,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
  Text,
  ActivityIndicator,
} from "react-native";
import { WebView } from "react-native-webview";
import { Ionicons } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");

export default function GameWebViewModal({ visible, onClose, url }) {
  const slideAnim = React.useRef(new Animated.Value(height)).current;
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: height / 2,
        duration: 350,
        useNativeDriver: false,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: height,
        duration: 250,
        useNativeDriver: false,
      }).start();
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Modal transparent visible={visible} animationType="fade" statusBarTranslucent>
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.overlayTouchable} onPress={onClose} activeOpacity={1} />
        <Animated.View style={[styles.container, { top: slideAnim }]}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>🎮 Game</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close-circle" size={30} color="#A8E6CF" />
            </TouchableOpacity>
          </View>

          {loading && (
            <View style={styles.loaderContainer}>
              <ActivityIndicator size="large" color="#A8E6CF" />
              <Text style={styles.loaderText}>Loading game...</Text>
            </View>
          )}

          <WebView
            source={{ uri: url }}
            style={styles.webview}
            onLoadEnd={() => setLoading(false)}
            javaScriptEnabled
            domStorageEnabled
          />
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.65)",
    justifyContent: "flex-end",
  },
  overlayTouchable: { flex: 1 },
  container: {
    position: "absolute",
    left: 0,
    width: width,
    height: height / 2,
    backgroundColor: "#101010",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingVertical: 10,
    backgroundColor: "rgba(255,255,255,0.06)",
  },
  headerTitle: { color: "#A8E6CF", fontWeight: "600", fontSize: 15 },
  webview: { flex: 1 },
  loaderContainer: {
    position: "absolute",
    top: "45%",
    left: 0,
    right: 0,
    alignItems: "center",
  },
  loaderText: {
    color: "#A8E6CF",
    marginTop: 10,
    fontSize: 14,
  },
});