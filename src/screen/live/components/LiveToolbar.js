// src/screen/live/components/LiveToolbar.js
import React, { useEffect, useRef, useState } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Text,
  Animated,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";

export default function LiveToolbar({ onExit, onPK, showPK = true }) {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const glowOpacity = useRef(new Animated.Value(0.4)).current;
  const tapScale = useRef(new Animated.Value(1)).current;

  // Modal confirm exit
  const [showConfirm, setShowConfirm] = useState(false);

  const handlePKPress = () => {
    Animated.sequence([
      Animated.timing(tapScale, {
        toValue: 0.85,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(tapScale, {
        toValue: 1.1,
        duration: 120,
        useNativeDriver: true,
      }),
      Animated.timing(tapScale, {
        toValue: 1,
        duration: 90,
        useNativeDriver: true,
      }),
    ]).start();

    onPK?.();
  };

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(pulseAnim, {
            toValue: 1.15,
            duration: 700,
            useNativeDriver: true,
          }),
          Animated.timing(glowOpacity, {
            toValue: 0.9,
            duration: 700,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 700,
            useNativeDriver: true,
          }),
          Animated.timing(glowOpacity, {
            toValue: 0.4,
            duration: 700,
            useNativeDriver: true,
          }),
        ]),
      ])
    ).start();
  }, []);

  return (
    <>
      {/* MAIN TOOLBAR */}
      <View style={styles.container}>

        {/* PK Button */}
        {showPK && (
          <Animated.View
            style={[
              styles.animatedWrapper,
              { transform: [{ scale: pulseAnim }] },
            ]}
          >
            <Animated.View
              pointerEvents="none"
              style={[styles.glow, { opacity: glowOpacity }]}
            />
            <Animated.View style={{ transform: [{ scale: tapScale }] }}>
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={handlePKPress}
                style={styles.circleWrapper}
              >
                <BlurView intensity={60} style={styles.circleBtn}>
                  <LinearGradient
                    colors={["rgba(147, 51, 234, 0.4)", "rgba(168, 85, 247, 0.3)"]}
                    style={styles.pkGradient}
                  >
                    <Text style={styles.pkText}>PK</Text>
                  </LinearGradient>
                </BlurView>
              </TouchableOpacity>
            </Animated.View>
          </Animated.View>
        )}

        {/* EXIT BUTTON */}
        <TouchableOpacity
          style={styles.exitBtn}
          onPress={() => setShowConfirm(true)}
        >
          <Ionicons name="close-outline" size={16} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* ========================= */}
      {/* POPUP CONFIRM EXIT       */}
      {/* ========================= */}
      <Modal
        visible={showConfirm}
        transparent
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Hint</Text>
            <Text style={styles.modalText}>
              Are you sure to exit the room?
            </Text>

            <View style={styles.modalBtnRow}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setShowConfirm(false)}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.confirmBtn}
                onPress={() => {
                  setShowConfirm(false);
                  onExit?.("goEndScreen");
                }}
              >
                <Text style={styles.confirmText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const BTN_SIZE = 38;
const EXIT_SIZE = 32;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 230,
    right: 15,
    alignItems: "center",
    zIndex: 999,
  },

  animatedWrapper: {
    width: BTN_SIZE,
    height: BTN_SIZE,
    marginBottom: 8,
    justifyContent: "center",
    alignItems: "center",
  },

  glow: {
    position: "absolute",
    width: BTN_SIZE + 8,
    height: BTN_SIZE + 8,
    borderRadius: (BTN_SIZE + 8) / 2,
    backgroundColor: "rgba(147, 51, 234, 0.5)",
    blur: 8,
  },

  circleWrapper: {
    overflow: "hidden",
    width: BTN_SIZE,
    height: BTN_SIZE,
    borderRadius: BTN_SIZE / 2,
    borderWidth: 1,
    borderColor: "rgba(168, 85, 247, 0.5)",
  },

  circleBtn: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  pkGradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: BTN_SIZE / 2,
  },

  pkText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 13,
  },

  exitBtn: {
    width: EXIT_SIZE,
    height: EXIT_SIZE,
    borderRadius: EXIT_SIZE / 2,
    backgroundColor: "rgba(120, 113, 130, 0.35)",
    borderWidth: 1,
    borderColor: "rgba(200, 190, 210, 0.3)",
    justifyContent: "center",
    alignItems: "center",
  },

  // POPUP
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },

  modalBox: {
    width: "75%",
    backgroundColor: "#fff",
    paddingVertical: 20,
    paddingHorizontal: 15,
    borderRadius: 10,
    elevation: 10,
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 10,
  },

  modalText: {
    textAlign: "center",
    fontSize: 14,
    marginBottom: 20,
    color: "#444",
  },

  modalBtnRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  cancelBtn: {
    flex: 1,
    paddingVertical: 10,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#999",
    borderRadius: 8,
  },

  confirmBtn: {
    flex: 1,
    paddingVertical: 10,
    backgroundColor: "#00c27f",
    borderRadius: 8,
  },

  cancelText: {
    textAlign: "center",
    color: "#444",
    fontWeight: "600",
  },

  confirmText: {
    textAlign: "center",
    color: "#fff",
    fontWeight: "700",
  },
});