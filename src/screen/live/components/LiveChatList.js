// src/live/components/LiveChatList.js

import React, { useRef, useEffect, memo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  Animated,
  Dimensions,
  Keyboard,
  Platform,
} from "react-native";
import VipChatVip from "./VipChatVip";
import { calculateVipLevel } from "../../../utils/vipCalculator";

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
      Animated.timing(fade, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slide, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();

    if (item.vip > 0) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(glow, {
            toValue: 1,
            duration: 800,
            useNativeDriver: false,
          }),
          Animated.timing(glow, {
            toValue: 0.2,
            duration: 800,
            useNativeDriver: false,
          }),
        ])
      ).start();
    }
  }, []);

  // ✅ JP WIN MESSAGE - Green background celebration (chat-style)
  if (item.isJPWin) {
    return (
      <Animated.View
        style={[
          styles.row,
          { opacity: fade, transform: [{ translateY: slide }] },
        ]}
      >
        <View style={styles.jpWinBubble}>
          <Text style={styles.jpWinText}>
            🎊 Selamat {item.viewer} {item.jpLevel}s mendapatkan{" "}
            {item.jpWinAmount?.toLocaleString("id-ID")} coin
          </Text>
        </View>
      </Animated.View>
    );
  }

  // ✅ SYSTEM MESSAGE - Join/Leave notification
  if (item.isSystem) {
    return (
      <Animated.View
        style={[
          styles.row,
          { opacity: fade, transform: [{ translateY: slide }] },
        ]}
      >
        <View style={styles.systemBubble}>
          {/* LEVEL BADGE */}
          <View style={styles.levelWrapper}>
            <Image
              source={getLevelBadge(item.level || 1)}
              style={styles.levelIcon}
            />
            <Text style={styles.levelText}>{item.level || 1}</Text>
          </View>

          {/* USERNAME AND SYSTEM MESSAGE TEXT */}
          <Text style={styles.systemMessage}>
            <Text style={styles.systemUsername}>{item.user}</Text>
            {" "}{item.text}
          </Text>
        </View>
      </Animated.View>
    );
  }

  // ✅ VIP chat dengan animasi khusus - hanya jika vip > 0
  const userVipLevel = calculateVipLevel(item.accumulatedCoins || 0);
  if (userVipLevel > 0) {
    return (
      <Animated.View
        style={[
          styles.row,
          { opacity: fade, transform: [{ translateY: slide }] },
        ]}
      >
        <VipChatVip
          username={item.user}
          message={item.text}
          avatar={item.avatar || "https://picsum.photos/36"}
          vip={userVipLevel}
        />
      </Animated.View>
    );
  }

  // ✅ Regular chat (non-VIP)
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
            backgroundColor: "rgba(0,0,0,0.35)",
            shadowColor: "transparent",
            shadowOpacity: glow,
            shadowRadius: 0,
          },
        ]}
      >
        {/* ✅ HEADER ROW WITH LEVEL BADGE AND USERNAME */}
        <View style={styles.headerRow}>
          {/* LEVEL BADGE */}
          <View style={styles.levelWrapper}>
            <Image
              source={getLevelBadge(item.level)}
              style={styles.levelIcon}
            />
            <Text style={styles.levelText}>{item.level}</Text>
          </View>

          {/* USERNAME */}
          <Text style={styles.username}>{item.user}:</Text>
        </View>

        {/* ✅ MESSAGE TEXT */}
        <View style={styles.messageContainer}>
          <Text style={styles.message}>
            {renderMessageWithMention(item.text)}
          </Text>
        </View>
      </Animated.View>
    </Animated.View>
  );
});

/* ============================================================
    ✅ MAIN LIST
============================================================ */
export default function LiveChatList({ messages, systemHeight = 170, forceUpdateKey = 0 }) {
  const listRef = useRef(null);
  const processedMessageIds = useRef(new Set());
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  // ✅ Keyboard listeners - adjust chat list when keyboard appears
  useEffect(() => {
    const keyboardWillShow = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
      (e) => {
        setKeyboardHeight(e.endCoordinates.height);
        // Auto scroll ke bottom saat keyboard muncul
        setTimeout(() => {
          if (listRef.current) {
            listRef.current?.scrollToEnd({ animated: true });
          }
        }, 100);
      }
    );

    const keyboardWillHide = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide",
      () => {
        setKeyboardHeight(0);
      }
    );

    return () => {
      keyboardWillShow.remove();
      keyboardWillHide.remove();
    };
  }, []);

  // Filter duplicate messages
  const uniqueMessages = messages.filter((msg) => {
    const messageKey = `${msg.id}-${msg.user}-${msg.text}`;
    if (processedMessageIds.current.has(messageKey)) {
      return false;
    }
    processedMessageIds.current.add(messageKey);
    return true;
  });

  // Clean up old message IDs to prevent memory leak
  useEffect(() => {
    if (processedMessageIds.current.size > 1000) {
      processedMessageIds.current.clear();
    }
  }, [messages]);

  // Force reflow when combo updates
  useEffect(() => {
    if (listRef.current) {
      listRef.current.setNativeProps({ opacity: 0.99 });
      setTimeout(() => {
        listRef.current?.setNativeProps({ opacity: 1 });
      }, 10);
    }
  }, [forceUpdateKey]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (uniqueMessages && uniqueMessages.length > 0 && listRef.current) {
      setTimeout(() => {
        listRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [uniqueMessages]);

  return (
    <View
      style={[styles.container, { paddingTop: systemHeight, paddingBottom: keyboardHeight + 20 }]}
      pointerEvents="box-none"
    >
      <FlatList
        key={forceUpdateKey}
        ref={listRef}
        data={uniqueMessages}
        keyExtractor={(item, index) => `${item.id}-${index}-${item.user}`}
        renderItem={({ item }) => <ChatRow item={item} />}
        showsVerticalScrollIndicator={false}
        scrollEnabled={true}
        nestedScrollEnabled={true}
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
    flex: 1,
    width: "100%",
    zIndex: 500,
    elevation: 500,
    overflow: "visible",
    pointerEvents: "box-none",
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

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },

  levelWrapper: {
    width: 48,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 6,
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

  messageContainer: {
    paddingLeft: 0,
    flexDirection: "row",
  },

  jpWinBubble: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 16,
    backgroundColor: "rgba(76, 175, 80, 0.4)",
    borderLeftWidth: 3,
    borderLeftColor: "#4CAF50",
    maxWidth: "85%",
  },

  jpWinText: {
    color: "#4CAF50",
    fontSize: 14,
    fontWeight: "bold",
    lineHeight: 18,
  },

  message: {
    color: "#fff",
    fontSize: 14,
    lineHeight: 18,
    flexWrap: "wrap",
    flex: 1,
  },

  mention: {
    color: "#4aa3ff",
    fontWeight: "bold",
  },

  // System message styles
  systemBubble: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: "rgba(147, 51, 234, 0.25)",
    borderWidth: 1,
    borderColor: "rgba(147, 51, 234, 0.4)",
    maxWidth: "85%",
  },

  systemMessage: {
    color: "rgba(255, 255, 255, 0.9)",
    fontSize: 13,
    fontWeight: "500",
    marginLeft: 8,
    flex: 1,
  },

  systemUsername: {
    color: "#fff",
    fontWeight: "bold",
  },
});