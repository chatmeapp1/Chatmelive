import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  View,
  ImageBackground,
  Animated,
  StatusBar,
  Keyboard,
  StyleSheet,
  BackHandler,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { scale, verticalScale } from "react-native-size-matters";
import { useFocusEffect } from "@react-navigation/native";

// === Components ===
import {
  GameListModal,
  GameWebViewModal,
  ChatInput,
  PartySeatGrid,
  PartyBottomMenu,
  RoomStatsHeader,
  EmojiPickerModal,
  GridMenuModal,
  RoomSettingsModal,
  RoomHeader,
  ChatOverlay,
  GiftLayer,
  MusicModal,
  ChatListScreen,
  PKModal,
  RoomModeModal,
  JoinEffect,
} from "../components";
import LiveGiftModal from "./live/components/LiveGiftModal";
import JoinEffectLayer from "../components/JoinEffectLayer";

export default function PartyRoomScreen() {
  // === State dasar ===
  const [activeTab, setActiveTab] = useState("Semua");
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "system",
      sender: "Sistem",
      text: "Selamat datang di Chatme Live 🎉",
    },
  ]);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const listRef = useRef(null);
  const [speakingId, setSpeakingId] = useState(null);
  const [isMicOn, setIsMicOn] = useState(true);

  // === Semua modal ===
  const [chatVisible, setChatVisible] = useState(false);
  const [giftVisible, setGiftVisible] = useState(false);
  const [gameListVisible, setGameListVisible] = useState(false);
  const [gameVisible, setGameVisible] = useState(false);
  const [emojiVisible, setEmojiVisible] = useState(false);
  const [gridVisible, setGridVisible] = useState(false);
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [musicVisible, setMusicVisible] = useState(false);
  const [pkVisible, setPkVisible] = useState(false);
  const [chatListVisible, setChatListVisible] = useState(false);
  const [roomModeVisible, setRoomModeVisible] = useState(false);
  const [currentMusic, setCurrentMusic] = useState(null);
  const [activeGift, setActiveGift] = useState(null);
  const [selectedGame, setSelectedGame] = useState(null);

  // === State efek join ===
  const [joinUser, setJoinUser] = useState(null);

  // === Level & seats ===
  const level = 39;
  const [seats] = useState([
    { id: 1, user: { name: "Rina", image: "https://picsum.photos/id/1011/100" } },
    { id: 2, user: { name: "Tono", image: "https://picsum.photos/id/1027/100" } },
    { id: 3, user: { name: "Miko", image: "https://picsum.photos/id/1025/100" } },
    { id: 4, user: null, locked: true },
    { id: 5, user: null },
    { id: 6, user: null },
    { id: 7, user: null },
    { id: 8, user: null },
  ]);

  // === Users for RoomHeader ===
  const [users] = useState([
    { name: "Rina", avatar: "https://picsum.photos/id/1011/100" },
    { name: "Tono", avatar: "https://picsum.photos/id/1027/100" },
    { name: "Miko", avatar: "https://picsum.photos/id/1025/100" },
    { name: "Momo", avatar: "https://picsum.photos/id/1021/100" },
    { name: "Budi", avatar: "https://picsum.photos/id/1022/100" },
    { name: "Lina", avatar: "https://picsum.photos/id/1023/100" },
    { name: "Joko", avatar: "https://picsum.photos/id/1024/100" },
  ]);

  // === Simulasi mic aktif ===
  useEffect(() => {
    const interval = setInterval(() => {
      setSpeakingId(Math.ceil(Math.random() * 8));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // === Simulasi user join ===
  useEffect(() => {
    const timer = setTimeout(() => {
      setJoinUser({
        name: "No name",
        avatar: "https://picsum.photos/200",
        vipLevel: 3,
      });
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  // === Reset modal saat fokus ulang ===
  useFocusEffect(
    useCallback(() => {
      setGridVisible(false);
      setChatListVisible(false);
      setGameListVisible(false);
      setGameVisible(false);
      setMusicVisible(false);
      setSettingsVisible(false);
      setGiftVisible(false);
      setChatVisible(false);
      setPkVisible(false);
      setRoomModeVisible(false);
    }, [])
  );

  // === Tombol back Android ===
  useEffect(() => {
    const backAction = () => {
      const modals = [
        { state: roomModeVisible, set: setRoomModeVisible },
        { state: pkVisible, set: setPkVisible },
        { state: chatListVisible, set: setChatListVisible },
        { state: musicVisible, set: setMusicVisible },
        { state: settingsVisible, set: setSettingsVisible },
        { state: gridVisible, set: setGridVisible },
        { state: giftVisible, set: setGiftVisible },
        { state: gameListVisible, set: setGameListVisible },
        { state: gameVisible, set: setGameVisible },
        { state: emojiVisible, set: setEmojiVisible },
        { state: chatVisible, set: setChatVisible },
      ];

      const active = modals.find((m) => m.state);
      if (active) {
        active.set(false);
        return true;
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);
    return () => backHandler.remove();
  }, [
    pkVisible,
    chatListVisible,
    musicVisible,
    settingsVisible,
    gridVisible,
    giftVisible,
    gameListVisible,
    gameVisible,
    emojiVisible,
    chatVisible,
    roomModeVisible,
  ]);

  // === Kirim pesan chat ===
  const handleSendMessage = (text) => {
    const msg = {
      id: Date.now(),
      type: "chat",
      sender: "Saya",
      text,
      level: 29,
    };
    setMessages((prev) => [...prev, msg]);
    setChatVisible(false);
    Keyboard.dismiss();
  };

  // === Tombol bawah ===
  const handleBottomMenu = (id) => {
    [
      setChatVisible,
      setGiftVisible,
      setGameListVisible,
      setGameVisible,
      setEmojiVisible,
      setGridVisible,
      setSettingsVisible,
      setMusicVisible,
      setChatListVisible,
      setPkVisible,
      setRoomModeVisible,
    ].forEach((fn) => fn(false));

    switch (id) {
      case "chat":
        setChatVisible(true);
        break;
      case "gift":
        setGiftVisible(true);
        break;
      case "mic":
        setIsMicOn(!isMicOn);
        break;
      case "game":
        setGameListVisible(true);
        break;
      case "emoji":
        setEmojiVisible(true);
        break;
      case "grid":
        setGridVisible(true);
        break;
    }
  };

  // === Emoji untuk tiap seat ===
  const [seatEmojis, setSeatEmojis] = useState({});
  const [selectedSeatId, setSelectedSeatId] = useState(1);
  const handleSelectEmoji = (emoji) => {
    const seatId = selectedSeatId || 1;
    setSeatEmojis((prev) => ({ ...prev, [seatId]: emoji }));
    setTimeout(() => setSeatEmojis((prev) => ({ ...prev, [seatId]: null })), 2500);
  };

  return (
    <View style={styles.fullscreenContainer}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <ImageBackground
        source={{
          uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ-VYAAfBRKwrzkjKWQOd0p300-_Th1ldb_ALnSgCEyG7Xbxc2lWv5sc989&s=10",
        }}
        style={StyleSheet.absoluteFillObject}
        resizeMode="cover"
      />

      <SafeAreaView style={styles.safeAreaContent}>
        {/* Header Room */}
        <RoomHeader
          host={{
            name: "no name",
            avatar: "https://picsum.photos/200",
            id: 99915,
            hasFrame: true,
          }}
          level={level}
          users={users}
        />

        <RoomStatsHeader users={users.map((u) => ({ image: u.avatar }))} trophy={0} hot="50+" />

        <PartySeatGrid
          seats={seats}
          speakingId={speakingId}
          seatEmojis={seatEmojis}
          onSeatPress={(seat) => setSelectedSeatId(seat.id)}
        />

        <ChatOverlay
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          fadeAnim={fadeAnim}
          messages={messages}
          listRef={listRef}
        />

        {!chatVisible && <PartyBottomMenu active="mic" onPress={handleBottomMenu} />}
      </SafeAreaView>

      {/* === Semua Modal === */}
      <ChatInput visible={chatVisible} onSend={handleSendMessage} onClose={() => setChatVisible(false)} />
      <LiveGiftModal
        visible={giftVisible}
        onClose={() => setGiftVisible(false)}
        onSend={(giftData) => setActiveGift(giftData.gift)}
      />
      <GameListModal
        visible={gameListVisible}
        onClose={() => setGameListVisible(false)}
        onSelectGame={(game) => {
          setSelectedGame(game);
          setGameListVisible(false);
          setTimeout(() => setGameVisible(true), 200);
        }}
      />
      <GameWebViewModal
        visible={gameVisible}
        onClose={() => setGameVisible(false)}
        url={
          selectedGame
            ? `https://chatmeapp.my.id/game/${selectedGame.name.toLowerCase().replace(" ", "")}`
            : ""
        }
      />
      <EmojiPickerModal visible={emojiVisible} onClose={() => setEmojiVisible(false)} onSelectEmoji={handleSelectEmoji} />
      <GridMenuModal visible={gridVisible} onClose={() => setGridVisible(false)} />
      <RoomSettingsModal visible={settingsVisible} onClose={() => setSettingsVisible(false)} />
      <MusicModal visible={musicVisible} onClose={() => setMusicVisible(false)} />
      <ChatListScreen visible={chatListVisible} onClose={() => setChatListVisible(false)} />
      <PKModal visible={pkVisible} onClose={() => setPkVisible(false)} />
      <RoomModeModal visible={roomModeVisible} onClose={() => setRoomModeVisible(false)} />

      {activeGift && <GiftLayer gift={activeGift} onFinish={() => setActiveGift(null)} />}

      {/* Efek Join */}
      {joinUser && <JoinEffectLayer activeUser={joinUser} />}
    </View>
  );
}

const styles = StyleSheet.create({
  fullscreenContainer: { flex: 1, backgroundColor: "#000" },
  safeAreaContent: {
    flex: 1,
    justifyContent: "flex-start",
    paddingHorizontal: scale(8),
    paddingBottom: verticalScale(10),
  },
});