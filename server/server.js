import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";
import { initDatabase } from "./db.js";
import authRoutes from "./routes/auth.js";
import incomeRoutes from "./routes/income.js";
import { saveLiveMessage, getLiveMessages, clearLiveMessages } from "./redis.js";

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
app.use(express.json());

// ====================================================
// ✅ Initialize Database
// ====================================================
initDatabase();

// ====================================================
// ✅ Root Route
// ====================================================
app.get("/", (req, res) => {
  res.send("🚀 ChatMe API aktif di Replit + NeonDB (PostgreSQL)!");
});

// ====================================================
// ✅ Routes
// ====================================================
app.use("/api", authRoutes);
app.use("/api/income", incomeRoutes);

// ====================================================
// ✅ 404 Handler
// ====================================================
app.all("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: `Endpoint ${req.originalUrl} tidak ditemukan.`,
  });
});

// ====================================================
// ✅ Socket.IO Event Handlers
// ====================================================
const activeUsers = new Map(); // userId -> socketId
const liveRooms = new Map(); // roomId -> Set of socketIds

io.on("connection", (socket) => {
  console.log(`✅ Socket connected: ${socket.id}`);

  // User join
  socket.on("user:join", (data) => {
    const { userId, username } = data;
    activeUsers.set(userId, { socketId: socket.id, username });
    socket.userId = userId;
    console.log(`👤 User joined: ${username} (${userId})`);
  });

  // Join live room
  socket.on("live:join", async (data) => {
    const { roomId, userId, username } = data;
    socket.join(roomId);

    if (!liveRooms.has(roomId)) {
      liveRooms.set(roomId, new Set());
    }
    liveRooms.get(roomId).add(socket.id);

    // Send cached messages to new user
    try {
      const cachedMessages = await getLiveMessages(roomId);
      if (cachedMessages.length > 0) {
        socket.emit("live:cached-messages", { messages: cachedMessages });
      }
    } catch (err) {
      console.warn("Error sending cached messages:", err.message);
    }

    // Notify others
    socket.to(roomId).emit("live:user-joined", { userId, username });

    // Send current viewers count
    const viewerCount = liveRooms.get(roomId).size;
    io.to(roomId).emit("live:viewer-count", { count: viewerCount });

    console.log(`📺 ${username} joined live room: ${roomId}`);
  });

  // Leave live room
  socket.on("live:leave", (data) => {
    const { roomId, userId, username } = data;
    socket.leave(roomId);

    if (liveRooms.has(roomId)) {
      liveRooms.get(roomId).delete(socket.id);
      const viewerCount = liveRooms.get(roomId).size;
      io.to(roomId).emit("live:viewer-count", { count: viewerCount });

      if (viewerCount === 0) {
        liveRooms.delete(roomId);
      }
    }

    socket.to(roomId).emit("live:user-left", { userId, username });
    console.log(`📺 ${username} left live room: ${roomId}`);
  });

  // Live chat message
  socket.on("live:message", (data) => {
    const { roomId, userId, username, message, level, vip } = data;
    io.to(roomId).emit("live:new-message", {
      userId,
      username,
      message,
      level,
      vip,
      timestamp: Date.now()
    });
  });

  // Send gift
  socket.on("live:gift", (data) => {
    const { roomId, from, to, gift, count } = data;
    io.to(roomId).emit("live:gift-received", {
      from,
      to,
      gift,
      count,
      timestamp: Date.now()
    });
  });

  // Private chat message
  socket.on("chat:send", (data) => {
    const { toUserId, fromUserId, message, username } = data;
    const recipient = activeUsers.get(toUserId);

    if (recipient) {
      io.to(recipient.socketId).emit("chat:receive", {
        fromUserId,
        username,
        message,
        timestamp: Date.now()
      });
    }
  });

  // Party room events
  socket.on("party:join", (data) => {
    const { roomId, userId, username, seat } = data;
    socket.join(`party:${roomId}`);
    socket.to(`party:${roomId}`).emit("party:user-joined", {
      userId,
      username,
      seat
    });
  });

  socket.on("party:leave", (data) => {
    const { roomId, userId, seat } = data;
    socket.leave(`party:${roomId}`);
    socket.to(`party:${roomId}`).emit("party:user-left", {
      userId,
      seat
    });
  });

  socket.on("party:message", (data) => {
    const { roomId, userId, username, message } = data;
    io.to(`party:${roomId}`).emit("party:new-message", {
      userId,
      username,
      message,
      timestamp: Date.now()
    });
  });

  // Disconnect
  socket.on("disconnect", () => {
    if (socket.userId) {
      activeUsers.delete(socket.userId);

      // Clean up live rooms
      liveRooms.forEach((viewers, roomId) => {
        if (viewers.has(socket.id)) {
          viewers.delete(socket.id);
          const viewerCount = viewers.size;
          io.to(roomId).emit("live:viewer-count", { count: viewerCount });

          if (viewerCount === 0) {
            liveRooms.delete(roomId);
          }
        }
      });
    }
    console.log(`❌ Socket disconnected: ${socket.id}`);
  });
});

// ====================================================
// ✅ Jalankan server (auto detect port Replit)
// ====================================================
const PORT = process.env.PORT || 8000;
httpServer.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ ChatMe API running on port ${PORT}`);
  console.log(`🌍 Public URL (Replit): https://${process.env.REPL_SLUG}-${process.env.REPL_OWNER}-${PORT}.pike.replit.dev`);
  console.log(`🔌 Socket.IO ready for real-time connections`);
});