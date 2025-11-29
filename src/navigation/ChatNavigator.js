import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import ChatScreen from "../screen/chat/ChatScreen";
import PrivateChatScreen from "../screen/chat/PrivateChatScreen";

const Stack = createNativeStackNavigator();

export default function ChatNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ChatHome" component={ChatScreen} />
      <Stack.Screen name="PrivateChat" component={PrivateChatScreen} />
    </Stack.Navigator>
  );
}
