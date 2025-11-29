import React, { useRef, useEffect, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  Animated,
  Easing,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import LottieView from "lottie-react-native";

/* ================================ */
/* CONFIG SIZE                      */
/* ================================ */
const AVATAR_SIZE = 62;       // ✅ dikurangi agar 5 avatar muat rapi
const FRAME_SIZE = 90;        // ✅ pas dengan avatar
const BADGE_W = 52;
const BADGE_H = 22;
const BADGE_TOP = AVATAR_SIZE - 10; // ✅ badge pas di bawah avatar

const AVATAR_FRAME = require("../../../assets/av_frame/lottie/Avatar_frame.json");

/* ================================ */
/* BADGE SELECTOR 1–10 (image)      */
/* ================================ */
const getLevelBadgeImage = (score) => {
  if (score <= 10) return require("../../../assets/level/lv_1.png");
  if (score <= 20) return require("../../../assets/level/lv_2.png");
  if (score <= 30) return require("../../../assets/level/lv_3.png");
  if (score <= 40) return require("../../../assets/level/lv_4.png");
  if (score <= 50) return require("../../../assets/level/lv_5.png");
  if (score <= 60) return require("../../../assets/level/lv_6.png");
  if (score <= 70) return require("../../../assets/level/lv_7.png");
  if (score <= 80) return require("../../../assets/level/lv_8.png");
  if (score <= 90) return require("../../../assets/level/lv_9.png");
  return require("../../../assets/level/lv_10.png");
};

/* ================================ */
/* BADGE GRADIENT 11–100            */
/* ================================ */
const getLevelGradient = (score) => {
  if (score <= 10) return null; // pakai PNG

  if (score <= 25) return ["#3C8DFF", "#FFDD00"]; // biru → kuning
  if (score <= 50) return ["#FFE567", "#FF8AD6"]; // kuning → pink
  if (score <= 70) return ["#FF54A8", "#C40062"]; // pink → pink tua
  return ["#FF2E2E", "#A30000"]; // merah extreme
};

/* ================================ */
/* DUMMY DATA                       */
/* ================================ */
const topLevelUsers = [
  { id: 1, name: "mo", avatar: require("../../../assets/images/avatar1.png"), score: 10 },
  { id: 2, name: "RP", avatar: require("../../../assets/images/avatar2.png"), score: 57 },
  { id: 3, name: "oRLin", avatar: require("../../../assets/images/avatar3.png"), score: 35 },
  { id: 4, name: "SU", avatar: require("../../../assets/images/avatar4.png"), score: 20 },
  { id: 5, name: "Bang_wo", avatar: require("../../../assets/images/avatar5.png"), score: 15 },
];

const topHostUsers = [
  { id: 1, name: "TIFF!", avatar: require("../../../assets/images/avatar6.png"), score: 71 },
  { id: 2, name: "oRLin", avatar: require("../../../assets/images/avatar3.png"), score: 40 },
  { id: 3, name: "celldc", avatar: require("../../../assets/images/avatar7.png"), score: 14 },
  { id: 4, name: "SU", avatar: require("../../../assets/images/avatar4.png"), score: 6 },
  { id: 5, name: "mo", avatar: require("../../../assets/images/avatar1.png"), score: 5 },
];

/* ================================ */
/* USER PODIUM COMPONENT            */
/* ================================ */
const PodiumUser = ({ user }) => {
  /* Avatar pulse animation */
  const pulse = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 1300, easing: Easing.out(Easing.quad), useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0, duration: 1300, easing: Easing.in(Easing.quad), useNativeDriver: true }),
      ])
    ).start();
  }, []);
  const scaleAnim = pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.03] });

  /** Badge style */
  const gradient = getLevelGradient(user.score);
  const badgeImage = getLevelBadgeImage(user.score);

  return (
    <View style={styles.userItem}>

      {/* Frame */}
      <View style={styles.frameWrap}>
        <LottieView
          source={AVATAR_FRAME}
          autoPlay
          loop
          style={{ width: FRAME_SIZE, height: FRAME_SIZE }}
        />
      </View>

      {/* Avatar */}
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <Image source={user.avatar} style={styles.avatar} />
      </Animated.View>

      {/* Badge */}
      <View style={styles.levelBadgeContainer}>
        {badgeImage ? (
          <>
            <Image source={badgeImage} style={styles.levelBadge} resizeMode="contain" />
            <Text style={styles.levelNumber}>{user.score}</Text>
          </>
        ) : (
          <LinearGradient colors={gradient} style={styles.levelBadge}>
            <Text style={styles.levelNumber}>{user.score}</Text>
          </LinearGradient>
        )}
      </View>

      {/* Username */}
      <View style={styles.usernameTag}>
        <Text style={styles.usernameText}>{user.name}</Text>
      </View>

    </View>
  );
};

