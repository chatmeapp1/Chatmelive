// === RoomSettingsModal.js (Dark Pastel Version) ===
import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  Switch,
  StyleSheet,
  Dimensions,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");

export default function RoomSettingsModal({ visible, onClose }) {
  const [isEffectOn, setEffectOn] = useState(true);
  const [isGiftNoteOn, setGiftNoteOn] = useState(false);
  const [isChatZoneOn, setChatZoneOn] = useState(true);

  if (!visible) return null;

  return (
    <Modal transparent visible={visible} animationType="slide" statusBarTranslucent>
      <View style={styles.overlay}>
        {/* klik luar untuk menutup */}
        <TouchableOpacity style={styles.bgOverlay} onPress={onClose} activeOpacity={1} />

        {/* kontainer utama */}
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="chevron-back-outline" size={22} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Pengaturan kamar</Text>
            <TouchableOpacity>
              <Text style={styles.saveText}>Simpan</Text>
            </TouchableOpacity>
          </View>

          {/* Scrollable content */}
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.section}>
              <Text style={styles.label}>Nama kamar</Text>
              <Text style={styles.value}>mmmm</Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.label}>Kata sandi</Text>
              <Text style={[styles.value, { color: "#888" }]}>Harap setel kata sandi kamar</Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.label}>Tema</Text>
            </View>

            <View style={styles.sectionToggle}>
              <Text style={styles.label}>Efek kamar</Text>
              <Switch
                value={isEffectOn}
                onValueChange={setEffectOn}
                trackColor={{ false: "#444", true: "#c7b8f7" }}
                thumbColor={isEffectOn ? "#b39ddb" : "#777"}
              />
            </View>

            <View style={styles.sectionToggle}>
              <Text style={styles.label}>Catatan hadiah</Text>
              <Switch
                value={isGiftNoteOn}
                onValueChange={setGiftNoteOn}
                trackColor={{ false: "#444", true: "#c7b8f7" }}
                thumbColor={isGiftNoteOn ? "#b39ddb" : "#777"}
              />
            </View>

            <View style={styles.sectionToggle}>
              <Text style={styles.label}>Buka zona obrolan</Text>
              <Switch
                value={isChatZoneOn}
                onValueChange={setChatZoneOn}
                trackColor={{ false: "#444", true: "#c7b8f7" }}
                thumbColor={isChatZoneOn ? "#b39ddb" : "#777"}
              />
            </View>

            <View style={styles.section}>
              <Text style={styles.label}>Manajer Kamar</Text>
              <Text style={styles.value}>3/3</Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.label}>Daftar hitam kamar</Text>
            </View>

            <View style={[styles.section, { borderBottomWidth: 0 }]}>
              <Text style={styles.label}>Tips kamar</Text>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)", // semi-transparan hitam
    justifyContent: "flex-end",
  },
  bgOverlay: {
    flex: 1,
  },
  container: {
    height: height * 0.75,
    backgroundColor: "rgba(25,25,25,0.95)", // 💎 dark doff elegan
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    paddingTop: 10,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 10,
    justifyContent: "space-between",
    borderBottomWidth: 0.5,
    borderColor: "rgba(255,255,255,0.15)",
  },
  headerTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  saveText: {
    color: "#c7b8f7",
    fontWeight: "600",
    fontSize: 14,
  },
  section: {
    paddingHorizontal: 18,
    paddingVertical: 15,
    borderBottomWidth: 0.5,
    borderColor: "rgba(255,255,255,0.15)",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionToggle: {
    paddingHorizontal: 18,
    paddingVertical: 15,
    borderBottomWidth: 0.5,
    borderColor: "rgba(255,255,255,0.15)",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  label: {
    color: "#fff",
    fontSize: 14.5,
  },
  value: {
    color: "#ddd",
    fontSize: 14,
  },
});