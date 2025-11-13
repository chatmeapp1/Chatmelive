import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Dimensions,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";

const { width } = Dimensions.get("window");

export default function BeautyPanel({ visible, onClose, onBeautyChange }) {
  const [selectedTab, setSelectedTab] = useState("putih");
  const [beautyValues, setBeautyValues] = useState({
    putih: 0.6,
    ruddy: 0.1,
    dermabrasi: 0.7,
    deHighlight: 0.0,
  });

  const beautyOptions = [
    {
      id: "putih",
      label: "putih",
      icon: "sunny-outline",
      key: "lighteningLevel",
    },
    {
      id: "ruddy",
      label: "ruddy",
      icon: "rose-outline",
      key: "rednessLevel",
    },
    {
      id: "dermabrasi",
      label: "dermabrasi",
      icon: "contrast-outline",
      key: "smoothnessLevel",
    },
    {
      id: "deHighlight",
      label: "de highlight",
      icon: "moon-outline",
      key: "sharpnessLevel",
    },
  ];

  const handleValueChange = (value) => {
    const newValues = { ...beautyValues, [selectedTab]: value };
    setBeautyValues(newValues);
    
    if (onBeautyChange) {
      onBeautyChange({
        lighteningLevel: newValues.putih,
        rednessLevel: newValues.ruddy,
        smoothnessLevel: newValues.dermabrasi,
        sharpnessLevel: newValues.deHighlight,
      });
    }
  };

  const resetBeauty = () => {
    const defaultValues = {
      putih: 0.6,
      ruddy: 0.1,
      dermabrasi: 0.7,
      deHighlight: 0.0,
    };
    setBeautyValues(defaultValues);
    
    if (onBeautyChange) {
      onBeautyChange({
        lighteningLevel: defaultValues.putih,
        rednessLevel: defaultValues.ruddy,
        smoothnessLevel: defaultValues.dermabrasi,
        sharpnessLevel: defaultValues.deHighlight,
      });
    }
  };

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.backdrop} onPress={onClose} />
        
        <View style={styles.panel}>
          <View style={styles.sliderSection}>
            <View style={styles.sliderHeader}>
              <Text style={styles.sliderTitle}>
                <Text style={styles.highlight}>Kecantikan dasar</Text>{" "}
                <Text style={styles.subtitle}>bentuk indah menyesuaikan</Text>
              </Text>
            </View>
            
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={1}
              value={beautyValues[selectedTab]}
              onValueChange={handleValueChange}
              minimumTrackTintColor="#A8E063"
              maximumTrackTintColor="rgba(255,255,255,0.3)"
              thumbTintColor="#A8E063"
            />
          </View>

          <View style={styles.optionsContainer}>
            <View style={styles.optionsRow}>
              {beautyOptions.map((option) => (
                <TouchableOpacity
                  key={option.id}
                  style={[
                    styles.optionItem,
                    selectedTab === option.id && styles.optionItemActive,
                  ]}
                  onPress={() => setSelectedTab(option.id)}
                >
                  <View style={styles.optionIcon}>
                    <Ionicons
                      name={option.icon}
                      size={32}
                      color={selectedTab === option.id ? "#A8E063" : "#fff"}
                    />
                  </View>
                  <Text
                    style={[
                      styles.optionLabel,
                      selectedTab === option.id && styles.optionLabelActive,
                    ]}
                  >
                    {option.label}
                  </Text>
                  {beautyValues[option.id] > 0 && (
                    <View style={styles.activeDot} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
            
            <TouchableOpacity style={styles.resetButton} onPress={resetBeauty}>
              <Ionicons name="refresh-outline" size={16} color="#fff" />
              <Text style={styles.resetText}>Reset</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.7)",
  },
  panel: {
    backgroundColor: "#1a1a1a",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 30,
  },
  sliderSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.1)",
  },
  sliderHeader: {
    marginBottom: 15,
  },
  sliderTitle: {
    fontSize: 14,
  },
  highlight: {
    color: "#A8E063",
    fontWeight: "600",
  },
  subtitle: {
    color: "#999",
    fontSize: 13,
  },
  slider: {
    width: "100%",
    height: 40,
  },
  optionsContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  optionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  optionItem: {
    alignItems: "center",
    width: (width - 80) / 4,
    position: "relative",
  },
  optionItemActive: {
    opacity: 1,
  },
  optionIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(255,255,255,0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  optionLabel: {
    color: "#999",
    fontSize: 12,
    textAlign: "center",
  },
  optionLabelActive: {
    color: "#A8E063",
    fontWeight: "600",
  },
  activeDot: {
    position: "absolute",
    top: 5,
    right: 15,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#A8E063",
  },
  resetButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.1)",
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 5,
  },
  resetText: {
    color: "#fff",
    fontSize: 14,
    marginLeft: 8,
    fontWeight: "600",
  },
});
