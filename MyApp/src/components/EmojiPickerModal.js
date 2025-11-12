// === EmojiPickerModal.js (Dark Transparent Version) ===
import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Dimensions,
} from "react-native";
import LottieView from "lottie-react-native";

const { width, height } = Dimensions.get("window");

const emojis = [
  { id: "love", name: "Love", file: require("../../assets/emoji/love.json") },
  { id: "smile", name: "Smile", file: require("../../assets/emoji/smile.json") },
  { id: "cry", name: "Cry", file: require("../../assets/emoji/Crying.json") },
];

export default function EmojiPickerModal({ visible, onClose, onSelectEmoji }) {
  if (!visible) return null;

  return (
    <Modal transparent visible={visible} animationType="fade" statusBarTranslucent>
      <View style={styles.overlay}>
        {/* klik luar untuk menutup */}
        <TouchableOpacity style={styles.bgOverlay} onPress={onClose} activeOpacity={1} />

        {/* container utama */}
        <View style={styles.container}>
          <FlatList
            data={emojis}
            numColumns={3}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.emojiItem}
                onPress={() => {
                  onSelectEmoji(item);
                  onClose();
                }}
              >
                <LottieView source={item.file} autoPlay loop style={styles.emojiAnim} />
                <Text style={styles.emojiText}>{item.name}</Text>
              </TouchableOpacity>
            )}
          />

          {/* tombol batal */}
          <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
            <Text style={styles.cancelText}>Membatalkan</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)", // 💥 semi-transparan hitam
    justifyContent: "flex-end",
  },
  bgOverlay: {
    flex: 1,
  },
  container: {
    backgroundColor: "rgba(30,30,30,0.95)", // 💎 gelap tapi masih sedikit transparan
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingVertical: 20,
    alignItems: "center",
  },
  emojiItem: {
    flex: 1 / 3,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 8,
  },
  emojiAnim: {
    width: 80,
    height: 80,
  },
  emojiText: {
    color: "#fff",
    fontSize: 13,
    marginTop: 5,
  },
  cancelBtn: {
    marginTop: 5,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 10,
    width: width * 0.9,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
  },
  cancelText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
});