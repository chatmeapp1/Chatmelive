import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function EditProfileScreen({ navigation }) {
  return (
    <View style={styles.container}>
      {/* ✅ Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={26} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.headerText}>profil pribadi</Text>
      </View>

      {/* ✅ Content */}
      <ScrollView contentContainerStyle={styles.content}>
        <TouchableOpacity style={styles.row}>
          <Text style={styles.label}>gambar profil</Text>
          <View style={styles.right}>
            <Image
              source={require("../../../assets/images/avatar_default.png")}
              style={styles.avatar}
            />
            <Ionicons name="chevron-forward" size={20} color="#aaa" />
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.row}>
          <Text style={styles.label}>Sebutan intim</Text>
          <View style={styles.right}>
            <Text style={styles.val}>GOPAY</Text>
            <Ionicons name="chevron-forward" size={20} color="#aaa" />
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.row}>
          <Text style={styles.label}>jenis kelamin</Text>
          <View style={styles.right}>
            <Text style={styles.val}>laki-laki</Text>
            <Ionicons name="chevron-forward" size={20} color="#aaa" />
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.row}>
          <Text style={styles.label}>usia</Text>
          <View style={styles.right}>
            <Text style={styles.val}>22</Text>
            <Ionicons name="chevron-forward" size={20} color="#aaa" />
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.row}>
          <Text style={styles.label}>tanda tangan pribadi</Text>
          <View style={styles.right}>
            <Text style={styles.val} numberOfLines={1}>
              karakteristik aku justru tanda tang…
            </Text>
            <Ionicons name="chevron-forward" size={20} color="#aaa" />
          </View>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F5F5" },

  header: {
    backgroundColor: "#6EE096",
    paddingTop: 45,
    paddingBottom: 20,
    alignItems: "center",
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  },
  backBtn: { position: "absolute", left: 15, top: 45 },
  headerText: { color: "#fff", fontSize: 18, fontWeight: "600" },

  content: { paddingTop: 10 },

  row: {
    backgroundColor: "#fff",
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  label: { fontSize: 15, color: "#444" },
  right: { flexDirection: "row", alignItems: "center", maxWidth: "60%" },

  val: { fontSize: 15, color: "#999", marginRight: 6 },

  avatar: { width: 52, height: 52, borderRadius: 26, marginRight: 8 },
});