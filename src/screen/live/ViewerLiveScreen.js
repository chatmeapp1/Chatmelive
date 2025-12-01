// src/screen/live/ViewerLiveScreen.js
import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Image,
  StyleSheet,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Animated,
  Alert,
  Modal,
  Text,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import socketService from "../../utils/socket";
import api, { authAPI } from "../../utils/api";
import getEnvVars from "../../utils/env";

import LiveHeader from "./components/LiveHeader";
import LiveViewerList from "./components/LiveViewerList";
import LiveRankBanner from "./components/LiveRankBanner";
import LiveSystemMessage from "./components/LiveSystemMessage";
import LiveGiftEffectSide from "./components/LiveGiftEffectSide";
import BigGiftEffect from "./components/BigGiftEffect";
import BigGiftKapal from "./components/BigGiftKapal";
import LiveChatList from "./components/LiveChatList";
import LiveChatInput from "./components/LiveChatInput";
import LiveSwipeHandler from "./components/LiveSwipeHandler";
import LiveCameraPreview from "./components/LiveCameraPreview";
import LiveBottomBar from "./components/LiveBottomBar";
import ComboButton from "./components/ComboButton";
import FloatingGiftCombo from "./components/FloatingGiftCombo";
import GameListModal from "../../components/GameListModal";
import { useGiftCombo } from "../../hooks/useGiftCombo";

import { DEFAULT_CHANNEL } from "../../config/Agora";

const { width, height } = Dimensions.get("window");

