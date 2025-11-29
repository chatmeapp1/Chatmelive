import { pool } from "./db.js";

const BOT_HOSTS = [
  { name: "🎙️ DJ Max", phone: "089999999901", level: 50, vipLevel: 5, balance: 5000000, avatar: "https://i.pravatar.cc/150?img=1&u=djmax" },
  { name: "✨ Luna Star", phone: "089999999902", level: 45, vipLevel: 5, balance: 4500000, avatar: "https://i.pravatar.cc/150?img=2&u=lunastar" },
  { name: "🔥 Phoenix", phone: "089999999903", level: 48, vipLevel: 5, balance: 4800000, avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTwWfX1I7HO8Bxd0-2-0Vc0l1Zumgum6eTqVyNlnP5CuTKDQV6FFX7yeEA&s" },
  { name: "🌈 Prisma", phone: "089999999904", level: 47, vipLevel: 5, balance: 4700000, avatar: "https://i.pravatar.cc/150?img=4&u=prisma" },
  { name: "💎 Luxury", phone: "089999999905", level: 49, vipLevel: 5, balance: 4900000, avatar: "https://i.pravatar.cc/150?img=5&u=luxury" }
];

async function seedBotHosts() {
  const client = await pool.connect();
  try {
    for (const bot of BOT_HOSTS) {
      const existing = await client.query("SELECT id FROM users WHERE phone = $1", [bot.phone]);
      if (existing.rows.length === 0) {
        const result = await client.query(
          "INSERT INTO users (name, phone, password, level, vip_level, balance, avatar_url) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id",
          [bot.name, bot.phone, "bot123456", bot.level, bot.vipLevel, bot.balance, bot.avatar]
        );
        const userId = result.rows[0].id;
        await client.query(
          "INSERT INTO live_sessions (host_id, start_time, end_time) VALUES ($1, NOW(), NULL) RETURNING id",
          [userId]
        );
        console.log(`✅ ${bot.name} (ID: ${userId})`);
      }
    }
  } finally { client.release(); }
}

seedBotHosts().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
