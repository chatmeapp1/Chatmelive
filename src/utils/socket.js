import { io } from "socket.io-client";

// ================================
// 🔗 Socket.IO Setup
// ================================
const SOCKET_URL = "https://5673766c-0cb9-4eb2-ba61-380c90ae9383-00-107h8sd6jgwdl.sisko.replit.dev:8000"; // Backend server port

class SocketService {
  constructor() {
    this.socket = null;
    this.connected = false;
  }

  connect(userId, username) {
    if (this.socket?.connected) {
      console.log("Socket already connected");
      return;
    }

    this.socket = io(SOCKET_URL, {
      transports: ["websocket"],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5
    });

    this.socket.on("connect", () => {
      console.log("✅ Socket connected:", this.socket.id);
      this.connected = true;
      this.socket.emit("user:join", { userId, username });
    });

    this.socket.on("disconnect", () => {
      console.log("❌ Socket disconnected");
      this.connected = false;
    });

    this.socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.connected = false;
    }
  }

  // Live room methods
  joinLiveRoom(roomId, userId, username) {
    if (!this.socket) return;
    this.socket.emit("live:join", { roomId, userId, username });
  }

  leaveLiveRoom(roomId, userId, username) {
    if (!this.socket) return;
    this.socket.emit("live:leave", { roomId, userId, username });
  }

  sendLiveMessage(roomId, userId, username, message, level, vip) {
    if (!this.socket) return;
    this.socket.emit("live:message", {
      roomId,
      userId,
      username,
      message,
      level,
      vip
    });
  }

  sendGift(roomId, from, to, gift, count) {
    if (!this.socket) return;
    this.socket.emit("live:gift", { roomId, from, to, gift, count });
  }

  onLiveMessage(callback) {
    if (!this.socket) return;
    this.socket.on("live:new-message", callback);
  }

  onGiftReceived(callback) {
    if (!this.socket) return;
    this.socket.on("live:gift-received", callback);
  }

  onUserJoined(callback) {
    if (!this.socket) return;
    this.socket.on("live:user-joined", callback);
  }

  onLiveUserJoined(callback) {
    if (!this.socket) return;
    this.socket.on("live:user-joined", callback);
  }

  onUserLeft(callback) {
    if (this.socket) {
      this.socket.on("live:user-left", callback);
    }
  }

  // PK Events
  startPK(roomId, hostLeft, hostRight) {
    if (this.socket) {
      this.socket.emit("pk:start", { roomId, hostLeft, hostRight });
    }
  }

  updatePKScore(roomId, side, score, contributors) {
    if (this.socket) {
      this.socket.emit("pk:score-update", { roomId, side, score, contributors });
    }
  }

  endPK(roomId, battleId, leftScore, rightScore, winner) {
    if (this.socket) {
      this.socket.emit("pk:end", { roomId, battleId, leftScore, rightScore, winner });
    }
  }

  onPKStarted(callback) {
    if (this.socket) {
      this.socket.on("pk:started", callback);
    }
  }

  onPKScoreUpdate(callback) {
    if (this.socket) {
      this.socket.on("pk:score-updated", callback);
    }
  }

  onPKEnd(callback) {
    if (this.socket) {
      this.socket.on("pk:ended", callback);
    }
  }

  onViewerCount(callback) {
    if (!this.socket) return;
    this.socket.on("live:viewer-count", callback);
  }

  emitJPWin(data) {
    if (!this.socket) return;
    this.socket.emit("live:jp-win", data);
  }

  onJPWin(callback) {
    if (!this.socket) return;
    this.socket.on("live:jp-win", callback);
  }

  // Generic emit method
  emit(event, data) {
    if (this.socket) {
      this.socket.emit(event, data);
    }
  }

  // Remove listener
  removeListener(event) {
    if (this.socket) {
      this.socket.off(event);
    }
  }

  // Private chat methods
  sendPrivateMessage(toUserId, fromUserId, message, username) {
    if (!this.socket) return;
    this.socket.emit("chat:send", { toUserId, fromUserId, message, username });
  }

  onPrivateMessage(callback) {
    if (!this.socket) return;
    this.socket.on("chat:receive", callback);
  }

  // Party room methods
  joinPartyRoom(roomId, userId, username, seat) {
    if (!this.socket) return;
    this.socket.emit("party:join", { roomId, userId, username, seat });
  }

  leavePartyRoom(roomId, userId, seat) {
    if (!this.socket) return;
    this.socket.emit("party:leave", { roomId, userId, seat });
  }

  sendPartyMessage(roomId, userId, username, message) {
    if (!this.socket) return;
    this.socket.emit("party:message", { roomId, userId, username, message });
  }

  onPartyMessage(callback) {
    if (!this.socket) return;
    this.socket.on("party:new-message", callback);
  }

  onPartyUserJoined(callback) {
    if (!this.socket) return;
    this.socket.on("party:user-joined", callback);
  }

  onPartyUserLeft(callback) {
    if (!this.socket) return;
    this.socket.on("party:user-left", callback);
  }

  // Remove listeners
  removeListener(event) {
    if (!this.socket) return;
    this.socket.off(event);
  }
}

export default new SocketService();