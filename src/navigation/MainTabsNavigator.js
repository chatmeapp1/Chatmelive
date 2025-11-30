// MyApp/src/navigation/MainTabsNavigator.js
import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  Platform,
} from "react-native";
import { TabView } from "react-native-tab-view";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

import HomeScreen from "../screen/HomeScreen";
import PartyScreen from "../screen/party/PartyScreen";
import ChatNavigator from "../navigation/ChatNavigator";
import ProfileNavigator from "../navigation/ProfileNavigator";
import colors from "../utils/colors";

const { width } = Dimensions.get("window");

export default function MainTabsNavigator() {
  const navigation = useNavigation();
  const [index, setIndex] = useState(0);
  
  const allRoutes = [
    { key: "home", title: "Home", icon: "home" },
    { key: "party", title: "Party", icon: "musical-notes" },
    { key: "live", title: "Live", icon: "radio", webDisabled: true },
    { key: "chat", title: "Chat", icon: "chatbubble" },
    { key: "profile", title: "Profile", icon: "person" },
  ];
  
  const [routes] = useState(allRoutes);

  const translateX = useRef(new Animated.Value(0)).current;

  const renderScene = ({ route }) => {
    switch (route.key) {
      case "home":
        return <HomeScreen />;
      case "party":
        return <PartyScreen />;
      case "chat":
        return <ChatNavigator />;
      case "profile":
        return <ProfileNavigator />;
      default:
        return (
          <View style={styles.centered}>
            <Text>Screen not found</Text>
          </View>
        );
    }
  };

  const handleIndexChange = (i) => {
    if (routes[i].key === "live") {
      if (Platform.OS === "web") {
        return;
      }
      return;
    }
    Animated.spring(translateX, {
      toValue: (width / routes.length) * i,
      useNativeDriver: true,
      friction: 8,
    }).start();
    setIndex(i);
  };

  return (
    <View style={styles.container}>
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={handleIndexChange}
        initialLayout={{ width }}
        renderTabBar={() => null}
        swipeEnabled={false}
      />

      {/* === Bottom Tab Bar === */}
      <View style={styles.tabBar}>
        {routes.map((route, i) => {
          const isLive = route.key === "live";

          if (isLive) {
            return (
              <TouchableOpacity
                key="live"
                style={[styles.liveButtonWrapper, Platform.OS === "web" && { opacity: 0.5 }]}
                onPress={() => {
                  if (Platform.OS !== "web") {
                    navigation.navigate("LiveNavigator");
                  }
                }}
                disabled={Platform.OS === "web"}
              >
                <View style={styles.liveButton}>
                  <Ionicons name="radio-outline" size={30} color="#fff" />
                </View>
                <Text style={styles.liveLabel}>Live</Text>
              </TouchableOpacity>
            );
          }

          const isActive = index === i;
          return (
            <TouchableOpacity
              key={route.key}
              style={styles.tabItem}
              onPress={() => handleIndexChange(i)}
            >
              <Ionicons
                name={isActive ? route.icon : `${route.icon}-outline`}
                size={24}
                color={isActive ? colors.primary : "#999"}
              />
              <Text
                style={[
                  styles.tabLabel,
                  { color: isActive ? colors.primary : "#999" },
                ]}
              >
                {route.title}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  tabBar: {
    flexDirection: "row",
    height: 70,
    backgroundColor: "#fff",
    borderTopWidth: 0.5,
    borderColor: "#eee",
    elevation: 8,
  },
  tabItem: { flex: 1, alignItems: "center", justifyContent: "center" },
  tabLabel: { fontSize: 12, marginTop: 2 },
  liveButtonWrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    marginTop: -25,
  },
  liveButton: {
    width: 70,
    height: 70,
    borderRadius: 40,
    backgroundColor: "#9AEC9A",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#9AEC9A",
    shadowOpacity: 0.6,
    shadowRadius: 10,
    elevation: 6,
  },
  liveLabel: {
    fontSize: 12,
    color: "#3A663A",
    marginTop: 2,
    fontWeight: "600",
  },
});