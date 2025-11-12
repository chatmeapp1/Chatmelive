// MyApp/src/navigation/RoomNavigator.js
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import PartyRoomScreen from "../screen/PartyRoomScreen";
import GameListModal from "../components/GameListModal";
import GiftModal from "../components/GiftModal";

const Stack = createNativeStackNavigator();

export default function RoomNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen name="PartyRoomScreen" component={PartyRoomScreen} />

      {/* Modal tambahan */}
      <Stack.Screen
        name="GameListModal"
        component={GameListModal}
        options={{
          presentation: "transparentModal",
          animation: "slide_from_bottom",
        }}
      />
      <Stack.Screen
        name="GiftModal"
        component={GiftModal}
        options={{
          presentation: "transparentModal",
          animation: "fade_from_bottom",
        }}
      />
    </Stack.Navigator>
  );
}