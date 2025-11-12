// MyApp/src/screen/auth/OnboardingScreen.js
import React, { useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  FlatList,
  StatusBar,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width } = Dimensions.get("window");

const slides = [
  {
    id: "1",
    title: "Selamat Datang di ChatMe",
    description: "Temukan teman baru, ngobrol, dan hibur dirimu setiap hari.",
    image: require("../../../assets/onboarding/slide1.png"),
  },
  {
    id: "2",
    title: "Gabung Party Seru",
    description: "Masuk ke room, ngobrol bareng, dan ikut event spesial 🎉",
    image: require("../../../assets/onboarding/slide2.png"),
  },
  {
    id: "3",
    title: "Nikmati Hadiah & Level Up",
    description: "Dapatkan poin, hadiah, dan jadi host populer! 💎",
    image: require("../../../assets/onboarding/slide3.png"),
  },
];

export default function OnboardingScreen({ navigation }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const slidesRef = useRef(null);

  const viewableItemsChanged = useRef(({ viewableItems }) => {
    setCurrentIndex(viewableItems[0].index);
  }).current;

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const handleNext = async () => {
    if (currentIndex < slides.length - 1) {
      slidesRef.current.scrollToIndex({ index: currentIndex + 1 });
    } else {
      await AsyncStorage.setItem("hasOnboarded", "true");
      navigation.replace("SplashScreen");
    }
  };

  const renderSlide = ({ item }) => (
    <LinearGradient colors={["#9AEC9A", "#63EEA2", "#B3FAD5"]} style={styles.slide}>
      <StatusBar barStyle="dark-content" backgroundColor="#9AEC9A" />
      <Image source={item.image} style={styles.image} resizeMode="contain" />
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.description}>{item.description}</Text>
    </LinearGradient>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={slides}
        renderItem={renderSlide}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        bounces={false}
        keyExtractor={(item) => item.id}
        onViewableItemsChanged={viewableItemsChanged}
        viewabilityConfig={viewConfig}
        ref={slidesRef}
      />

      {/* Dots Indicator */}
      <View style={styles.dotsContainer}>
        {slides.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              currentIndex === index ? styles.activeDot : styles.inactiveDot,
            ]}
          />
        ))}
      </View>

      {/* Button Next */}
      <TouchableOpacity activeOpacity={0.8} onPress={handleNext}>
        <LinearGradient
          colors={["#56E37D", "#3DDC84", "#2ECC71"]}
          style={styles.button}
        >
          <Text style={styles.buttonText}>
            {currentIndex === slides.length - 1 ? "Mulai Sekarang" : "Lanjut"}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  slide: {
    width,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 30,
  },
  image: { width: 250, height: 250, marginBottom: 30 },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1E5631",
    textAlign: "center",
    marginBottom: 10,
  },
  description: {
    textAlign: "center",
    color: "#355C3B",
    fontSize: 14,
    lineHeight: 20,
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  activeDot: { backgroundColor: "#1E8C4B" },
  inactiveDot: { backgroundColor: "#C6EFD4" },
  button: {
    marginHorizontal: 30,
    marginBottom: 40,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});