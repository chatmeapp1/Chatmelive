import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  FlatList,
  Modal,
  StyleSheet,
  Dimensions,
  BackHandler,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import api from "../utils/api";
import socketService from "../utils/socket";

const { width, height } = Dimensions.get("window");

export default function PKModal({ visible, onClose, currentHost, roomId }) {
  const navigation = useNavigation();
  const [search, setSearch] = useState("");
  const [showRules, setShowRules] = useState(false);
  const [hosts, setHosts] = useState([]);
  const [loading, setLoading] = useState(false);

  // === Tutup saat tombol back ditekan ===
  useEffect(() => {
    const backAction = () => {
      if (showRules) {
        setShowRules(false);
        return true;
      } else if (visible) {
        onClose?.();
        return true;
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );
    return () => backHandler.remove();
  }, [visible, showRules]);

  // === Fetch available hosts for PK ===
  useEffect(() => {
    if (visible) {
      fetchAvailableHosts();
    }
  }, [visible]);

  const fetchAvailableHosts = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/pk/available-hosts/${currentHost?.id}`);
      if (response.data.success) {
        setHosts(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching available hosts:", error);
      // Fallback to dummy data if API fails
      setHosts([
        { id: 2, name: "S✿DAgency✿", level: 14, avatar_url: "https://picsum.photos/id/1011/100" },
        { id: 3, name: "S♚Ador", level: 20, avatar_url: "https://picsum.photos/id/1027/100" },
        { id: 4, name: "king+boss", level: 18, avatar_url: "https://picsum.photos/id/1025/100" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const filteredHosts = hosts.filter((h) =>
    h.name.toLowerCase().includes(search.toLowerCase())
  );

  const handlePKInvite = async (opponent) => {
    try {
      // Start PK battle via API
      const response = await api.post("/pk/start", {
        hostId: currentHost?.id,
        opponentId: opponent?.id,
        roomId: roomId,
      });

      if (response.data.success) {
        const battleId = response.data.data.id;
        
        // Emit socket event
        socketService.emit("pk:start", {
          roomId,
          battleId,
          hostLeft: currentHost,
          hostRight: opponent,
        });

        // Close modal and navigate
        onClose();
        navigation.navigate("PKBattleScreen", {
          hostLeft: currentHost,
          hostRight: opponent,
          roomId: roomId,
          battleId: battleId,
          isHost: true,
        });
      }
    } catch (error) {
      console.error("Error starting PK:", error);
      alert("Gagal memulai PK. Coba lagi.");
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      {/* LAYER HITAM TRANSPARAN */}
      <View style={styles.overlay}>
        {/* Area luar (tap untuk menutup) */}
        <TouchableOpacity
          style={styles.bgOverlay}
          activeOpacity={1}
          onPress={onClose}
        />

        {/* === KONTEN MODAL === */}
        <View style={styles.modalContainer}>
          {/* HEADER */}
          <View style={styles.header}>
            <Text style={styles.pkTitle}>
              <Text style={{ color: "#ff4040" }}>P</Text>
              <Text style={{ color: "#3da8ff" }}>K</Text>
            </Text>

            <TouchableOpacity
              onPress={() => setShowRules(true)}
              style={styles.rulesBtn}
            >
              <Text style={styles.rulesText}>Aturan</Text>
            </TouchableOpacity>
          </View>

          {/* Tombol Acak & Teman */}
          <View style={styles.pkButtonsRow}>
            <TouchableOpacity activeOpacity={0.9} style={styles.glassButton}>
              <LinearGradient
                colors={["rgba(255,100,100,0.8)", "rgba(255,60,60,0.4)"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.glassGradient}
              >
                <Ionicons name="dice" size={22} color="#fff" />
                <Text style={styles.pkBtnText}>Acak</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity activeOpacity={0.9} style={styles.glassButton}>
              <LinearGradient
                colors={["rgba(90,160,255,0.85)", "rgba(50,120,255,0.4)"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.glassGradient}
              >
                <Ionicons name="people" size={22} color="#fff" />
                <Text style={styles.pkBtnText}>Teman</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          <Text style={styles.subTitle}>Coba PK dengan mereka</Text>

          {/* Kolom Pencarian */}
          <View style={styles.searchBox}>
            <Ionicons name="search" size={20} color="#aaa" />
            <TextInput
              placeholder="Cari ID pengguna"
              placeholderTextColor="#999"
              style={styles.input}
              value={search}
              onChangeText={setSearch}
            />
          </View>

          {/* Loading Indicator */}
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#a46bff" />
              <Text style={styles.loadingText}>Mencari host...</Text>
            </View>
          ) : (
            <>
              {/* Empty State */}
              {filteredHosts.length === 0 ? (
                <View style={styles.emptyContainer}>
                  <Ionicons name="search-outline" size={60} color="#666" />
                  <Text style={styles.emptyText}>Tidak ada host tersedia</Text>
                  <Text style={styles.emptySubText}>Coba lagi nanti</Text>
                </View>
              ) : (
                /* Daftar Host */
                <FlatList
                  data={filteredHosts}
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={({ item }) => (
                    <View style={styles.hostRow}>
                      <View style={styles.hostInfo}>
                        <Image 
                          source={{ uri: item.avatar_url || item.avatar || "https://picsum.photos/100" }} 
                          style={styles.avatar} 
                        />
                        <View>
                          <Text style={styles.hostName}>{item.name}</Text>
                          <Text style={styles.hostLevel}>Lv {item.level || 1}</Text>
                        </View>
                      </View>

                      <TouchableOpacity
                        activeOpacity={0.85}
                        onPress={() => handlePKInvite(item)}
                      >
                        <LinearGradient
                          colors={["#a46bff", "#8a9eff", "#63ffd6"]}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 1 }}
                          style={styles.pkInviteBtn}
                        >
                          <Text style={styles.pkInviteText}>PK</Text>
                        </LinearGradient>
                      </TouchableOpacity>
                    </View>
                  )}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={{ paddingBottom: 40 }}
                />
              )}
            </>
          )}
        </View>
      </View>

      {/* === MODAL ATURAN === */}
      {showRules && (
        <Modal
          visible={showRules}
          transparent
          animationType="fade"
          onRequestClose={() => setShowRules(false)}
        >
          <View style={styles.rulesOverlay}>
            <View style={styles.rulesBox}>
              <Text style={styles.rulesTitle}>Aturan PK</Text>
              <Text style={styles.rulesTextBlock}>
                1. Gameplay PK sepanjang hari, dan duel PK yang intens dengan
                anchor semua platform.
              </Text>
              <Text style={styles.rulesTextBlock}>
                2. Klik untuk memulai PK, sistem akan mencocokkan lawan yang
                mendekati kekuatan Anda.
              </Text>
              <Text style={styles.rulesTextBlock}>
                3. 1 Berlian = nilai 1 PK. Setelah 6 menit PK, nilai tertinggi
                menang.
              </Text>
              <Text style={styles.rulesTextBlock}>
                4. Harap tetap buka jaringan selama PK. Penundaan bisa
                mengurangi nilai PK.
              </Text>
              <Text style={styles.rulesTextBlock}>
                5. Keluar atau menyerah akan dianggap kalah otomatis.
              </Text>

              <TouchableOpacity
                onPress={() => setShowRules(false)}
                style={styles.closeBtn}
              >
                <Ionicons name="close" size={22} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </Modal>
  );
}

// === STYLES ===
const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.55)",
  },
  bgOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  modalContainer: {
    backgroundColor: "rgba(20,20,20,0.97)",
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    paddingHorizontal: 18,
    paddingTop: 15,
    paddingBottom: 10,
    height: height * 0.65,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    marginBottom: 12,
  },
  pkTitle: {
    fontSize: 30,
    fontWeight: "bold",
    letterSpacing: 1,
  },
  rulesBtn: {
    position: "absolute",
    right: 15,
  },
  rulesText: {
    color: "#fff",
    fontWeight: "600",
    backgroundColor: "rgba(255,255,255,0.15)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    fontSize: 13,
  },
  pkButtonsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 15,
    marginBottom: 12,
  },

  // 🌈 Tombol baru elegan glassy
  glassButton: {
    flex: 1,
    marginHorizontal: 6,
    borderRadius: 14,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 4,
  },
  glassGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    backgroundColor: "rgba(255,255,255,0.05)",
  },

  pkBtnText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
    marginLeft: 6,
  },
  subTitle: {
    color: "#fff",
    fontSize: 14,
    opacity: 0.8,
    marginVertical: 6,
    marginLeft: 4,
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 12,
    height: 40,
  },
  input: {
    flex: 1,
    color: "#fff",
    marginLeft: 8,
    fontSize: 14,
  },
  hostRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderColor: "rgba(255,255,255,0.07)",
  },
  hostInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 10,
  },
  hostName: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
  hostLevel: {
    color: "#ccc",
    fontSize: 12,
  },
  pkInviteBtn: {
    paddingHorizontal: 20,
    paddingVertical: 6,
    borderRadius: 20,
  },
  pkInviteText: {
    color: "#fff",
    fontWeight: "700",
  },
  rulesOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  rulesBox: {
    width: width * 0.9,
    backgroundColor: "rgba(25,25,25,0.97)",
    borderRadius: 15,
    padding: 20,
    borderWidth: 0.8,
    borderColor: "rgba(255,255,255,0.08)",
  },
  rulesTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 10,
  },
  rulesTextBlock: {
    color: "#ddd",
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 6,
  },
  closeBtn: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  loadingText: {
    color: "#fff",
    marginTop: 12,
    fontSize: 14,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginTop: 16,
  },
  emptySubText: {
    color: "#999",
    fontSize: 13,
    marginTop: 6,
  },
});