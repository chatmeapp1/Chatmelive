// MyApp/src/navigation/LiveNavigator.js
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import StartLiveScreen from "../screen/live/StartLiveScreen";
import HostLiveScreen from "../screen/live/HostLiveScreen";
import ViewerLiveScreen from "../screen/live/ViewerLiveScreen";

const Stack = createNativeStackNavigator();

export default function LiveNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="StartLiveScreen" component={StartLiveScreen} />
      <Stack.Screen name="HostLiveScreen" component={HostLiveScreen} />
      <Stack.Screen name="ViewerLiveScreen" component={ViewerLiveScreen} />
    </Stack.Navigator>
  );
}