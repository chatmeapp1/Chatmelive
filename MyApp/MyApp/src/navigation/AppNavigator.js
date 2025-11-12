// === AppNavigator.js ===
import React, { useState } from "react";
import { Platform } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import AuthNavigator from "./AuthNavigator";
import MainTabsNavigator from "./MainTabsNavigator";
import LiveNavigator from "./LiveNavigator";
import RoomNavigator from "./RoomNavigator";
import ProfileNavigator from "./ProfileNavigator";
import FeedbackScreen from "../screen/FeedbackScreen";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

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