import { seedBotHosts } from "./seeds/botHosts.js";

console.log("🚀 Seeding bot hosts...");
await seedBotHosts();
process.exit(0);
