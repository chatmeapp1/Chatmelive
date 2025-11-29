
import React, { useState } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Platform,
  FlatList,
  Text,
  TouchableOpacity,
  Image,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import api from "../../../utils/api";

export default function HomeSearchBar() {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [searching, setSearching] = useState(false);

  const handleSearch = async (text) => {
    setSearchQuery(text);

    if (text.trim().length === 0) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    try {
      setSearching(true);
      const response = await api.get(`/hosts/search?q=${encodeURIComponent(text)}`);
      if (response.data.success) {
        setSearchResults(response.data.data);
        setShowResults(true);
      }
    } catch (error) {
      console.error("Error searching:", error);
    } finally {
      setSearching(false);
    }
  };

  const handleSelectUser = (user) => {
    setShowResults(false);
    setSearchQuery("");
    
    if (user.isLive) {
      navigation.navigate("LiveNavigator", {
        screen: "ViewerLiveScreen",
        params: {
          host: user,
          liveTitle: user.title || "",
        },
      });
    } else {
      navigation.navigate("ProfileNavigator", {
        screen: "PersonalProfileScreen",
        params: { userId: user.id },
      });
    }
  };

  const renderSearchItem = ({ item }) => (
    <TouchableOpacity
      style={styles.resultItem}
      onPress={() => handleSelectUser(item)}
    >
      <Image source={{ uri: item.image }} style={styles.resultAvatar} />
      <View style={styles.resultInfo}>
        <Text style={styles.resultName}>{item.name}</Text>
        <Text style={styles.resultId}>ID: {item.id}</Text>
      </View>
      {item.isLive && (
        <View style={styles.liveBadge}>
          <Text style={styles.liveText}>LIVE</Text>
        </View>
      )}
      <Ionicons name="chevron-forward" size={20} color="#999" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        <Ionicons
          name="search-outline"
          size={20}
          color="#444"
          style={styles.icon}
        />

        <TextInput
          style={styles.input}
          placeholder="Cari host, username, atau ID..."
          placeholderTextColor="#888"
          value={searchQuery}
          onChangeText={handleSearch}
        />

        {searchQuery.length > 0 && (
          <TouchableOpacity
            onPress={() => {
              setSearchQuery("");
              setSearchResults([]);
              setShowResults(false);
            }}
            style={styles.clearButton}
          >
            <Ionicons name="close-circle" size={20} color="#888" />
          </TouchableOpacity>
        )}
      </View>

      <Modal
        visible={showResults}
        transparent
        animationType="fade"
        onRequestClose={() => setShowResults(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowResults(false)}
        >
          <View style={styles.resultsContainer}>
            {searching ? (
              <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Mencari...</Text>
              </View>
            ) : searchResults.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>Tidak ada hasil</Text>
              </View>
            ) : (
              <FlatList
                data={searchResults}
                keyExtractor={(item) => item.id}
                renderItem={renderSearchItem}
                style={styles.resultsList}
              />
            )}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "relative",
    zIndex: 999,
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.85)",
    borderRadius: 16,
    paddingHorizontal: 12,
    height: 45,
    marginHorizontal: 16,
    marginBottom: 12,
    shadowColor: "#00FFAA",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 5,
    borderWidth: 0.3,
    borderColor: "rgba(0, 255, 120, 0.25)",
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    color: "#333",
    fontSize: 15,
    fontWeight: "400",
    paddingVertical: Platform.OS === "ios" ? 6 : 2,
  },
  clearButton: {
    padding: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingTop: 100,
  },
  resultsContainer: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    borderRadius: 12,
    maxHeight: 400,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 5,
  },
  resultsList: {
    padding: 8,
  },
  resultItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: "#eee",
  },
  resultAvatar: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    marginRight: 12,
  },
  resultInfo: {
    flex: 1,
  },
  resultName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
    marginBottom: 2,
  },
  resultId: {
    fontSize: 12,
    color: "#888",
  },
  liveBadge: {
    backgroundColor: "red",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    marginRight: 8,
  },
  liveText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
  },
  loadingContainer: {
    padding: 20,
    alignItems: "center",
  },
  loadingText: {
    color: "#888",
    fontSize: 14,
  },
  emptyContainer: {
    padding: 20,
    alignItems: "center",
  },
  emptyText: {
    color: "#888",
    fontSize: 14,
  },
});
