
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
} from "react-native";

const REGIONS = [
  "Indonesia",
  "Malaysia",
  "Philippines",
  "Saudi Arabia",
  "Vietnam",
  "Thailand",
];

export default function RegionPickerModal({ visible, onClose, onSelect }) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={onClose}
        />

        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.cancelText}>cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.determineText}>Determine</Text>
            </TouchableOpacity>
          </View>

          {/* Region List */}
          <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
            {REGIONS.map((region) => (
              <TouchableOpacity
                key={region}
                style={styles.regionItem}
                onPress={() => {
                  onSelect(region);
                  onClose();
                }}
              >
                <Text style={styles.regionText}>{region}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  backdrop: {
    flex: 1,
  },
  container: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "50%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  cancelText: {
    fontSize: 16,
    color: "#666",
  },
  determineText: {
    fontSize: 16,
    color: "#8B5CF6",
    fontWeight: "500",
  },
  list: {
    paddingHorizontal: 20,
  },
  regionItem: {
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#f5f5f5",
  },
  regionText: {
    fontSize: 16,
    color: "#999",
    textAlign: "center",
  },
});
