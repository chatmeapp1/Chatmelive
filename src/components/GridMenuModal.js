import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  StyleSheet,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const { width } = Dimensions.get("window");

const MENU_ITEMS = [
  { id: "pengaturan", name: "Pengaturan", icon: require("../../assets/icons/pengaturan.png") },
  { id: "bermusik", name: "Bermusik", icon: require("../../assets/icons/bermusik.png") },
  { id: "obrolan_pribadi", name: "Obrolan pribadi", icon: require("../../assets/icons/obrolan_pribadi.png") },
  { id: "umpan_balik", name: "Umpan balik", icon: require("../../assets/icons/umpan_balik.png") },
  { id: "pk", name: "PK", icon: require("../../assets/icons/pk.png") },
  { id: "mode_ruangan", name: "Mode ruangan", icon: require("../../assets/icons/mode_ruangan.png") },
];

export default function GridMenuModal({ visible, onClose, onSelect }) {
  const navigation = useNavigation();
  const [isClosing, setIsClosing] = useState(false);

  if (!visible && !isClosing) return null;

  const handleSelect = (id) => {
    if (isClosing) return; // cegah spam klik
    setIsClosing(true);
    onClose?.();

    // Tunggu 200ms supaya modal benar-benar hilang
    setTimeout(() => {
      setIsClosing(false);
      onSelect?.(id);

      switch (id) {
        case "pengaturan":
          console.log("⚙️ Buka Pengaturan");
          break;
        case "bermusik":
          console.log("🎵 Buka Menu Musik");
          break;
        case "obrolan_pribadi":
          navigation.navigate("ChatList");
          break;
        case "umpan_balik":
          navigation.navigate("Feedback");
          break;
        case "pk":
  onClose?.();
  setTimeout(() => {
    onSelect?.("pk");
  }, 300);
          break;
        case "mode_ruangan":
          console.log("🎭 Mode Ruangan Diubah");
          break;
        default:
          break;
      }
    }, 200);
  };

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View style={styles.overlay} pointerEvents="box-none">
        {/* klik luar untuk menutup */}
        <TouchableOpacity
          style={styles.bgOverlay}
          activeOpacity={1}
          onPress={() => {
            setIsClosing(true);
            onClose?.();
            setTimeout(() => setIsClosing(false), 250);
          }}
          pointerEvents="auto"
        />

        {/* === Konten modal === */}
        <View style={styles.container}>
          <FlatList
            data={MENU_ITEMS}
            numColumns={3}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.grid}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.item}
                activeOpacity={0.85}
                onPress={() => handleSelect(item.id)}
              >
                <View style={styles.iconWrapper}>
                  <View style={styles.activeGlow} />
                  <Image source={item.icon} style={styles.icon} />
                  <View style={styles.shineLayer} />
                </View>
                <Text style={styles.text}>{item.name}</Text>
              </TouchableOpacity>
            )}
          />

          {/* Tombol Batal */}
          <TouchableOpacity
            style={styles.cancelBtn}
            onPress={() => {
              setIsClosing(true);
              onClose?.();
              setTimeout(() => setIsClosing(false), 250);
            }}
          >
            <Text style={styles.cancelText}>Membatalkan</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

// === Styles ===
const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "flex-end",
  },
  bgOverlay: { flex: 1, zIndex: 0 },
  container: {
    backgroundColor: "rgba(25,25,25,0.96)",
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    paddingTop: 18,
    paddingBottom: 25,
    alignItems: "center",
    borderTopWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
  grid: {
    paddingHorizontal: 10,
    justifyContent: "center",
  },
  item: {
    width: width / 3.3,
    alignItems: "center",
    marginVertical: 12,
  },

  // === Icon Glow Bulat ===
  iconWrapper: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "rgba(255,255,255,0.1)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 0.5,
    borderColor: "rgba(255,255,255,0.15)",
    overflow: "hidden",
    elevation: 6,
    position: "relative",
  },
  activeGlow: {
    position: "absolute",
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(138,43,226,0.18)",
    top: -15,
    left: -15,
    zIndex: -2,
  },
  icon: {
    width: 70,
    height: 70,
    borderRadius: 35,
    resizeMode: "cover",
  },
  shineLayer: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    borderRadius: 35,
    backgroundColor: "rgba(255,255,255,0.2)",
    opacity: 0.25,
  },

  text: {
    color: "#fff",
    fontSize: 13,
    textAlign: "center",
    marginTop: 6,
    fontWeight: "500",
  },

  cancelBtn: {
    marginTop: 5,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 10,
    width: width * 0.9,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  cancelText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
});