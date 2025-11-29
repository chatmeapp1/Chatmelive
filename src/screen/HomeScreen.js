import React, { useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Dimensions,
  View,
  StatusBar,
  Platform,
} from "react-native";
import { TabView, SceneMap } from "react-native-tab-view";

// === Components ===
import HomeSearchBar from "./home/components/HomeSearchBar";
import HomeBanner from "./home/components/HomeBanner";
import HomeTabs from "./home/components/HomeTabs";

// === Tabs ===
import FollowTab from "./home/tabs/FollowTab";
import HotTab from "./home/tabs/HotTab";
import NewTab from "./home/tabs/NewTab";

const { width } = Dimensions.get("window");

export default function HomeScreen() {
  const [index, setIndex] = useState(1);
  const [routes] = useState([
    { key: "follow", title: "Follow" },
    { key: "hot", title: "Hot" },
    { key: "new", title: "New" },
  ]);

  const renderScene = SceneMap({
    follow: FollowTab,
    hot: HotTab,
    new: NewTab,
  });

  return (
    <SafeAreaView style={styles.container}>
      {/* Status bar control */}
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header wrapper (Search, Banner, Tabs) */}
      <View style={styles.headerWrapper}>
        <HomeSearchBar />
        <HomeBanner />
        <HomeTabs index={index} setIndex={setIndex} routes={routes} />
      </View>

      {/* Swipe Tabs Section */}
      <View style={styles.tabWrapper}>
        <TabView
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={{ width }}
          renderTabBar={() => null}
          swipeEnabled
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  headerWrapper: {
    // ✅ Otomatis menyesuaikan tinggi status bar (Android & iOS)
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight + 10 : 30,
    backgroundColor: "#fff",
    borderBottomWidth: 0.3,
    borderBottomColor: "#eee",
  },
  tabWrapper: {
    flex: 1,
    backgroundColor: "#fff",
  },
})