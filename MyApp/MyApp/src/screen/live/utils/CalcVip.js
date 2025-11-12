// Hitung VIP berdasarkan total top up user
export function getVipLevel(totalTopup) {
  if (totalTopup >= 50000000) return 6; // ✅ VIP 6 (50jt+)
  if (totalTopup >= 30000000) return 5; // ✅ VIP 5
  if (totalTopup >= 20000000) return 4; // ✅ VIP 4
  if (totalTopup >= 15000000) return 3; // ✅ VIP 3
  if (totalTopup >= 10000000) return 2; // ✅ VIP 2
  if (totalTopup >= 5000000)  return 1; // ✅ VIP 1
  return 0;                               // ✅ Non-VIP
}