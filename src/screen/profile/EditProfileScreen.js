
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

export default function EditProfileScreen({ navigation, route }) {
  const userData = route?.params?.userData;
  
  const profileData = {
    avatar: userData?.avatar || require("../../../assets/images/avatar_default.png"),
    nickname: userData?.name || "User",
    gender: userData?.gender || "laki-laki",
    age: userData?.age || 22,
    signature: userData?.signature || "karakteristik aku justru tanda tangan...",
  };

  const menuItems = [
    {
      id: 1,
      title: "gambar profil",
      value: null,
      screen: "ProfilePictureScreen",
      params: {},
    },
    {
      id: 2,
      title: "Sebutan intim",
      value: profileData.nickname,
      screen: "NicknameScreen",
      params: { currentName: profileData.nickname },
    },
    {
      id: 3,
      title: "jenis kelamin",
      value: profileData.gender,
      screen: "GenderScreen",
    },
    {
      id: 4,
      title: "usia",
      value: profileData.age,
      screen: "AgeScreen",
    },
    {
      id: 5,
      title: "tanda tangan pribadi",
      value: profileData.signature,
      screen: "SignatureScreen",
    },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={26} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerText}>profil pribadi</Text>
      </View>

      {/* Content */}
      <ScrollView contentContainerStyle={styles.content}>
        {menuItems.map((item) => (
          <TouchableOpacity 
            key={item.id} 
            style={styles.row}
            onPress={() => navigation.navigate(item.screen, item.params || {})}
          >
            <Text style={styles.label}>{item.title}</Text>
            <View style={styles.right}>
              {item.id === 1 ? (
                <Image source={profileData.avatar} style={styles.avatar} />
              ) : (
                <Text style={styles.val} numberOfLines={1}>
                  {item.value}
                </Text>
              )}
              <Ionicons name="chevron-forward" size={20} color="#aaa" />
            </View>
          </TouchableOpacity>
        ))}
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
