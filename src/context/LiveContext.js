import React, { createContext, useState, useContext } from "react";

const LiveContext = createContext();

export function LiveProvider({ children }) {
  const [liveHosts, setLiveHosts] = useState([]);

  // ✅ Tambah host baru
  const startLive = (hostData) => {
    console.log("🎥 Starting live with data:", hostData);
    setLiveHosts((prev) => {
      // Remove if already exists
      const filtered = prev.filter((h) => h.id !== hostData.id);
      return [...filtered, hostData];
    });
  };

  // ✅ Hentikan siaran
  const stopLive = (hostId) => {
    console.log("🛑 Stopping live for host:", hostId);
    setLiveHosts((prev) => prev.filter((h) => h.id !== hostId));
  };

  // ✅ Update live data (untuk update viewers, title, dll)
  const updateLive = (hostId, updates) => {
    setLiveHosts((prev) =>
      prev.map((h) => (h.id === hostId ? { ...h, ...updates } : h))
    );
  };

  return (
    <LiveContext.Provider value={{ liveHosts, startLive, stopLive, updateLive }}>
      {children}
    </LiveContext.Provider>
  );
}

export function useLive() {
  return useContext(LiveContext);
}