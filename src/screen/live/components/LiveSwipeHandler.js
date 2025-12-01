// src/live/components/LiveSwipeHandler.js

import React, { useRef } from "react";
import { View, PanResponder, StyleSheet, Animated } from "react-native";

export default function LiveSwipeHandler({ onSwipe }) {
  const startX = useRef(0);
  const lastSwipeTime = useRef(0);
  const animValue = useRef(new Animated.Value(0)).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: (_, gesture) => {
        // ✅ Swipe hanya aktif jika user mulai dari sisi kiri atau kanan layar
        return gesture.x0 < 60 || gesture.x0 > (gesture.moveX - 60);
      },

      onPanResponderGrant: (evt) => {
        startX.current = evt.nativeEvent.pageX;
      },

      onPanResponderMove: (evt) => {
        // ✅ Real-time smooth animation saat swipe
        const currentX = evt.nativeEvent.pageX;
        const progress = (currentX - startX.current) / 100;
        Animated.timing(animValue, {
          toValue: progress,
          duration: 0,
          useNativeDriver: false,
        }).start();
      },

      onPanResponderRelease: (evt) => {
        const endX = evt.nativeEvent.pageX;
        const diff = endX - startX.current;
        const now = Date.now();

        // ✅ Anti-spam: Prevent rapid successive swipes
        if (now - lastSwipeTime.current < 300) return;
        lastSwipeTime.current = now;

        // ✅ Ambang swipe yang lebih responsif (lebih lembut)
        if (diff < -30) {
          onSwipe(false); // hide UI
          Animated.timing(animValue, { toValue: -1, duration: 200, useNativeDriver: false }).start();
        } else if (diff > 30) {
          onSwipe(true);  // show UI
          Animated.timing(animValue, { toValue: 1, duration: 200, useNativeDriver: false }).start();
        } else {
          // Reset animation jika tidak mencapai threshold
          Animated.timing(animValue, { toValue: 0, duration: 150, useNativeDriver: false }).start();
        }
      },
    })
  ).current;

  return (
    <>
      {/* ✅ AREA SWIPE KIRI */}
      <View
        style={styles.leftSwipeZone}
        {...panResponder.panHandlers}
        pointerEvents="auto"
      />

      {/* ✅ AREA SWIPE KANAN */}
      <View
        style={styles.rightSwipeZone}
        {...panResponder.panHandlers}
        pointerEvents="auto"
      />
    </>
  );
}

const styles = StyleSheet.create({
  leftSwipeZone: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 60,
    zIndex: 50,
    backgroundColor: "transparent",
  },

  rightSwipeZone: {
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    width: 60,
    zIndex: 50,
    backgroundColor: "transparent",
  },
});