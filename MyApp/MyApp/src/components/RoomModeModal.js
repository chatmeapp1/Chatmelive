import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Dimensions,
  BackHandler,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const { width, height } = Dimensions.get("window");

export default function RoomModeModal({ visible, onClose }) {
  const [selected, setSelected] = useState(12); // default 12 orang

  // === BackHandler: tekan back tutup modal ===
  useEffect(() => {
    const backAction = () => {
      if (visible) {
        onClose?.();
        return true;
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);
    return () => backHandler.remove();
  }, [visible]);

  if (!visible) return null;

  return (
    <Modal
      transparent
      visible={visible}
      animationType="slide"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      {/* BACKGROUND HITAM TRANSPARAN */}
      <View style={styles.overlay}>
        <TouchableOpacity
          style={styles.bgOverlay}
          activeOpacity={1}
          onPress={onClose}
        />

        {/* KONTEN MODAL */}
        <View style={styles.container}>
          <Text style={styles.title}>Mode ruangan</Text>

          <View style={styles.modeButtons}>
            {[8, 12, 16].map((num) => (
              <TouchableOpacity
                key={num}
                activeOpacity={0.9}
                onPress={() => setSelected(num)}
                style={[
                  styles.optionBtn,
                  selected === num && styles.optionActive,
                ]}
              >
                <Text
                  style={[
                    styles.optionText,
                    selected === num && styles.optionTextActive,
                  ]}
                >
                  {num} orang
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.bottomButtons}>
            <TouchableOpacity activeOpacity={0.9} style={styles.gradientBtn}>
              <LinearGradient
                colors={["#42a5ff", "#63ffd6"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gradientInner}
              >
                <Text style={styles.gradientText}>Mengalihkan</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity activeOpacity={0.9} style={styles.grayBtn}>
              <Text style={styles.grayText}>Pembelian</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

// === STYLE ===
const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "flex-end",
  },
  bgOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  container: {
    backgroundColor: "rgba(25,25,25,0.96)",
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    paddingTop: 20,
    paddingHorizontal: 22,
    paddingBottom: 30,
    borderTopWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  title: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 17,
    textAlign: "center",
    marginBottom: 18,
  },
  modeButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 25,
  },
  optionBtn: {
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 22,
    backgroundColor: "rgba(255,255,255,0.05)",
  },
  optionActive: {
    borderColor: "#63ffd6",
    backgroundColor: "rgba(99,255,214,0.15)",
  },
  optionText: {
    color: "#ccc",
    fontWeight: "500",
    fontSize: 14,
  },
  optionTextActive: {
    color: "#63ffd6",
    fontWeight: "700",
  },
  bottomButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  gradientBtn: {
    flex: 1,
    borderRadius: 10,
    overflow: "hidden",
  },
  gradientInner: {
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  gradientText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },
  grayBtn: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  grayText: {
    color: "#ccc",
    fontWeight: "600",
    fontSize: 15,
  },
});