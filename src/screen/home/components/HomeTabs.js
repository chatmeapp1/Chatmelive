import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function HomeTabs({ index, setIndex, routes }) {
  return (
    <View style={styles.tabContainer}>
      {routes.map((route, i) => (
        <TouchableOpacity key={route.key} onPress={() => setIndex(i)}>
          <Text
            style={[
              styles.tabText,
              index === i ? styles.tabTextActive : styles.tabTextInactive,
            ]}
          >
            {route.title}
          </Text>
          {index === i && <View style={styles.tabIndicator} />}
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  tabText: {
    fontSize: 15,
    fontWeight: "600",
  },
  tabTextActive: {
    color: "#00C896",
  },
  tabTextInactive: {
    color: "#999",
  },
  tabIndicator: {
    height: 3,
    borderRadius: 2,
    backgroundColor: "#00C896",
    marginTop: 3,
  },
});