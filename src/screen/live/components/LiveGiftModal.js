// src/screen/live/components/LiveGiftModal.js
import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Image,
  Dimensions,
  ScrollView,
} from "react-native";
import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";
import LottieView from "lottie-react-native";
import JPWinAnimation from "./JPWinAnimation";

const { width, height } = Dimensions.get("window");

export default function LiveGiftModal({
  visible = false,
  onClose = () => {},
  onSend = () => {},
  onBigGift = () => {},
  onComboChange = () => {},
  onJPResult = () => {},
  userCoins = 0,
}) {
  const slideY = useRef(new Animated.Value(height)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;

  const [activeTab, setActiveTab] = useState("s-lucky");
  const [selectedGift, setSelectedGift] = useState(null);

  // =====================================
  // ⭐ COMBO POPUP ANIMATION
  // =====================================
  const comboAnimOpacity = useRef(new Animated.Value(0)).current;
  const comboAnimTranslate = useRef(new Animated.Value(20)).current;
  const [comboVisible, setComboVisible] = useState(false);

  const [giftCount, setGiftCount] = useState(1);
  const [jpResult, setJpResult] = useState(null);
  const [insufficientCoins, setInsufficientCoins] = useState(false);

  const openComboAnimation = () => {
    setComboVisible(true);
    Animated.parallel([
      Animated.timing(comboAnimOpacity, { toValue: 1, duration: 160, useNativeDriver: true }),
      Animated.timing(comboAnimTranslate, { toValue: 0, duration: 160, useNativeDriver: true }),
    ]).start();
  };

  const closeComboAnimation = () => {
    Animated.parallel([
      Animated.timing(comboAnimOpacity, { toValue: 0, duration: 160, useNativeDriver: true }),
      Animated.timing(comboAnimTranslate, { toValue: 20, duration: 160, useNativeDriver: true }),
    ]).start(() => setComboVisible(false));
  };

  const toggleCombo = () => {
    if (comboVisible) closeComboAnimation();
    else openComboAnimation();
  };

  // =====================================
  // BOTTOM SHEET ANIMATION
  // =====================================
  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(backdropOpacity, { toValue: 1, duration: 200, useNativeDriver: true }),
        Animated.timing(slideY, { toValue: 0, duration: 300, useNativeDriver: true }),
      ]).start();
    } else {
      closeComboAnimation();
      Animated.parallel([
        Animated.timing(backdropOpacity, { toValue: 0, duration: 180, useNativeDriver: true }),
        Animated.timing(slideY, { toValue: height, duration: 260, useNativeDriver: true }),
      ]).start();
    }
  }, [visible]);

  // =====================================
  // GIFT DATA
  // =====================================
  const sLuckyGifts = [
    { id: "cute", name: "Labu", src: require("../../../../assets/gift/umum/Cute.png"), price: 100, category: "s-lucky", hostShare: 0.1 },
    { id: "diamond", name: "Milk tea", src: require("../../../../assets/gift/umum/Diamond.png"), price: 100, category: "s-lucky", hostShare: 0.1 },
    { id: "maxi", name: "Beach", src: require("../../../../assets/gift/umum/Maxi.png"), price: 250, category: "s-lucky", hostShare: 0.1 },
    { id: "ring", name: "Yellow Duck", src: require("../../../../assets/gift/umum/Ring.png"), price: 500, category: "s-lucky", hostShare: 0.1 },
  ];

  const luckyGifts = [
    { id: "cupid", name: "Carousel", src: require("../../../../assets/gift/static/cupid.png"), price: 100, category: "lucky", hostShare: 0.1 },
    { id: "sweetheart", name: "Vacation", src: require("../../../../assets/gift/static/sweetheart.png"), price: 200, category: "lucky", hostShare: 0.1 },
    { id: "balon", name: "Unicorn", src: require("../../../../assets/gift/static/balon.png"), price: 300, category: "lucky", hostShare: 0.1 },
  ];

  const luxuryGifts = [
    { id: "burger", name: "Burger", lottie: require("../../../../assets/gift/lottie/burger.json"), price: 2999, category: "luxury", hostShare: 0.5 },
    { id: "cake", name: "Cake", lottie: require("../../../../assets/gift/lottie/Cake.json"), price: 5000, category: "luxury", hostShare: 0.5 },
  ];

  const getCurrentGifts = () => {
    switch (activeTab) {
      case "lucky": return luckyGifts;
      case "luxury": return luxuryGifts;
      default: return sLuckyGifts;
    }
  };

  const getGiftType = () => (activeTab === "luxury" ? "lottie" : "static");

  // =====================================
  // SEND GIFT
  // =====================================
  const handleSendGift = () => {
    if (!selectedGift) return;

    const totalCost = selectedGift.price * giftCount;

    // ❌ VALIDATE BALANCE
    if (userCoins < totalCost) {
      setInsufficientCoins(true);
      setTimeout(() => setInsufficientCoins(false), 2000);
      return;
    }

    try {
      const data = { ...selectedGift, count: giftCount };
      onSend(data);

      // Only trigger big gift effect for luxury category
      if (selectedGift.category === "luxury" && selectedGift.lottie && onBigGift) {
        onBigGift({ ...selectedGift, count: giftCount, duration: 4000 });
      }

      closeComboAnimation();
      onClose();
      setGiftCount(1);
      setSelectedGift(null);
    } catch (error) {
      console.error("❌ Error sending gift:", error);
      setInsufficientCoins(true);
      setTimeout(() => setInsufficientCoins(false), 2000);
    }
  };

  // =====================================
  // UI
  // =====================================
  return (
    <Modal visible={visible} transparent animationType="none" statusBarTranslucent>
      <Animated.View style={[styles.backdrop, { opacity: backdropOpacity }]}>
        <TouchableOpacity style={StyleSheet.absoluteFill} onPress={onClose} />
      </Animated.View>

      <Animated.View style={[styles.sheet, { transform: [{ translateY: slideY }] }]}>
        <View style={styles.darkOverlay} />
        <BlurView intensity={25} tint="dark" style={StyleSheet.absoluteFill} />

        <View style={styles.content}>

          {/* HEADER */}
          <View style={styles.headerRow}>
            <Text style={styles.username}>Gift</Text>
            <TouchableOpacity onPress={onClose}><Ionicons name="close" size={24} color="#fff" /></TouchableOpacity>
          </View>

          {/* TAB */}
          <View style={styles.tabRow}>
            <TouchableOpacity onPress={() => setActiveTab("s-lucky")}><Text style={[styles.tabText, activeTab === "s-lucky" && styles.tabActive]}>S-Lucky</Text></TouchableOpacity>
            <TouchableOpacity onPress={() => setActiveTab("lucky")}><Text style={[styles.tabText, activeTab === "lucky" && styles.tabActive]}>Lucky</Text></TouchableOpacity>
            <TouchableOpacity onPress={() => setActiveTab("luxury")}><Text style={[styles.tabText, activeTab === "luxury" && styles.tabActive]}>Luxury</Text></TouchableOpacity>
          </View>

          {/* GRID */}
          <ScrollView showsVerticalScrollIndicator={false} style={styles.giftScroll}>
            <View style={styles.giftGrid}>
              {getCurrentGifts().map((item) => (
                <TouchableOpacity
                  key={item.id}
                  onPress={() => setSelectedGift(item)}
                  style={[styles.giftItem, selectedGift?.id === item.id && styles.giftItemSelected]}
                >
                  {item.lottie
                    ? <LottieView source={item.lottie} autoPlay loop style={styles.giftAnim} />
                    : <Image source={item.src} style={styles.giftImage} resizeMode="contain" />
                  }

                  <Text style={styles.giftPrice}>{item.price} U</Text>
                  <Text style={styles.giftName}>{item.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          {/* ERROR MESSAGE */}
          {insufficientCoins && (
            <Text style={styles.errorText}>❌ Coin tidak cukup!</Text>
          )}

          {/* FOOTER */}
          <View style={styles.footer}>
            <View style={styles.coinRow}>
              <Ionicons name="diamond" size={18} color="#FFD700" />
              <Text style={styles.coinText}>{userCoins}</Text>
              <TouchableOpacity><Text style={styles.topUp}>Topup {'>'}</Text></TouchableOpacity>
            </View>

            <View style={styles.sendRow}>
              {/* COMBO BUTTON */}
              <TouchableOpacity style={styles.comboButton} onPress={toggleCombo}>
                <Text style={styles.comboText}>{giftCount}</Text>
                <Ionicons name={comboVisible ? "chevron-down" : "chevron-up"} size={16} color="#fff" />
              </TouchableOpacity>

              {/* SEND */}
              <TouchableOpacity
                style={[styles.sendButton, (!selectedGift || userCoins < (selectedGift?.price * giftCount || 0)) && styles.sendButtonDisabled]}
                onPress={handleSendGift}
                disabled={!selectedGift || userCoins < (selectedGift?.price * giftCount || 0)}
              >
                <Text style={styles.sendLabel}>Kirim {selectedGift ? `(${selectedGift.price * giftCount})` : ""}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* ⭐ JP WIN ANIMATION */}
        <JPWinAnimation
          jpResult={jpResult}
          onAnimationEnd={() => {
            setJpResult(null);
            closeComboAnimation();
            onClose();
            setGiftCount(1);
            setSelectedGift(null);
            if (onJPResult) onJPResult(null);
          }}
        />

        {/* ===================================== */}
        {/* ⭐ POPUP COMBO (1,3,9,19,66,199) */}
        {/* ===================================== */}
        {comboVisible && (
          <Animated.View
            style={[
              styles.comboPopup,
              {
                opacity: comboAnimOpacity,
                transform: [{ translateY: comboAnimTranslate }],
              },
            ]}
          >
            <ScrollView style={{ maxHeight: 200 }} showsVerticalScrollIndicator={false}>
              {[1, 3, 9, 19, 66, 199].map((num) => (
                <TouchableOpacity
                  key={num}
                  style={styles.comboItem}
                  onPress={() => {
                    setGiftCount(num);
                    onComboChange(num);
                    closeComboAnimation();
                  }}
                >
                  <Text style={styles.comboItemText}>x{num}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </Animated.View>
        )}
      </Animated.View>
    </Modal>
  );
}

// ======================================================
// STYLES
// ======================================================
const styles = StyleSheet.create({
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.7)" },

  sheet: {
    position: "absolute",
    left: 0, right: 0, bottom: 0,
    height: height * 0.65,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: "hidden",
  },

  darkOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(10,10,10,0.95)" },

  content: { flex: 1, paddingHorizontal: 16, paddingTop: 16 },

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },

  username: { color: "#fff", fontSize: 16, fontWeight: "600" },

  tabRow: {
    flexDirection: "row",
    gap: 24,
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.1)",
    paddingBottom: 8,
  },

  tabText: { color: "#888", fontSize: 14, fontWeight: "600" },
  tabActive: { color: "#4CAF50", borderBottomWidth: 2, borderBottomColor: "#4CAF50" },

  giftScroll: { flex: 1, marginBottom: 12 },

  giftGrid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },

  giftItem: {
    width: "23%",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.05)",
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "transparent",
    marginBottom: 12,
  },

  giftItemSelected: {
    borderColor: "#4CAF50",
    backgroundColor: "rgba(76,175,80,0.15)",
  },

  giftImage: { width: 50, height: 50, marginBottom: 6 },
  giftAnim: { width: 50, height: 50, marginBottom: 6 },

  giftPrice: { color: "#FFD700", fontSize: 11, fontWeight: "700" },
  giftName: { color: "#fff", fontSize: 10, marginTop: 2 },

  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.1)",
  },

  coinRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  coinText: { color: "#FFD700", fontSize: 14, fontWeight: "600" },
  topUp: { color: "#4CAF50", fontWeight: "600" },

  sendRow: { flexDirection: "row", gap: 10, alignItems: "center" },

  sendButton: {
    backgroundColor: "#4CAF50",
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 20,
  },

  sendButtonDisabled: { backgroundColor: "#555" },
  sendLabel: { color: "#fff", fontWeight: "700", fontSize: 14 },
  errorText: { color: "#FF6B6B", fontSize: 12, fontWeight: "600", marginBottom: 8, textAlign: "center" },

  comboButton: {
    backgroundColor: "#333",
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },

  comboText: { color: "#fff", fontSize: 14, fontWeight: "700" },

  // ⭐ POPUP COMBO STYLE BARU
  comboPopup: {
    position: "absolute",
    bottom: 80,          // tepat di atas tombol combo
    right: 20,           // dekat tombol "Kirim"
    width: 110,
    backgroundColor: "rgba(0,0,0,0.85)",
    borderRadius: 14,
    paddingVertical: 10,
    borderWidth: 2,
    borderColor: "#D57FFF",    // ungu pastel
    zIndex: 9999,
    elevation: 15,
  },

  comboItem: {
    paddingVertical: 12,
    justifyContent: "center",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.12)",
  },

  comboItemText: {
    fontSize: 18,
    fontWeight: "800",
    color: "#A6FFCB",     // hijau pastel
  },
});