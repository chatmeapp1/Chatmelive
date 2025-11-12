import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import ProfileScreen from "../screen/profile/ProfileScreen";
import LevelScreen from "../screen/profile/LevelScreen";
import PenggemarScreen from "../screen/profile/PenggemarScreen";
import PendapatanScreen from "../screen/profile/PendapatanScreen";
import GameCenterScreen from "../screen/profile/GameCenterScreen";
import BergabungScreen from "../screen/profile/BergabungScreen";

/* ✅ Import Edit Profile yang benar */
import EditProfileScreen from "../screen/profile/EditProfileScreen";

const Stack = createNativeStackNavigator();

export default function ProfileNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ProfileScreen" component={ProfileScreen} />

      {/* ✅ Screen Edit Profile FIXED */}
      <Stack.Screen name="EditProfileScreen" component={EditProfileScreen} />

      <Stack.Screen name="LevelScreen" component={LevelScreen} />
      <Stack.Screen name="PenggemarScreen" component={PenggemarScreen} />
      <Stack.Screen name="PendapatanScreen" component={PendapatanScreen} />
      <Stack.Screen name="GameCenterScreen" component={GameCenterScreen} />
      <Stack.Screen name="BergabungScreen" component={BergabungScreen} />
    </Stack.Navigator>
  );
}