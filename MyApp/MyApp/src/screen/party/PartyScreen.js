import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Platform,
  StatusBar,
  Animated,
  Dimensions,
  FlatList,
} from "react-native";
import { TabView, SceneMap } from "react-native-tab-view";
import { useNavigation } from "@react-navigation/native";
import PartyBanner from "./components/PartyBanner";
import PartyCard from "./components/PartyCard";

const { width } = Dimensions.get("window");

// === Dummy data ===
const dataHot = [
  { id: 1, name: "Nona 💋", country: "🇮🇩", image: "https://picsum.photos/200/300?random=1", viewers: 75 },
  { id: 2, name: "Soraya Cute 💄", country: "🇮🇩", image: "https://picsum.photos/200/300?random=2", viewers: 88 },
  { id: 3, name: "Queen 🌹", country: "🇮🇩", image: "https://picsum.photos/200/300?random=3", viewers: 120 },
  { id: 4, name: "Baby Elz 😘", country: "🇮🇩", image: "httpsum.photos/200/300?random=4", viewers: 95 },
];

const dataAsia = [
  { id: 5, name: "Mina 🇯🇵", country: "🇯🇵", image: "https://picsum.photos/200/300?random=5", viewers: 140 },
  { id: 6, name: "Lalisa 🇹🇭", country: "🇹🇭", image: "https://picsum.photos/200/300?random=6", viewers: 130 },
  { id: 7, name: "Sakura 🇰🇷", country: "🇰🇷", image: "https://picsum.photos/200/300?random=7", viewers: 115 },
];

const dataMiddleEast = [
  { id: 8, name: "Layla 🌙", country: "🇸🇦", image: "https://picsum.photos/200/300?random=8", viewers: 110 },
  { id: 9, name: "Amina 💫", country: "🇦🇪", image: "https://picsum.photos/200/300?random=9", viewers: 90 },
];

// ✅ FIXED — PartyList langsung menggunakan nested navigation ke RoomNavigator
const PartyList = ({ data, navigation }) => (
  <FlatList
    data={data}
    keyExtractor={(item) => item.id.toString()}
    numColumns={2}
    showsVerticalScrollIndicator={false}
    contentContainerStyle={styles.listContainer}
    renderItem={({ item }) => (
      <PartyCard
        room={item}
        onPress={() =>
          navigation.navigate("RoomNavigator", {
            screen: "PartyRoomScreen",
            params: { room: item },
          })
        }
      />
    )}
  />
);

export default function PartyScreen() {
  const navigation = useNavigation();
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "hot", title: "🔥 Hot" },
    { key: "asia", title: "Asia" },
    { key: "middle", title: "Timur Tengah" },
  ]);

  const fadeAnim = useState(new Animated.Value(1))[0];

  const renderScene = SceneMap({
    hot: () => <PartyList data={dataHot} navigation={navigation} />,
    asia: () => <PartyList data={dataAsia} navigation={navigation} />,
    middle: () => <PartyList data={dataMiddleEast} navigation={navigation} />,
  });

  useEffect(() => {
    Animated.sequence([
      Animated.timing(fadeAnim, { toValue: 0.8, duration: 150, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 250, useNativeDriver: true }),
    ]).start();
  }, [index]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header */}
      <View style={styles.headerWrapper}>
        <View style={styles.titleRow}>
          <Text style={styles.follow}>Mengikuti</Text>
          <Text style={styles.active}>Berpesta</Text>
        </View>

        <PartyBanner />
      </View>

      {/* Tabs */}
      <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
        <TabView
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={{ width }}
          renderTabBar={(props) => (
            <View style={styles.tabContainer}>
              {props.navigationState.routes.map((route, i) => {
                const isActive = index === i;
                return (
                  <Text
                    key={i}
                    onPress={() => setIndex(i)}
                    style={[
                      styles.tabItem,
                      isActive ? styles.activeTab : styles.inactiveTab,
                    ]}
                  >
                    {route.title}
                  </Text>
                );
              })}
            </View>
          )}
        />
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  headerWrapper: {
    backgroundColor: "#fff",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight + 8 : 20,
    borderBottomWidth: 0.3,
    borderBottomColor: "#eee",
    elevation: 2,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
  follow: { fontSize: 18, color: "#888", fontWeight: "500" },
  active: {
    fontSize: 20,
    color: "#3CD070",
    fontWeight: "700",
    marginLeft: 15,
    textDecorationLine: "underline",
  },
  listContainer: {
    paddingHorizontal: 10,
    paddingBottom: 100,
    backgroundColor: "#fff",
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "center",
    paddingVertical: 8,
    backgroundColor: "#fff",
  },
  tabItem: {
    fontSize: 14,
    fontWeight: "600",
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    marginHorizontal: 6,
  },
  activeTab: {
    backgroundColor: "#B5F5C0",
    color: "#2E7D32",
  },
  inactiveTab: {
    backgroundColor: "#F3F3F3",
    color: "#666",
  },
});