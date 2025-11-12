// src/config/agora.js
export const AGORA_APP_ID = "a1cbca25bbb24ed086dac870aa4956e3";

// Catatan penting:
// - Untuk development cepat, kamu bisa join tanpa token jika App Certificate OFF.
// - Untuk production, WAJIB pakai token (temp token / server token).
export const DEFAULT_CHANNEL = "chatme-live";
export const DEFAULT_UID = 0; // biar Agora pilih otomatis