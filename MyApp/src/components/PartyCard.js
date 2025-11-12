import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";

export default function PartyCard({ room, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image source={{ uri: room.image }} style={styles.image} />
      <View style={styles.overlay} />
      <View style={styles.info}>
        <Text style={styles.name}>
          {room.country} {room.name}
        </Text>
        <Text style={styles.viewers}>👥 {room.viewers}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    margin: 6,
    borderRadius: 12,
    overflow: "hidden",
    elevation: 3,
    backgroundColor: "#eee",
  },
  image: {
    width: "100%",
    height: 180,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.25)",
  },
  info: {
    position: "absolute",
    bottom: 8,
    left: 8,
  },
  name: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
  viewers: {
    color: "#fff",
    fontSize: 12,
    marginTop: 2,
  },
});