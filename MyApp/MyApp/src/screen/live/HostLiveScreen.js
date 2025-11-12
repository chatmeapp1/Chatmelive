// src/screen/live/HostLiveScreen.js
import React, { useState, useEffect } from "react";
import {
  View,
  Image,
  StyleSheet,
  Dimensions,
  Platform,
  KeyboardAvoidingView,
  AppState,
} from "react-native";

import LiveHeader from "./components/LiveHeader";
import LiveViewerList from "./components/LiveViewerList";
import LiveRankBanner from "./components/LiveRankBanner";
import LiveSystemMessage from "./components/LiveSystemMessage";
import LiveGiftEffect from "./components/LiveGiftEffect";
import LiveChatList from "./components/LiveChatList";
import LiveChatInput from "./components/LiveChatInput";
import LiveBottomBar from "./components/LiveBottomBar";
import LiveSwipeHandler from "./components/LiveSwipeHandler";
import LiveCameraPreview from "./components/LiveCameraPreview";
import { DEFAULT_CHANNEL } from "../../config/Agora";

const { width, height } = Dimensions.get("window");

export default function HostLiveScreen({ route }) {
  const { isLive = false, liveTitle = "" } = route?.params ?? {};

  const host = {
    id: "host_1",
    name: "GOPAY",
    vip: 1,
    level: 31,
    image: "https://picsum.photos/id/112/400/600",
    title: liveTitle,
  };

  const [coins, setCoins] = useState(2039);
  const [messages, setMessages] = useState([]);
  const [giftTrigger, setGiftTrigger] = useState(0);
  const [uiVisible, setUiVisible] = useState(true);
  const [showInput, setShowInput] = useState(false);
  const [viewerListVisible, setViewerListVisible] = useState(false);

  useEffect(() => {
    const sub = AppState.addEventListener("change", (state) => {
      if (state === "active") setShowInput(false);
    });
    return () => sub.remove();
  }, []);

  const viewers = [
    { id: 1, name: "Rio", level: 4, vip: 0, avatar: "https://picsum.photos/id/1011/80" },
    { id: 2, name: "Messi", level: 12, vip: 1, avatar: "https://picsum.photos/id/1012/80" },
    { id: 3, name: "Jisoo", level: 22, vip: 2, avatar: "https://picsum.photos/id/1013/80" },
  ];

  const addMessage = (text) => {
    setMessages((prev) => [
      ...prev,
      { id: Date.now(), user: host.name, vip: host.vip, level: host.level, text },
    ]);
  };

  return (
    <View style={styles.container}>
      {/* Jika BELUM live, tampilkan foto blur.
          Jika SUDAH live, kamera Agora menggantikan background */}
      {!isLive && (
        <Image source={{ uri: host.image }} style={styles.background} blurRadius={3} />
      )}
      {isLive && (
        <LiveCameraPreview
          channelName={DEFAULT_CHANNEL}
          onReady={() => {}}
        />
      )}

      <LiveSwipeHandler onSwipe={(visible) => setUiVisible(visible)} />

      {uiVisible && (
        <>
          <LiveHeader
            host={host}
            viewers={viewers}
            totalViewers={viewers.length}
            onPressViewers={() => setViewerListVisible(true)}
          />

          <LiveRankBanner coins={coins} />

          <View style={styles.systemWrapper}>
            <LiveSystemMessage />
          </View>

          <LiveChatList messages={messages} systemHeight={180} />

          <LiveBottomBar
            hidden={showInput}
            onChatPress={() => setShowInput(true)}
            onGiftPress={() => {
              setCoins((c) => c + 10);
              setGiftTrigger((t) => t + 1);
            }}
          />
        </>
      )}

      {showInput && (
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.inputWrapper}
        >
          <LiveChatInput
            onSend={(text) => {
              addMessage(text);
              setShowInput(false);
            }}
            onClose={() => setShowInput(false)}
          />
        </KeyboardAvoidingView>
      )}

      <LiveGiftEffect trigger={giftTrigger} />

      <LiveViewerList
        visible={viewerListVisible}
        viewers={viewers}
        onClose={() => setViewerListVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: "transparent",
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
    zIndex: 10,
  },
  inputWrapper: {
    position: "absolute",
    bottom: 0, left: 0, right: 0,
    zIndex: 9999,
  },
});