export default function ViewerLiveScreen({ route }) {
  const navigation = useNavigation();
  const { host, channelName = DEFAULT_CHANNEL } = route?.params ?? {};

  // ===========================
  // STATES
  // ===========================
  const [viewer, setViewer] = useState({
    id: 0,
    name: "User",
    vip: 0,
    level: 1,
  });

  const [bigGift, setBigGift] = useState(null);
  const [bigKapalTrigger, setBigKapalTrigger] = useState(0);
  const [giftEffect, setGiftEffect] = useState(null);

  const [coins, setCoins] = useState(0);
  const [messages, setMessages] = useState([]);
  const [viewerCount, setViewerCount] = useState(1);
  const [viewers, setViewers] = useState([]);

  const [uiVisible, setUiVisible] = useState(true);
  const [showInput, setShowInput] = useState(false);
  const [viewerListVisible, setViewerListVisible] = useState(false);
  const [gameModalVisible, setGameModalVisible] = useState(false);
  const [giftModalOpen, setGiftModalOpen] = useState(false);
  const [giftComboCount, setGiftComboCount] = useState(1);
  const [selectedGiftData, setSelectedGiftData] = useState(null);
  const [insufficientBalanceError, setInsufficientBalanceError] = useState(null);
  const { activeCombo, handleGiftTap } = useGiftCombo();
  const [menuAnimations] = useState({
    chat: new Animated.Value(0),
    filter: new Animated.Value(0),
    gift: new Animated.Value(0),
    game: new Animated.Value(0),
  });

  // Load user data function
  const loadUserData = useCallback(async () => {
    try {
      const response = await authAPI.getProfile();
      if (response?.success && response?.data) {
        const user = response.data;
        setViewer({
          id: user.id,
          name: user.name || "User",
          vip: user.vipLevel || 0,
          level: user.level || 1,
        });
        // Load actual coin balance from API
        setCoins(user.balance || 0);
      }
    } catch (error) {
      console.error("❌ Failed to load viewer data:", error);
    }
  }, []);

  // Load viewers list from server
  const loadViewersList = useCallback(async () => {
    try {
      const response = await api.get(`/api/live-session/${channelName}/viewers`);
      if (response.data.success) {
        setViewers(response.data.data || []);
      }
    } catch (error) {
      if (error.response?.status !== 404) {
        console.error("❌ Error loading viewers list:", error);
      }
      // Silently handle 404 - room might not exist yet
    }
  }, [channelName]);

  // Load data on mount
  useEffect(() => {
    loadUserData();
  }, [loadUserData]);

  // ✅ Reload data when screen is focused (e.g., after uploading avatar)
  useFocusEffect(
    useCallback(() => {
      console.log("🔄 ViewerLiveScreen focused - reloading user data");
      loadUserData();
    }, [loadUserData])
  );

  // Socket.IO integration
  useEffect(() => {
    if (!viewer.id) return; // Wait for viewer data to load

    const roomId = channelName;

    // Connect socket
    socketService.connect(viewer.id, viewer.name);

    // Join live room
    socketService.joinLiveRoom(roomId, viewer.id, viewer.name);

    // Load viewers list
    loadViewersList();

    // Refresh viewers list every 3 seconds
    const viewersInterval = setInterval(() => {
      loadViewersList();
    }, 3000);

    // Listen for new messages
    socketService.onLiveMessage((data) => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          user: data.username,
          level: data.level,
          vip: data.vip,
          text: data.message,
        },
      ]);
    });

    // Listen for gifts
    socketService.onGiftReceived((data) => {
      // Don't show effect if it's from the current viewer (already shown when sent)
      if (data.from.userId !== viewer.id) {
        setGiftEffect({
          ...data.gift,
          username: data.from.username,
          avatar: data.from.avatar || "https://picsum.photos/50",
          count: data.count,
        });
      }
    });

    // Listen for viewer count
    socketService.onViewerCount((data) => {
      setViewerCount(data.count);
    });

    // Listen for users joining (consolidated - using onLiveUserJoined)
    socketService.onLiveUserJoined((data) => {
      const message = {
        id: Date.now() + Math.random(),
        user: data.username || "User",
        level: data.level || 1,
        text: "bergabung ke ruangan",
        isSystem: true,
      };
      setMessages((prev) => [...prev, message]);
      console.log(`✅ User ${data.username} joined room`);
    });

    // Listen for users leaving
    socketService.onUserLeft((data) => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          user: "System",
          text: `${data.username} keluar`,
          isSystem: true,
        },
      ]);
    });

    // Listen for PK start
    socketService.onPKStarted((data) => {
      // Navigate viewer to PK Battle Screen
      navigation.navigate("PKBattleScreen", {
        hostLeft: data.hostLeft,
        hostRight: data.hostRight,
        roomId: data.roomId,
        isHost: false,
        viewerId: viewer.id,
      });
    });

    // Listen for JP win events
    socketService.onJPWin((data) => {
      const jpWinMessage = {
        id: Date.now(),
        isJPWin: true,
        viewer: data.viewer,
        jpLevel: data.jpLevel,
        jpWinAmount: data.jpWinAmount,
      };
      setMessages((prev) => [...prev, jpWinMessage]);
    });

    // Cleanup
    return () => {
      clearInterval(viewersInterval);
      socketService.leaveLiveRoom(roomId, viewer.id, viewer.name);
      socketService.removeListener("live:new-message");
      socketService.removeListener("live:gift-received");
      socketService.removeListener("live:viewer-count");
      socketService.removeListener("live:user-joined");
      socketService.removeListener("live:user-left");
      socketService.removeListener("pk:started");
      socketService.removeListener("live:jp-win");
    };
  }, [viewer.id, viewer.name, channelName, loadViewersList]);

  // ===========================
  // SEND GIFT HANDLER
  // ===========================
  const sendGift = async (giftData) => {
    if (!giftData) return;

    const count = giftData.count || 1;
    const totalPrice = giftData.price * count;

    // ❌ VALIDATE BALANCE FIRST
    if (coins < totalPrice) {
      console.warn("❌ Coin tidak cukup! Perlu:", totalPrice, "Punya:", coins);
      return;
    }

    try {
      const token = await AsyncStorage.getItem("userToken");
      const { API_URL } = getEnvVars();

      // Only luxury gifts skip JP - use JP for s-lucky & lucky only
      const isJPGift = giftData.category === "s-lucky" || giftData.category === "lucky";

      // CALL JP-GIFT API ONLY FOR S-LUCKY & LUCKY
      let result;
      if (isJPGift) {
        const response = await fetch(`${API_URL}/api/jp-gift/send`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify({
            receiverId: host?.id || 0,
            giftPrice: giftData.price,
            combo: count,
            roomId: channelName,
          }),
        });

        result = await response.json();

        // ❌ API FAILED - CHECK FOR ERROR
        if (!result || !result.success) {
          const errorMsg = result?.message || result?.error || "Unknown error";
          console.error("❌ JP Gift Error:", errorMsg);
          setInsufficientBalanceError(errorMsg);
          return;
        }
      } else {
        // For luxury gifts - just deduct coins without JP
        await fetch(`${API_URL}/api/gifts/send`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify({
            receiverId: host?.id || 0,
            giftPrice: giftData.price,
            count: count,
            roomId: channelName,
          }),
        });

        result = {
          success: true,
          saldoAkhir: coins - totalPrice,
          hostIncome: Math.floor(totalPrice * 0.5), // 50% for luxury
          jpWin: false,
          message: "Luxury gift sent successfully",
        };
      }

      // ✅ GIFT SENT SUCCESSFULLY
      // Use server-calculated hostIncome for accuracy
      const hostIncome = result.hostIncome || 0;

      const data = {
        ...giftData,
        username: viewer.name,
        avatar: "https://picsum.photos/50",
        idKey: giftData.id,
        count: count,
      };

      // Store gift data + combo count for ComboButton
      setSelectedGiftData({ ...giftData, count });

      // Broadcast gift via Socket.IO with server-calculated host income
      socketService.sendGift(
        channelName,
        { userId: viewer.id, username: viewer.name, avatar: "https://picsum.photos/50", level: viewer.level, vip: viewer.vip },
        { userId: host?.id || 0, username: host?.name || "Host" },
        { ...giftData, category: giftData.category, hostIncome: hostIncome, jpWin: result.jpWin },
        count
      );

      // Show side gift effect for non-luxury gifts
      if (giftData.category !== "luxury") {
        setGiftEffect(data);
      }

      // Big gift animation for luxury items
      if (giftData.category === "luxury" && giftData.lottie) {
        setBigGift(data);
      }

      // kapal special trigger
      if (giftData.id === "kapal") {
        setBigKapalTrigger((t) => t + 1);
      }

      // ✅ UPDATE COINS BASED ON BACKEND RESPONSE
      // Result = coins - totalPrice + (jpWin ? jpWinAmount : 0)
      const newBalance = result.saldoAkhir;
      setCoins(newBalance);

      // Trigger combo bubble animation
      handleGiftTap(giftData, viewer);

      // Emit JP win event if user won
      if (result.jpWin) {
        socketService.emitJPWin({
          viewer: viewer.name,
          jpLevel: result.jpLevel,
          jpWinAmount: result.jpWinAmount,
        });
      }

      console.log("✅ Gift sent:", result.message);
    } catch (error) {
      console.error("❌ Error sending gift:", error);
    }
  };

  // ===========================
  // - UI
  // ===========================
  const addMessage = (text) => {
    const newMessage = {
      id: Date.now(),
      user: viewer.name,
      level: viewer.level,
      vip: viewer.vip,
      text,
    };

    setMessages((prev) => [...prev, newMessage]);

    // Broadcast via Socket.IO
    socketService.sendLiveMessage(
      channelName,
      viewer.id,
      viewer.name,
      text,
      viewer.level,
      viewer.vip
    );
  };

  return (
    <View style={styles.container}>
      {/* BIG GIFT KAPAL */}
      <BigGiftKapal trigger={bigKapalTrigger} />

      {/* INSUFFICIENT BALANCE WARNING MODAL */}
      <Modal
        visible={!!insufficientBalanceError}
        transparent
        animationType="fade"
        statusBarTranslucent
      >
        <View style={styles.modalOverlay}>
          <View style={styles.warningBox}>
            <View style={styles.warningHeader}>
              <Text style={styles.warningIcon}>⚠️</Text>
              <Text style={styles.warningTitle}>Saldo Tidak Cukup</Text>
            </View>
            <Text style={styles.warningMessage}>{insufficientBalanceError}</Text>
            <TouchableOpacity
              style={styles.warningButton}
              onPress={() => setInsufficientBalanceError(null)}
              activeOpacity={0.7}
            >
              <Text style={styles.warningButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* CAMERA PREVIEW (Viewer mode) */}
      <LiveCameraPreview
        channelName={channelName}
        onReady={() => {}}
        isHost={false}
        pointerEvents="none"
      />

      <LiveSwipeHandler onSwipe={(v) => setUiVisible(v)} />

      {/* ===========================
           MAIN UI
      =========================== */}
      {uiVisible && (
        <>
          <LiveHeader
            host={host || { name: "Host", level: 30, vip: 1, image: "https://picsum.photos/200" }}
            viewers={viewers}
            totalViewers={viewerCount}
            onPressViewers={() => setViewerListVisible(true)}
            isHost={false}
            onClose={() => {
              // Disconnect from room before going back
              socketService.leaveLiveRoom(channelName, viewer.id, viewer.name);
              navigation.goBack();
            }}
          />

          <LiveRankBanner coins={coins} isHost={false} pointerEvents="box-none" />

          <View style={styles.systemWrapper} pointerEvents="box-none">
            <LiveSystemMessage />
          </View>

          <View style={styles.chatListWrapper} pointerEvents="box-none">
            <LiveChatList messages={messages} systemHeight={180} forceUpdateKey={activeCombo ? activeCombo.count : 0} />
          </View>

          {/* BOTTOM ACTION BAR */}
          {!showInput && (
            <LiveBottomBar
              hidden={false}
              onChatPress={() => setShowInput(true)}
              onGiftPress={sendGift}
              onBigGift={(gift) => {
                setBigGift(gift);
                setBigKapalTrigger((t) => t + 1);
              }}
              onPressInbox={() => console.log("Inbox pressed")}
              onPressMenu={() => console.log("Menu pressed")}
              inboxCount={0}
              onGiftModalOpen={() => setGiftModalOpen(true)}
              onGiftModalClose={() => setGiftModalOpen(false)}
              onComboChange={(count) => setGiftComboCount(count)}
              onJPResult={() => {}}
              userCoins={coins}
            />
          )}

          {/* COMBO BUTTON - Shows when gift modal is open, stays for 60s after send */}
          <ComboButton
            visible={giftModalOpen || !!selectedGiftData}
            count={selectedGiftData?.count || giftComboCount}
            giftData={selectedGiftData}
            viewer={viewer}
            host={host}
            roomId={channelName}
            onJPResult={(jpData) => console.log("JP Result:", jpData)}
            onGiftTap={handleGiftTap}
            onHide={() => setSelectedGiftData(null)}
          />
        </>
      )}

      {/* CHAT INPUT */}
      {showInput && (
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ width: "100%" }}
        >
          <LiveChatInput
            onSend={(t) => addMessage(t)}
            onClose={() => setShowInput(false)}
          />
        </KeyboardAvoidingView>
      )}

      {/* FLOATING GIFT COMBO BUBBLE */}
      <FloatingGiftCombo activeCombo={activeCombo} />

      {/* GIFT BUBBLE SIDE EFFECT - Only show if NOT in combo mode */}
      {!activeCombo && <LiveGiftEffectSide gift={giftEffect} />}

      {/* BIG GIFT FULLSCREEN */}
      <BigGiftEffect gift={bigGift} />

      {/* MODALS */}
      <LiveViewerList
        visible={viewerListVisible}
        onClose={() => setViewerListVisible(false)}
      />

      {/* GAME MODAL */}
      <GameListModal
        visible={gameModalVisible}
        onClose={() => setGameModalVisible(false)}
        onSelectGame={(game) => {
          console.log("Selected game:", game);
          // Handle game selection
        }}
      />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#000",
  },
  systemWrapper: {
    position: "absolute",
    top: 100,
    left: 0,
    right: 0,
    zIndex: 10,
    paddingHorizontal: 10,
  },
  chatListWrapper: {
    position: "absolute",
    bottom: 130,
    left: 0,
    right: 0,
    height: "38%",
    zIndex: 5,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: "hidden",
  },
  bottomMenuContainer: {
    position: "absolute",
    bottom: 30,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingHorizontal: 20,
    zIndex: 100,
  },
  menuButton: {
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  circleBtn: {
    width: 55,
    height: 55,
    borderRadius: 27.5,
    backgroundColor: "rgba(0,0,0,0.18)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.25)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 5,
  },
  circleBtnChat: {
    width: 55,
    height: 55,
    borderRadius: 27.5,
    backgroundColor: "rgba(0,0,0,0.18)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.25)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 5,
  },
  // WARNING MODAL STYLES
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  warningBox: {
    backgroundColor: "#2a2a2a",
    borderRadius: 16,
    padding: 24,
    width: "80%",
    maxWidth: 320,
    borderWidth: 1,
    borderColor: "rgba(255, 100, 100, 0.3)",
    shadowColor: "#FF6464",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  warningHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  warningIcon: {
    fontSize: 28,
    marginRight: 10,
  },
  warningTitle: {
    color: "#FF6464",
    fontSize: 18,
    fontWeight: "700",
  },
  warningMessage: {
    color: "#ccc",
    fontSize: 14,
    marginBottom: 20,
    lineHeight: 20,
  },
  warningButton: {
    backgroundColor: "#FF6464",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  warningButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },

  closeButtonBottom: {
    position: "absolute",
    bottom: 20,
    right: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(255, 50, 80, 0.8)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
});