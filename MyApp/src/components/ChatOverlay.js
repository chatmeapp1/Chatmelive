import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Animated,
  StyleSheet,
  Dimensions,
  Image,
} from "react-native";

const { height } = Dimensions.get("window");

export default function ChatOverlay({
  activeTab,
  setActiveTab,
  fadeAnim,
  messages,
  listRef,
}) {
  const tabAnim = useRef(new Animated.Value(1)).current;

  // Animasi tab saat berpindah
  useEffect(() => {
    Animated.sequence([
      Animated.timing(tabAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(tabAnim, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start();
  }, [activeTab]);

  // Fade animasi masuk (supaya bubble chat tidak transparan terus)
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, []);

  const filteredMessages =
    activeTab === "Semua"
      ? messages
      : activeTab === "Ngobrol"
      ? messages.filter((m) => m.type === "chat" || m.type === "system")
      : messages.filter((m) => m.type === "gift");

  const getLevelIcon = (level) => {
    if (!level) return null;
    if (level <= 10)
      return require("../../assets/level/lv_1.png");
    if (level <= 20)
      return require("../../assets/level/lv_2.png");
    if (level <= 30)
      return require("../../assets/level/lv_3.png");
    return require("../../assets/level/lv_4.png");
  };

  return (
    <View style={styles.overlayWrapper} pointerEvents="box-none">
      <View style={styles.chatOverlay}>
        {/* === Tabs === */}
        <View style={styles.chatTabs}>
          {["Semua", "Ngobrol", "Gift"].map((tab) => (
            <TouchableOpacity key={tab} onPress={() => setActiveTab(tab)}>
              <Text
                style={[
                  styles.chatTabText,
                  activeTab === tab && styles.chatTabActive,
                ]}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* === Chat List === */}
        <Animated.View style={{ opacity: tabAnim }}>
          <FlatList
            ref={listRef}
            data={filteredMessages}
            renderItem={({ item }) => (
              <Animated.View
                style={[
                  styles.messageBubble,
                  {
                    opacity: fadeAnim,
                    backgroundColor:
                      item.type === "gift"
                        ? "rgba(255, 215, 0, 0.2)"
                        : item.type === "system"
                        ? "rgba(0, 180, 100, 0.3)"
                        : "rgba(0, 0, 0, 0.4)",
                  },
                ]}
              >
                <View style={styles.senderRow}>
                  <Text style={styles.senderName}>{item.sender}</Text>

                  {item.level && (
                    <View style={styles.levelBadgeWrapper}>
                      <Image
                        source={getLevelIcon(item.level)}
                        style={styles.levelBadge}
                        resizeMode="contain"
                      />
                      <Text style={styles.levelNumber}>{item.level}</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.messageText}>{item.text}</Text>
              </Animated.View>
            )}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            onContentSizeChange={() =>
              listRef.current?.scrollToEnd({ animated: true })
            }
            style={styles.chatList}
          />
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlayWrapper: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: scaleUp(105), // posisi fix di atas menu bawah
    height: height * 0.35,
    justifyContent: "flex-end",
  },
  chatOverlay: {
    width: "100%",
    paddingHorizontal: 10,
  },
  chatTabs: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 3,
  },
  chatTabText: {
    color: "#ccc",
    fontSize: 13,
    marginHorizontal: 15,
  },
  chatTabActive: {
    color: "#fff",
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
  chatList: {
    flexGrow: 0,
  },
  messageBubble: {
    borderRadius: 10,
    paddingVertical: 5,
    paddingHorizontal: 8,
    marginVertical: 2,
  },
  senderRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  senderName: {
    fontWeight: "bold",
    color: "#FFD700",
    fontSize: 12.5,
    marginRight: 5,
  },
  levelBadgeWrapper: {
    position: "relative",
    width: 34,
    height: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  levelBadge: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  levelNumber: {
    color: "#fff",
    fontSize: 10.5,
    fontWeight: "700",
    textAlign: "center",
    textShadowColor: "rgba(0,0,0,0.7)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1.5,
  },
  messageText: {
    color: "#fff",
    fontSize: 12.5,
    marginTop: 1,
  },
});

function scaleUp(value) {
  const baseHeight = 680;
  return (value * height) / baseHeight;
}