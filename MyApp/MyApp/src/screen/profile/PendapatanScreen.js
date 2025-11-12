import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import DateTimePickerModal from "react-native-modal-datetime-picker";

export default function PendapatanScreen({ navigation }) {
  const [startDate, setStartDate] = useState("2025-10-28");
  const [endDate, setEndDate] = useState("2025-11-04");
  const [pickerVisible, setPickerVisible] = useState(false);
  const [isStart, setIsStart] = useState(true);

  const [details] = useState([
    {
      date: "2025-11-04",
      poin: 0,
      luxury: 0,
      lucky: 0,
      sLucky: 0,
    },
    {
      date: "2025-11-03",
      poin: 0,
      luxury: 0,
      lucky: 0,
      sLucky: 0,
    },
  ]);

  const handleDateConfirm = (date) => {
    const formatted = date.toISOString().split("T")[0];
    if (isStart) setStartDate(formatted);
    else setEndDate(formatted);
    setPickerVisible(false);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={["#B5F5B0", "#7EE6C7", "#5ED8E1"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back-outline" size={26} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerText}>Pendapatan saya</Text>
          <TouchableOpacity>
            <Text style={styles.closeText}>Close</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Content */}
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Poin Card */}
        <View style={styles.poinCard}>
          <View style={styles.poinRow}>
            <Image
              source={require("../../../assets/icons/crystal.png")}
              style={styles.crystalIcon}
            />
            <Text style={styles.poinLabel}>Poin :</Text>
          </View>

          <Text style={styles.poinValue}>0</Text>

          <TouchableOpacity style={styles.historyBtn}>
            <Text style={styles.historyText}>History</Text>
          </TouchableOpacity>

          <View style={styles.btnRow}>
            <TouchableOpacity style={[styles.btn, { backgroundColor: "#FFA530" }]}>
              <Text style={styles.btnText}>Menarik uang</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.btn, { backgroundColor: "#4DD179" }]}>
              <Text style={styles.btnText}>Exchange</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Date Range */}
        <View style={styles.dateRow}>
          <TouchableOpacity
            style={styles.dateBox}
            onPress={() => {
              setIsStart(true);
              setPickerVisible(true);
            }}
          >
            <Ionicons name="time-outline" size={18} color="#47C472" />
            <Text style={styles.dateText}>{startDate}</Text>
          </TouchableOpacity>

          <Text style={styles.dateTo}>To</Text>

          <TouchableOpacity
            style={styles.dateBox}
            onPress={() => {
              setIsStart(false);
              setPickerVisible(true);
            }}
          >
            <Text style={styles.dateText}>{endDate}</Text>
          </TouchableOpacity>
        </View>

        {/* Details */}
        {details.map((item, index) => (
          <View key={index} style={styles.detailCard}>
            <Text style={styles.detailTitle}>Details</Text>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Date</Text>
              <Text style={styles.detailValue}>{item.date}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.detailList}>
              <View style={styles.detailItem}>
                <Text style={styles.detailText}>
                  Poin <Image source={require("../../../assets/icons/crystal.png")} style={styles.iconMini} /> :
                </Text>
                <Text style={styles.detailValue}>{item.poin}</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailText}>Luxury:</Text>
                <Text style={styles.detailValue}>{item.luxury}</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailText}>Lucky:</Text>
                <Text style={styles.detailValue}>{item.lucky}</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailText}>S-Lucky:</Text>
                <Text style={styles.detailValue}>{item.sLucky}</Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Date Picker */}
      <DateTimePickerModal
        isVisible={pickerVisible}
        mode="date"
        onConfirm={handleDateConfirm}
        onCancel={() => setPickerVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
  },
  headerText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  closeText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },

  poinCard: {
    margin: 15,
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
    elevation: 3,
    alignItems: "center",
  },
  poinRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  crystalIcon: {
    width: 30,
    height: 30,
    marginRight: 8,
  },
  poinLabel: {
    fontSize: 15,
    color: "#555",
  },
  poinValue: {
    fontSize: 36,
    color: "#4CAF50",
    fontWeight: "700",
  },
  historyBtn: {
    position: "absolute",
    top: 15,
    right: 15,
    backgroundColor: "#4DD179",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 10,
  },
  historyText: {
    color: "#fff",
    fontWeight: "600",
  },
  btnRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
    marginTop: 15,
  },
  btn: {
    flex: 1,
    borderRadius: 25,
    paddingVertical: 8,
    marginHorizontal: 5,
    alignItems: "center",
  },
  btnText: {
    color: "#fff",
    fontWeight: "700",
  },

  dateRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
  },
  dateBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F2F2F2",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  dateText: {
    color: "#444",
    marginLeft: 6,
    fontSize: 13,
  },
  dateTo: {
    marginHorizontal: 10,
    color: "#555",
  },

  detailCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginHorizontal: 15,
    marginVertical: 8,
    elevation: 2,
    padding: 15,
  },
  detailTitle: {
    fontWeight: "700",
    fontSize: 15,
    color: "#222",
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  detailLabel: {
    color: "#666",
  },
  detailValue: {
    color: "#222",
    fontWeight: "600",
  },
  divider: {
    height: 1,
    backgroundColor: "#eee",
    marginVertical: 10,
  },
  detailList: {
    gap: 4,
  },
  detailItem: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  detailText: {
    color: "#555",
  },
  iconMini: {
    width: 16,
    height: 16,
  },
});