/* ================================ */
/* MAIN SCREEN                      */
/* ================================ */
export default function LevelScreen() {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

      {/* Header */}
      <View style={styles.headerRow}>
        <TouchableOpacity>
          <Ionicons name="arrow-back-outline" size={26} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Level</Text>
        <TouchableOpacity style={styles.ruleBtn}>
          <Text style={styles.ruleText}>aturan level</Text>
        </TouchableOpacity>
      </View>

      {/* Level User */}
      <LinearGradient colors={["#FEEAA0", "#FFC472", "#FDA892"]} style={styles.card}>
        <View style={styles.cardLeft}>
          <Ionicons name="star" size={30} color="#fff" />
          <View>
            <Text style={styles.cardTitle}>User level 31</Text>
            <Text style={styles.cardSub}>nilai pengalaman 4,119,900 · 19%</Text>
          </View>
        </View>
        <View style={styles.progressBar}>
          <LinearGradient colors={["#fff", "#7FFFD4"]} style={[styles.progressFill, { width: "19%" }]} />
        </View>
      </LinearGradient>

      {/* Level Host */}
      <LinearGradient colors={["#9DEBBE", "#65E4A6", "#45C48A"]} style={styles.card}>
        <View style={styles.cardLeft}>
          <Ionicons name="crown" size={28} color="#fff" />
          <View>
            <Text style={styles.cardTitle}>User host 0</Text>
            <Text style={styles.cardSub}>nilai pengalaman 0 · 0%</Text>
          </View>
        </View>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: "0%" }]} />
        </View>
      </LinearGradient>

      {/* User Level Top5 */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>User Level Top5</Text>
        <TouchableOpacity style={styles.ruleSmallBtn}>
          <Text style={styles.ruleSmallText}>aturan naik papan</Text>
        </TouchableOpacity>
      </View>

      <ImageBackground
        source={require("../../../assets/background/podium-bg.png")}
        style={styles.podiumBackground}
        resizeMode="cover"
      >
        <View style={styles.podiumRow}>
          {topLevelUsers.map((u) => (
            <PodiumUser key={u.id} user={u} />
          ))}
        </View>
      </ImageBackground>

      {/* Host Top5 */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>User Host Top5</Text>
      </View>

      <ImageBackground
        source={require("../../../assets/background/podium-bg.png")}
        style={styles.podiumBackground}
        resizeMode="cover"
      >
        <View style={styles.podiumRow}>
          {topHostUsers.map((u) => (
            <PodiumUser key={u.id} user={u} />
          ))}
        </View>
      </ImageBackground>

    </ScrollView>
  );
}

/* ================================ */
/* STYLES                           */
/* ================================ */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingTop: 50,
    paddingBottom: 10,
  },

  headerText: { fontSize: 20, fontWeight: "700", color: "#333" },

  ruleBtn: {
    backgroundColor: "#48C47B",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
  },

  ruleText: { color: "#fff", fontWeight: "600" },

  card: {
    marginHorizontal: 15,
    marginVertical: 8,
    borderRadius: 16,
    padding: 14,
    elevation: 4,
  },

  cardLeft: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
    marginBottom: 10,
  },

  cardTitle: { color: "#fff", fontSize: 17, fontWeight: "700" },
  cardSub: { color: "#fff", opacity: 0.9, marginTop: 2 },

  progressBar: {
    height: 9,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "rgba(255,255,255,0.3)",
  },
  progressFill: { height: "100%" },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    marginTop: 12,
    alignItems: "center",
  },

  sectionTitle: { fontSize: 18, fontWeight: "700", color: "#222" },

  ruleSmallBtn: {
    backgroundColor: "#47BF69",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },

  ruleSmallText: { color: "#fff", fontSize: 12 },

  podiumBackground: {
    width: "100%",
    height: 230,
    marginTop: 10,
    justifyContent: "center",
  },

  podiumRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 28,   // ✅ kiri & kanan simetris, avatar rapi
    width: "100%",
    alignItems: "flex-start",
  },

  userItem: {
    width: 75,
    alignItems: "center",
    position: "relative",
  },

  frameWrap: {
    position: "absolute",
    top: -14,          // ✅ frame turun & pas
    width: FRAME_SIZE,
    height: FRAME_SIZE,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },

  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    zIndex: 2,
  },

  levelBadgeContainer: {
    position: "absolute",
    top: BADGE_TOP,  // ✅ badge tepat bawah avatar
    width: BADGE_W,
    height: BADGE_H,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 3,
  },

  levelBadge: {
    width: BADGE_W,
    height: BADGE_H,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },

  levelNumber: {
    position: "absolute",
    color: "#fff",
    fontSize: 12,
    fontWeight: "800",
    width: "100%",
    textAlign: "center",
  },

  usernameTag: {
    marginTop: 8,     // ✅ nama lebih turun & rapi
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    backgroundColor: "rgba(0,0,0,0.45)",
  },

  usernameText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 13,
  },
});