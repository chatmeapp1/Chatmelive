import React from "react";
import {
  Modal,
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Animated,
} from "react-native";
import { scale, verticalScale } from "react-native-size-matters";

export default function UserListModal({ visible, onClose, users }) {
  const slideAnim = React.useRef(new Animated.Value(0)).current;

  // ✅ Data default kalau belum ada user dari props
  const defaultUsers = [
    { name: "Rina", avatar: "https://picsum.photos/id/1011/100", vipLevel: 2 },
    { name: "Tono", avatar: "https://picsum.photos/id/1027/100", vipLevel: 1 },
    { name: "Miko", avatar: "https://picsum.photos/id/1025/100", vipLevel: 3 },
    { name: "Momo", avatar: "https://picsum.photos/id/1021/100" },
    { name: "Budi", avatar: "https://picsum.photos/id/1022/100" },
    { name: "Lina", avatar: "https://picsum.photos/id/1023/100" },
    { name: "Joko", avatar: "https://picsum.photos/id/1024/100" },
    { name: "Andi", avatar: "https://picsum.photos/id/1026/100" },
  ];

  const dataToShow = users && users.length > 0 ? users : defaultUsers;

  React.useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 1,
        duration: 280,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const translateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [400, 0],
  });

  return (
    <Modal transparent visible={visible} animationType="none">
      <View style={styles.overlay}>
        <TouchableOpacity
          style={styles.overlayTouchable}
          activeOpacity={1}
          onPress={onClose}
        />

        <Animated.View
          style={[
            styles.modalBox,
            { transform: [{ translateY }] },
          ]}
        >
          {/* === Header === */}
          <View style={styles.header}>
            <Text style={styles.title}>
              👥 Pengguna Online ({dataToShow.length})
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.closeText}>✖ Tutup</Text>
            </TouchableOpacity>
          </View>

          {/* === List User === */}
          {dataToShow.length === 0 ? (
            <Text style={styles.empty}>Belum ada pengguna</Text>
          ) : (
            <FlatList
              data={dataToShow}
              keyExtractor={(item, index) => index.toString()}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <View style={styles.userRow}>
                  <Image source={{ uri: item.avatar }} style={styles.avatar} />
                  <View>
                    <Text style={styles.userName}>{item.name}</Text>
                    {item.vipLevel && (
                      <Text style={styles.vipBadge}>⭐ VIP {item.vipLevel}</Text>
                    )}
                  </View>
                </View>
              )}
            />
          )}
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  overlayTouchable: {
    flex: 1,
  },
  modalBox: {
    height: "50%",
    backgroundColor: "#1a1a1a",
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    paddingHorizontal: scale(15),
    paddingVertical: verticalScale(12),
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: -3 },
    shadowRadius: 6,
    elevation: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.1)",
    paddingBottom: 8,
    marginBottom: 10,
  },
  title: {
    color: "#fff",
    fontSize: scale(16),
    fontWeight: "600",
  },
  closeText: {
    color: "#ff7070",
    fontSize: scale(14),
  },
  userRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 7,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
  },
  userName: {
    color: "#fff",
    fontSize: scale(14),
    fontWeight: "500",
  },
  vipBadge: {
    color: "#ffd700",
    fontSize: scale(12),
    marginTop: 2,
  },
  empty: {
    textAlign: "center",
    color: "#aaa",
    marginTop: 40,
    fontSize: scale(14),
  },
});