import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  Image,
  Animated,
  StyleSheet,
  Dimensions,
  Easing,
} from "react-native";
import LottieView from "lottie-react-native";

const { width, height } = Dimensions.get("window");

// 🔹 Hasil kalibrasi kamu
const HOLE_LEFT_RATIO = 0.196;
const HOLE_TOP_RATIO = 0.609;
const HOLE_DIAMETER_RATIO = 0.52;

// 🔹 Path banner VIP
const VIP_BANNERS = {
  1: require("../../assets/icons/ic_join/vip_1.png"),
  2: require("../../assets/icons/ic_join/vip_2.png"),
  3: require("../../assets/icons/ic_join/vip_3.png"),
  4: require("../../assets/icons/ic_join/vip_4.png"),
  5: require("../../assets/icons/ic_join/vip_5.png"),
  6: require("../../assets/icons/ic_join/vip_6.png"),
};

// 🔹 Path animasi motor.json
const MOTOR_LOTTIE = require("../../assets/epect_masuk/motor.json");

export default function JoinEffect({ visible, user, onFinish }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(width)).current;
  const motorAnim = useRef(new Animated.Value(width)).current;
  const lottieRef = useRef(null);

  useEffect(() => {
    if (!visible || !user) return;

    // Mulai animasi motor + banner bersamaan
    Animated.sequence([
      Animated.timing(motorAnim, {
        toValue: 0,
        duration: 1000,
        easing: Easing.out(Easing.exp),
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 800,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    // Play animasi motor
    if (lottieRef.current) {
      lottieRef.current.play();
    }

    // Setelah 5 detik, keluar ke kiri
    const t = setTimeout(() => {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: -width,
          duration: 800,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 700,
          easing: Easing.inOut(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start(() => onFinish && onFinish());
    }, 5000);

    return () => clearTimeout(t);
  }, [visible, user]);

  if (!visible || !user) return null;

  const bannerWidth = width * 0.75;
  const bannerHeight = 80;
  const avatarSize = bannerHeight * HOLE_DIAMETER_RATIO * 0.9;
  const avatarLeft = bannerWidth * HOLE_LEFT_RATIO - avatarSize / 2;
  const avatarTop = bannerHeight * HOLE_TOP_RATIO - avatarSize / 2 - 5;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [{ translateX: slideAnim }],
        },
      ]}
      pointerEvents="none"
    >
      {/* 🚀 Motor animasi masuk */}
      <Animated.View
        style={[
          styles.motorWrap,
          {
            transform: [{ translateX: motorAnim }],
          },
        ]}
      >
        <LottieView
          ref={lottieRef}
          source={MOTOR_LOTTIE}
          autoPlay
          loop={false}
          style={{ width: 180, height: 180 }}
        />
      </Animated.View>

      {/* 🎖 Banner VIP */}
      <View style={[styles.bannerBox, { width: bannerWidth, height: bannerHeight }]}>
        <Image
          source={VIP_BANNERS[user.vipLevel] || VIP_BANNERS[3]}
          style={styles.banner}
          resizeMode="contain"
        />

        {/* Avatar */}
        <View
          style={[
            styles.avatarWrapper,
            {
              width: avatarSize,
              height: avatarSize,
              borderRadius: avatarSize / 2,
              left: avatarLeft,
              top: avatarTop,
            },
          ]}
        >
          <Image
            source={{ uri: user.avatar }}
            style={{
              width: "100%",
              height: "100%",
              borderRadius: avatarSize / 2,
            }}
          />
        </View>

        {/* Text */}
        <View style={[styles.textBox, { marginLeft: avatarLeft + avatarSize + 10 }]}>
          <Text style={styles.text}>
            <Text style={styles.name}>
              {user.name || "No name"}
            </Text>{" "}
            joined room 🎉
          </Text>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    alignSelf: "center",
    top: height * 0.35,
    zIndex: 9999,
  },
  bannerBox: {
    justifyContent: "center",
    alignItems: "flex-start",
  },
  banner: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  avatarWrapper: {
    position: "absolute",
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "#fff",
    backgroundColor: "#000",
  },
  textBox: {
    position: "absolute",
    top: "50%",
    transform: [{ translateY: -12 }],
  },
  text: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },
  name: {
    color: "#FFEB3B",
    fontWeight: "900",
  },
  motorWrap: {
    position: "absolute",
    zIndex: 10000,
    left: -80,
    top: -30,
  },
});