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

      <View style={styles.iconsRow}>
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
                  outputRange: ["-8deg", "0deg"],
                }),
              },
            ],
          };

          return (
            <Animated.View
              key={item.id}
              style={[
                styles.iconItemWrapper,
                { opacity: animations[index], ...combinedAnim },
              ]}
            >
              <TouchableWithoutFeedback
                onPress={() => handlePress(index, item.route)}
              >
                <View style={styles.iconContainer}>
                  <Image source={item.icon} style={styles.iconOnly} />
                </View>
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
    paddingHorizontal: 14,
    paddingVertical: 12,
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
    marginBottom: 12,
  },

  iconsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },

  iconItemWrapper: {
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
  },

  iconContainer: {
    width: 52,
    height: 52,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    backgroundColor: "transparent",
  },

  iconOnly: {
    width: 48,
    height: 48,
    resizeMode: "contain",
  },
});