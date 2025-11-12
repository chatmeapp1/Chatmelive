import React, { useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { WebView } from "react-native-webview";

export default function GameCenterScreen({ navigation }) {
  const webviewRef = useRef(null);
  const [loading, setLoading] = useState(true);

  // Fungsi untuk reload halaman
  const handleReload = () => {
    if (webviewRef.current) {
      webviewRef.current.reload();
    }
  };

  return (
    <View style={styles.container}>
      {/* === Header Gradasi === */}
      <LinearGradient
        colors={["#B5F5B0", "#7EE6C7", "#5ED8E1"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back-outline" size={26} color="#fff" />
          </TouchableOpacity>

          <Text style={styles.headerText}>Game Center</Text>

          <View style={styles.rightButtons}>
            <TouchableOpacity onPress={handleReload} style={styles.iconBtn}>
              <Ionicons name="refresh-outline" size={22} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>

      {/* === WebView === */}
      <View style={styles.webContainer}>
        {loading && (
          <View style={styles.loader}>
            <ActivityIndicator size="large" color="#52C787" />
            <Text style={styles.loadingText}>Loading games...</Text>
          </View>
        )}
        <WebView
          ref={webviewRef}
          source={{ uri: "https://chatmeapp.my.id/games" }}
          onLoadEnd={() => setLoading(false)}
          startInLoadingState={true}
          allowsFullscreenVideo
          javaScriptEnabled={true}
          domStorageEnabled={true}
          cacheEnabled={true}
          style={{ flex: 1 }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FFF8" },

  header: {
    paddingTop: 60,
    paddingBottom: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 5,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
  },
  headerText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  rightButtons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  iconBtn: {
    paddingHorizontal: 4,
  },
  closeText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },

  webContainer: {
    flex: 1,
    overflow: "hidden",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: "#fff",
  },
  loader: {
    position: "absolute",
    top: "45%",
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 10,
  },
  loadingText: {
    marginTop: 10,
    color: "#4CAF50",
    fontWeight: "500",
  },
});