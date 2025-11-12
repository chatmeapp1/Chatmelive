// src/live/components/LiveViewerList.js

import React from "react";
import {
  View,
  Text,
  Image,
  Modal,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Dimensions,
} from "react-native";
import { BlurView } from "expo-blur";

const { height } = Dimensions.get("window");

export default function LiveViewerList({ visible, viewers, onClose }) {
  const getLevelColor = (level) => {
    if (level <= 10) return "#ff66c4";
    if (level <= 20) return "#6ecbff";
    if (level <= 30) return "#ffc94d";
    if (level <= 50) return "#ff8f3d";
    return "#b66bff";
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      {/* ✅ Blur Background */}
      <BlurView intensity={55} tint="dark" style={styles.blurBG}>
        {/* ✅ Bottom Sheet */}
        <View style={styles.sheet}>
          <View style={styles.headerRow}>
            <Text style={styles.title}>Daftar Penonton</Text>

            <TouchableOpacity onPress={onClose}>
              <Text style={styles.closeBtn}>Tutup</Text>
            </TouchableOpacity>
          </View>

          {/* ✅ Viewer List */}
          <FlatList
            data={viewers}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <View style={styles.viewerRow}>
                <Image source={{ uri: item.avatar }} style={styles.avatar} />

                <View style={{ marginLeft: 10 }}>
                  <Text style={styles.name}>{item.name}</Text>

                  <View
                    style={[
                      styles.levelBadge,
                      { backgroundColor: getLevelColor(item.level) },
                    ]}
                  >
                    <Text style={styles.levelText}>Lv {item.level}</Text>
                  </View>
                </View>
              </View>
            )}
          />
        </View>
      </BlurView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  blurBG: {
    flex: 1,
    justifyContent: "flex-end",
  },

  sheet: {
    height: height * 0.55,
    backgroundColor: "rgba(20,20,20,0.85)",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 15,
  },

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  title: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },

  closeBtn: {
    color: "#ff5f7e",
    fontWeight: "700",
    fontSize: 14,
  },

  viewerRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },

  avatar: {
    width: 45,
    height: 45,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: "#fff",
  },

  name: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },

  levelBadge: {
    marginTop: 4,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
  },

  levelText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
  },
});