import React, { createContext, useState, useContext } from "react";

const LiveContext = createContext();

export function LiveProvider({ children }) {
  const [liveHosts, setLiveHosts] = useState([]);

  // ✅ Tambah host baru
  const startLive = (hostData) => {
    setLiveHosts((prev) => [...prev, hostData]);
  };

  // ✅ Hentikan siaran
  const stopLive = (hostId) => {
    setLiveHosts((prev) => prev.filter((h) => h.id !== hostId));
  };

  return (
    <LiveContext.Provider value={{ liveHosts, startLive, stopLive }}>
      {children}
    </LiveContext.Provider>
  );
}

export function useLive() {
  return useContext(LiveContext);
}