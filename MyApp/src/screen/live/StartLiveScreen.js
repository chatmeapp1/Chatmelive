import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useLive } from "../../context/LiveContext";

export default function StartLiveScreen() {
  const navigation = useNavigation();
  const { startLive } = useLive();

  const host = {
    id: "host_1",
    name: "GOPAY",
    avatar: "https://picsum.photos/id/1005/100",
  };

  const [isFrontCamera, setIsFrontCamera] = useState(true);

  const beginLive = () => {
    startLive({
      id: host.id,
      name: host.name,
      image: host.avatar,
      viewers: 0,
      title: "Live Streaming",
    });

    navigation.navigate("HostLiveScreen", {
      isLive: true,
      host,
      liveTitle: "Live Streaming",
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.cameraPlaceholder}>
        <Text style={styles.placeholderText}>📹</Text>
        <Text style={styles.placeholderSubtext}>Kamera akan aktif saat siaran dimulai</Text>
      </View>

      <TouchableOpacity
        style={styles.closeButton}
        onPress={() => {
          navigation.goBack();
        }}
      >
        <Ionicons name="close" size={28} color="#fff" />
      </TouchableOpacity>

      <View style={styles.headerBox}>
        <Image source={{ uri: host.avatar }} style={styles.avatar} />
        <View style={{ flex: 1 }}>
          <Text style={styles.askText}>kamu ingin siaran langsung apa ya ?</Text>
          <Text style={styles.subText}>undang teman masuk untuk ramaikan</Text>
        </View>
        <View style={styles.shareIcons}>
          <Feather name="twitter" size={20} color="#fff" style={{ marginRight: 10 }} />
          <Feather name="facebook" size={20} color="#fff" />
        </View>
      </View>

      <TouchableOpacity onPress={beginLive} activeOpacity={0.85} style={styles.startButtonWrapper}>
        <LinearGradient colors={["#A8E063", "#56AB2F"]} style={styles.startButton}>
          <Text style={styles.startText}>mulai siaran langsung</Text>
        </LinearGradient>
      </TouchableOpacity>

      <View style={styles.toolsRow}>
        <TouchableOpacity
          style={styles.toolItem}
          onPress={() => {
            console.log("Beauty settings akan aktif saat siaran");
          }}
        >
          <Ionicons name="color-wand-outline" size={26} color="#fff" />
          <Text style={styles.toolText}>Beauty</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.toolItem}
          onPress={() => {
            setIsFrontCamera(!isFrontCamera);
          }}
        >
          <Ionicons name="camera-reverse-outline" size={26} color="#fff" />
          <Text style={styles.toolText}>Reverse</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  cameraPlaceholder: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#1a1a1a",
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    fontSize: 60,
    marginBottom: 10,
  },
  placeholderSubtext: {
    color: "#666",
    fontSize: 14,
  },
  closeButton: {
    position: "absolute",
    top: 40,
    right: 20,
    zIndex: 10,
  },
  headerBox: {
    position: "absolute",
    top: 60,
    left: 20,
    right: 20,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
    padding: 15,
    borderRadius: 15,
    zIndex: 5,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 12,
    marginRight: 12,
  },
  askText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },
  subText: {
    color: "#ccc",
    fontSize: 13,
    marginTop: 4,
  },
  shareIcons: {
    flexDirection: "row",
    alignItems: "center",
  },
  startButtonWrapper: {
    position: "absolute",
    bottom: 120,
    left: 35,
    right: 35,
    zIndex: 5,
  },
  startButton: {
    width: "100%",
    borderRadius: 30,
    paddingVertical: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  startText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  toolsRow: {
    position: "absolute",
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 80,
    zIndex: 5,
  },
  toolItem: {
    alignItems: "center",
  },
  toolText: {
    color: "#fff",
    fontSize: 13,
    marginTop: 8,
    fontWeight: "600",
  },
});
