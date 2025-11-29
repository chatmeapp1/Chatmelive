import { useState, useCallback, useRef, useEffect } from "react";

export const useGiftCombo = () => {
  const [activeCombo, setActiveCombo] = useState(null);
  const timeoutRef = useRef(null);
  const lastTapRef = useRef(0);

  // Reset combo after 2 seconds of inactivity
  const resetCombo = useCallback(() => {
    setActiveCombo(null);
  }, []);

  // Handle tap - either create or update combo
  const handleGiftTap = useCallback(
    (giftData, viewerData) => {
      const now = Date.now();

      // Anti-spam: Prevent double-tap within 100ms
      if (now - lastTapRef.current < 100) return;
      lastTapRef.current = now;

      // Clear existing timeout
      if (timeoutRef.current) clearTimeout(timeoutRef.current);

      // Use setState with functional update to check actual previous state
      setActiveCombo((prev) => {
        // If combo exists for same gift/user, increment count
        if (
          prev &&
          prev.giftId === giftData.id &&
          prev.username === viewerData.name
        ) {
          return {
            ...prev,
            count: prev.count + 1,
            shouldBounce: true,
          };
        } else {
          // Create new combo
          return {
            id: Date.now(),
            giftId: giftData.id,
            username: viewerData.name,
            avatar: viewerData.avatar || "https://picsum.photos/50",
            giftName: giftData.name,
            giftImage: giftData.src || giftData.lottie,
            count: 1,
            shouldBounce: false,
          };
        }
      });

      // Set timeout to reset combo after 2 seconds
      timeoutRef.current = setTimeout(() => {
        resetCombo();
      }, 2000);
    },
    [resetCombo]
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return {
    activeCombo,
    handleGiftTap,
    resetCombo,
  };
};
