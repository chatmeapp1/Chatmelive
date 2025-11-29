import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableWithoutFeedback,
  Image,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";

// ✅ Load icon dari assets
const functions = [
  {
    id: "1",
    icon: require("../../../../assets/icons/level_128.png"),
    label: "Level",
    route: "LevelScreen",
  },
  {
    id: "2",
    icon: require("../../../../assets/icons/penggemar_128.png"),
    label: "Penggemar",
    route: "PenggemarScreen",
  },
  {
    id: "3",
    icon: require("../../../../assets/icons/pendapatan_128.png"),
    label: "Pendapatan",
    route: "Pendapatan",
  },
  {
    id: "4",
    icon: require("../../../../assets/icons/game_128.png"),
    label: "Game",
    route: "GameCenterScreen",
  },
  {
    id: "5",
    icon: require("../../../../assets/agency.png"),
    label: "Agency",
    route: "AgencyDashboard",
  },
  {
    id: "6",
    icon: require("../../../../assets/icons/bergabung_128.png"),
    label: "Bergabung",
    route: "BergabungScreen",
  },
];

export default function ProfileFunctions() {
  const navigation = useNavigation();

  // ✅ Animasi masuk
  const animations = useRef(functions.map(() => new Animated.Value(0))).current;

  // ✅ Animasi saat ditekan
  const pressAnimations = useRef(
    functions.map(() => new Animated.Value(1))
  ).current;

  useEffect(() => {
    const anim = animations.map((a, i) =>
      Animated.spring(a, {
        toValue: 1,
        useNativeDriver: true,
        friction: 7,
        delay: i * 120,
      })
    );
    Animated.stagger(100, anim).start();
  }, []);

  // ✅ Efek goyang halus
  const handlePress = (index, route) => {
    Animated.sequence([
      Animated.timing(pressAnimations[index], {
        toValue: 0.9,
        duration: 80,
        useNativeDriver: true,
      }),
      Animated.spring(pressAnimations[index], {
        toValue: 1,
        friction: 3,
        tension: 80,
        useNativeDriver: true,
      }),
    ]).start(() => {
      navigation.navigate("ProfileNavigator", { screen: route });
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Fungsi umum</Text>

      <View style={styles.grid}>
        {functions.map((item, index) => {
          const enterAnim = animations[index].interpolate({
            inputRange: [0, 1],
            outputRange: [0.7, 1],
          });

          const pressAnim = pressAnimations[index];

          const combinedAnim = {
            transform: [
              { scale: Animated.multiply(enterAnim, pressAnim) },
              {
                rotate: pressAnimations[index].interpolate({
                  inputRange: [0.9, 1],
                  outputRange: ["-5deg", "0deg"],
                }),
              },
            ],
          };

          return (
            <Animated.View
              key={item.id}
              style={[
                styles.itemWrapper,
                index === 4 ? styles.centerLastItem : null, // ✅ item ke-5 biar di tengah
                { opacity: animations[index], ...combinedAnim },
              ]}
            >
              <TouchableWithoutFeedback
                onPress={() => handlePress(index, item.route)}
              >
                <LinearGradient
                  colors={["#3EDC81", "#63EEA2", "#B3FAD5"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.card}
                >
                  {/* wrapper icon */}
                  <View
                    style={[
                      styles.iconWrapper,
                      item.id === "4" && styles.iconGameShadow,
                    ]}
                  >
                    <Image source={item.icon} style={styles.iconImage} />
                  </View>

                  <Text style={styles.label}>{item.label}</Text>
                </LinearGradient>
              </TouchableWithoutFeedback>
            </Animated.View>
          );
        })}
      </View>
    </View>
  );
}

// ✅ Styles
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    borderRadius: 14,
    padding: 14,
    marginTop: 14,
    shadowColor: "#00C67A",
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#222",
    marginBottom: 10,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  itemWrapper: {
    width: "48%",
    marginVertical: 6,
  },

  // ✅ Item ke-5 biar pas tengah
  centerLastItem: {
    width: "48%",
    alignSelf: "center",
  },

  card: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    paddingVertical: 18,
    shadowColor: "#00B96E",
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 4,
  },

  iconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },

  iconGameShadow: {
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 6,
    elevation: 6,
  },

  iconImage: {
    width: 38,
    height: 38,
    resizeMode: "contain",
  },

  label: {
    color: "#054D32",
    fontWeight: "600",
    marginTop: 6,
    fontSize: 14,
  },
});