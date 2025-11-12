import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import Svg, { Defs, LinearGradient, Stop, Polygon, Path } from "react-native-svg";

const { width } = Dimensions.get("window");

/* ✅ Gradient warna level */
const getLevelGradient = (level) => {
  if (level <= 10) return ["#FF8BC9", "#FF5FB8"];
  if (level <= 20) return ["#7ED7FF", "#4BB2FF"];
  if (level <= 30) return ["#FFE27A", "#FF9B30"];
  if (level <= 50) return ["#FF9B30", "#B657FF"];
  if (level <= 70) return ["#B657FF", "#FF2D55"];
  return ["#FF2D55", "#000000"];
};

/* ✅ Icon diamond kecil */
const DiamondIcon = ({ colors }) => (
  <Svg width={16} height={16} viewBox="0 0 100 100">
    <Defs>
      <LinearGradient id="gradDiamond" x1="0" y1="0" x2="1" y2="1">
        <Stop offset="0" stopColor={colors[0]} />
        <Stop offset="1" stopColor={colors[1]} />
      </LinearGradient>
    </Defs>

    <Polygon
      points="50,5 90,35 70,90 30,90 10,35"
      fill="url(#gradDiamond)"
      stroke="#fff"
      strokeWidth="4"
      strokeLinejoin="round"
    />
  </Svg>
);

export default function ProfileHeader() {
  const navigation = useNavigation();
  const userLevel = 31;
  const hostLevel = 4;

  const userColor = getLevelGradient(userLevel);
  const hostColor = getLevelGradient(hostLevel);

  /* ✅ Animasi shine pill badge */
  const shineAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(shineAnim, {
        toValue: 1,
        duration: 2400,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const shineTranslate = shineAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-40, 80],
  });

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

      {/* ✅ Background Curve */}
      <View style={styles.curveWrapper}>
        <Svg height="250" width={width}>
          <Defs>
            <LinearGradient id="darkBG" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor="#3A3A3A" />
              <Stop offset="1" stopColor="#000" />
            </LinearGradient>
          </Defs>

          <Path
            d={`M0,0 H${width} V180 Q${width / 2},250 0,180 Z`}
            fill="url(#darkBG)"
          />
        </Svg>
      </View>

      {/* ✅ Tombol Edit — FIXED NAVIGATION */}
      <TouchableOpacity
        style={styles.editButton}
        onPress={() =>
          navigation.navigate("ProfileNavigator", {
            screen: "EditProfileScreen",
          })
        }
      >
        <Ionicons name="create-outline" size={18} color="#fff" />
        <Text style={styles.editText}>Edit</Text>
      </TouchableOpacity>

      {/* ✅ Avatar */}
      <View style={styles.avatarWrapper}>
        <Image
          source={require("../../../../assets/images/avatar_default.png")}
          style={styles.avatar}
        />
      </View>

      {/* ✅ Row badge */}
      <View style={styles.badgeRow}>

        {/* USER LEVEL */}
        <View style={[styles.pillBadge, { backgroundColor: userColor[0] }]}>
          <DiamondIcon colors={userColor} />
          <Text style={styles.levelNumber}>{userLevel}</Text>

          <Animated.View
            style={[styles.shine, { transform: [{ translateX: shineTranslate }] }]}
          />
        </View>

        {/* HOST LEVEL */}
        <View style={[styles.pillBadge, { backgroundColor: hostColor[0] }]}>
          <DiamondIcon colors={hostColor} />
          <Text style={styles.levelNumber}>{hostLevel}</Text>

          <Animated.View
            style={[styles.shine, { transform: [{ translateX: shineTranslate }] }]}
          />
        </View>

        {/* ✅ VIP BADGE */}
        <Image
          source={require("../../../../assets/badge/vip/vip1.png")}
          style={styles.vipBadge}
        />
      </View>
    </View>
  );
}

/* ✅ Style */
const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingBottom: 20,
  },

  curveWrapper: {
    position: "absolute",
    top: 0,
    zIndex: -1,
  },

  avatarWrapper: {
    marginTop: 55,
  },

  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    borderColor: "#ffffff",
  },

  /* ✅ Edit Button */
  editButton: {
    position: "absolute",
    top: 40,
    right: 20,
    flexDirection: "row",
    backgroundColor: "#2ECC71",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 22,
    alignItems: "center",
    zIndex: 10,
  },

  editText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
    marginLeft: 5,
  },

  badgeRow: {
    flexDirection: "row",
    marginTop: 15,
    alignItems: "center",
  },

  /* ✅ Kapsul badge */
  pillBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    marginHorizontal: 6,
    minWidth: 58,
    justifyContent: "center",
    overflow: "hidden",
  },

  levelNumber: {
    fontSize: 14,
    fontWeight: "700",
    color: "#fff",
    marginLeft: 5,
  },

  vipBadge: {
    width: 40,
    height: 40,
    resizeMode: "contain",
    marginLeft: 8,
  },

  shine: {
    position: "absolute",
    width: 30,
    height: 100,
    backgroundColor: "rgba(255,255,255,0.22)",
    transform: [{ rotate: "55deg" }],
    top: -20,
    left: -30,
    borderRadius: 10,
  },
});