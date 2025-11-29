
// src/utils/agoraPartyHelper.js
import { createAgoraRtcEngine } from "react-native-agora";
import AgoraConfig, {
  AGORA_APP_ID,
  PARTY_AUDIO_CONFIG,
  generateChannelName,
  generateUID,
} from "../config/Agora";

class AgoraPartyHelper {
  constructor() {
    this.engine = null;
    this.channelName = null;
    this.userId = null;
    this.isMuted = false;
    this.speakingUsers = new Set();
  }

  async initialize(roomId, userId) {
    try {
      this.channelName = generateChannelName(roomId, "party");
      this.userId = userId;

      // Create Agora engine
      this.engine = await createAgoraRtcEngine();
      
      // Initialize
      this.engine.initialize({ appId: AGORA_APP_ID });

      // Set channel profile untuk audio communication
      this.engine.setChannelProfile(PARTY_AUDIO_CONFIG.channelProfile);

      // Set audio profile
      this.engine.setAudioProfile(
        PARTY_AUDIO_CONFIG.audioProfile,
        PARTY_AUDIO_CONFIG.audioScenario
      );

      // Enable audio
      this.engine.enableAudio();

      // Register event handlers
      this.registerEventHandlers();

      console.log("✅ Agora Party Audio initialized");
      return true;
    } catch (error) {
      console.error("❌ Error initializing Agora Party:", error);
      return false;
    }
  }

  registerEventHandlers() {
    if (!this.engine) return;

    this.engine.registerEventHandler({
      onJoinChannelSuccess: () => {
        console.log("✅ Joined party audio channel:", this.channelName);
      },
      onUserJoined: (_connection, uid) => {
        console.log("👤 User joined audio:", uid);
      },
      onUserOffline: (_connection, uid) => {
        console.log("👋 User left audio:", uid);
        this.speakingUsers.delete(uid);
      },
      onAudioVolumeIndication: (_connection, speakers) => {
        // Detect speaking users
        speakers.forEach((speaker) => {
          if (speaker.volume > 5) {
            this.speakingUsers.add(speaker.uid);
          } else {
            this.speakingUsers.delete(speaker.uid);
          }
        });
      },
      onError: (err) => {
        console.error("❌ Agora Party Error:", err);
      },
    });

    // Enable audio volume indication
    this.engine.enableAudioVolumeIndication(300, 3, true);
  }

  async joinChannel() {
    if (!this.engine || !this.channelName) return false;

    try {
      const uid = generateUID(this.userId);
      await this.engine.joinChannel(
        PARTY_AUDIO_CONFIG.token,
        this.channelName,
        uid,
        {}
      );
      console.log("✅ Joined party channel with UID:", uid);
      return true;
    } catch (error) {
      console.error("❌ Error joining channel:", error);
      return false;
    }
  }

  async leaveChannel() {
    if (!this.engine) return;

    try {
      await this.engine.leaveChannel();
      console.log("✅ Left party channel");
    } catch (error) {
      console.error("❌ Error leaving channel:", error);
    }
  }

  toggleMute() {
    if (!this.engine) return;

    this.isMuted = !this.isMuted;
    this.engine.muteLocalAudioStream(this.isMuted);
    console.log(`🎤 Microphone ${this.isMuted ? "muted" : "unmuted"}`);
    return this.isMuted;
  }

  adjustVolume(volume) {
    if (!this.engine) return;
    
    // Volume: 0-100
    this.engine.adjustRecordingSignalVolume(volume);
    this.engine.adjustPlaybackSignalVolume(volume);
  }

  getSpeakingUsers() {
    return Array.from(this.speakingUsers);
  }

  async destroy() {
    if (!this.engine) return;

    try {
      await this.leaveChannel();
      this.engine.release();
      this.engine = null;
      console.log("✅ Agora Party Helper destroyed");
    } catch (error) {
      console.error("❌ Error destroying Agora:", error);
    }
  }
}

export default new AgoraPartyHelper();
