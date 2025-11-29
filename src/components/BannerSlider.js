import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Image,
  Animated,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Alert,
} from "react-native";

const banners = [
  {
    uri: "1000_F_409569278_nzKPJyfGMbRENm8GuIrVJGnPubwWe0zH.webp",
    title: "Event Dragon Festival",
    link: "1000_F_409569278_nzKPJyfGMbRENm8GuIrVJGnPubwWe0zH.webp",
  },
  {
    uri: "https://i.imgur.com/C2vZ7BI.jpg",
    title: "Top Host Competition",
    link: "https://chatmeapp.my.id/event/top-host",
  },
  {
    uri: "https://i.imgur.com/XLH8kHY.jpg",
    title: "Lucky Draw Party",
    link: "https://chatmeapp.my.id/event/lucky-draw",
  },
];

const { width } = Dimensions.get("window");

export default function BannerSlider({ onBannerPress }) {
  const [index, setIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  // 🔁 Auto fade tiap 3 detik
  useEffect(() => {
    const interval = setInterval(() => {
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start();

      setIndex((prevIndex) => (prevIndex + 1) % banners.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // 🔗 Klik banner
  const handlePress = () => {
    const selected = banners[index];
    if (onBannerPress) {
      onBannerPress(selected);
    } else {
      // Default aksi: tampilkan alert
      Alert.alert("Event", `Buka halaman: ${selected.title}`);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handlePress} activeOpacity={0.9}>
        <Animated.Image
          source={{ uri: banners[index].uri }}
          style={[styles.image, { opacity: fadeAnim }]}
        />
      </TouchableOpacity>

      {/* 🔵 Dots indikator */}
      <View style={styles.dotsContainer}>
        {banners.map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              { opacity: i === index ? 1 : 0.3 },
              { backgroundColor: i === index ? "#8e44ad" : "#ccc" },
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    marginBottom: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: width * 0.9,
    height: 110,
    borderRadius: 12,
    resizeMode: "cover",
    backgroundColor: "#f3f3f3",
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    position: "absolute",
    bottom: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
});