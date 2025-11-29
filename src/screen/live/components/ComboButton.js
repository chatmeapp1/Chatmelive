// src/screen/live/components/ComboButton.js

import React, { useState, useEffect, useRef } from "react";
import { TouchableOpacity, Text, StyleSheet, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import socketService from "../../../utils/socket";
import getEnvVars from "../../../utils/env";

export default function ComboButton({ 
  visible = false, 
  count = 1,
  giftData = null,
  viewer = null,
  host = null,
  roomId = null,
  onJPResult = () => {},
  onGiftTap = () => {},
  onHide = () => {},
}) {
  const [isLoading, setIsLoading] = useState(false);
  const timerRef = useRef(null);
  const lastTapRef = useRef(0);

  // Auto-hide after 60 seconds when visible
  useEffect(() => {
    if (visible) {
      // Clear any existing timer
      if (timerRef.current) clearTimeout(timerRef.current);
      
      // Set new 60s timer
      timerRef.current = setTimeout(() => {
        onHide();
      }, 60000); // 60 seconds
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [visible, onHide]);

  if (!visible) return null;

  const handleComboPress = async () => {
    // Anti-spam: Prevent double-tap within 150ms
    const now = Date.now();
    if (now - lastTapRef.current < 150) return;
    lastTapRef.current = now;

    // If gift data is provided, send to JP endpoint
    if (!giftData || !viewer || !host || !roomId) {
      return;
    }

    try {
      const token = await AsyncStorage.getItem("userToken");
      const { API_URL } = getEnvVars();
      
      const response = await fetch(`${API_URL}/api/jp-gift/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          receiverId: host.id,
          giftPrice: giftData.price,
          combo: count,
          roomId: roomId,
        }),
      });

      const result = await response.json();

      if (result.success) {
        // Trigger combo bubble animation with gift info
        onGiftTap(giftData, viewer);

        // Pass result to parent for animation
        onJPResult({
          jpWin: result.jpWin,
          jpLevel: result.jpLevel,
          jpWinAmount: result.jpWinAmount,
          combo: count,
        });

        // Emit JP win to socket for chat display
        if (result.jpWin) {
          socketService.emitJPWin({
            viewer: viewer.name,
            jpLevel: result.jpLevel,
            jpWinAmount: result.jpWinAmount,
          });
        }

        console.log('✅ Gift re-sent (x' + count + '):', result.message);
      } else {
        console.error('❌ Error:', result.message);
      }
    } catch (error) {
      console.error('JP Gift Error:', error);
    }
  };

  return (
    <View style={styles.container} pointerEvents="box-none">
      <TouchableOpacity 
        activeOpacity={0.9} 
        onPress={handleComboPress}
        disabled={isLoading}
      >
        <LinearGradient
          colors={["#ff9900", "#ff5500"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.button, isLoading && styles.buttonLoading]}
        >
          <Text style={styles.text}>{isLoading ? '...' : `x${count}`}</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 210,
    right: 18,
    zIndex: 450,
    elevation: 450,
  },

  button: {
    width: 58,
    height: 58,
    borderRadius: 29,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.4)",
  },

  buttonLoading: {
    opacity: 0.7,
  },

  text: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "900",
  },
});
