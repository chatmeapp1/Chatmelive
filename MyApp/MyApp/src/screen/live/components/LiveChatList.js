// src/live/components/LiveChatList.js

import React, { useRef, useEffect, memo } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  Animated,
  Dimensions,
} from "react-native";

const { height } = Dimensions.get("window");

/* ============================================================
    ✅ VIP BADGES
============================================================ */
const vipBadge = {
  1: require("../../../../assets/badge/vip/vip1.png"),
  2: require("../../../../assets/badge/vip/vip2.png"),
  3: require("../../../../assets/badge/vip/vip3.png"),
  4: require("../../../../assets/badge/vip/vip4.png"),
  5: require("../../../../assets/badge/vip/vip5.png"),
  6: require("../../../../assets/badge/vip/vip6.png"),
};

/* ✅ Warna bubble VIP */
const vipBubble = {
  1: "rgba(255,182,193,0.32)",
  2: "rgba(155,89,182,0.32)",
  3: "rgba(255,165,0,0.32)",
  4: "rgba(70,130,255,0.32)",
  5: "rgba(255,140,0,0.35)",
  6: "rgba(255,0,0,0.35)",
};

/* ✅ Warna glow VIP */
const vipGlowColor = {
  1: "rgba(255,182,193,0.9)",
  2: "rgba(155,89,182,0.9)",
  3: "rgba(255,165,0,0.9)",
  4: "rgba(70,130,255,0.9)",
  5: "rgba(255,140,0,0.9)",
  6: "rgba(255,0,0,0.9)",
};

/* ============================================================
    ✅ LEVEL BADGES
============================================================ */
const levelBadge = {
  blue: require("../../../../assets/badge/level/lv_blue.png"),
  green: require("../../../../assets/badge/level/lv_green.png"),
  yellow: require("../../../../assets/badge/level/lv_yellow.png"),
  orange: require("../../../../assets/badge/level/lv_orange.png"),
  red: require("../../../../assets/badge/level/lv_red.png"),
  black: require("../../../../assets/badge/level/lv_black.png"),
};

const getLevelBadge = (lvl) => {
  if (lvl >= 75) return levelBadge.black;
  if (lvl >= 50) return levelBadge.red;
  if (lvl >= 30) return levelBadge.orange;
  if (lvl >= 20) return levelBadge.yellow;
  if (lvl >= 10) return levelBadge.green;
  return levelBadge.blue;
};

/* ============================================================
    ✅ PARSER UNTUK @MENTION
============================================================ */
const renderMessageWithMention = (text) => {
  const parts = text.split(/(@\w+)/g);

  return parts.map((part, idx) => {
    if (part.startsWith("@")) {
      return (
        <Text key={idx} style={styles.mention}>
          {part}
        </Text>
      );
    }
    return (
      <Text key={idx} style={{ color: "#fff" }}>
        {part}
      </Text>
    );
  });
};

/* ============================================================
    ✅ CHAT ROW COMPONENT
============================================================ */
const ChatRow = memo(({ item }) => {
  const fade = useRef(new Animated.Value(0)).current;
  const slide = useRef(new Animated.Value(8)).current;

  /* ✅ VIP GLOW animation */
  const glow = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, { toValue: 1, duration: 200, useNativeDriver: true }),
      Animated.timing(slide, { toValue: 0, duration: 200, useNativeDriver: true }),
    ]).start();

    if (item.vip > 0) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(glow, { toValue: 1, duration: 800, useNativeDriver: false }),
          Animated.timing(glow, { toValue: 0.2, duration: 800, useNativeDriver: false }),
        ])
      ).start();
    }
  }, []);

  return (
    <Animated.View
      style={[
        styles.row,
        { opacity: fade, transform: [{ translateY: slide }] },
      ]}
    >
      {/* ✅ BUBBLE CHAT */}
      <Animated.View
        style={[
          styles.bubble,
          {
            backgroundColor: item.vip > 0 ? vipBubble[item.vip] : "rgba(0,0,0,0.35)",
            shadowColor: item.vip > 0 ? vipGlowColor[item.vip] : "transparent",
            shadowOpacity: glow, // animasi glow
            shadowRadius: item.vip > 0 ? 8 : 0,
          },
        ]}
      >
        {/* ✅ FIRST LINE */}
        <View style={styles.firstLine}>

          {/* VIP BADGE */}
          {item.vip > 0 && (
            <Image source={vipBadge[item.vip]} style={styles.vipIcon} />
          )}

          {/* LEVEL BADGE */}
          <View style={styles.levelWrapper}>
            <Image source={getLevelBadge(item.level)} style={styles.levelIcon} />
            <Text style={styles.levelText}>{item.level}</Text>
          </View>

          {/* USERNAME */}
          <Text style={styles.username}>{item.user}:</Text>
        </View>

        {/* ✅ MULTILINE MESSAGE + MENTION */}
        <Text style={styles.message}>
          {renderMessageWithMention(item.text)}
        </Text>

      </Animated.View>
    </Animated.View>
  );
});

/* ============================================================
    ✅ MAIN LIST
============================================================ */
export default function LiveChatList({ messages, systemHeight = 170 }) {
  const listRef = useRef(null);

  useEffect(() => {
    if (messages.length > 0 && listRef.current) {
      setTimeout(() => listRef.current.scrollToEnd({ animated: true }), 80);
    }
  }, [messages]);

  return (
    <View style={[styles.container, { paddingTop: systemHeight }]}>
      <FlatList
        ref={listRef}
        data={messages}
        keyExtractor={(i) => i.id.toString()}
        renderItem={({ item }) => <ChatRow item={item} />}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

/* ============================================================
    ✅ STYLE
============================================================ */
const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 10,
    right: 10,
    bottom: 120,
    maxHeight: height * 0.55,
  },

  row: {
    flexDirection: "row",
    marginBottom: 6,
  },

  bubble: {
    flexDirection: "column",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    maxWidth: "85%",
  },

  firstLine: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 3,
  },

  vipIcon: {
    width: 24,
    height: 24,
    resizeMode: "contain",
    marginRight: 4,
  },

  levelWrapper: {
    width: 48,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 5,
  },

  levelIcon: {
    width: 48,
    height: 36,
    resizeMode: "contain",
  },

  levelText: {
    position: "absolute",
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },

  username: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 4,
  },

  message: {
    color: "#fff",
    fontSize: 14,
    lineHeight: 18,
    flexWrap: "wrap",
  },

  mention: {
    color: "#4aa3ff",
    fontWeight: "bold",
  },
});