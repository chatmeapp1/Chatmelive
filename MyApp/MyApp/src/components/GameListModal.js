// === GameListModal.js ===
import React from "react";
import {
Modal,
View,
Text,
TouchableOpacity,
Image,
StyleSheet,
Dimensions,
FlatList,
Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");

const games = [
{ id: 1, name: "Roulette", icon: require("../../assets/games/roulette.png") },
{ id: 2, name: "777", icon: require("../../assets/games/777.png"), isNew: true },
{ id: 3, name: "Ocean", icon: require("../../assets/games/ocean.png"), isNew: true },
{ id: 4, name: "Tembak Ikan", icon: require("../../assets/games/tembak_ikan.png") },
{ id: 5, name: "Fruit Loops", icon: require("../../assets/games/fruit.png") },
{ id: 6, name: "Lucky Spin", icon: require("../../assets/games/lucky.png") },
{ id: 7, name: "Lava", icon: require("../../assets/games/lava.png") },
{ id: 8, name: "Gredy", icon: require("../../assets/games/gredy.png") },
];

export default function GameListModal({ visible, onClose, onSelectGame }) {
const slideAnim = React.useRef(new Animated.Value(height)).current;

React.useEffect(() => {
if (visible) {
Animated.timing(slideAnim, {
toValue: height / 2,
duration: 350,
useNativeDriver: false,
}).start();
} else {
Animated.timing(slideAnim, {
toValue: height,
duration: 250,
useNativeDriver: false,
}).start();
}
}, [visible]);

if (!visible) return null;

const renderGame = ({ item }) => (
<TouchableOpacity
style={styles.gameCard}
onPress={() => {
if (onSelectGame) onSelectGame(item);
onClose();
}}
activeOpacity={0.8}
>
<Image source={item.icon} style={styles.gameIcon} resizeMode="contain" />
{item.isNew && <View style={styles.newBadge}><Text style={styles.newText}>New</Text></View>}
<Text style={styles.gameName} numberOfLines={1}>{item.name}</Text>
</TouchableOpacity>
);

return (
<Modal transparent visible={visible} animationType="fade" statusBarTranslucent>
<View style={styles.overlay}>
<TouchableOpacity style={styles.overlayTouchable} onPress={onClose} activeOpacity={1} />

<Animated.View style={[styles.container, { top: slideAnim }]}>  
      {/* Header */}  
      <View style={styles.header}>  
        <Text style={styles.headerTitle}>🎮 Mini Games</Text>  
        <TouchableOpacity onPress={onClose}>  
          <Ionicons name="close-circle" size={28} color="#A8E6CF" />  
        </TouchableOpacity>  
      </View>  

      {/* Grid */}  
      <FlatList  
        data={games}  
        renderItem={renderGame}  
        numColumns={4}  
        keyExtractor={(item) => item.id.toString()}  
        contentContainerStyle={styles.grid}  
      />  
    </Animated.View>  
  </View>  
</Modal>

);
}

const styles = StyleSheet.create({
overlay: {
flex: 1,
backgroundColor: "rgba(0,0,0,0.65)",
justifyContent: "flex-end",
},
overlayTouchable: { flex: 1 },
container: {
position: "absolute",
left: 0,
width: width,
height: height / 2,
backgroundColor: "rgba(20,20,20,0.95)",
borderTopLeftRadius: 22,
borderTopRightRadius: 22,
overflow: "hidden",
elevation: 12,
shadowColor: "#000",
shadowOpacity: 0.4,
shadowRadius: 10,
},
header: {
flexDirection: "row",
justifyContent: "space-between",
alignItems: "center",
paddingHorizontal: 20,
paddingVertical: 10,
backgroundColor: "rgba(255,255,255,0.06)",
borderBottomWidth: 1,
borderBottomColor: "rgba(255,255,255,0.1)",
},
headerTitle: {
color: "#A8E6CF",
fontWeight: "600",
fontSize: 16,
},
grid: {
paddingTop: 15,
paddingHorizontal: 10,
},
gameCard: {
flex: 1 / 4,
alignItems: "center",
marginVertical: 10,
},
gameIcon: {
width: 55,
height: 55,
borderRadius: 12,
},
newBadge: {
position: "absolute",
top: 0,
right: 12,
backgroundColor: "#FF6B6B",
borderRadius: 6,
paddingHorizontal: 4,
},
newText: {
color: "#fff",
fontSize: 9,
fontWeight: "600",
},
gameName: {
color: "#fff",
fontSize: 12,
marginTop: 4,
textAlign: "center",
},
});