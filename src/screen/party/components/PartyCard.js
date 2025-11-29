import React from "react";
import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const PartyCard = ({ room, onPress }) => {
  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.85}
      onPress={onPress}
    >
      <ImageBackground
        source={{ uri: room.image }}
        style={styles.image}
        imageStyle={styles.imageStyle}
      >
        <View style={styles.overlay}>
          <View style={styles.bottomInfo}>
            <Text style={styles.name} numberOfLines={1}>
              {room.country} {room.name}
            </Text>
            <View style={styles.viewersRow}>
              <Ionicons name="eye" size={14} color="#fff" />
              <Text style={styles.viewers}>{room.viewers}</Text>
            </View>
          </View>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    margin: 5,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#eee",
    elevation: 3,
  },
  image: {
    height: 180,
    justifyContent: "flex-end",
  },
  imageStyle: {
    borderRadius: 12,
  },
  overlay: {
    backgroundColor: "rgba(0,0,0,0.25)",
    borderRadius: 12,
    padding: 8,
  },
  bottomInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  name: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 13,
    flex: 1,
  },
  viewersRow: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 6,
  },
  viewers: {
    color: "#fff",
    marginLeft: 3,
    fontSize: 12,
  },
});

export default PartyCard;