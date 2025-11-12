import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Animated,
  Easing,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function SeatActionModal({
  seat,
  onClose,
  onLockChange,
  onKick,
  onMute,
  onAddUser,
  onViewProfile,
}) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(60)).current;
  const [visible, setVisible] = useState(true);

  // Animasi masuk
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 220,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 250,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Tutup modal dengan animasi halus
  const handleClose = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 220,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 60,
        duration: 220,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start(() => {
      setVisible(false);
      onClose();
    });
  };

  const handleAction = (action) => {
    if (action === "lock") onLockChange?.(seat.id, true);
    if (action === "unlock") onLockChange?.(seat.id, false);
    if (action === "kick") onKick?.(seat.id);
    if (action === "mute") onMute?.(seat.id);
    if (action === "add") onAddUser?.(seat.id);
    if (action === "profile") onViewProfile?.(seat.user);
    // beri jeda agar animasi keluar lebih halus
    setTimeout(handleClose, 250);
  };

  if (!visible) return null;

  return (
    <Modal transparent animationType="none" onRequestClose={handleClose}>
      <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
        <Animated.View
          style={[
            styles.modal,
            { transform: [{ translateY: slideAnim }] },
          ]}
        >
          <Text style={styles.title}>Seat {seat.id}</Text>

          <View style={styles.actions}>
            {seat.user ? (
              <>
                <ActionButton
                  icon="person-circle-outline"
                  text="Profil"
                  onPress={() => handleAction("profile")}
                />
                <ActionButton
                  icon="mic-off-outline"
                  text="Mute"
                  onPress={() => handleAction("mute")}
                />
                <ActionButton
                  icon="exit-outline"
                  text="Kick"
                  onPress={() => handleAction("kick")}
                />
              </>
            ) : seat.locked ? (
              <ActionButton
                icon="lock-open-outline"
                text="Unlock"
                onPress={() => handleAction("unlock")}
              />
            ) : (
              <>
                <ActionButton
                  icon="add-circle-outline"
                  text="Add User"
                  onPress={() => handleAction("add")}
                />
                <ActionButton
                  icon="lock-closed-outline"
                  text="Lock"
                  onPress={() => handleAction("lock")}
                />
              </>
            )}
          </View>

          <TouchableOpacity onPress={handleClose} style={styles.closeBtn}>
            <Text style={styles.closeText}>Batal</Text>
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

function ActionButton({ icon, text, onPress }) {
  return (
    <TouchableOpacity style={styles.actionBtn} onPress={onPress}>
      <Ionicons name={icon} size={22} color="#FFD700" />
      <Text style={styles.actionText}>{text}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
    justifyContent: "flex-end",
  },
  modal: {
    backgroundColor: "#111",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 15,
    alignItems: "center",
  },
  title: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-around",
    flexWrap: "wrap",
    width: "100%",
    paddingBottom: 10,
  },
  actionBtn: {
    alignItems: "center",
    justifyContent: "center",
    width: "30%",
    marginVertical: 10,
  },
  actionText: {
    color: "#fff",
    fontSize: 13,
    marginTop: 5,
  },
  closeBtn: {
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#333",
    width: "100%",
    alignItems: "center",
    paddingTop: 10,
  },
  closeText: {
    color: "#FFD700",
    fontSize: 14,
    fontWeight: "600",
  },
});