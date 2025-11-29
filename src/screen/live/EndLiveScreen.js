import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import api from "../../utils/api";

export default function EndLiveScreen({ route, navigation }) {
  const {
    duration = 0,
    totalViewers = 0,
    income = 0,
    newFans = 0,
    likes = 0,
    avatar = "",
    username = "Host",
    liveNumber = 1,
    sessionId = null,
  } = route.params || {};

  const [loading, setLoading] = useState(false);

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}m ${s}s`;
  };

  return (
    <SafeAreaView style={styles.container}>

      {/* CLOSE BUTTON */}
      <TouchableOpacity
        style={styles.closeBtn}
        onPress={() => navigation.navigate("MainTabs", { screen: "home" })}
      >
        <Ionicons name="close" size={30} color="#fff" />
      </TouchableOpacity>

      {/* TITLE */}
      <Text style={styles.title}>
        The {liveNumber}th live ended.
      </Text>

      {/* AVATAR */}
      <Image
        source={{ uri: avatar || "https://picsum.photos/200" }}
        style={styles.avatar}
      />

      {/* USERNAME */}
      <Text style={styles.name}>{username}</Text>

      {/* DURATION */}
      <Text style={styles.durationText}>
        Effective live length: {formatTime(duration)}
      </Text>

      {/* STATS BOX */}
      <View style={styles.statsBox}>
        {/* Left Column */}
        <View style={styles.col}>
          <Text style={styles.statTitle}>Browse users</Text>
          <Text style={styles.statValue}>{totalViewers}</Text>

          <Text style={[styles.statTitle, { marginTop: 25 }]}>Newly fans</Text>
          <Text style={styles.statValue}>{newFans}</Text>
        </View>

        {/* Right Column */}
        <View style={styles.col}>
          <Text style={styles.statTitle}>Diamond</Text>
          <Text style={styles.statValue}>{income}</Text>

          <Text style={[styles.statTitle, { marginTop: 25 }]}>Thumb up</Text>
          <Text style={styles.statValue}>{likes}</Text>
        </View>
      </View>

      {/* SHARE BUTTON */}
      <TouchableOpacity style={styles.shareBtn}>
        <Text style={styles.shareText}>Share</Text>
      </TouchableOpacity>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f1215",
    alignItems: "center",
    paddingTop: 40,
  },

  closeBtn: {
    position: "absolute",
    top: 20,
    right: 20,
    padding: 10,
  },

  title: {
    color: "#fff",
    fontSize: 18,
    marginTop: 20,
  },

  avatar: {
    width: 95,
    height: 95,
    borderRadius: 50,
    marginTop: 20,
  },

  name: {
    color: "#fff",
    fontSize: 20,
    marginTop: 12,
  },

  durationText: {
    color: "#ccc",
    marginTop: 5,
    fontSize: 14,
  },

  statsBox: {
    width: "85%",
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 12,
    padding: 20,
    marginTop: 25,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  col: {
    width: "45%",
    alignItems: "center",
  },

  statTitle: {
    color: "#bbb",
    fontSize: 14,
  },

  statValue: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "700",
    marginTop: 5,
  },

  shareBtn: {
    width: "80%",
    backgroundColor: "#32e0a0",
    paddingVertical: 12,
    borderRadius: 50,
    marginTop: 40,
    alignItems: "center",
  },

  shareText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});