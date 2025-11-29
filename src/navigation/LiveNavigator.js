// MyApp/src/navigation/LiveNavigator.js
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import StartLiveScreen from "../screen/live/StartLiveScreen";
import HostLiveScreen from "../screen/live/HostLiveScreen";
import ViewerLiveScreen from "../screen/live/ViewerLiveScreen";
import FansRankingScreen from "../screen/live/FansRankingScreen";
import CoinDetailScreen from "../screen/live/CoinDetailScreen";
import EndLiveScreen from "../screen/live/EndLiveScreen";
import PKBattleScreen from "../screen/live/PKBattleScreen";

const Stack = createNativeStackNavigator();

export default function LiveNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="StartLiveScreen" component={StartLiveScreen} />
      <Stack.Screen name="HostLiveScreen" component={HostLiveScreen} />
      <Stack.Screen name="ViewerLiveScreen" component={ViewerLiveScreen} />
      <Stack.Screen name="FansRankingScreen" component={FansRankingScreen} />
      <Stack.Screen name="CoinDetailScreen" component={CoinDetailScreen} />

      {/* 🔥 Screen EndLive harus ditambahkan di sini */}
      <Stack.Screen name="EndLiveScreen" component={EndLiveScreen} />

      {/* PK Battle Screen */}
      <Stack.Screen
        name="PKBattleScreen"
        component={PKBattleScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}