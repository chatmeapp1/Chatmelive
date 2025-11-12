import React from "react";
import { View, StyleSheet, FlatList } from "react-native";
import HostCard from "../components/HostCard";
import { useLive } from "../../../context/LiveContext";

const defaultHosts = [
  {
    id: "1",
    name: "Samantha",
    viewers: 128,
    image: "https://i.ibb.co/CvRrxhv/sample1.jpg",
    title: "Chilling with U 💕",
  },
  {
    id: "2",
    name: "Jeje",
    viewers: 245,
    image: "https://i.ibb.co/Y8Fjz8z/sample2.jpg",
    title: "Ngobrol seru yuk!",
  },
];

export default function HotTab() {
  const { liveHosts } = useLive();

  const hosts = liveHosts.length > 0 ? liveHosts : defaultHosts;

  return (
    <View style={styles.container}>
      <FlatList
        data={hosts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <HostCard host={item} />}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 10,
  },
  list: {
    paddingBottom: 80,
  },
});