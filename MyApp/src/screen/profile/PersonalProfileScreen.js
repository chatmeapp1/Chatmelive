
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function PersonalProfileScreen({ navigation }) {
  const profileData = {
    avatar: require("../../assets/images/avatar_default.png"),
    nickname: "GOPAY",
    gender: "laki-laki",
    age: 22,
    signature: "karakteristik aku justru tanda tangan...",
  };

  const menuItems = [
    {
      id: 1,
      title: "gambar profil",
      value: null,
      icon: "person-circle",
      screen: "ProfilePictureScreen",
    },
    {
      id: 2,
      title: "Sebutan intim",
      value: profileData.nickname,
      icon: "text",
      screen: "NicknameScreen",
    },
    {
      id: 3,
      title: "jenis kelamin",
      value: profileData.gender,
      icon: "male-female",
      screen: "GenderScreen",
    },
    {
      id: 4,
      title: "usia",
      value: profileData.age,
      icon: "calendar",
      screen: "AgeScreen",
    },
    {
      id: 5,
      title: "tanda tangan pribadi",
      value: profileData.signature,
      icon: "create",
      screen: "SignatureScreen",
    },
  ];

  const renderMenuItem = (item) => (
    <TouchableOpacity
      key={item.id}
      style={styles.menuItem}
      onPress={() => navigation.navigate(item.screen)}
    >
      <View style={styles.menuLeft}>
        <Text style={styles.menuTitle}>{item.title}</Text>
      </View>
      <View style={styles.menuRight}>
        {item.id === 1 ? (
          <Image source={profileData.avatar} style={styles.avatarSmall} />
        ) : (
          <Text style={styles.menuValue} numberOfLines={1}>
            {item.value}
          </Text>
        )}
        <Ionicons name="chevron-forward" size={20} color="#999" />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={28} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>profil pribadi</Text>
        <View style={{ width: 28 }} />
      </View>

      {/* Menu List */}
      <ScrollView style={styles.content}>
        {menuItems.map((item) => renderMenuItem(item))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 50,
    backgroundColor: "#4CAF50",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFF",
  },
  content: {
    flex: 1,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFF",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  menuLeft: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 15,
    color: "#333",
  },
  menuRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    maxWidth: "60%",
  },
  menuValue: {
    fontSize: 14,
    color: "#999",
    marginRight: 4,
  },
  avatarSmall: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 4,
  },
});
