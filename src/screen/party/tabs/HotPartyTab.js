
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import ShimmerPlaceholder from "react-native-shimmer-placeholder";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import getEnvVars from "../../../utils/env";

const { API_URL } = getEnvVars();

const { width } = Dimensions.get("window");
const CARD_WIDTH = width / 2 - 20;
const CARD_HEIGHT = CARD_WIDTH * 1.4;

export default function HotPartyTab() {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchHotRooms();
  }, []);

  const fetchHotRooms = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/party/hot`);
      if (response.data.success) {
        setData(response.data.data);
      }
    } catch (error) {
      console.error("❌ Error fetching hot party rooms:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePress = (item) => {
    navigation.navigate("RoomNavigator", {
      screen: "PartyRoomScreen",
      params: { room: item },
    });
  };

  const renderCard = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.85}
      onPress={() => handlePress(item)}
    >
      <LinearGradient colors={["#B5FFB8", "transparent"]} style={styles.neonTop} />

      <Image source={{ uri: item.image }} style={styles.image} />

      <View style={styles.overlay}>
        <Text style={styles.name}>{item.country} {item.name}</Text>

        <View style={styles.viewerRow}>
          <Ionicons name="eye" size={14} color="#fff" />
          <Text style={styles.viewerText}>{item.viewers}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderShimmer = (_, i) => (
    <View key={i} style={styles.card}>
      <ShimmerPlaceholder
        LinearGradient={LinearGradient}
        style={styles.image}
        shimmerColors={["#E8FFE8", "#B5FFB8", "#E8FFE8"]}
      />
    </View>
  );

  return (
    <FlatList
      data={loading ? [1, 2, 3, 4] : data}
      numColumns={2}
      keyExtractor={(item, i) => item.id ?? i.toString()}
      contentContainerStyle={styles.list}
      renderItem={loading ? renderShimmer : renderCard}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    paddingHorizontal: 10,
    paddingBottom: 90,
  },
  card: {
    margin: 5,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#000",
  },
  neonTop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 10,
    zIndex: 2,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  image: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
  },
  overlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 6,
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  name: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  viewerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  viewerText: {
    color: "#fff",
    fontSize: 12,
    marginLeft: 4,
  },
});
