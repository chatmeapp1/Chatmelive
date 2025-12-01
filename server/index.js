import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";
import path from "path";
import { fileURLToPath } from "url";
import fileUpload from "express-fileupload";
import { initDatabase } from "./db.js";
import authRoutes from "./routes/auth.js";
import rankingRoutes from "./routes/ranking.js";
import giftsRoutes from "./routes/gifts.js";
import contributionsRoutes from "./routes/contributions.js";
import incomeHostRoutes from "./routes/IncomeHost.js";
import liveSessionsRoutes from "./routes/liveSessions.js";
import agencyRoutes from "./routes/agency.js";
import followsRoutes from "./routes/follows.js";
import incomeRoutes from "./routes/income.js";
import chatRoutes from "./routes/chat.js";
import hostsRoutes from "./routes/hosts.js";
import pkRoutes from "./routes/pk.js";
import fs from "fs";
import partyRoutes from "./routes/party.js";
import userVipRoutes from "./routes/userVip.js";
import { saveLiveMessage, getLiveMessages, clearLiveMessages } from "./redis.js";
import liveMessagesRoutes from "./routes/liveMessages.js";
import jpGiftRoutes from "./routes/jpGift.js";
import adminRoutes from "./routes/admin.js";
import superAdminRoutes from "./routes/superAdmin.js";
import paymentRoutes from "./routes/payment.js";
import adminAuthRoutes from "./routes/admin-auth.js";
import rankingsRoutes from "./routes/rankings.js";
import { pool } from "./db.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// ✅ CORS Configuration dengan specific domains
const corsOptions = {
  origin: [
    "https://5673766c-0cb9-4eb2-ba61-380c90ae9383-00-107h8sd6jgwdl.sisko.replit.dev",
    "https://octagonal-sha-unspruced.ngrok-free.dev",
    "http://localhost:3000",
    "http://localhost:5000",
    "*" // Fallback untuk development
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"]
};

app.use(cors(corsOptions));

// ✅ Handle preflight OPTIONS requests
app.options("*", cors(corsOptions));

// ✅ Custom middleware untuk CORS headers
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", req.get("origin") || "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    console.log("✅ Preflight request accepted for:", req.get("origin"));
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json());

// ✅ File Upload Middleware
app.use(fileUpload());

// Serve uploaded files statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ====================================================
// ✅ Initialize Database
// ====================================================
initDatabase();

// ====================================================
// ✅ Root Route
// ====================================================
app.get("/", (req, res) => {
  res.send("🚀 welcome chatme live");
});

// ====================================================
// ✅ Routes
// ====================================================
app.use("/api", authRoutes);
app.use("/api/ranking", rankingRoutes);
app.use("/api/gifts", giftsRoutes);
app.use("/api/contributions", contributionsRoutes);
app.use("/api/host-income", incomeHostRoutes);
app.use("/api/live-session", liveSessionsRoutes);
app.use("/api/agency", agencyRoutes);
app.use("/api/follows", followsRoutes);
app.use("/api/income", incomeRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/hosts", hostsRoutes);
app.use("/api/pk", pkRoutes);
app.use("/api/party", partyRoutes);
app.use("/api/user-vip", userVipRoutes);
app.use("/api/live-messages", liveMessagesRoutes);
app.use("/api/jp-gift", jpGiftRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/super-admin", superAdminRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/admin-auth", adminAuthRoutes);
app.use("/api/rankings", rankingsRoutes);

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
const activeUsers = new Map();
const liveRooms = new Map();

io.on("connection", (socket) => {
  console.log(`✅ Socket connected: ${socket.id}`);

  socket.on("user:join", (data) => {
    const { userId, username } = data;
    activeUsers.set(userId, socket.id);
    io.emit("user:online", { userId, username });
  });

  socket.on("live:join", async (data) => {
    const { roomId, userId, username } = data;
    socket.join(roomId);
    
    if (!liveRooms.has(roomId)) {
      liveRooms.set(roomId, new Set());
    }
    liveRooms.get(roomId).add(socket.id);

    // Get user level from database
    let userLevel = 1;
    try {
      const userResult = await pool.query(
        "SELECT level FROM users WHERE id = $1",
        [userId]
      );
      if (userResult.rows.length > 0) {
        userLevel = userResult.rows[0].level || 1;
      }
    } catch (err) {
      console.error("Error fetching user level:", err);
    }

    // Notify others in room
    socket.to(roomId).emit("live:user-joined", { 
      userId, 
      username,
      level: userLevel
    });

    // Send viewer count
    const viewerCount = liveRooms.get(roomId).size;
    io.to(roomId).emit("live:viewer-count", { count: viewerCount });
  });

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
  });

  socket.on("live:start", (data) => {
    const { roomId, hostId } = data;
    if (!liveRooms.has(roomId)) {
      liveRooms.set(roomId, new Set());
    }
    liveRooms.get(roomId).add(socket.id);
    io.emit("live:started", data);
  });

  socket.on("live:end", (data) => {
    liveRooms.delete(data.roomId);
    io.emit("live:ended", data);
  });

  socket.on("live:new-message", (data) => {
    io.emit("live:new-message", data);
  });

  socket.on("live:gift", (data) => {
    io.emit("live:gift-received", data);
  });

  socket.on("live:gift-received", (data) => {
    io.emit("live:gift-received", data);
  });

  socket.on("live:user-joined", (data) => {
    io.emit("live:user-joined", data);
  });

  socket.on("live:user-left", (data) => {
    io.emit("live:user-left", data);
  });

  socket.on("live:viewer-count", (data) => {
    io.emit("live:viewer-count", data);
  });

  socket.on("live:jp-win", (data) => {
    io.emit("live:jp-win", data);
  });

  socket.on("pk:start", (data) => {
    io.emit("pk:started", data);
  });

  socket.on("pk:score-update", (data) => {
    io.emit("pk:score-updated", data);
  });

  socket.on("pk:end", (data) => {
    io.emit("pk:ended", data);
  });

  socket.on("party:join", (data) => {
    io.emit("party:user-joined", data);
  });

  socket.on("party:leave", (data) => {
    io.emit("party:user-left", data);
  });

  socket.on("party:message", (data) => {
    io.emit("party:new-message", data);
  });

  socket.on("chat:send", (data) => {
    io.emit("chat:receive", data);
  });

  socket.on("disconnect", () => {
    console.log(`❌ Socket disconnected: ${socket.id}`);
  });
});

// ====================================================
// ✅ Server Start
// ====================================================
const PORT = process.env.PORT || 8000;
httpServer.listen(PORT, () => {
  console.log(`🎉 Server running on port ${PORT}`);
});

export default app;
