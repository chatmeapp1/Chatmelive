
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function ProfileShop({ navigation }) {
  const [selectedCategory, setSelectedCategory] = useState("vehicle");

  // Data dummy untuk kendaraan masuk
  const vehicleItems = [
    {
      id: 1,
      name: "Super sports car",
      price: "300,000",
      duration: "7Hari",
      image: null, // akan diisi dari admin
    },
    {
      id: 2,
      name: "Pirate ship",
      price: "1,000,000",
      duration: "7Hari",
      image: null,
    },
    {
      id: 3,
      name: "Luxury carriage",
      price: "1,400,000",
      duration: "7Hari",
      image: null,
    },
    {
      id: 4,
      name: "beetle",
      price: "1,500,000",
      duration: "7Hari",
      image: null,
    },
  ];

  // Data dummy untuk avatar frame
  const avatarFrameItems = [
    {
      id: 1,
      name: "Frame Premium",
      price: "500,000",
      duration: "7Hari",
      image: null,
    },
    {
      id: 2,
      name: "Frame VIP",
      price: "800,000",
      duration: "7Hari",
      image: null,
    },
  ];

  const currentItems = selectedCategory === "vehicle" ? vehicleItems : avatarFrameItems;

  const renderShopItem = (item) => (
    <View key={item.id} style={styles.card}>
      {/* Play Button */}
      <View style={styles.playButton}>
        <Ionicons name="play" size={16} color="#FFD700" />
      </View>

      {/* Image Placeholder */}
      <View style={styles.imageContainer}>
        {item.image ? (
          <Image source={item.image} style={styles.itemImage} />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Ionicons name="image-outline" size={40} color="#ccc" />
          </View>
        )}
      </View>

      {/* Item Name */}
      <Text style={styles.itemName}>{item.name}</Text>

      {/* Price */}
      <View style={styles.priceRow}>
        <Ionicons name="ellipse" size={12} color="#FFD700" />
        <Text style={styles.priceText}>
          {item.price}
          <Text style={styles.durationText}>U/{item.duration}</Text>
        </Text>
      </View>

      {/* Buy Button */}
      <TouchableOpacity style={styles.buyButton}>
        <Text style={styles.buyButtonText}>Beli</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={26} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Toko</Text>
        <TouchableOpacity>
          <Text style={styles.closeText}>Close</Text>
        </TouchableOpacity>
      </View>

      {/* Category Tabs */}
      <View style={styles.categoryContainer}>
        <TouchableOpacity
          style={[
            styles.categoryButton,
            selectedCategory === "vehicle" && styles.categoryButtonActive,
          ]}
          onPress={() => setSelectedCategory("vehicle")}
        >
          <Text
            style={[
              styles.categoryText,
              selectedCategory === "vehicle" && styles.categoryTextActive,
            ]}
          >
            normal
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.categoryButton,
            selectedCategory === "avatarFrame" && styles.categoryButtonActive,
          ]}
          onPress={() => setSelectedCategory("avatarFrame")}
        >
          <Text
            style={[
              styles.categoryText,
              selectedCategory === "avatarFrame" && styles.categoryTextActive,
            ]}
          >
            mentereng
          </Text>
        </TouchableOpacity>
      </View>

      {/* Shop Items Grid */}
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.grid}>
          {currentItems.map((item) => renderShopItem(item))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0F0F0",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 15,
    backgroundColor: "#5DD9C1",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
  },
  closeText: {
    fontSize: 15,
    color: "#fff",
  },
  categoryContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingTop: 15,
    paddingBottom: 10,
    gap: 10,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 15,
    backgroundColor: "#5DD9C1",
  },
  categoryButtonActive: {
    backgroundColor: "#5DD9C1",
  },
  categoryText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#fff",
  },
  categoryTextActive: {
    color: "#fff",
    fontWeight: "600",
  },
  scrollContent: {
    paddingHorizontal: 8,
    paddingBottom: 20,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 8,
  },
  card: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  playButton: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "#fff",
    borderRadius: 15,
    width: 28,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  imageContainer: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 8,
    overflow: "hidden",
    marginBottom: 10,
  },
  itemImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  imagePlaceholder: {
    width: "100%",
    height: "100%",
    backgroundColor: "#f5f5f5",
    alignItems: "center",
    justifyContent: "center",
  },
  itemName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 6,
    textAlign: "center",
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    gap: 4,
  },
  priceText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#333",
  },
  durationText: {
    fontSize: 12,
    fontWeight: "400",
    color: "#666",
  },
  buyButton: {
    backgroundColor: "#7FE5A8",
    paddingVertical: 8,
    borderRadius: 20,
    alignItems: "center",
  },
  buyButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
  },
});
