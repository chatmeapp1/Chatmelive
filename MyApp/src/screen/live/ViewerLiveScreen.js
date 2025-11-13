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

const { width, height } = Dimensions.get("window");

export default function ViewerLiveScreen({ route }) {
  const { host, liveTitle = "" } = route?.params ?? {};

  const hostData = host || {
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
      { id: Date.now(), user: "Saya", vip: 0, level: 5, text },
    ]);
  };

  return (
    <View style={styles.container}>
      {/* Background: Tampilkan video stream host (untuk sementara pakai image) */}
      <Image source={{ uri: hostData.image }} style={styles.background} />

      <LiveSwipeHandler onSwipe={(visible) => setUiVisible(visible)} />

      {uiVisible && (
        <>
          {/* Header: Sama seperti host tapi tanpa timer/kontrol */}
          <LiveHeader
            host={hostData}
            viewers={viewers}
            totalViewers={viewers.length}
            onPressViewers={() => setViewerListVisible(true)}
            isViewer={true}
          />

          <LiveRankBanner coins={coins} />

          <View style={styles.systemWrapper}>
            <LiveSystemMessage />
          </View>

          <LiveChatList messages={messages} systemHeight={180} />

          {/* Bottom Bar: Sama seperti host (chat, gift, dll) */}
          <LiveBottomBar
            hidden={showInput}
            onChatPress={() => setShowInput(true)}
            onGiftPress={() => {
              setCoins((c) => c + 10);
              setGiftTrigger((t) => t + 1);
            }}
            isViewer={true}
          />
        </>
      )}

      {showInput && (
        <KeyboardAvoidingView
          style={styles.inputContainer}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
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

      {viewerListVisible && (
        <LiveViewerList
          viewers={viewers}
          onClose={() => setViewerListVisible(false)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  background: {
    position: "absolute",
    width,
    height,
    resizeMode: "cover",
  },
  systemWrapper: {
    position: "absolute",
    top: 120,
    left: 10,
    right: 10,
    zIndex: 1,
  },
  inputContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 999,
  },
});
