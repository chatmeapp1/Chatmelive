import React, { useRef, useEffect, useState } from "react";
import {
  View,
  Image,
  FlatList,
  Dimensions,
  StyleSheet,
  Animated,
  ActivityIndicator,
} from "react-native";
import * as FileSystem from "expo-file-system";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");

export default function PartyBanner() {
  const flatListRef = useRef(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  const [banners, setBanners] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  // 🔥 Static banners sebagai fallback
  const STATIC_BANNERS = [
    { id: 1, image: "https://i.imgur.com/C2vZ7BI.jpg", title: "Party Event" },
    { id: 2, image: "https://i.imgur.com/XLH8kHY.jpg", title: "Lucky Draw" },
  ];

  useEffect(() => {
    fetchBanners();
  }, []);

  // === Fetch dan cache gambar ===
  const fetchBanners = async () => {
    try {
      // Gunakan static banners untuk sekarang
      setBanners(STATIC_BANNERS);
      setLoading(false);
    } catch (error) {
      console.log("Gagal ambil banner:", error);
      // Fallback ke static banners
      setBanners(STATIC_BANNERS);
      setLoading(false);
    }
  };

  // === Auto Slide ===
  useEffect(() => {
    if (!banners.length) return;

    const timer = setInterval(() => {
      const nextIndex = (currentIndex + 1) % banners.length;
      setCurrentIndex(nextIndex);
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
    }, 3000);

    return () => clearInterval(timer);
  }, [currentIndex, banners]);

  if (loading) {
    // Placeholder shimmer efek gradasi abu
    return (
      <LinearGradient
        colors={["#e0e0e0", "#f5f5f5", "#e0e0e0"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.shimmer}
      >
        <ActivityIndicator size="small" color="#888" />
      </LinearGradient>
    );
  }

  if (!banners.length) return null;

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={banners}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        renderItem={({ item }) => (
          <View style={styles.slide}>
            <Image source={{ uri: item.image }} style={styles.image} />
          </View>
        )}
      />

      {/* Pagination Dots */}
      <View style={styles.pagination}>
        {banners.map((_, i) => {
          const opacity = scrollX.interpolate({
            inputRange: [(i - 1) * width, i * width, (i + 1) * width],
            outputRange: [0.3, 1, 0.3],
            extrapolate: "clamp",
          });
          return <Animated.View key={i} style={[styles.dot, { opacity }]} />;
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#f5f5f5",
    marginBottom: 10,
    marginTop: 8,
  },
  slide: {
    width: width - 32,
    height: 120,
    borderRadius: 12,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  pagination: {
    flexDirection: "row",
    position: "absolute",
    bottom: 8,
    alignSelf: "center",
  },
  dot: {
    height: 6,
    width: 6,
    borderRadius: 3,
    backgroundColor: "#999",
    marginHorizontal: 3,
  },
  shimmer: {
    marginHorizontal: 16,
    height: 120,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
});