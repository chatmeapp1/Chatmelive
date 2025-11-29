import { createClient } from "redis";

const redisClient = createClient({
  username: process.env.REDIS_USERNAME,
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT),
    tls: {
      rejectUnauthorized: false,
    },
  },
});

let redisConnected = false;

redisClient.on("error", (err) => {
  console.error("❌ Redis Error:", err.message);
  redisConnected = false;
});

redisClient.on("connect", () => {
  console.log("✅ Redis Cloud connected successfully");
  redisConnected = true;
});

redisClient.on("reconnecting", () => {
  console.log("🔄 Redis Cloud reconnecting...");
  redisConnected = false;
});

(async () => {
  try {
    await redisClient.connect();
    console.log("✅ Redis Cloud connection established");
  } catch (err) {
    console.error("❌ Redis Cloud connection failed:", err.message);
  }
})();

export { redisClient };
export default redisClient;

/**
 * Save chat message to Redis (live room)
 */
export async function saveLiveMessage(roomId, message) {
  if (!redisConnected) {
    return;
  }

  try {
    const key = `live:room:${roomId}:messages`;
    const messageData = JSON.stringify({
      ...message,
      timestamp: Date.now(),
    });

    await redisClient.lPush(key, messageData);
    await redisClient.lTrim(key, 0, 99);
    await redisClient.expire(key, 86400);
  } catch (err) {
    console.warn("Error saving message to Redis:", err.message);
  }
}

/**
 * Get all chat messages from Redis (live room)
 */
export async function getLiveMessages(roomId) {
  if (!redisConnected) {
    return [];
  }

  try {
    const key = `live:room:${roomId}:messages`;
    const messages = await redisClient.lRange(key, 0, -1);
    return messages.map((msg) => JSON.parse(msg)).reverse();
  } catch (err) {
    console.warn("Error getting messages from Redis:", err.message);
    return [];
  }
}

/**
 * Clear messages from live room (when stream ends)
 */
export async function clearLiveMessages(roomId) {
  if (!redisConnected) {
    return;
  }

  try {
    const key = `live:room:${roomId}:messages`;
    await redisClient.del(key);
    console.log(`✅ Cleared messages for room: ${roomId}`);
  } catch (err) {
    console.warn("Error clearing messages from Redis:", err.message);
  }
}
