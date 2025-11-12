import React, { useEffect } from "react";
import { StatusBar } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import * as NavigationBar from "expo-navigation-bar";

import AppNavigator from "./src/navigation/AppNavigator";
import { LiveProvider } from "./src/context/LiveContext"; // ✅

export default function App() {
  useEffect(() => {
    const hideNav = async () => {
      try {
        await NavigationBar.setVisibilityAsync("hidden");
        await NavigationBar.setBehaviorAsync("overlay-swipe");
        await NavigationBar.setBackgroundColorAsync("transparent");
      } catch (e) {}
    };

    hideNav();
  }, []);

  return (
    <LiveProvider>
      <SafeAreaProvider style={{ flex: 1, backgroundColor: "transparent" }}>
        <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
        <AppNavigator />
      </SafeAreaProvider>
    </LiveProvider>
  );
}