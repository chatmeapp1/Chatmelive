
// src/screen/live/HostLiveScreen.js
// ⚠️ PENTING: Menggunakan Agora Camera untuk Live Streaming
// Gunakan Expo Dev Client untuk menjalankan aplikasi ini

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  AppState,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Text,
  Image,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Camera } from "expo-camera";
import { Audio } from "expo-av";
import {
  createAgoraRtcEngine,
  RtcSurfaceView,
  ChannelProfileType,
  ClientRoleType,
} from "react-native-agora";

import socketService from "../../utils/socket";
import api from "../../utils/api";

import LiveHeader from "./components/LiveHeader";
import LiveViewerList from "./components/LiveViewerList";
import LiveRankBanner from "./components/LiveRankBanner";
import LiveSystemMessage from "./components/LiveSystemMessage";
import LiveGiftEffectSide from "./components/LiveGiftEffectSide";
import BigGiftEffect from "./components/BigGiftEffect";
import BigGiftKapal from "./components/BigGiftKapal";
import LiveChatList from "./components/LiveChatList";
import LiveChatInput from "./components/LiveChatInput";
import LiveBottomBar from "./components/LiveBottomBar";
import LiveSwipeHandler from "./components/LiveSwipeHandler";
import LiveToolbar from "./components/LiveToolbar";
import PKModal from "../../components/PKModal";
import LiveInboxModal from "./components/LiveInboxModal";
import BeautyPanel from "./components/BeautyPanel";
import ComboButton from "./components/ComboButton";

import { AGORA_APP_ID, DEFAULT_CHANNEL } from "../../config/Agora";

const { width, height } = Dimensions.get("window");

