
// src/screen/live/components/BeautyPanel.js
import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
  TextInput,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import Slider from "@react-native-community/slider";

const { width, height } = Dimensions.get("window");

export default function BeautyPanel({
  visible,
  onClose,
  onToggleFlash,
  onSwitchCamera,
  onToggleMute,
  onBeautyChange,
  onSendMessage,
  isMuted = false,
  isFlashOn = false,
  cameraType = "front",
}) {
  const [activeTab, setActiveTab] = useState("main");
  const [beautySettings, setBeautySettings] = useState({
    smooth: 50,
    whiten: 30,
    sharpen: 40,
  });

  const [messageText, setMessageText] = useState("");
  const [selectedFrame, setSelectedFrame] = useState("frame1");

  const handleBeautyChange = (type, value) => {
    const newSettings = { ...beautySettings, [type]: Math.round(value) };
    setBeautySettings(newSettings);
    if (onBeautyChange) {
      onBeautyChange(newSettings);
    }
  };

  const handleSendMessage = () => {
    if (messageText.trim() && onSendMessage) {
      onSendMessage({
        text: messageText,
        frame: selectedFrame,
      });
      setMessageText("");
      onClose();
    }
  };

  const renderMainMenu = () => (
    <View style={styles.menuGrid}>
      <TouchableOpacity style={styles.menuItem} onPress={() => setActiveTab("beauty")}>
        <View style={styles.iconCircle}>
          <Ionicons name="sparkles" size={28} color="#FFD700" />
        </View>
        <Text style={styles.menuText}>Kecantikan</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuItem} onPress={() => setActiveTab("filter")}>
        <View style={styles.iconCircle}>
          <Ionicons name="color-filter-outline" size={28} color="#fff" />
        </View>
        <Text style={styles.menuText}>Filter</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuItem} onPress={() => setActiveTab("message")}>
        <View style={styles.iconCircle}>
          <Ionicons name="megaphone" size={28} color="#FFD700" />
        </View>
        <Text style={styles.menuText}>Pesan</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.menuItem} 
        onPress={onToggleFlash}
      >
        <View style={[styles.iconCircle, isFlashOn && styles.iconActive]}>
          <Ionicons name={isFlashOn ? "flash" : "flash-off"} size={28} color="#fff" />
        </View>
        <Text style={styles.menuText}>Flash</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.menuItem}
        onPress={onSwitchCamera}
      >
        <View style={styles.iconCircle}>
          <Ionicons name="camera-reverse-outline" size={28} color="#fff" />
        </View>
        <Text style={styles.menuText}>Balik Kamera</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.menuItem}
        onPress={onToggleMute}
      >
        <View style={[styles.iconCircle, isMuted && styles.iconMuted]}>
          <Ionicons name={isMuted ? "mic-off" : "mic"} size={28} color="#fff" />
        </View>
        <Text style={styles.menuText}>{isMuted ? "Buka Mic" : "Tutup Mic"}</Text>
      </TouchableOpacity>
    </View>
  );

  const renderBeautyMenu = () => (
    <View style={styles.beautyContainer}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => setActiveTab("main")}
      >
        <Ionicons name="arrow-back" size={24} color="#fff" />
        <Text style={styles.backText}>Kembali</Text>
      </TouchableOpacity>

      <ScrollView style={styles.beautyScroll} showsVerticalScrollIndicator={false}>
        <View style={styles.settingItem}>
          <View style={styles.settingHeader}>
            <Text style={styles.beautyTitle}>Penghalusan Kulit</Text>
            <Text style={styles.valueText}>{beautySettings.smooth}%</Text>
          </View>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={100}
            value={beautySettings.smooth}
            onValueChange={(value) => handleBeautyChange("smooth", value)}
            minimumTrackTintColor="#FFD700"
            maximumTrackTintColor="rgba(255,255,255,0.3)"
            thumbTintColor="#FFD700"
          />
          <Text style={styles.sliderLabel}>Smooth: {beautySettings.smooth}%</Text>
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingHeader}>
            <Text style={styles.beautyTitle}>Pemutihan</Text>
            <Text style={styles.valueText}>{beautySettings.whiten}%</Text>
          </View>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={100}
            value={beautySettings.whiten}
            onValueChange={(value) => handleBeautyChange("whiten", value)}
            minimumTrackTintColor="#FFD700"
            maximumTrackTintColor="rgba(255,255,255,0.3)"
            thumbTintColor="#FFD700"
          />
          <Text style={styles.sliderLabel}>Whiten: {beautySettings.whiten}%</Text>
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingHeader}>
            <Text style={styles.beautyTitle}>Ketajaman</Text>
            <Text style={styles.valueText}>{beautySettings.sharpen}%</Text>
          </View>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={100}
            value={beautySettings.sharpen}
            onValueChange={(value) => handleBeautyChange("sharpen", value)}
            minimumTrackTintColor="#FFD700"
            maximumTrackTintColor="rgba(255,255,255,0.3)"
            thumbTintColor="#FFD700"
          />
          <Text style={styles.sliderLabel}>Sharpen: {beautySettings.sharpen}%</Text>
        </View>

        <View style={styles.noteContainer}>
          <Ionicons name="information-circle" size={16} color="#FFD700" />
          <Text style={styles.beautyNote}>
            Fitur beauty menggunakan Agora Video Enhancement
          </Text>
        </View>
      </ScrollView>
    </View>
  );

  const renderMessageMenu = () => (
    <View style={styles.messageContainer}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => setActiveTab("main")}
      >
        <Ionicons name="arrow-back" size={24} color="#fff" />
        <Text style={styles.backText}>Kembali</Text>
      </TouchableOpacity>

      <ScrollView style={styles.messageScroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Tulis Pesan</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Contoh: Host sedang ke toilet"
          placeholderTextColor="rgba(255,255,255,0.5)"
          value={messageText}
          onChangeText={setMessageText}
          multiline
          maxLength={100}
        />
        <Text style={styles.charCount}>{messageText.length}/100</Text>

        <Text style={styles.sectionTitle}>Pilih Banner</Text>
        <View style={styles.frameGrid}>
          <TouchableOpacity
            style={[
              styles.frameItem,
              selectedFrame === "frame1" && styles.frameItemSelected,
            ]}
            onPress={() => setSelectedFrame("frame1")}
          >
            <Image
              source={require("../../../../assets/frame1.png")}
              style={styles.frameImage}
              resizeMode="contain"
            />
            {selectedFrame === "frame1" && (
              <View style={styles.selectedBadge}>
                <Ionicons name="checkmark-circle" size={24} color="#FFD700" />
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.frameItem,
              selectedFrame === "frame2" && styles.frameItemSelected,
            ]}
            onPress={() => setSelectedFrame("frame2")}
          >
            <Image
              source={require("../../../../assets/frame2.png")}
              style={styles.frameImage}
              resizeMode="contain"
            />
            {selectedFrame === "frame2" && (
              <View style={styles.selectedBadge}>
                <Ionicons name="checkmark-circle" size={24} color="#FFD700" />
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.frameItem,
              selectedFrame === "frame3" && styles.frameItemSelected,
            ]}
            onPress={() => setSelectedFrame("frame3")}
          >
            <Image
              source={require("../../../../assets/frame3.png")}
              style={styles.frameImage}
              resizeMode="contain"
            />
            {selectedFrame === "frame3" && (
              <View style={styles.selectedBadge}>
                <Ionicons name="checkmark-circle" size={24} color="#FFD700" />
              </View>
            )}
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[
            styles.sendButton,
            !messageText.trim() && styles.sendButtonDisabled,
          ]}
          onPress={handleSendMessage}
          disabled={!messageText.trim()}
        >
          <Ionicons name="send" size={20} color="#fff" />
          <Text style={styles.sendButtonText}>Kirim Pesan</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );

  const renderFilterMenu = () => (
    <View style={styles.filterContainer}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => setActiveTab("main")}
      >
        <Ionicons name="arrow-back" size={24} color="#fff" />
        <Text style={styles.backText}>Kembali</Text>
      </TouchableOpacity>

      <ScrollView horizontal style={styles.filterScroll} showsHorizontalScrollIndicator={false}>
        <TouchableOpacity style={styles.filterItem}>
          <View style={styles.filterPreview}>
            <Ionicons name="image-outline" size={32} color="#fff" />
          </View>
          <Text style={styles.filterText}>Original</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.filterItem}>
          <View style={[styles.filterPreview, { backgroundColor: "#FFB6C1" }]}>
            <Ionicons name="sunny" size={32} color="#fff" />
          </View>
          <Text style={styles.filterText}>Warm</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.filterItem}>
          <View style={[styles.filterPreview, { backgroundColor: "#87CEEB" }]}>
            <Ionicons name="water" size={32} color="#fff" />
          </View>
          <Text style={styles.filterText}>Cool</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.filterItem}>
          <View style={[styles.filterPreview, { backgroundColor: "#FFD700" }]}>
            <Ionicons name="film" size={32} color="#fff" />
          </View>
          <Text style={styles.filterText}>Vintage</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.filterItem}>
          <View style={[styles.filterPreview, { backgroundColor: "#DA70D6" }]}>
            <Ionicons name="rose" size={32} color="#fff" />
          </View>
          <Text style={styles.filterText}>Romance</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <TouchableOpacity 
          style={styles.overlay} 
          activeOpacity={1}
          onPress={onClose}
        />

        <BlurView intensity={95} tint="dark" style={styles.panel}>
          <View style={styles.header}>
            <Text style={styles.title}>
              {activeTab === "main" && "Pengaturan"}
              {activeTab === "beauty" && "Kecantikan"}
              {activeTab === "filter" && "Filter"}
              {activeTab === "message" && "Pesan"}
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={28} color="#fff" />
            </TouchableOpacity>
          </View>

          {activeTab === "main" && renderMainMenu()}
          {activeTab === "beauty" && renderBeautyMenu()}
          {activeTab === "filter" && renderFilterMenu()}
          {activeTab === "message" && renderMessageMenu()}
        </BlurView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  panel: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 30,
    minHeight: height * 0.5,
    maxHeight: height * 0.75,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.1)",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  closeButton: {
    padding: 4,
  },
  menuGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 20,
    justifyContent: "space-around",
  },
  menuItem: {
    alignItems: "center",
    width: "30%",
    marginBottom: 24,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "rgba(255,255,255,0.15)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  iconActive: {
    backgroundColor: "rgba(255,215,0,0.4)",
    borderWidth: 2,
    borderColor: "#FFD700",
  },
  iconMuted: {
    backgroundColor: "rgba(255,0,0,0.4)",
    borderWidth: 2,
    borderColor: "#FF4444",
  },
  menuText: {
    color: "#fff",
    fontSize: 13,
    textAlign: "center",
    fontWeight: "500",
  },
  beautyContainer: {
    padding: 20,
    flex: 1,
  },
  beautyScroll: {
    marginTop: 10,
  },
  settingItem: {
    marginBottom: 24,
    backgroundColor: "rgba(255,255,255,0.05)",
    padding: 16,
    borderRadius: 12,
  },
  settingHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  beautyTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  valueText: {
    color: "#FFD700",
    fontSize: 16,
    fontWeight: "bold",
  },
  slider: {
    width: "100%",
    height: 40,
  },
  sliderLabel: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 13,
    marginTop: 4,
  },
  noteContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,215,0,0.1)",
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
  },
  beautyNote: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 12,
    fontStyle: "italic",
    marginLeft: 8,
    flex: 1,
  },
  filterContainer: {
    padding: 20,
  },
  filterScroll: {
    marginTop: 20,
  },
  filterItem: {
    alignItems: "center",
    marginRight: 20,
  },
  filterPreview: {
    width: 90,
    height: 90,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.15)",
    marginBottom: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  filterText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "500",
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  backText: {
    color: "#fff",
    fontSize: 16,
    marginLeft: 8,
    fontWeight: "500",
  },
  messageContainer: {
    padding: 20,
    flex: 1,
  },
  messageScroll: {
    marginTop: 10,
  },
  sectionTitle: {
    color: "#FFD700",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
    marginTop: 8,
  },
  textInput: {
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 12,
    padding: 16,
    color: "#fff",
    fontSize: 15,
    minHeight: 80,
    textAlignVertical: "top",
    borderWidth: 1,
    borderColor: "rgba(255,215,0,0.3)",
  },
  charCount: {
    color: "rgba(255,255,255,0.5)",
    fontSize: 12,
    textAlign: "right",
    marginTop: 4,
    marginBottom: 16,
  },
  frameGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  frameItem: {
    width: "30%",
    aspectRatio: 1,
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.2)",
    backgroundColor: "rgba(255,255,255,0.05)",
  },
  frameItemSelected: {
    borderColor: "#FFD700",
    borderWidth: 3,
  },
  frameImage: {
    width: "100%",
    height: "100%",
  },
  selectedBadge: {
    position: "absolute",
    top: 4,
    right: 4,
    backgroundColor: "rgba(0,0,0,0.7)",
    borderRadius: 12,
  },
  sendButton: {
    backgroundColor: "#FFD700",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 8,
  },
  sendButtonDisabled: {
    backgroundColor: "rgba(255,215,0,0.3)",
  },
  sendButtonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
});
