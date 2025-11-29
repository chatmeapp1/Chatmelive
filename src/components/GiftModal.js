// === GIFT MODAL FINAL + USER CHECKLIST + SEND TRIGGER ===
import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  Animated,
  FlatList,
  Image,
  Dimensions,
  Switch,
  ScrollView,
} from "react-native";
import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";
import LottieView from "lottie-react-native";

const { width, height } = Dimensions.get("window");

export default function GiftModal({ visible = false, onClose = () => {}, onSend = () => {}, userCoins = 0 }) {
  const slideY = useRef(new Animated.Value(height)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;

  const [activeTab, setActiveTab] = useState("umum");
  const [sendAll, setSendAll] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedGift, setSelectedGift] = useState(null);
  const [showCountList, setShowCountList] = useState(false);
  const [selectedCount, setSelectedCount] = useState(1);
  const [insufficientCoins, setInsufficientCoins] = useState(false);

  const users = [
    { id: 1, name: "Rina", avatar: "https://picsum.photos/id/1011/100" },
    { id: 2, name: "Tono", avatar: "https://picsum.photos/id/1027/100" },
    { id: 3, name: "Miko", avatar: "https://picsum.photos/id/1025/100" },
  ];

  const umumGifts = [
    { id: "cute", name: "Cute", src: require("../../assets/gift/umum/Cute.png"), price: 50 },
    { id: "diamond", name: "Diamond", src: require("../../assets/gift/umum/Diamond.png"), price: 100 },
    { id: "maxi", name: "Maxi", src: require("../../assets/gift/umum/Maxi.png"), price: 150 },
    { id: "ring", name: "Ring", src: require("../../assets/gift/umum/Ring.png"), price: 200 },
  ];

  const staticGifts = [
    { id: "cupid", name: "Cupid", src: require("../../assets/gift/static/cupid.png"), price: 100 },
    { id: "sweetheart", name: "Sweetheart", src: require("../../assets/gift/static/sweetheart.png"), price: 250 },
    { id: "balon", name: "Balon", src: require("../../assets/gift/static/balon.png"), price: 500 },
  ];

  const luxuryGifts = [
    { id: "burger", name: "Burger", lottie: require("../../assets/gift/lottie/burger.json"), price: 2999 },
    { id: "cake", name: "Cake", lottie: require("../../assets/gift/lottie/Cake.json"), price: 700 },
  ];

  const popularGifts = [
    { id: "heart", name: "Love Star", src: require("../../assets/gift/static/sweetheart.png"), price: 120 },
    { id: "rose", name: "Magic Rose", src: require("../../assets/gift/static/balon.png"), price: 180 },
  ];

  const giftCounts = [1, 3, 9, 99, 199];

  // === Modal Animation ===
  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(backdropOpacity, { toValue: 1, duration: 200, useNativeDriver: true }),
        Animated.timing(slideY, { toValue: 0, duration: 300, useNativeDriver: true }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(backdropOpacity, { toValue: 0, duration: 180, useNativeDriver: true }),
        Animated.timing(slideY, { toValue: height, duration: 260, useNativeDriver: true }),
      ]).start();
    }
  }, [visible]);

  // === Toggle user selection ===
  const toggleUser = (user) => {
    if (sendAll) return;
    setSelectedUsers((prev) =>
      prev.find((u) => u.id === user.id)
        ? prev.filter((u) => u.id !== user.id)
        : [...prev, user]
    );
  };

  // === Toggle send all ===
  const handleSendAll = (value) => {
    setSendAll(value);
    setSelectedUsers(value ? [...users] : []);
  };

  // === Send gift handler ===
  const handleSendGift = () => {
    if (!selectedGift) return;

    const totalCost = selectedGift.price * selectedCount;
    
    // Validate balance
    if (userCoins < totalCost) {
      setInsufficientCoins(true);
      setTimeout(() => setInsufficientCoins(false), 2000);
      return;
    }

    const giftData = {
      gift: selectedGift,
      count: selectedCount,
      sendAll,
      targets: sendAll ? users : selectedUsers,
    };

    onSend(giftData); // kirim ke parent (PartyRoomScreen)
    onClose();
  };

  // === Render user ===
  const renderUser = ({ item }) => {
    const isSelected = sendAll || selectedUsers.find((u) => u.id === item.id);
    return (
      <TouchableOpacity
        style={[styles.userItem, isSelected && styles.userItemSelected]}
        onPress={() => toggleUser(item)}
        activeOpacity={0.8}
      >
        <Image source={{ uri: item.avatar }} style={styles.userAvatar} />
        {isSelected && (
          <View style={styles.checkOverlay}>
            <Ionicons name="checkmark-circle" size={20} color="#A8E6CF" />
          </View>
        )}
        <Text style={styles.userName}>{item.name}</Text>
      </TouchableOpacity>
    );
  };

  // === Render gift item ===
  const renderGift = ({ item, type }) => (
    <TouchableOpacity
      onPress={() => setSelectedGift(item)}
      activeOpacity={0.8}
      style={[styles.giftItem, selectedGift?.id === item.id && styles.giftItemSelected]}
    >
      {type === "lottie" ? (
        <LottieView source={item.lottie} autoPlay loop style={styles.giftAnim} />
      ) : (
        <Image source={item.src} style={styles.giftImage} resizeMode="contain" />
      )}
      <Text style={styles.giftName}>{item.name}</Text>
      <Text style={styles.giftPrice}>{item.price}</Text>
    </TouchableOpacity>
  );

  return (
    <Modal visible={visible} transparent statusBarTranslucent animationType="none">
      {/* Backdrop */}
      <Animated.View style={[styles.backdrop, { opacity: backdropOpacity }]}>
        <TouchableOpacity style={StyleSheet.absoluteFill} onPress={onClose} />
      </Animated.View>

      {/* Modal content */}
      <Animated.View style={[styles.sheet, { transform: [{ translateY: slideY }] }]}>
        <View style={styles.darkOverlay} />
        <BlurView intensity={25} tint="dark" style={StyleSheet.absoluteFill} />

        <View style={styles.content}>
          {/* === USERS ROW === */}
          <View style={styles.userRow}>
            <FlatList
              horizontal
              data={users}
              renderItem={renderUser}
              keyExtractor={(i) => i.id.toString()}
              showsHorizontalScrollIndicator={false}
            />
            <Switch
              value={sendAll}
              onValueChange={handleSendAll}
              thumbColor={sendAll ? "#A8E6CF" : "#555"}
              trackColor={{ true: "#C9F6E5", false: "#333" }}
              style={{ marginLeft: 10 }}
            />
          </View>

          {/* === TAB MENU === */}
          <View style={styles.tabRow}>
            {["umum", "static", "luxury", "popular"].map((tab) => (
              <TouchableOpacity key={tab} onPress={() => setActiveTab(tab)}>
                <Text style={[styles.tabText, activeTab === tab && styles.tabActive]}>
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* === GIFTS LIST === */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {activeTab === "umum" &&
              umumGifts.map((item) => (
                <View key={item.id}>{renderGift({ item, type: "static" })}</View>
              ))}
            {activeTab === "static" &&
              staticGifts.map((item) => (
                <View key={item.id}>{renderGift({ item, type: "static" })}</View>
              ))}
            {activeTab === "luxury" &&
              luxuryGifts.map((item) => (
                <View key={item.id}>{renderGift({ item, type: "lottie" })}</View>
              ))}
            {activeTab === "popular" &&
              popularGifts.map((item) => (
                <View key={item.id}>{renderGift({ item, type: "static" })}</View>
              ))}
          </ScrollView>

          {/* === FOOTER === */}
          <View style={styles.bottomBar}>
            <View style={styles.coinRow}>
              <Ionicons name="logo-usd" size={18} color="#FFDFA6" />
              <Text style={styles.coinText}>1.00</Text>
              <TouchableOpacity>
                <Text style={styles.topUp}>Isi Ulang</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.sendRow}>
              <TouchableOpacity
                style={styles.countBox}
                onPress={() => setShowCountList(!showCountList)}
              >
                <Text style={styles.countText}>{selectedCount}</Text>
              </TouchableOpacity>

              {showCountList && (
                <View style={styles.dropdown}>
                  {giftCounts.map((c) => (
                    <TouchableOpacity
                      key={c}
                      onPress={() => {
                        setSelectedCount(c);
                        setShowCountList(false);
                      }}
                      style={[styles.dropdownItem, selectedCount === c && styles.dropdownSelected]}
                    >
                      <Text style={styles.dropdownText}>{c}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              <TouchableOpacity style={styles.sendButton} onPress={handleSendGift}>
                <Text style={styles.sendLabel}>Kirim</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Animated.View>
    </Modal>
  );
}

// === STYLES ===
const styles = StyleSheet.create({
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.5)" },
  darkOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(20,20,20,0.9)" },
  sheet: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: height * 0.55,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: "hidden",
  },
  content: { flex: 1, paddingHorizontal: 14, paddingTop: 12 },
  userRow: { flexDirection: "row", alignItems: "center", marginBottom: 5 },
  userItem: { alignItems: "center", marginHorizontal: 6, position: "relative" },
  userItemSelected: { transform: [{ scale: 1.05 }] },
  userAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 2,
    borderColor: "#A8E6CF",
  },
  checkOverlay: {
    position: "absolute",
    top: -2,
    right: -2,
    backgroundColor: "rgba(0,0,0,0.3)",
    borderRadius: 12,
  },
  userName: { color: "#fff", fontSize: 11, marginTop: 2 },
  tabRow: { flexDirection: "row", justifyContent: "space-around", marginVertical: 6 },
  tabText: { color: "#aaa", fontSize: 14, fontWeight: "600" },
  tabActive: {
    color: "#fff",
    borderBottomWidth: 2,
    borderColor: "#A8E6CF",
    paddingBottom: 3,
  },
  giftItem: {
    width: width / 5,
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.05)",
    paddingVertical: 6,
    marginHorizontal: 5,
    borderRadius: 10,
  },
  giftItemSelected: {
    borderWidth: 2,
    borderColor: "#A8E6CF",
    shadowColor: "#A8E6CF",
    shadowOpacity: 0.6,
    shadowRadius: 8,
  },
  giftImage: { width: 45, height: 45, marginBottom: 3 },
  giftAnim: { width: 45, height: 45, marginBottom: 3 },
  giftName: { color: "#fff", fontSize: 11 },
  giftPrice: { color: "#FFDFA6", fontSize: 10, marginVertical: 2 },
  bottomBar: { marginTop: "auto", flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  coinRow: { flexDirection: "row", alignItems: "center" },
  coinText: { color: "#fff", marginLeft: 4 },
  topUp: { color: "#A8E6CF", marginLeft: 6, fontWeight: "600" },
  sendRow: { flexDirection: "row", alignItems: "center", position: "relative" },
  countBox: {
    backgroundColor: "rgba(255,255,255,0.1)",
    borderWidth: 1,
    borderColor: "#A8E6CF",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 8,
  },
  countText: { color: "#fff", fontWeight: "600" },
  dropdown: {
    position: "absolute",
    bottom: 45,
    left: 0,
    backgroundColor: "rgba(0,0,0,0.85)",
    borderRadius: 8,
    paddingVertical: 5,
  },
  dropdownItem: { paddingHorizontal: 14, paddingVertical: 6 },
  dropdownSelected: { backgroundColor: "rgba(168,230,207,0.2)" },
  dropdownText: { color: "#fff", fontSize: 13 },
  sendButton: {
    backgroundColor: "#A8E6CF",
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
  },
  sendLabel: { color: "#333", fontWeight: "700", fontSize: 13 },
  sendBtnDisabled: { opacity: 0.5 },
  errorText: { color: "#FF6B6B", fontSize: 12, fontWeight: "600", marginBottom: 8, textAlign: "center" },
});