export default function HostLiveScreen({ route }) {
  const navigation = useNavigation();
  const { isLive = false, liveTitle = "" } = route?.params ?? {};

  // Agora Engine Reference
  const agoraEngineRef = useRef(null);
  const [isEngineReady, setIsEngineReady] = useState(false);
  const [permissionsGranted, setPermissionsGranted] = useState(false);

  const [host, setHost] = useState({
    id: null,
    name: "Loading...",
    vip: 0,
    level: 1,
    image: "https://picsum.photos/id/112/400/600",
    title: liveTitle,
  });
  const [liveSessionId, setLiveSessionId] = useState(null);

  // ===========================
  // STATES
  // ===========================
  const [giftEffect, setGiftEffect] = useState(null);
  const [bigGift, setBigGift] = useState(null);
  const [bigKapalTrigger, setBigKapalTrigger] = useState(0);

  const [coins, setCoins] = useState(2039);
  const [messages, setMessages] = useState([]);

  const [uiVisible, setUiVisible] = useState(true);
  const [showInput, setShowInput] = useState(false);
  const [viewerListVisible, setViewerListVisible] = useState(false);

  const [pkModalVisible, setPkModalVisible] = useState(false);
  const [inboxVisible, setInboxVisible] = useState(false);
  const [beautyPanelVisible, setBeautyPanelVisible] = useState(false);

  const [cameraType, setCameraType] = useState("front");
  const [isMuted, setIsMuted] = useState(false);
  const [isFlashOn, setIsFlashOn] = useState(false);

  // Combo System
  const [comboVisible, setComboVisible] = useState(false);
  const [giftCount, setGiftCount] = useState(1);
  const [lastGiftSelected, setLastGiftSelected] = useState(null);

  // Live Session Stats
  const [liveStartTime] = useState(Date.now());
  const [totalIncome, setTotalIncome] = useState(0);
  const [viewerCount, setViewerCount] = useState(0);
  const [totalViewers, setTotalViewers] = useState(0);
  const [newFans, setNewFans] = useState(0);
  const [likesCount, setLikesCount] = useState(0);

  // System Message State
  const [systemMessage, setSystemMessage] = useState("Platform ini menganjurkan konten sehat");
  const [showSystemMessage, setShowSystemMessage] = useState(true);
  const [messageFrame, setMessageFrame] = useState(null);

  // Fetch user data function
  const fetchUserData = useCallback(async () => {
    try {
      const response = await api.get("/auth/profile");
      if (response.success && response.user) {
        setHost(prev => ({
          ...prev,
          id: response.user.id,
          name: response.user.name || "User",
          image: response.user.avatar_url || prev.image,
        }));
      }
    } catch (error) {
      console.error("❌ Error fetching user profile:", error);
    }
  }, []);

  // ✅ Reload data when screen is focused (e.g., after uploading avatar)
  useFocusEffect(
    useCallback(() => {
      console.log("🔄 HostLiveScreen focused - reloading user data");
      fetchUserData();
    }, [fetchUserData])
  );

  // Initialize on mount
  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  // ===========================
  // 1. REQUEST PERMISSIONS (Hanya untuk izin, bukan preview)
  // ===========================
  const requestPermissions = async () => {
    try {
      console.log("📷 Requesting camera and microphone permissions...");

      const cameraPermission = await Camera.requestCameraPermissionsAsync();
      const audioPermission = await Audio.requestPermissionsAsync();

      if (cameraPermission.status !== "granted") {
        console.error("❌ Camera permission denied");
        Alert.alert(
          "Izin Kamera Ditolak",
          "Izin kamera diperlukan untuk memulai live streaming.",
          [{ text: "OK", onPress: () => navigation.goBack() }]
        );
        return false;
      }

      if (audioPermission.status !== "granted") {
        console.error("❌ Audio permission denied");
        Alert.alert(
          "Izin Mikrofon Ditolak",
          "Izin mikrofon diperlukan untuk memulai live streaming.",
          [{ text: "OK", onPress: () => navigation.goBack() }]
        );
        return false;
      }

      console.log("✅ Camera and microphone permissions granted");
      setPermissionsGranted(true);
      return true;
    } catch (error) {
      console.error("❌ Error requesting permissions:", error);
      Alert.alert("Error", "Gagal meminta izin: " + error.message);
      return false;
    }
  };

  // ===========================
  // 2. INITIALIZE AGORA ENGINE
  // ===========================
  const initAgora = async () => {
    try {
      console.log("🎬 Initializing Agora Engine...");

      // Create Agora RTC Engine
      const engine = createAgoraRtcEngine();
      agoraEngineRef.current = engine;

      // Initialize with App ID
      engine.initialize({
        appId: AGORA_APP_ID,
        channelProfile: ChannelProfileType.ChannelProfileLiveBroadcasting,
      });

      console.log("✅ Agora Engine initialized with App ID:", AGORA_APP_ID);

      // Set client role as Broadcaster (Host)
      engine.setClientRole(ClientRoleType.ClientRoleBroadcaster);
      console.log("✅ Client role set to Broadcaster");

      // Register event handlers
      engine.registerEventHandler({
        onJoinChannelSuccess: (connection, elapsed) => {
          console.log("✅ Successfully joined channel:", connection.channelId);
          console.log("⏱️ Join elapsed time:", elapsed, "ms");
        },
        onUserJoined: (connection, uid, elapsed) => {
          console.log("👤 Remote user joined:", uid);
        },
        onUserOffline: (connection, uid, reason) => {
          console.log("👋 Remote user left:", uid, "Reason:", reason);
        },
        onError: (err, msg) => {
          console.error("❌ Agora Error:", err, msg);
        },
        onWarning: (warn, msg) => {
          console.warn("⚠️ Agora Warning:", warn, msg);
        },
        onNetworkQuality: (connection, uid, txQuality, rxQuality) => {
          if (txQuality > 3 || rxQuality > 3) {
            console.warn("⚠️ Poor network quality - TX:", txQuality, "RX:", rxQuality);
          }
        },
      });

      console.log("✅ Event handlers registered");
      setIsEngineReady(true);

      return engine;
    } catch (error) {
      console.error("❌ Error initializing Agora:", error);
      Alert.alert("Error Inisialisasi", "Gagal menginisialisasi Agora: " + error.message);
      return null;
    }
  };

  // ===========================
  // 3. START LIVE STREAMING (Menggunakan Agora Camera)
  // ===========================
  const startLive = async () => {
    try {
      const engine = agoraEngineRef.current;
      if (!engine) {
        console.error("❌ Agora engine not initialized");
        return;
      }

      console.log("📹 Starting live stream with Agora camera...");

      // Enable video module
      engine.enableVideo();
      console.log("✅ Video enabled");

      // Set video encoder configuration - HD Quality (720x1280, 30fps, 1200kbps)
      engine.setVideoEncoderConfiguration({
        dimensions: { width: 720, height: 1280 },
        frameRate: 30,
        bitrate: 1200,
        orientationMode: 1, // ADAPTIVE
      });
      console.log("✅ Video encoder configured (720x1280, 30fps, 1200kbps)");

      // Enable beauty options
      engine.setBeautyEffectOptions(true, {
        lighteningContrastLevel: 1,
        lighteningLevel: 0.6,
        smoothnessLevel: 0.7,
        rednessLevel: 0.1,
      });
      console.log("✅ Beauty effects enabled");

      // Start local preview (PENTING: Menggunakan Agora, bukan expo-camera)
      engine.startPreview();
      console.log("✅ Agora camera preview started");

      // Join channel
      const channelName = DEFAULT_CHANNEL;
      const uid = 0; // Let Agora assign UID automatically

      engine.joinChannel(
        null, // Token - null for testing without token authentication
        channelName,
        uid,
        {
          clientRoleType: ClientRoleType.ClientRoleBroadcaster,
        }
      );

      console.log("✅ Joining channel:", channelName);

      // Start live session in backend
      if (host.id) {
        try {
          const sessionRes = await api.post("/live-session/start", {
            hostId: host.id,
            roomId: channelName
          });
          if (sessionRes.success) {
            setLiveSessionId(sessionRes.sessionId);
            console.log("✅ Live session started:", sessionRes.sessionId);
          }
        } catch (error) {
          console.error("Error starting live session:", error);
        }
      }
    } catch (error) {
      console.error("❌ Error starting live:", error);
      Alert.alert("Error Live", "Gagal memulai live streaming: " + error.message);
    }
  };

  // ===========================
  // 4. LEAVE LIVE STREAMING (Clean up)
  // ===========================
  const leaveLive = async () => {
    try {
      const engine = agoraEngineRef.current;
      if (!engine) return;

      console.log("🛑 Leaving live stream...");

      // Stop preview
      engine.stopPreview();
      console.log("✅ Preview stopped");

      // Leave channel
      engine.leaveChannel();
      console.log("✅ Left channel");

      // Release engine
      engine.release();
      console.log("✅ Engine released");

      agoraEngineRef.current = null;
      setIsEngineReady(false);
    } catch (error) {
      console.error("❌ Error leaving live:", error);
    }
  };

  // ===========================
  // Load user profile
  // ===========================
  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (token) {
          const response = await api.get("/auth/profile");
          if (response.data.success) {
            const userData = response.data.data;
            const avatarUrl = userData.avatar_url
              ? `${require("../../utils/config").default.API_BASE_URL}${userData.avatar_url}`
              : "https://picsum.photos/id/112/400/600";

            setHost({
              id: userData.id,
              name: userData.name,
              vip: userData.vipLevel || 0,
              level: userData.level || 1,
              image: avatarUrl,
              title: liveTitle,
            });
            console.log("✅ Host data loaded:", userData);
          }
        }
      } catch (error) {
        console.error("❌ Error loading user profile:", error);
      }
    };

    loadUserProfile();
  }, [liveTitle]);

  // ===========================
  // Initialize Agora on mount
  // ===========================
  useEffect(() => {
    let mounted = true;

    const initialize = async () => {
      // Request permissions first
      const hasPermissions = await requestPermissions();
      if (!hasPermissions) {
        console.error("❌ Permissions not granted, cannot initialize Agora");
        return;
      }

      // Initialize Agora
      const engine = await initAgora();
      if (!engine || !mounted) return;

      // Start live if isLive flag is true
      if (isLive) {
        await startLive();
      }
    };

    initialize();

    // Cleanup on unmount
    return () => {
      mounted = false;
      leaveLive();
    };
  }, [isLive]);

  // Auto close input on app state
  useEffect(() => {
    const sub = AppState.addEventListener("change", (s) => {
      if (s === "active") setShowInput(false);
    });
    return () => sub.remove();
  }, []);

  // Socket.IO integration
  useEffect(() => {
    const roomId = DEFAULT_CHANNEL;

    socketService.connect(host.id, host.name);

    if (isLive) {
      socketService.joinLiveRoom(roomId, host.id, host.name);

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

      socketService.onGiftReceived((data) => {
        // Handle multiple possible socket event formats
        const toId = data.to?.userId ?? data.to;
        const fromUsername = data.from?.username ?? data.from;
        const fromAvatar = data.from?.avatar ?? "https://picsum.photos/50";
        
        // Check if this gift is for the current host
        if (toId === host.id) {
          setGiftEffect({
            ...data.gift,
            username: fromUsername,
            avatar: fromAvatar,
            count: data.count,
          });
          
          // Use hostIncome from socket if available, otherwise calculate based on category
          let giftIncome = 0;
          if (data.gift?.hostIncome && data.gift.hostIncome > 0) {
            // Server-provided income (preferred)
            giftIncome = data.gift.hostIncome;
          } else {
            // Fallback: calculate locally based on category
            const giftValue = (data.gift?.price || 0) * 1; // Only charge once per gift
            const category = data.gift?.category || "umum";
            // Lucky/S-Lucky: 10%, Umum/Luxury: 50%
            const hostShare = (category === "lucky" || category === "s-lucky") ? 0.10 : 0.50;
            giftIncome = Math.floor(giftValue * hostShare);
          }
          
          if (giftIncome > 0) {
            setTotalIncome((prev) => prev + giftIncome);
          }
          
          // Add gift notification to chat
          setMessages((prev) => [
            ...prev,
            {
              id: Date.now(),
              user: fromUsername,
              level: data.from?.level || 1,
              vip: data.from?.vip || 0,
              text: `mengirim ${data.gift?.name || 'gift'} x${data.count || 1}`,
              isGift: true,
            },
          ]);
        }
      });

      socketService.onViewerCount((data) => {
        console.log(`👥 Viewers: ${data.count}`);
        setViewerCount(data.count || 0);
        setTotalViewers((prev) => Math.max(prev, data.count || 0));
      });

      socketService.onUserJoined((data) => {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now(),
            user: "System",
            level: data.level || 1,
            text: `${data.username} bergabung`,
            isSystem: true,
          },
        ]);
      });

      socketService.onUserLeft((data) => {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now(),
            user: "System",
            level: data.level || 1,
            text: `${data.username} keluar`,
            isSystem: true,
          },
        ]);
      });
    }

    return () => {
      if (isLive) {
        socketService.leaveLiveRoom(roomId, host.id, host.name);
      }
      socketService.removeListener("live:new-message");
      socketService.removeListener("live:gift-received");
      socketService.removeListener("live:viewer-count");
      socketService.removeListener("live:user-joined");
      socketService.removeListener("live:user-left");
    };
  }, [isLive]);

  const viewers = [
    { id: 1, name: "Rio", avatar: "https://picsum.photos/id/1011/80" },
    { id: 2, name: "Messi", avatar: "https://picsum.photos/id/1012/80" },
    { id: 3, name: "Jisoo", avatar: "https://picsum.photos/id/1013/80" },
  ];

  // ===========================
  // SEND GIFT HANDLER
  // ===========================
  const sendGift = (giftData) => {
    if (!giftData) return;

    const data = {
      ...giftData,
      username: "Spender",
      avatar: "https://picsum.photos/50",
      idKey: giftData.id,
      count: giftData.count || 1,
    };

    setGiftEffect(data);

    if (giftData.price >= 3000 && giftData.lottie) {
      setBigGift(data);
    }

    if (giftData.id === "kapal") {
      setBigKapalTrigger((t) => t + 1);
    }

    setCoins((c) => c - giftData.price * data.count);

    const giftValue = giftData.price * data.count;
    setTotalIncome((prev) => prev + giftValue);

    setLastGiftSelected(giftData);
  };

  const handleComboPress = () => {
    if (!lastGiftSelected) return;
    sendGift({
      ...lastGiftSelected,
      count: 1,
    });
  };

  // ===========================
  // UI HANDLERS
  // ===========================
  const addMessage = (text) => {
    const newMessage = {
      id: Date.now(),
      user: host.name,
      level: host.level,
      avatar: host.image,
      accumulatedCoins: host.accumulatedCoins || 0,
      text,
    };

    setMessages((prev) => [...prev, newMessage]);

    if (isLive) {
      socketService.sendLiveMessage(
        DEFAULT_CHANNEL,
        host.id,
        host.name,
        text,
        host.level,
        host.accumulatedCoins || 0
      );
    }
  };

  const handlePK = () => setPkModalVisible(true);

  const handleExit = (action) => {
    if (action === "goEndScreen") {
      const duration = Math.floor((Date.now() - liveStartTime) / 1000);

      navigation.navigate("EndLiveScreen", {
        sessionId: liveSessionId,
        duration: duration,
        totalViewers: totalViewers,
        income: totalIncome,
        newFans: newFans,
        likes: likesCount,
        avatar: host.image,
        username: host.name,
        liveNumber: 1,
        hostId: host.id,
      });
    }
  };

  // Switch Camera (Agora)
  const handleSwitchCamera = () => {
    const engine = agoraEngineRef.current;
    if (engine) {
      engine.switchCamera();
      setCameraType((prev) => (prev === "front" ? "back" : "front"));
      console.log("📷 Camera switched to:", cameraType === "front" ? "back" : "front");
    }
  };

  // Toggle Mute (Agora)
  const handleToggleMute = () => {
    const engine = agoraEngineRef.current;
    if (engine) {
      const nextMuted = !isMuted;
      engine.muteLocalAudioStream(nextMuted);
      setIsMuted(nextMuted);
      console.log(nextMuted ? "🔇 Microphone muted" : "🔊 Microphone unmuted");
    }
  };

  // Handle Beauty Settings Change (Agora)
  const handleBeautyChange = (settings) => {
    const engine = agoraEngineRef.current;
    if (!engine) return;

    console.log("💄 Applying beauty settings:", settings);

    // Convert percentage (0-100) to Agora scale (0-1)
    const lighteningLevel = settings.whiten / 100;
    const smoothnessLevel = settings.smooth / 100;
    const sharpnessLevel = settings.sharpen / 100;

    // Apply beauty effects to Agora
    engine.setBeautyEffectOptions(true, {
      lighteningContrastLevel: 1, // 0 = Low, 1 = Normal, 2 = High
      lighteningLevel: lighteningLevel,
      smoothnessLevel: smoothnessLevel,
      sharpnessLevel: sharpnessLevel,
      rednessLevel: 0.1, // Keep some natural skin tone
    });

    console.log("✅ Beauty effects applied - Smooth:", smoothnessLevel, "Whiten:", lighteningLevel, "Sharpen:", sharpnessLevel);
  };

  // Handle System Message with Frame
  const handleSendMessage = (messageData) => {
    console.log("📢 Sending system message:", messageData);
    setSystemMessage(messageData.text);
    setMessageFrame(messageData.frame);
    setShowSystemMessage(true);

    // Auto hide message after 10 seconds
    setTimeout(() => {
      setShowSystemMessage(false);
    }, 10000);
  };

  // ===========================
  // RENDER
  // ===========================
  return (
    <View style={styles.container}>
      {/* BIG GIFT KAPAL */}
      <BigGiftKapal trigger={bigKapalTrigger} />

      {/* BG BEFORE LIVE */}
      {!isLive && (
        <Image source={{ uri: host.image }} style={styles.background} blurRadius={3} />
      )}

      {/* AGORA CAMERA PREVIEW - FULLSCREEN */}
      {isLive && isEngineReady && permissionsGranted && (
        <RtcSurfaceView
          style={StyleSheet.absoluteFill}
          canvas={{ uid: 0 }}
          zOrderMediaOverlay={false}
        />
      )}

      {/* Loading overlay while initializing */}
      {isLive && (!isEngineReady || !permissionsGranted) && (
        <View style={styles.loadingOverlay}>
          <Text style={styles.loadingText}>Menginisialisasi kamera...</Text>
        </View>
      )}

      <LiveSwipeHandler onSwipe={(v) => setUiVisible(v)} />

      {/* MAIN UI */}
      {uiVisible && (
        <>
          <LiveHeader
            host={host}
            viewers={viewers}
            totalViewers={viewers.length}
            onPressViewers={() => setViewerListVisible(true)}
          />

          <LiveRankBanner coins={coins} hostId={host?.id} />

          <View style={styles.systemWrapper}>
            <LiveSystemMessage 
              message={systemMessage}
              frame={messageFrame}
              visible={showSystemMessage}
            />
          </View>

          <LiveChatList messages={messages} systemHeight={180} />

          <LiveBottomBar
            hidden={showInput}
            onChatPress={() => setShowInput(true)}
            onGiftPress={(giftData) => sendGift(giftData)}
            onBigGift={(g) => setBigGift(g)}
            onPressInbox={() => setInboxVisible(true)}
            onPressMenu={() => setBeautyPanelVisible(true)}
            inboxCount={1}
          />

          {lastGiftSelected && (
            <View style={styles.comboWrapper}>
              <ComboButton value={lastGiftSelected.count || 1} onPress={handleComboPress} />
            </View>
          )}

          <LiveToolbar
            onChat={() => setShowInput(true)}
            onGift={(gd) => sendGift(gd)}
            onPK={handlePK}
            onExit={handleExit}
            showPK={isLive}
          />
        </>
      )}

      {/* CHAT INPUT */}
      {showInput && (
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ width: "100%" }}
        >
          <LiveChatInput onSend={(t) => addMessage(t)} onClose={() => setShowInput(false)} />
        </KeyboardAvoidingView>
      )}

      {/* GIFT BUBBLE SIDE EFFECT */}
      <LiveGiftEffectSide gift={giftEffect} />

      {/* BIG GIFT FULLSCREEN */}
      <BigGiftEffect gift={bigGift} />

      {/* MODALS */}
      <LiveViewerList visible={viewerListVisible} onClose={() => setViewerListVisible(false)} />

      <PKModal
        visible={pkModalVisible}
        onClose={() => setPkModalVisible(false)}
        currentHost={host}
        roomId={DEFAULT_CHANNEL}
      />

      <LiveInboxModal visible={inboxVisible} onClose={() => setInboxVisible(false)} />

      <BeautyPanel
        visible={beautyPanelVisible}
        onClose={() => setBeautyPanelVisible(false)}
        isMuted={isMuted}
        isFlashOn={isFlashOn}
        cameraType={cameraType}
        onToggleFlash={() => setIsFlashOn(!isFlashOn)}
        onToggleMute={handleToggleMute}
        onSwitchCamera={handleSwitchCamera}
        onBeautyChange={handleBeautyChange}
        onSendMessage={handleSendMessage}
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
  background: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  systemWrapper: {
    position: "absolute",
    top: 150,
    left: 0,
    right: 0,
  },
  comboWrapper: {
    position: "absolute",
    bottom: 240,
    right: 20,
    zIndex: 3000,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
