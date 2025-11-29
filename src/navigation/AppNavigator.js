
// === AppNavigator.js ===
import React, { useState, useEffect } from "react";
import { Platform } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";

import AuthNavigator from "./AuthNavigator";
import MainTabsNavigator from "./MainTabsNavigator";
import LiveNavigator from "./LiveNavigator";
import RoomNavigator from "./RoomNavigator";
import ProfileNavigator from "./ProfileNavigator";
import FeedbackScreen from "../screen/FeedbackScreen";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();

    // Listen for auth changes every 500ms
    const interval = setInterval(async () => {
      const token = await AsyncStorage.getItem("userToken");
      const newAuthState = !!token;
      if (newAuthState !== isAuthenticated) {
        setIsAuthenticated(newAuthState);
      }
    }, 500);

    return () => clearInterval(interval);
  }, [isAuthenticated]);

  const checkAuth = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      setIsAuthenticated(!!token);
    } catch (error) {
      console.error("Error checking auth:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return null; // Or show a loading screen
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false, animation: "slide_from_right" }}>

        {!isAuthenticated ? (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        ) : (
          <>
            <Stack.Screen name="MainTabs" component={MainTabsNavigator} />
            <Stack.Screen name="LiveNavigator" component={LiveNavigator} />
            <Stack.Screen name="RoomNavigator" component={RoomNavigator} />
            <Stack.Screen name="ProfileNavigator" component={ProfileNavigator} />
          </>
        )}

        <Stack.Screen
          name="Feedback"
          component={FeedbackScreen}
          options={{
            presentation: "modal",
            animation: "fade",
          }}
        />

      </Stack.Navigator>
    </NavigationContainer>
  );
}
