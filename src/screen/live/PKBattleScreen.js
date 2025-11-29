
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
  FlatList,
  Animated,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import socketService from "../../utils/socket";
import api from "../../utils/api";

import LiveChatList from "./components/LiveChatList";
import LiveChatInput from "./components/LiveChatInput";
import LiveBottomBar from "./components/LiveBottomBar";
import LiveGiftEffectSide from "./components/LiveGiftEffectSide";

const { width, height } = Dimensions.get("window");
const PK_DURATION = 5 * 60; // 5 minutes

export default function PKBattleScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { hostLeft, hostRight, roomId, isHost, viewerId } = route.params || {};

  const [timeLeft, setTimeLeft] = useState(PK_DURATION);
  const [leftScore, setLeftScore] = useState(0);
  const [rightScore, setRightScore] = useState(0);
  const [leftContributors, setLeftContributors] = useState([]);
  const [rightContributors, setRightContributors] = useState([]);
  const [messages, setMessages] = useState([]);
  const [showInput, setShowInput] = useState(false);
  const [giftEffect, setGiftEffect] = useState(null);
  const [battleId, setBattleId] = useState(null);

  const [pulseAnim] = useState(new Animated.Value(1));

  // Pulse animation for timer
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  // Set battle ID from params
  useEffect(() => {
    if (route.params?.battleId) {
      setBattleId(route.params.battleId);
    }
  }, []);

  // Timer countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          endBattle();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Socket.IO listeners
  useEffect(() => {
    socketService.onPKScoreUpdate((data) => {
      if (data.side === "left") {
        setLeftScore(data.score);
        setLeftContributors(data.contributors || []);
      } else {
        setRightScore(data.score);
        setRightContributors(data.contributors || []);
      }
    });

    socketService.onPKEnd((data) => {
      setTimeout(() => {
        navigation.goBack();
      }, 3000);
    });

    return () => {
      socketService.removeListener("pk:score-updated");
      socketService.removeListener("pk:ended");
    };
  }, []);

  const endBattle = async () => {
    try {
      await api.post("/pk/end", {
        battleId,
        hostScore: leftScore,
        opponentScore: rightScore,
      });

      socketService.emit("pk:end", {
        roomId,
        battleId,
        leftScore,
        rightScore,
        winner: leftScore > rightScore ? hostLeft : hostRight,
      });
    } catch (error) {
      console.error("Error ending PK:", error);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleGiftSend = (giftData) => {
    const side = isHost ? "left" : "right";
    const newScore = side === "left" ? leftScore + giftData.price : rightScore + giftData.price;

    if (side === "left") {
      setLeftScore(newScore);
    } else {
      setRightScore(newScore);
    }

    socketService.emit("pk:score-update", {
      roomId,
      side,
      score: newScore,
      gift: giftData,
    });

    setGiftEffect(giftData);
  };

  const handleHostClick = (host) => {
    navigation.navigate("ViewerLiveScreen", {
      host: host,
      channelName: `room_${host.id}`,
    });
  };

  const renderContributor = ({ item }) => (
    <View style={styles.contributorCircle}>
      <Image source={{ uri: item.avatar }} style={styles.contributorAvatar} />
    </View>
  );

  const progressWidth = leftScore + rightScore > 0
    ? (leftScore / (leftScore + rightScore)) * 100
    : 50;

  return (
    <View style={styles.container}>
      {/* Background Split */}
      <LinearGradient
        colors={["#ff4757", "#c0392b"]}
        style={[styles.bgSplit, { width: "50%" }]}
      />
      <LinearGradient
        colors={["#3498db", "#2980b9"]}
        style={[styles.bgSplit, { width: "50%", right: 0 }]}
      />

      {/* PK Frame Image */}
      <Image
        source={require("../../../assets/frame_pk.png")}
        style={styles.pkFrame}
        resizeMode="contain"
      />

      {/* Close Button */}
      <TouchableOpacity
        style={styles.closeBtn}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="close" size={28} color="#fff" />
      </TouchableOpacity>

      {/* Timer */}
      <Animated.View style={[styles.timerContainer, { transform: [{ scale: pulseAnim }] }]}>
        <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
      </Animated.View>

      {/* Left Host Info */}
      <TouchableOpacity
        style={styles.hostLeftInfo}
        onPress={() => handleHostClick(hostLeft)}
        activeOpacity={0.8}
      >
        <View style={styles.hostNameBubble}>
          <Text style={styles.hostNameText} numberOfLines={1}>
            {hostLeft?.name || "Meran"}
          </Text>
        </View>
      </TouchableOpacity>

      {/* Right Host Info */}
      <TouchableOpacity
        style={styles.hostRightInfo}
        onPress={() => handleHostClick(hostRight)}
        activeOpacity={0.8}
      >
        <View style={styles.hostNameBubble}>
          <Text style={styles.hostNameText} numberOfLines={1}>
            {hostRight?.name || "Biru"}
          </Text>
        </View>
      </TouchableOpacity>

      {/* Left Score */}
      <View style={styles.scoreLeft}>
        <Text style={styles.scoreText}>{leftScore}</Text>
      </View>

      {/* Right Score */}
      <View style={styles.scoreRight}>
        <Text style={styles.scoreText}>{rightScore}</Text>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <LinearGradient
            colors={["#ff4757", "#ff6b81"]}
            style={[styles.progressFill, { width: `${progressWidth}%` }]}
          />
        </View>
      </View>

      {/* Left Contributors */}
      <View style={styles.contributorsLeft}>
        <FlatList
          data={leftContributors.slice(0, 3)}
          renderItem={renderContributor}
          keyExtractor={(item) => item.id?.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
      </View>

      {/* Right Contributors */}
      <View style={styles.contributorsRight}>
        <FlatList
          data={rightContributors.slice(0, 3)}
          renderItem={renderContributor}
          keyExtractor={(item) => item.id?.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
      </View>

      {/* Chat Messages */}
      <LiveChatList messages={messages} systemHeight={200} />

      {/* Bottom Bar */}
      {!showInput && (
        <LiveBottomBar
          onChatPress={() => setShowInput(true)}
          onGiftPress={handleGiftSend}
          onBigGift={() => {}}
          onPressInbox={() => {}}
          onPressMenu={() => {}}
          inboxCount={0}
        />
      )}

      {/* Chat Input */}
      {showInput && (
        <LiveChatInput
          onSend={(text) => {
            setMessages((prev) => [
              ...prev,
              { id: Date.now(), user: "You", text, level: 1, vip: 0 },
            ]);
            setShowInput(false);
          }}
          onClose={() => setShowInput(false)}
        />
      )}

      {/* Gift Effects */}
      <LiveGiftEffectSide gift={giftEffect} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  bgSplit: {
    position: "absolute",
    top: 0,
    bottom: 0,
    opacity: 0.3,
  },
  pkFrame: {
    position: "absolute",
    width: width * 0.9,
    height: height * 0.35,
    top: height * 0.3,
    left: width * 0.05,
  },
  closeBtn: {
    position: "absolute",
    top: 50,
    right: 20,
    backgroundColor: "rgba(0,0,0,0.4)",
    borderRadius: 20,
    padding: 8,
    zIndex: 100,
  },
  timerContainer: {
    position: "absolute",
    top: height * 0.56,
    left: width / 2 - 50,
    alignItems: "center",
    zIndex: 50,
  },
  timerText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    textShadowColor: "rgba(0,0,0,0.8)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  hostLeftInfo: {
    position: "absolute",
    top: height * 0.32,
    left: 20,
  },
  hostRightInfo: {
    position: "absolute",
    top: height * 0.32,
    right: 20,
  },
  hostNameBubble: {
    backgroundColor: "rgba(255,255,255,0.25)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    maxWidth: 120,
  },
  hostNameText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
    textAlign: "center",
  },
  scoreLeft: {
    position: "absolute",
    top: height * 0.36,
    left: 30,
  },
  scoreRight: {
    position: "absolute",
    top: height * 0.36,
    right: 30,
  },
  scoreText: {
    fontSize: 48,
    fontWeight: "900",
    color: "#fff",
    textShadowColor: "rgba(0,0,0,0.8)",
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 6,
  },
  progressContainer: {
    position: "absolute",
    top: height * 0.55,
    left: 40,
    right: 40,
  },
  progressBar: {
    height: 6,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 3,
  },
  contributorsLeft: {
    position: "absolute",
    top: height * 0.48,
    left: 20,
    flexDirection: "row",
  },
  contributorsRight: {
    position: "absolute",
    top: height * 0.48,
    right: 20,
    flexDirection: "row",
  },
  contributorCircle: {
    marginHorizontal: 2,
  },
  contributorAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: "#ffd700",
  },
});
