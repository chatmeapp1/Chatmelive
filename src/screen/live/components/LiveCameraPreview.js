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
import AgoraConfig, {
  AGORA_APP_ID,
  DEFAULT_UID,
  LIVE_STREAMING_CONFIG,
  AGORA_ROLES,
  generateUID
} from "../../../config/Agora";

export default function LiveCameraPreview({
  channelName = DEFAULT_CHANNEL,
  uid = DEFAULT_UID,
  onReady,
  isHost = true, // Default to host, but can be changed
  agoraEngine, // Receive engine from parent if already initialized
  setEngine, // Function to set engine in parent
  setJoined, // Function to set join status in parent
  setRemoteUid, // Function to set remote UID in parent
}) {
  const localEngineRef = useRef(null); // Local ref for engine if not passed from parent
  const [beautyOn, setBeautyOn] = useState(true);

  // Use a ref to ensure the engine is only initialized once
  const engine = agoraEngine || localEngineRef.current;

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      try {
        let currentEngine;
        if (agoraEngine) {
          currentEngine = agoraEngine;
        } else {
          currentEngine = createAgoraRtcEngine();
          localEngineRef.current = currentEngine;
          if (setEngine) setEngine(currentEngine); // Set parent's engine if available
        }

        // Initialize with App ID
        currentEngine.initialize({ appId: AGORA_APP_ID });

        // Set channel profile for live broadcasting
        currentEngine.setChannelProfile(ChannelProfileType.ChannelProfileLiveBroadcasting);

        // Register event handlers
        currentEngine.registerEventHandler({
          onJoinChannelSuccess: () => {
            console.log("✅ Successfully joined channel:", channelName);
            if (setJoined) setJoined(true);
            if (onReady) onReady();
          },
          onUserJoined: (_connection, uid) => {
            console.log("👤 Remote user joined:", uid);
            if (setRemoteUid) setRemoteUid(uid);
          },
          onUserOffline: (_connection, uid) => {
            console.log("👋 Remote user left:", uid);
            if (setRemoteUid) setRemoteUid(0);
          },
          onError: (err) => {
            console.error("❌ Agora Error:", err);
          },
          onNetworkQuality: (_connection, uid, txQuality, rxQuality) => {
            // Monitor network quality
            if (txQuality > 3 || rxQuality > 3) {
              console.warn("⚠️ Poor network quality");
            }
          },
        });

        if (isHost) {
          // Set client role as broadcaster
          currentEngine.setClientRole(ClientRoleType.ClientRoleBroadcaster);

          // Enable video
          currentEngine.enableVideo();

          // Set video encoder configuration
          currentEngine.setVideoEncoderConfiguration(
            LIVE_STREAMING_CONFIG.videoEncoderConfiguration
          );

          // Enable beauty options
          currentEngine.setBeautyEffectOptions(true, {
            lighteningContrastLevel: 1,
            lighteningLevel: 0.6,
            smoothnessLevel: 0.7,
            rednessLevel: 0.1,
          });

          // Start preview
          currentEngine.startPreview();
        } else {
          // Set client role as audience
          currentEngine.setClientRole(ClientRoleType.ClientRoleAudience);
        }

        // Join channel with token (null for development)
        currentEngine.joinChannel(
          null, // Token - null for development or if using account-based auth
          channelName,
          uid, // Use the provided or default UID
          {
            clientRoleType: isHost ? ClientRoleType.ClientRoleBroadcaster : ClientRoleType.ClientRoleAudience,
          }
        );
      } catch (error) {
        console.error("❌ Error initializing Agora:", error);
      }
    };

    init();

    return () => {
      mounted = false;
      const e = localEngineRef.current || agoraEngine; // Use local ref or passed engine
      if (e) {
        try {
          e.stopPreview();
          e.leaveChannel();
          e.release();
          if (!agoraEngine) { // Only release if we initialized it locally
            localEngineRef.current = null;
          }
        } catch (error) {
          console.error("Error cleaning up Agora:", error);
        }
      }
    };
  }, [channelName, uid, isHost, onReady, agoraEngine, setEngine, setJoined, setRemoteUid]); // Added dependencies

  const toggleBeauty = () => {
    const next = !beautyOn;
    setBeautyOn(next);
    const e = localEngineRef.current || agoraEngine;
    if (!e) return;
    e.setBeautyEffectOptions(next, {
      lighteningContrastLevel: 1,
      lighteningLevel: 0.6,
      smoothnessLevel: 0.7,
      rednessLevel: 0.1,
    });
  };

  const switchCam = () => {
    const e = localEngineRef.current || agoraEngine;
    if (!e) return;
    e.switchCamera();
  };

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
      {/* Preview kamera lokal (full screen) */}
      <RtcSurfaceView
        style={StyleSheet.absoluteFill}
        canvas={{ uid: 0 }} // uid: 0 for local user
      />

      {/* Mini controls (kanan-bawah) */}
      <View style={styles.controls}>
        {isHost && ( // Show beauty and switch camera only for host
          <>
            <TouchableOpacity style={styles.ctrlBtn} onPress={toggleBeauty}>
              <Ionicons name="color-wand" size={18} color="#fff" />
              <Text style={styles.ctrlText}>{beautyOn ? "Beauty ON" : "Beauty OFF"}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.ctrlBtn} onPress={switchCam}>
              <Ionicons name="camera-reverse" size={18} color="#fff" />
              <Text style={styles.ctrlText}>Reverse</Text>
            </TouchableOpacity>
          </>
        )}
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