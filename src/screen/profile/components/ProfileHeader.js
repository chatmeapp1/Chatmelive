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
import LottieView from "lottie-react-native";
import getEnvVars from "../../../utils/env";
import { getLevelBadge } from "../../../utils/levelCalculator";

const { width } = Dimensions.get("window");

export default function ProfileHeader({ userData }) {
  const navigation = useNavigation();
  const userLevel = userData?.userLevel || userData?.level || 0;
  const hostLevel = userData?.hostLevel || 0;

  // ✅ Build full avatar URL
  const { API_URL } = getEnvVars();
  const getAvatarSource = () => {
    if (!userData?.avatar) {
      return require("../../../../assets/images/avatar_default.png");
    }
    
    // If it's a relative path (starts with /), build full URL
    if (typeof userData.avatar === "string" && userData.avatar.startsWith("/")) {
      return { uri: `${API_URL}${userData.avatar}` };
    }
    
    // If it's already a full URL
    if (typeof userData.avatar === "string" && userData.avatar.startsWith("http")) {
      return { uri: userData.avatar };
    }
    
    // Otherwise use the avatar value as-is (for require() statements)
    return userData.avatar;
  };


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
            params: { userData },
          })
        }
      >
        <Ionicons name="create-outline" size={18} color="#fff" />
        <Text style={styles.editText}>Edit</Text>
      </TouchableOpacity>

      {/* ✅ Avatar dengan Frame */}
      <View style={styles.avatarWrapper}>
        <Image
          source={getAvatarSource()}
          style={styles.avatar}
        />
        <LottieView
          source={require("../../../../assets/av_frame/lottie/Avatar_frame.json")}
          autoPlay
          loop
          style={styles.avatarFrame}
        />
      </View>

      {/* ✅ Nickname/Username with User ID */}
      <View style={styles.nicknameContainer}>
        <Text style={styles.nickname}>{userData?.name || "User"}</Text>
        {userData?.id && (
          <Text style={styles.userId}>#{userData.id}</Text>
        )}
      </View>

      {/* ✅ Row badge */}
      <View style={styles.badgeRow}>

        {/* USER LEVEL - dengan icon mapping */}
        {userLevel > 0 && (
          <View style={styles.badgeContainer}>
            <Image
              source={getLevelBadge(userLevel).icon}
              style={styles.levelBadgeIcon}
            />
            <Text style={styles.levelBadgeNumber}>{userLevel}</Text>
          </View>
        )}

        {/* HOST LEVEL - dengan icon mapping */}
        {hostLevel > 0 && (
          <View style={styles.badgeContainer}>
            <Image
              source={getLevelBadge(hostLevel).icon}
              style={styles.levelBadgeIcon}
            />
            <Text style={styles.levelBadgeNumber}>{hostLevel}</Text>
          </View>
        )}

        {/* ✅ VIP BADGE */}
        {(userData?.vipLevel || 0) > 0 && (
          <Image
            source={require("../../../../assets/badge/vip/vip1.png")}
            style={styles.vipBadge}
          />
        )}
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
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },

  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    borderColor: "#ffffff",
  },

  avatarFrame: {
    position: "absolute",
    width: 110,
    height: 110,
    top: -15,
    left: -15,
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

  nicknameContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    gap: 6,
  },

  nickname: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },

  userId: {
    color: "#AAA",
    fontSize: 12,
    fontWeight: "500",
    textAlign: "center",
  },

  badgeRow: {
    flexDirection: "row",
    marginTop: 8,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },

  /* ✅ Badge container untuk level icon + number */
  badgeContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },

  levelBadgeIcon: {
    width: 28,
    height: 28,
    resizeMode: "contain",
  },

  levelBadgeNumber: {
    fontSize: 10,
    fontWeight: "700",
    color: "#fff",
    position: "absolute",
    textAlign: "center",
  },

  vipBadge: {
    width: 28,
    height: 28,
    resizeMode: "contain",
  },

});