// MyApp/src/navigation/AuthNavigator.js
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// === Screens ===
import OnboardingScreen from "../screen/auth/OnboardingScreen";
import SplashScreen from "../screen/auth/SplashScreen";
import LoginScreen from "../screen/auth/LoginScreen";
import RegisterScreen from "../screen/auth/RegisterScreen";
import PhoneLoginScreen from "../screen/auth/PhoneLoginScreen";

const Stack = createNativeStackNavigator();

export default function AuthNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="SplashScreen"
      screenOptions={{
        headerShown: false,
        animation: "fade_from_bottom",
        gestureEnabled: true,
      }}
    >
      {/* === Onboarding === */}
      <Stack.Screen
        name="OnboardingScreen"
        component={OnboardingScreen}
        options={{
          animation: "fade",
        }}
      />

      {/* === Splash Awal (auto redirect ke Login) === */}
      <Stack.Screen
        name="SplashScreen"
        component={SplashScreen}
        options={{
          animation: "fade",
        }}
      />

      {/* === Login === */}
      <Stack.Screen
        name="LoginScreen"
        component={LoginScreen}
        options={{
          animation: "slide_from_right",
        }}
      />

      {/* === Login via Phone (ditambahkan) === */}
      <Stack.Screen
        name="PhoneLoginScreen"
        component={PhoneLoginScreen}
        options={{
          // tampil seperti modal turun dari bawah
          animation: "slide_from_bottom",
          gestureEnabled: true,
        }}
      />

      {/* === Register === */}
      <Stack.Screen
        name="RegisterScreen"
        component={RegisterScreen}
        options={{
          animation: "slide_from_left",
        }}
      />
    </Stack.Navigator>
  );
}