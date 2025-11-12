import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useLive } from "../../context/LiveContext";  // ✅

export default function StartLiveScreen() {
  const navigation = useNavigation();
  const { startLive } = useLive();

  const host = {
    id: "host_1",
    name: "GOPAY",
    avatar: "https://picsum.photos/id/1005/100",
  };

  const [title, setTitle] = useState("");

  const beginLive = () => {
    startLive({
      id: host.id,
      name: host.name,
      image: host.avatar,
      viewers: 0,
      title,
    });

    navigation.navigate("HostLiveScreen", {
      isLive: true,
      host,
    });
  };

  return (
    <View style={styles.container}>

      <TouchableOpacity style={styles.closeButton} onPress={() => navigation.goBack()}>
        <Ionicons name="close" size={28} color="#fff" />
      </TouchableOpacity>

      <View style={styles.headerBox}>
        <Image source={{ uri: host.avatar }} style={styles.avatar} />
        <View style={{ flex: 1 }}>
          <Text style={styles.askText}>kamu ingin siaran langsung apa ya?</Text>
          <Text style={styles.subText}>undang teman masuk untuk ramaikan</Text>
        </View>
        <View style={styles.shareIcons}>
          <Feather name="twitter" size={20} color="#fff" style={{ marginRight: 10 }} />
          <Feather name="facebook" size={20} color="#fff" />
        </View>
      </View>

      <TextInput
        placeholder="Tulis judul siaran kamu..."
        placeholderTextColor="#aaa"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
      />

      <TouchableOpacity onPress={beginLive} activeOpacity={0.85}>
        <LinearGradient
          colors={["#A8E063", "#56AB2F"]}
          style={styles.startButton}
        >
          <Text style={styles.startText}>mulai siaran langsung</Text>
        </LinearGradient>
      </TouchableOpacity>

      <View style={styles.toolsRow}>
        <TouchableOpacity style={styles.toolItem}>
          <Ionicons name="color-wand-outline" size={22} color="#fff" />
          <Text style={styles.toolText}>Beauty</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.toolItem}>
          <Ionicons name="camera-reverse-outline" size={22} color="#fff" />
          <Text style={styles.toolText}>Reverse</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000", paddingHorizontal: 20, paddingTop: 60 },
  closeButton: { position: "absolute", top: 40, right: 20, zIndex: 10 },
  headerBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.05)",
    padding: 15,
    borderRadius: 15,
    marginBottom: 20,
  },
  avatar: { width: 60, height: 60, borderRadius: 12, marginRight: 12 },
  askText: { color: "#fff", fontSize: 15, fontWeight: "600" },
  subText: { color: "#aaa", fontSize: 13, marginTop: 4 },
  shareIcons: { flexDirection: "row", alignItems: "center" },
  input: {
    backgroundColor: "rgba(255,255,255,0.1)",
    color: "#fff",
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 30,
    fontSize: 14,
  },
  startButton: {
    width: "100%",
    borderRadius: 30,
    paddingVertical: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  startText: { color: "#fff", fontSize: 16, fontWeight: "700" },
  toolsRow: { flexDirection: "row", justifyContent: "space-around", marginTop: 35 },
  toolItem: { alignItems: "center" },
  toolText: { color: "#fff", fontSize: 13, marginTop: 6 },
});