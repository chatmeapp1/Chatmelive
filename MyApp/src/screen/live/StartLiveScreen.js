import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useLive } from "../../context/LiveContext";
import {
  createAgoraRtcEngine,
  RtcSurfaceView,
  ChannelProfileType,
  ClientRoleType,
} from "react-native-agora";
import { AGORA_APP_ID, DEFAULT_CHANNEL, DEFAULT_UID } from "../../config/Agora";
import BeautyPanel from "./components/BeautyPanel";

export default function StartLiveScreen() {
  const navigation = useNavigation();
  const { startLive } = useLive();
  const engineRef = useRef(null);

  const host = {
    id: "host_1",
    name: "GOPAY",
    avatar: "https://picsum.photos/id/1005/100",
  };

  const [beautyPanelVisible, setBeautyPanelVisible] = useState(false);
  const [beautyEnabled, setBeautyEnabled] = useState(true);
  const [cameraReady, setCameraReady] = useState(false);
  const [beautySettings, setBeautySettings] = useState({
    lighteningLevel: 0.6,
    rednessLevel: 0.1,
    smoothnessLevel: 0.7,
    sharpnessLevel: 0.0,
  });

  useEffect(() => {
    let mounted = true;

    const initCamera = async () => {
      try {
        const engine = createAgoraRtcEngine();
        engineRef.current = engine;

        engine.initialize({
          appId: AGORA_APP_ID,
          channelProfile: ChannelProfileType.ChannelProfileLiveBroadcasting,
        });

        engine.enableVideo();

        engine.setBeautyEffectOptions(true, {
          lighteningContrastLevel: 1,
          lighteningLevel: beautySettings.lighteningLevel,
          smoothnessLevel: beautySettings.smoothnessLevel,
          rednessLevel: beautySettings.rednessLevel,
          sharpnessLevel: beautySettings.sharpnessLevel,
        });

        engine.startPreview();

        if (mounted) {
          setCameraReady(true);
        }
      } catch (error) {
        console.error("Error initializing camera:", error);
      }
    };

    initCamera();

    return () => {
      mounted = false;
      const engine = engineRef.current;
      if (engine) {
        try {
          engine.stopPreview();
          engine.release();
        } catch (error) {
          console.error("Error cleaning up camera:", error);
        }
      }
    };
  }, []);

  const handleBeautyChange = (newSettings) => {
    setBeautySettings(newSettings);
    const engine = engineRef.current;
    if (!engine) return;

    try {
      engine.setBeautyEffectOptions(beautyEnabled, {
        lighteningContrastLevel: 1,
        lighteningLevel: newSettings.lighteningLevel,
        smoothnessLevel: newSettings.smoothnessLevel,
        rednessLevel: newSettings.rednessLevel,
        sharpnessLevel: newSettings.sharpnessLevel,
      });
    } catch (error) {
      console.error("Error updating beauty settings:", error);
    }
  };

  const toggleBeauty = () => {
    const newBeautyState = !beautyEnabled;
    setBeautyEnabled(newBeautyState);
    const engine = engineRef.current;
    if (!engine) return;

    try {
      engine.setBeautyEffectOptions(newBeautyState, {
        lighteningContrastLevel: 1,
        lighteningLevel: beautySettings.lighteningLevel,
        smoothnessLevel: beautySettings.smoothnessLevel,
        rednessLevel: beautySettings.rednessLevel,
        sharpnessLevel: beautySettings.sharpnessLevel,
      });
    } catch (error) {
      console.error("Error toggling beauty:", error);
    }
  };

  const switchCamera = () => {
    const engine = engineRef.current;
    if (!engine) return;

    try {
      engine.switchCamera();
    } catch (error) {
      console.error("Error switching camera:", error);
    }
  };

  const beginLive = () => {
    const engine = engineRef.current;
    if (engine) {
      try {
        engine.stopPreview();
      } catch (error) {
        console.error("Error stopping preview:", error);
      }
    }

    startLive({
      id: host.id,
      name: host.name,
      image: host.avatar,
      viewers: 0,
      title: "Live Streaming",
    });

    navigation.navigate("HostLiveScreen", {
      isLive: true,
      host,
      liveTitle: "Live Streaming",
    });
  };

  return (
    <View style={styles.container}>
      {cameraReady && (
        <RtcSurfaceView
          style={StyleSheet.absoluteFill}
          canvas={{ uid: 0 }}
        />
      )}

      <TouchableOpacity
        style={styles.closeButton}
        onPress={() => {
          navigation.goBack();
        }}
      >
        <Ionicons name="close" size={28} color="#fff" />
      </TouchableOpacity>

      <View style={styles.headerBox}>
        <Image source={{ uri: host.avatar }} style={styles.avatar} />
        <View style={{ flex: 1 }}>
          <Text style={styles.askText}>kamu ingin siaran langsung apa ya ?</Text>
          <Text style={styles.subText}>undang teman masuk untuk ramaikan</Text>
        </View>
        <View style={styles.shareIcons}>
          <Feather name="twitter" size={20} color="#fff" style={{ marginRight: 10 }} />
          <Feather name="facebook" size={20} color="#fff" />
        </View>
      </View>

      <TouchableOpacity onPress={beginLive} activeOpacity={0.85} style={styles.startButtonWrapper}>
        <LinearGradient colors={["#A8E063", "#56AB2F"]} style={styles.startButton}>
          <Text style={styles.startText}>mulai siaran langsung</Text>
        </LinearGradient>
      </TouchableOpacity>

      <View style={styles.toolsRow}>
        <TouchableOpacity
          style={styles.toolItem}
          onPress={() => setBeautyPanelVisible(true)}
        >
          <Ionicons name="color-wand-outline" size={26} color="#fff" />
          <Text style={styles.toolText}>Beauty</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.toolItem} onPress={switchCamera}>
          <Ionicons name="camera-reverse-outline" size={26} color="#fff" />
          <Text style={styles.toolText}>Reverse</Text>
        </TouchableOpacity>
      </View>

      <BeautyPanel
        visible={beautyPanelVisible}
        onClose={() => setBeautyPanelVisible(false)}
        onBeautyChange={handleBeautyChange}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  closeButton: {
    position: "absolute",
    top: 40,
    right: 20,
    zIndex: 10,
  },
  headerBox: {
    position: "absolute",
    top: 60,
    left: 20,
    right: 20,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
    padding: 15,
    borderRadius: 15,
    zIndex: 5,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 12,
    marginRight: 12,
  },
  askText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },
  subText: {
    color: "#ccc",
    fontSize: 13,
    marginTop: 4,
  },
  shareIcons: {
    flexDirection: "row",
    alignItems: "center",
  },
  startButtonWrapper: {
    position: "absolute",
    bottom: 120,
    left: 35,
    right: 35,
    zIndex: 5,
  },
  startButton: {
    width: "100%",
    borderRadius: 30,
    paddingVertical: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  startText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  toolsRow: {
    position: "absolute",
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 80,
    zIndex: 5,
  },
  toolItem: {
    alignItems: "center",
  },
  toolText: {
    color: "#fff",
    fontSize: 13,
    marginTop: 8,
    fontWeight: "600",
  },
});
