// src/screen/live/components/LiveCameraPreview.js
import React, { useEffect, useRef, useState } from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import RtcEngine, {
  RtcLocalView,
  VideoRenderMode,
  ChannelProfile,
  ClientRole,
} from "react-native-agora";
import { Ionicons } from "@expo/vector-icons";
import { AGORA_APP_ID, DEFAULT_CHANNEL, DEFAULT_UID } from "../../../config/Agora";

export default function LiveCameraPreview({
  channelName = DEFAULT_CHANNEL,
  uid = DEFAULT_UID,
  onReady,
}) {
  const engineRef = useRef(null);
  const [beautyOn, setBeautyOn] = useState(true);

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      const engine = await RtcEngine.create(AGORA_APP_ID);
      engineRef.current = engine;

      // Profile broadcaster
      await engine.setChannelProfile(ChannelProfile.LiveBroadcasting);
      await engine.setClientRole(ClientRole.Broadcaster);

      // Video on
      await engine.enableVideo();
      await engine.startPreview();

      // Default: Beauty ON
      await engine.setBeautyEffectOptions(true, {
        lighteningContrastLevel: 1,   // 0: low, 1: normal, 2: high
        lighteningLevel: 0.6,         // 0.0 - 1.0
        smoothnessLevel: 0.7,         // 0.0 - 1.0
        rednessLevel: 0.1,            // 0.0 - 1.0
      });

      // Join channel (tanpa token untuk dev cepat)
      await engine.joinChannel(null, channelName, null, uid);

      if (mounted && onReady) onReady();
    };

    init();

    return () => {
      mounted = false;
      const e = engineRef.current;
      (async () => {
        try {
          if (!e) return;
          await e.stopPreview();
          await e.leaveChannel();
          e.destroy();
        } catch {}
      })();
    };
  }, [channelName, uid]);

  const toggleBeauty = async () => {
    const next = !beautyOn;
    setBeautyOn(next);
    const e = engineRef.current;
    if (!e) return;
    await e.setBeautyEffectOptions(next, {
      lighteningContrastLevel: 1,
      lighteningLevel: 0.6,
      smoothnessLevel: 0.7,
      rednessLevel: 0.1,
    });
  };

  const switchCam = async () => {
    const e = engineRef.current;
    if (!e) return;
    await e.switchCamera();
  };

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
      {/* Preview kamera lokal (full screen) */}
      <RtcLocalView.SurfaceView
        style={StyleSheet.absoluteFill}
        channelId={channelName}
        renderMode={VideoRenderMode.Hidden}
      />

      {/* Mini controls (kanan-bawah) */}
      <View style={styles.controls}>
        <TouchableOpacity style={styles.ctrlBtn} onPress={toggleBeauty}>
          <Ionicons name="color-wand" size={18} color="#fff" />
          <Text style={styles.ctrlText}>{beautyOn ? "Beauty ON" : "Beauty OFF"}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.ctrlBtn} onPress={switchCam}>
          <Ionicons name="camera-reverse" size={18} color="#fff" />
          <Text style={styles.ctrlText}>Reverse</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  controls: {
    position: "absolute",
    right: 12,
    bottom: 120,
    gap: 10,
  },
  ctrlBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.35)",
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 18,
  },
  ctrlText: { color: "#fff", fontSize: 12, marginLeft: 6, fontWeight: "600" },
});