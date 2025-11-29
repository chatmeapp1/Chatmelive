
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  ActivityIndicator,
  Modal,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useLive } from "../../context/LiveContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../../utils/api";
import Config from "../../utils/config";

export default function StartLiveScreen() {
  const navigation = useNavigation();
  const { startLive } = useLive();

  const [host, setHost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFrontCamera, setIsFrontCamera] = useState(true);
  const [liveTitle, setLiveTitle] = useState("");
  const [showModeModal, setShowModeModal] = useState(false);

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("token");
      
      if (token) {
        console.log("🔑 Token found, fetching profile...");
        const response = await api.get("/auth/profile");
        
        if (response.data.success) {
          const userData = response.data.data;
          const avatarUrl = userData.avatar_url 
            ? `${Config.API_BASE_URL}${userData.avatar_url}`
            : "https://picsum.photos/id/1005/100";

          setHost({
            id: userData.id,
            name: userData.name,
            avatar: avatarUrl,
            level: userData.level || 1,
            vip: userData.vipLevel || 0,
          });
          console.log("✅ Host profile loaded successfully");
        } else {
          console.warn("⚠️ Profile API returned unsuccessful response despite valid token");
          setHost({
            id: 1,
            name: "Guest User",
            avatar: "https://picsum.photos/id/1005/100",
            level: 1,
            vip: 0,
          });
        }
      } else {
        console.log("ℹ️ No token found, using guest profile");
        setHost({
          id: 1,
          name: "Guest User",
          avatar: "https://picsum.photos/id/1005/100",
          level: 1,
          vip: 0,
        });
      }
    } catch (error) {
      console.warn("⚠️ Could not load profile, using fallback:", error.message);
      setHost({
        id: 1,
        name: "Guest User",
        avatar: "https://picsum.photos/id/1005/100",
        level: 1,
        vip: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleModeSelection = (mode) => {
    setShowModeModal(false);
    
    if (mode === "audio_party") {
      // Navigate to Party Screen
      navigation.navigate("MainTabs", { screen: "party" });
    } else if (mode === "solo_live") {
      // Start solo live
      beginSoloLive();
    }
  };

  const beginSoloLive = () => {
    if (!host) return;

    const title = liveTitle.trim() || "Live Streaming";
    
    startLive({
      id: host.id,
      name: host.name,
      image: host.avatar,
      viewers: 0,
      title: title,
    });

    navigation.navigate("HostLiveScreen", {
      isLive: true,
      host: {
        ...host,
        image: host.avatar,
      },
      liveTitle: title,
    });
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color="#56AB2F" />
        <Text style={{ color: "#fff", marginTop: 10 }}>Memuat profil...</Text>
      </View>
    );
  }

  if (!host) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <Text style={{ color: "#fff", fontSize: 16, marginBottom: 20 }}>Gagal memuat profil</Text>
        <TouchableOpacity 
          onPress={() => loadUserProfile()} 
          style={styles.retryButton}
        >
          <Text style={{ color: "#fff", fontWeight: "600" }}>Coba Lagi</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={() => navigation.goBack()} 
          style={{ marginTop: 15 }}
        >
          <Text style={{ color: "#56AB2F" }}>Kembali</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.cameraPlaceholder}>
        <Text style={styles.placeholderText}>📹</Text>
        <Text style={styles.placeholderSubtext}>Kamera akan aktif saat siaran dimulai</Text>
      </View>

      <TouchableOpacity
        style={styles.closeButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="close" size={28} color="#fff" />
      </TouchableOpacity>

      <View style={styles.headerBox}>
        <Image source={{ uri: host.avatar }} style={styles.avatar} />
        <View style={{ flex: 1 }}>
          <Text style={styles.askText}>kamu ingin siaran langsung apa ya ?</Text>
          <TextInput
            style={styles.titleInput}
            placeholder="Tulis judul siaran kamu..."
            placeholderTextColor="#999"
            value={liveTitle}
            onChangeText={setLiveTitle}
            maxLength={50}
          />
        </View>
        <View style={styles.shareIcons}>
          <Feather name="twitter" size={20} color="#fff" style={{ marginRight: 10 }} />
          <Feather name="facebook" size={20} color="#fff" />
        </View>
      </View>

      <TouchableOpacity 
        onPress={() => setShowModeModal(true)} 
        activeOpacity={0.85} 
        style={styles.startButtonWrapper}
      >
        <LinearGradient colors={["#A8E063", "#56AB2F"]} style={styles.startButton}>
          <Text style={styles.startText}>Pilih Mode Siaran</Text>
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

      {/* Mode Selection Modal */}
      <Modal
        visible={showModeModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowModeModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Pilih Mode Siaran</Text>
            
            <TouchableOpacity
              style={styles.modeOption}
              onPress={() => handleModeSelection("solo_live")}
              activeOpacity={0.7}
            >
              <LinearGradient
                colors={["#FF6B6B", "#FF8E53"]}
                style={styles.modeGradient}
              >
                <Ionicons name="videocam" size={40} color="#fff" />
                <View style={styles.modeTextContainer}>
                  <Text style={styles.modeTitle}>Solo Live</Text>
                  <Text style={styles.modeDescription}>Siaran langsung video</Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modeOption}
              onPress={() => handleModeSelection("audio_party")}
              activeOpacity={0.7}
            >
              <LinearGradient
                colors={["#4FACFE", "#00F2FE"]}
                style={styles.modeGradient}
              >
                <MaterialCommunityIcons name="microphone-variant" size={40} color="#fff" />
                <View style={styles.modeTextContainer}>
                  <Text style={styles.modeTitle}>Audio Party</Text>
                  <Text style={styles.modeDescription}>Siaran party audio</Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setShowModeModal(false)}
            >
              <Text style={styles.cancelText}>Batal</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  titleInput: {
    backgroundColor: "rgba(255,255,255,0.15)",
    color: "#fff",
    fontSize: 14,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginTop: 8,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
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
  retryButton: {
    backgroundColor: "#56AB2F",
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#1a1a1a",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    padding: 20,
    paddingBottom: 40,
  },
  modalTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 25,
  },
  modeOption: {
    marginBottom: 15,
    borderRadius: 15,
    overflow: "hidden",
  },
  modeGradient: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    borderRadius: 15,
  },
  modeTextContainer: {
    marginLeft: 20,
    flex: 1,
  },
  modeTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 4,
  },
  modeDescription: {
    color: "#fff",
    fontSize: 14,
    opacity: 0.9,
  },
  cancelButton: {
    marginTop: 10,
    padding: 15,
    alignItems: "center",
  },
  cancelText: {
    color: "#999",
    fontSize: 16,
    fontWeight: "600",
  },
});
