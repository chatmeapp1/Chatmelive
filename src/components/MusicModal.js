import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Dimensions,
  Slider,
  Animated,
} from "react-native";
import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";

const { width, height } = Dimensions.get("window");

export default function MusicModal({ visible, onClose, onSelect }) {
  const [musicList, setMusicList] = useState([
    { id: "1", title: "Dreamscape", uri: "https://files.freemusicarchive.org/storage-freemusicarchive-org/music/Dreamscape.mp3" },
    { id: "2", title: "Summer Vibes", uri: "https://files.freemusicarchive.org/storage-freemusicarchive-org/music/SummerVibes.mp3" },
  ]);
  const [localMusic, setLocalMusic] = useState(null);
  const [current, setCurrent] = useState(null);
  const [musicVolume, setMusicVolume] = useState(50);
  const [micVolume, setMicVolume] = useState(100);

  // animasi modal
  const slideY = new Animated.Value(height);

  useEffect(() => {
    if (visible) {
      Animated.timing(slideY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideY, {
        toValue: height,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const pickLocalMusic = async () => {
    const res = await DocumentPicker.getDocumentAsync({
      type: "audio/mpeg",
    });
    if (res.type === "success") {
      setLocalMusic({
        id: Date.now().toString(),
        title: res.name,
        uri: res.uri,
      });
    }
  };

  const playMusic = async (music) => {
    try {
      setCurrent(music);
      await RtcEngine.startAudioMixing(
        music.uri,
        false, // semua user dengar
        false, // tetap bisa bicara
        1 // main 1x
      );
      onSelect?.(music);
    } catch (e) {
      console.log("Gagal play:", e);
    }
  };

  const stopMusic = async () => {
    try {
      await RtcEngine.stopAudioMixing();
      setCurrent(null);
    } catch (e) {
      console.log("Stop gagal:", e);
    }
  };

  const adjustVolumes = async (musicVol, micVol) => {
    try {
      await RtcEngine.adjustAudioMixingVolume(musicVol);
      await RtcEngine.adjustRecordingSignalVolume(micVol);
    } catch (e) {
      console.log("Volume error:", e);
    }
  };

  useEffect(() => {
    adjustVolumes(musicVolume, micVolume);
  }, [musicVolume, micVolume]);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.musicItem, current?.id === item.id && styles.activeMusic]}
      onPress={() => playMusic(item)}
    >
      <Ionicons name="musical-notes" size={22} color="#A8E6CF" />
      <Text style={styles.musicTitle} numberOfLines={1}>
        {item.title}
      </Text>
      {current?.id === item.id && (
        <Ionicons name="pause-circle" size={22} color="#FFD700" />
      )}
    </TouchableOpacity>
  );

  return (
    <Modal visible={visible} transparent animationType="none">
      <BlurView intensity={30} tint="dark" style={StyleSheet.absoluteFill} />
      <Animated.View
        style={[styles.sheet, { transform: [{ translateY: slideY }] }]}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>🎵 Pemutar Musik</Text>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <TouchableOpacity style={styles.addBtn} onPress={pickLocalMusic}>
            <Ionicons name="add-circle-outline" size={20} color="#A8E6CF" />
            <Text style={styles.addText}>Tambah Musik Lokal</Text>
          </TouchableOpacity>

          {localMusic && (
            <TouchableOpacity
              style={styles.localMusic}
              onPress={() => playMusic(localMusic)}
            >
              <Ionicons name="musical-notes-outline" size={20} color="#FFD700" />
              <Text style={styles.musicTitle} numberOfLines={1}>
                {localMusic.title}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        <Text style={styles.subHeader}>Daftar Musik Online</Text>
        <FlatList
          data={musicList}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 40 }}
        />

        {current && (
          <View style={styles.controller}>
            <Text style={styles.nowPlaying}>
              Sedang diputar: {current.title}
            </Text>
            <TouchableOpacity style={styles.stopBtn} onPress={stopMusic}>
              <Ionicons name="stop-circle" size={28} color="#FF6B6B" />
            </TouchableOpacity>

            <View style={styles.sliderRow}>
              <Text style={styles.sliderLabel}>Musik</Text>
              <Slider
                minimumValue={0}
                maximumValue={100}
                value={musicVolume}
                onValueChange={setMusicVolume}
                minimumTrackTintColor="#A8E6CF"
                thumbTintColor="#A8E6CF"
                style={{ width: 200 }}
              />
              <Text style={styles.percent}>{musicVolume}%</Text>
            </View>

            <View style={styles.sliderRow}>
              <Text style={styles.sliderLabel}>Suara</Text>
              <Slider
                minimumValue={0}
                maximumValue={100}
                value={micVolume}
                onValueChange={setMicVolume}
                minimumTrackTintColor="#FFD700"
                thumbTintColor="#FFD700"
                style={{ width: 200 }}
              />
              <Text style={styles.percent}>{micVolume}%</Text>
            </View>
          </View>
        )}
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  sheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: height * 0.75,
    backgroundColor: "rgba(20,20,20,0.95)",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 15,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  section: { marginBottom: 15 },
  addBtn: { flexDirection: "row", alignItems: "center", marginVertical: 5 },
  addText: { color: "#A8E6CF", marginLeft: 6 },
  localMusic: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
  },
  subHeader: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 6,
  },
  musicItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.06)",
    padding: 10,
    borderRadius: 10,
    marginVertical: 4,
    justifyContent: "space-between",
  },
  activeMusic: {
    borderColor: "#A8E6CF",
    borderWidth: 1,
  },
  musicTitle: {
    flex: 1,
    color: "#fff",
    fontSize: 13,
    marginHorizontal: 8,
  },
  controller: {
    marginTop: 10,
    backgroundColor: "rgba(255,255,255,0.08)",
    padding: 10,
    borderRadius: 10,
  },
  nowPlaying: { color: "#fff", fontSize: 13, marginBottom: 8 },
  stopBtn: { alignSelf: "center", marginVertical: 4 },
  sliderRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 4,
    justifyContent: "space-between",
  },
  sliderLabel: { color: "#fff", width: 60 },
  percent: { color: "#fff", fontSize: 12 },
});