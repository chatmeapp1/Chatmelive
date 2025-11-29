
// src/config/Agora.js

// Agora App ID - sudah dikonfigurasi
export const AGORA_APP_ID = "a1cbca25bbb24ed086dac870aa4956e3";

// Default channel untuk live streaming
export const DEFAULT_CHANNEL = "chatme-live";

// Default UID - biar Agora pilih otomatis
export const DEFAULT_UID = 0;

// Agora Client Configuration untuk Live Streaming
export const LIVE_STREAMING_CONFIG = {
  mode: "live", // "live" mode untuk streaming (host + viewers)
  codec: "vp8", // Video codec
  role: "host", // Default role, akan diubah untuk viewer
  // Token mode (production ready)
  // Untuk development, bisa null jika App Certificate OFF
  token: null,
  // Channel profile
  channelProfile: 1, // 1 = LIVE_BROADCASTING
  // Video encoding configuration
  videoEncoderConfiguration: {
    width: 720,
    height: 1280,
    frameRate: 15,
    bitrate: 1130,
    orientationMode: 1, // ADAPTIVE
  },
};

// Agora Client Configuration untuk Party Audio Room
export const PARTY_AUDIO_CONFIG = {
  mode: "rtc", // "rtc" mode untuk komunikasi real-time
  codec: "opus", // Audio codec untuk voice
  // Token mode (production ready)
  token: null,
  // Channel profile untuk audio communication
  channelProfile: 0, // 0 = COMMUNICATION (low latency)
  // Audio profile untuk party room
  audioProfile: 4, // 4 = MUSIC_STANDARD (48kHz stereo)
  audioScenario: 5, // 5 = CHATROOM (optimize untuk multi-user voice)
};

// Role types untuk live streaming
export const AGORA_ROLES = {
  HOST: 1, // Broadcaster yang bisa publish stream
  AUDIENCE: 2, // Viewer yang hanya bisa subscribe
};

// Quality presets untuk live streaming
export const VIDEO_QUALITY_PRESETS = {
  LOW: {
    width: 320,
    height: 480,
    frameRate: 15,
    bitrate: 400,
  },
  MEDIUM: {
    width: 480,
    height: 720,
    frameRate: 15,
    bitrate: 800,
  },
  HIGH: {
    width: 720,
    height: 1280,
    frameRate: 15,
    bitrate: 1130,
  },
  ULTRA: {
    width: 1080,
    height: 1920,
    frameRate: 30,
    bitrate: 2080,
  },
};

// Beauty filter presets
export const BEAUTY_PRESETS = {
  NATURAL: {
    lighteningLevel: 0.3,
    rednessLevel: 0.1,
    smoothnessLevel: 0.5,
    sharpnessLevel: 0.3,
  },
  SMOOTH: {
    lighteningLevel: 0.5,
    rednessLevel: 0.2,
    smoothnessLevel: 0.7,
    sharpnessLevel: 0.4,
  },
  WHITENING: {
    lighteningLevel: 0.7,
    rednessLevel: 0.15,
    smoothnessLevel: 0.6,
    sharpnessLevel: 0.5,
  },
};

// Audio mixing configuration untuk party room
export const AUDIO_MIXING_CONFIG = {
  // Volume untuk background music (0-100)
  musicVolume: 50,
  // Volume untuk voice (0-100)
  voiceVolume: 100,
  // Enable/disable loopback recording
  loopback: false,
  // Replace mic audio with music
  replace: false,
  // Audio cycle (loop music)
  cycle: 1,
};

// Network quality thresholds
export const NETWORK_QUALITY = {
  EXCELLENT: 1,
  GOOD: 2,
  POOR: 3,
  BAD: 4,
  VERY_BAD: 5,
  DOWN: 6,
};

// Helper function untuk generate channel name dari room ID
export const generateChannelName = (roomId, type = "live") => {
  return `${type}-${roomId}`;
};

// Helper function untuk generate UID dari user ID
export const generateUID = (userId) => {
  // Convert userId to number (jika string) atau gunakan hash
  if (typeof userId === "number") return userId;
  if (typeof userId === "string") {
    // Simple hash function
    let hash = 0;
    for (let i = 0; i < userId.length; i++) {
      const char = userId.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
  }
  return 0; // Default
};

// Agora error codes mapping
export const AGORA_ERROR_CODES = {
  INVALID_VENDOR_KEY: 101,
  INVALID_CHANNEL_NAME: 102,
  INVALID_UID: 103,
  NO_AUTHORIZED: 110,
  DYNAMIC_KEY_TIMEOUT: 111,
  NO_ACTIVE_STATUS: 120,
  INVALID_APP_ID: 2,
  INVALID_CHANNEL_PROFILE: 2,
  JOIN_CHANNEL_REJECTED: 17,
  LEAVE_CHANNEL_REJECTED: 18,
};

// Export default configuration
export default {
  APP_ID: AGORA_APP_ID,
  DEFAULT_CHANNEL,
  DEFAULT_UID,
  LIVE_STREAMING_CONFIG,
  PARTY_AUDIO_CONFIG,
  AGORA_ROLES,
  VIDEO_QUALITY_PRESETS,
  BEAUTY_PRESETS,
  AUDIO_MIXING_CONFIG,
  NETWORK_QUALITY,
  generateChannelName,
  generateUID,
  AGORA_ERROR_CODES,
};
