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

/* ✅ Import Detail Profile Screens */
import ProfilePictureScreen from "../screen/profile/ProfilePictureScreen";
import NicknameScreen from "../screen/profile/NicknameScreen";
import GenderScreen from "../screen/profile/GenderScreen";
import AgeScreen from "../screen/profile/AgeScreen";
import SignatureScreen from "../screen/profile/SignatureScreen";
import RechargeScreen from "../screen/profile/RechargeScreen";

const Stack = createNativeStackNavigator();

export default function ProfileNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ProfileScreen" component={ProfileScreen} />

      {/* ✅ Screen Edit Profile FIXED */}
      <Stack.Screen name="EditProfileScreen" component={EditProfileScreen} />

      {/* ✅ Detail Profile Screens */}
      <Stack.Screen name="ProfilePictureScreen" component={ProfilePictureScreen} />
      <Stack.Screen name="NicknameScreen" component={NicknameScreen} />
      <Stack.Screen name="GenderScreen" component={GenderScreen} />
      <Stack.Screen name="AgeScreen" component={AgeScreen} />
      <Stack.Screen name="SignatureScreen" component={SignatureScreen} />

      <Stack.Screen name="RechargeScreen" component={RechargeScreen} />
      <Stack.Screen name="LevelScreen" component={LevelScreen} />
      <Stack.Screen name="PenggemarScreen" component={PenggemarScreen} />
      <Stack.Screen name="PendapatanScreen" component={PendapatanScreen} />
      <Stack.Screen name="GameCenterScreen" component={GameCenterScreen} />
      <Stack.Screen name="BergabungScreen" component={BergabungScreen} />
    </Stack.Navigator>
  );
}