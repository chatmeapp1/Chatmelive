import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { scale } from "react-native-size-matters";
import { useNavigation } from "@react-navigation/native";

export default function HomeHeader() {
  const navigation = useNavigation();

  const host = {
    name: "Top Host",
    level: 39,
    id: 99915,
    avatar: "https://picsum.photos/id/1011/200",
  };

  const mini = [
    "https://picsum.photos/id/1025/50",
    "https://picsum.photos/id/1027/50",
    "https://picsum.photos/id/1026/50",
  ];

  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <Image source={{ uri: host.avatar }} style={styles.avatar} />
        <View style={{ marginLeft: scale(10) }}>
          <Text style={styles.name}>{host.name}</Text>
          <Text style={styles.sub}>LV.{host.level} • ID:{host.id}</Text>
        </View>
      </View>

      <View style={styles.right}>
        <View style={styles.miniRow}>
          {mini.map((u, i) => (
            <Image
              key={i}
              source={{ uri: u }}
              style={[styles.mini, { marginLeft: i === 0 ? 0 : -8 }]}
            />
          ))}
        </View>

        <TouchableOpacity
          style={styles.countBtn}
          onPress={() => navigation.navigate("ChatList")}
        >
          <Text style={styles.countText}>71</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: scale(14),
    paddingTop: scale(10),
    paddingBottom: scale(8),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  left: { flexDirection: "row", alignItems: "center" },
  avatar: { width: scale(60), height: scale(60), borderRadius: 999 },
  name: { color: "#111", fontSize: scale(18), fontWeight: "700" },
  sub: { color: "#6b6b6b", fontSize: scale(12), marginTop: 2 },
  right: { flexDirection: "row", alignItems: "center" },
  miniRow: { flexDirection: "row", marginRight: 8 },
  mini: { width: 34, height: 34, borderRadius: 17, borderWidth: 2, borderColor: "#fff" },
  countBtn: {
    backgroundColor: "rgba(0,0,0,0.06)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 18,
  },
  countText: { color: "#111", fontWeight: "700" },
});