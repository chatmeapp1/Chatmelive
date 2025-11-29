// src/live/components/LiveBottomBar.js
import React, { useState, useRef } from "react";
import {
  View,
  StyleSheet,
  Text,
  Pressable,
  Animated,
  Platform,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import LiveGiftModal from "./LiveGiftModal";

const ICON_SIZE = 46;

function IconCircleButton({ icon, onPress, badgeCount }) {
  const scale = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.parallel([
      Animated.spring(scale, {
        toValue: 0.88,
        friction: 6,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0.7,
        duration: 120,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handlePressOut = () => {
    Animated.parallel([
      Animated.spring(scale, {
        toValue: 1,
        friction: 5,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 120,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={styles.circleOuter}
    >
      <Animated.View
        style={[
          styles.circleInner,
          {
            transform: [{ scale }],
            opacity,
          },
        ]}
      >
        {icon}

        {/* Badge Notif */}
        {badgeCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              {badgeCount > 99 ? "99+" : badgeCount}
            </Text>
          </View>
        )}
      </Animated.View>
    </Pressable>
  );
}

export default function LiveBottomBar({
  hidden = false,
  onChatPress,
  onGiftPress,
  onBigGift,
  onPressInbox,
  onPressMenu,
  inboxCount = 0,
  onGiftModalOpen,
  onGiftModalClose,
  onComboChange,
  onJPResult,
  userCoins = 0,
}) {
  const insets = useSafeAreaInsets();
  const [giftModalVisible, setGiftModalVisible] = useState(false);
  const [giftComboCount, setGiftComboCount] = useState(1);

  if (hidden) return null;

  const handleGiftSend = (giftData) => {
    if (onGiftPress) onGiftPress(giftData);
  };

  return (
    <>
      <View style={[styles.container, { bottom: insets.bottom + 16 }]}>
        <View style={styles.row}>

          {/* Chat */}
          <IconCircleButton
            onPress={onChatPress}
            icon={<Ionicons name="chatbubble-ellipses" size={20} color="#fff" />}
          />

          {/* Inbox */}
          <IconCircleButton
            onPress={onPressInbox}
            badgeCount={inboxCount}
            icon={<Ionicons name="mail-outline" size={20} color="#fff" />}
          />

          {/* Co-Host / Crown */}
          <IconCircleButton
            onPress={onPressMenu}
            icon={<Ionicons name="star" size={28} color="#fff" />}
          />

          {/* Gift */}
          <IconCircleButton
            onPress={() => {
              setGiftModalVisible(true);
              if (onGiftModalOpen) onGiftModalOpen();
            }}
            icon={
              <Image
                source={require("../../../../assets/gift.png")}
                style={{ width: 40, height: 40 }}
                resizeMode="contain"
              />
            }
          />

        </View>
      </View>

      {/* Gift Modal */}
      <LiveGiftModal
        visible={giftModalVisible}
        onClose={() => {
          setGiftModalVisible(false);
          if (onGiftModalClose) onGiftModalClose();
          setGiftComboCount(1);
        }}
        onSend={handleGiftSend}
        onBigGift={onBigGift}
        onComboChange={onComboChange}
        onJPResult={onJPResult}
        userCoins={userCoins}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 9999,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
  },

  // Outer wrapper (shadow/glass-like)
  circleOuter: {
    width: ICON_SIZE,
    height: ICON_SIZE,
    borderRadius: ICON_SIZE / 2,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.25)",

    // Shadow (Android + iOS)
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 5,
  },

  // Inner view - SUPER transparent glass effect
  circleInner: {
    width: ICON_SIZE - 5,
    height: ICON_SIZE - 5,
    borderRadius: (ICON_SIZE - 5) / 2,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.18)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.25)",
  },

  badge: {
    position: "absolute",
    top: -3,
    right: -3,
    backgroundColor: "#ff3b5f",
    paddingHorizontal: 5,
    minWidth: 17,
    height: 17,
    borderRadius: 9,
    justifyContent: "center",
    alignItems: "center",
  },

  badgeText: {
    color: "#fff",
    fontSize: 9,
    fontWeight: "700",
  },
});