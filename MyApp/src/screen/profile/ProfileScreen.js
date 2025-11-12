import React, { useState } from "react";
import {
  Animated,
  RefreshControl,
  StyleSheet,
  View,
  ScrollView,
} from "react-native";

import ProfileHeader from "./components/ProfileHeader";
import ProfileStats from "./components/ProfileStats";
import ProfileBalance from "./components/ProfileBalance";
import ProfileFunctions from "./components/ProfileFunctions";
import ProfileShop from "./components/ProfileShop";

export default function ProfileScreen({ navigation }) {
  const scrollY = new Animated.Value(0);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  };

  const headerHeight = scrollY.interpolate({
    inputRange: [0, 150],
    outputRange: [200, 100],
    extrapolate: "clamp",
  });

  return (
    <View style={styles.container}>

      {/* ✅ HEADER FIXED */}
      <Animated.View
        style={[
          styles.headerContainer,
          { height: headerHeight }
        ]}
      >
        <ProfileHeader />
      </Animated.View>

      {/* ✅ CONTENT SCROLL */}
      <Animated.ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={{
          paddingBottom: 100,
          paddingTop: 10,
        }}
      >
        <View style={styles.content}>
          <ProfileStats />
          <ProfileBalance />
          <ProfileFunctions />
          <ProfileShop />
        </View>
      </Animated.ScrollView>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },

  /* ✅ Header selalu di atas dan tidak tertutup */
  headerContainer: {
    overflow: "hidden",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    zIndex: 9999,
    elevation: 10, // ✅ dukungan Android
  },

  scrollView: {
    flex: 1,
    marginTop: -20, // sambung halus antara header & konten
  },

  content: {
    marginHorizontal: 8,
    marginTop: 20,
  },
});