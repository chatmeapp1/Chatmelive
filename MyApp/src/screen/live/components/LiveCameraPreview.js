// src/screen/live/components/LiveCameraPreview.js
import React, { useEffect, useRef, useState } from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import {
  createAgoraRtcEngine,
  RtcSurfaceView,
  ChannelProfileType,
  ClientRoleType,
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

    const init = () => {
      try {
        const engine = createAgoraRtcEngine();
        engineRef.current = engine;

        engine.initialize({
          appId: AGORA_APP_ID,
          channelProfile: ChannelProfileType.ChannelProfileLiveBroadcasting,
        });

        engine.enableVideo();
        engine.startPreview();

        engine.setBeautyEffectOptions(true, {
          lighteningContrastLevel: 1,
          lighteningLevel: 0.6,
          smoothnessLevel: 0.7,
          rednessLevel: 0.1,
        });

        engine.joinChannel(null, channelName, uid, {
          clientRoleType: ClientRoleType.ClientRoleBroadcaster,
        });

        if (mounted && onReady) onReady();
      } catch (error) {
        console.error("Error initializing Agora:", error);
      }
    };

    init();

    return () => {
      mounted = false;
      const e = engineRef.current;
      if (e) {
        try {
          e.stopPreview();
          e.leaveChannel();
          e.release();
        } catch (error) {
          console.error("Error cleaning up Agora:", error);
        }
      }
    };
  }, [channelName, uid]);

  const toggleBeauty = () => {
    const next = !beautyOn;
    setBeautyOn(next);
    const e = engineRef.current;
    if (!e) return;
    e.setBeautyEffectOptions(next, {
      lighteningContrastLevel: 1,
      lighteningLevel: 0.6,
      smoothnessLevel: 0.7,
      rednessLevel: 0.1,
    });
  };

  const switchCam = () => {
    const e = engineRef.current;
    if (!e) return;
    e.switchCamera();
  };

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
      {/* Preview kamera lokal (full screen) */}
      <RtcSurfaceView
        style={StyleSheet.absoluteFill}
        canvas={{ uid: 0 }}
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