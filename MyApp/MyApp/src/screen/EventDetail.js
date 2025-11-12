import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Linking,
  ScrollView,
} from "react-native";

const { width } = Dimensions.get("window");

export default function EventDetail({ route, navigation }) {
  const { banner } = route.params || {};

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Banner Event */}
      <Image
        source={{ uri: banner?.uri }}
        style={styles.image}
        resizeMode="cover"
      />

      {/* Detail Info */}
      <View style={styles.content}>
        <Text style={styles.title}>{banner?.title || "Event Spesial"}</Text>
        <Text style={styles.desc}>
          Selamat datang di event spesial kami 🎉{"\n\n"}
          Bergabunglah dan menangkan hadiah menarik!{"\n"}
          Klik tombol di bawah untuk informasi lebih lanjut.
        </Text>

        {/* Tombol Gabung */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            if (banner?.link) {
              Linking.openURL(banner.link);
            } else {
              alert("Link event belum tersedia.");
            }
          }}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>🎯 Gabung Event</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 40,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  image: {
    width: width,
    height: 220,
  },
  content: {
    width: "90%",
    marginTop: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#8e44ad",
    marginBottom: 10,
  },
  desc: {
    fontSize: 15,
    color: "#444",
    lineHeight: 22,
    marginBottom: 30,
  },
  button: {
    backgroundColor: "#8e44ad",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});