// src/live/components/LiveSwipeHandler.js

import React, { useRef } from "react";
import { View, PanResponder, StyleSheet } from "react-native";

export default function LiveSwipeHandler({ onSwipe }) {
  const startX = useRef(0);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: (_, gesture) => {
        // ✅ Swipe hanya aktif jika user mulai dari sisi kiri atau kanan layar
        return gesture.x0 < 60 || gesture.x0 > (gesture.moveX - 60);
      },

      onPanResponderGrant: (evt) => {
        startX.current = evt.nativeEvent.pageX;
      },

      onPanResponderRelease: (evt) => {
        const endX = evt.nativeEvent.pageX;
        const diff = endX - startX.current;

        // ✅ Ambang swipe lembut
        if (diff < -40) onSwipe(false); // hide UI
        if (diff > 40) onSwipe(true);  // show UI
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