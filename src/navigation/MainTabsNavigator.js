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
  Image,
} from "react-native";
import { TabView } from "react-native-tab-view";
import { useNavigation } from "@react-navigation/native";

import HomeScreen from "../screen/HomeScreen";
import PartyScreen from "../screen/party/PartyScreen";
import ChatNavigator from "../navigation/ChatNavigator";
import ProfileScreen from "../screen/profile/ProfileScreen";
import colors from "../utils/colors";

const { width } = Dimensions.get("window");

// Icon mapping with custom assets
const ICON_MAP = {
  home: require("../../assets/icons/ic_home.png"),
  party: require("../../assets/icons/ic_party.png"),
  live: require("../../assets/icons/ic-live.png"),
  chat: require("../../assets/icons/ic_chat.png"),
  profile: require("../../assets/icons/ic_profile.png"),
};

export default function MainTabsNavigator() {
  const navigation = useNavigation();
  const [index, setIndex] = useState(0);
  
  const allRoutes = [
    { key: "home", title: "Home", icon: "home" },
    { key: "party", title: "Party", icon: "party" },
    { key: "live", title: "Live", icon: "live", webDisabled: true },
    { key: "chat", title: "Chat", icon: "chat" },
    { key: "profile", title: "Profile", icon: "profile" },
  ];
  
  const [routes] = useState(allRoutes);
  const translateX = useRef(new Animated.Value(0)).current;
  
  // Pulse animation refs for each tab
  const pulseAnims = useRef(routes.map(() => new Animated.Value(1))).current;

  const renderScene = ({ route }) => {
    switch (route.key) {
      case "home":
        return <HomeScreen />;
      case "party":
        return <PartyScreen />;
      case "chat":
        return <ChatNavigator />;
      case "profile":
        return <ProfileScreen />;
      default:
        return (
          <View style={styles.centered}>
            <Text>Screen not found</Text>
          </View>
        );
    }
  };

  const triggerPulse = (tabIndex) => {
    const pulseAnim = pulseAnims[tabIndex];
    pulseAnim.setValue(1);
    
    Animated.sequence([
      Animated.timing(pulseAnim, {
        toValue: 0.85,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(pulseAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleIndexChange = (i) => {
    if (routes[i].key === "live") {
      if (Platform.OS === "web") {
        return;
      }
      return;
    }
    triggerPulse(i);
    Animated.spring(translateX, {
      toValue: (width / routes.length) * i,
      useNativeDriver: true,
      friction: 8,
    }).start();
    setIndex(i);
  };

  const handleLivePress = () => {
    if (Platform.OS !== "web") {
      const liveIndex = routes.findIndex(r => r.key === "live");
      triggerPulse(liveIndex);
      navigation.navigate("LiveNavigator");
    }
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
                onPress={handleLivePress}
                disabled={Platform.OS === "web"}
              >
                <Animated.View 
                  style={[
                    styles.liveButton,
                    { transform: [{ scale: pulseAnims[i] }] }
                  ]}
                >
                  <Image
                    source={ICON_MAP.live}
                    style={styles.liveIcon}
                    resizeMode="contain"
                  />
                </Animated.View>
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
              activeOpacity={0.8}
            >
              <Animated.View
                style={{
                  transform: [{ scale: pulseAnims[i] }],
                }}
              >
                <Image
                  source={ICON_MAP[route.icon]}
                  style={[
                    styles.tabIcon,
                    { opacity: isActive ? 1 : 0.6 },
                  ]}
                  resizeMode="contain"
                />
              </Animated.View>
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
  tabItem: { 
    flex: 1, 
    alignItems: "center", 
    justifyContent: "center",
    paddingTop: 5,
  },
  tabIcon: {
    width: 40,
    height: 40,
  },
  tabLabel: { 
    fontSize: 12, 
    marginTop: 6,
    fontWeight: "500",
  },
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
  liveIcon: {
    width: 36,
    height: 36,
  },
  liveLabel: {
    fontSize: 12,
    color: "#3A663A",
    marginTop: 2,
    fontWeight: "600",
  },
});
