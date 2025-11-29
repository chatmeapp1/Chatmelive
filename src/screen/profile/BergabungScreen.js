// MyApp/src/screen/profile/BergabungScreen.js
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, StatusBar } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

export default function BergabungScreen({ navigation }) {
  return (
    <LinearGradient
      colors={["#9AEC9A", "#63EEA2", "#B3FAD5"]}
      style={styles.container}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#9AEC9A" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Join Us</Text>
        <View style={{ width: 24 }} /> 
      </View>

      <View style={styles.content}>
        <LinearGradient
          colors={["#A45DEB", "#F093FB"]}
          style={styles.banner}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.bannerText}>Join Us</Text>
        </LinearGradient>

        <TouchableOpacity 
          style={styles.option}
          onPress={() => navigation.navigate("ApplyAgency")}
        >
          <Text style={styles.optionText}>Apply for Agency</Text>
          <Ionicons name="chevron-forward" size={20} color="#888" />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.option}
          onPress={() => navigation.navigate("ApplyHost")}
        >
          <Text style={styles.optionText}>Apply for Host</Text>
          <Ionicons name="chevron-forward" size={20} color="#888" />
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    marginTop: StatusBar.currentHeight || 40,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  content: {
    backgroundColor: "#fff",
    marginTop: 30,
    flex: 1,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  banner: {
    padding: 30,
    borderRadius: 20,
    alignItems: "center",
    marginBottom: 25,
  },
  bannerText: {
    fontSize: 22,
    color: "#fff",
    fontWeight: "700",
  },
  option: {
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    elevation: 2,
  },
  optionText: {
    fontSize: 16,
    color: "#222",
  },
});