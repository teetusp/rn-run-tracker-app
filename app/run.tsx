import { supabase } from "@/services/supabase";
import { Runstype } from "@/types/runstype";
import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const run = require("../assets/images/run.png");
export default function Run() {
  const [runs, setRuns] = useState<Runstype[]>([]);

  // ดึงข้อมูลการวิ่งจาก Supabase
  const fetchRuns = async () => {
    const { data, error } = await supabase.from("runs").select("*");
    if (error) {
      Alert.alert("คำเตือน", "เกิดข้อผิดพลาดในการดึงข้อมูล");
      return;
    } else {
      setRuns(data as Runstype[]);
    }
  };

  // เรียกใช้ฟังก์ชันดึงข้อมูล
  useFocusEffect(
    useCallback(() => {
      fetchRuns();
    }, []),
  );

  const renderItem = ({ item }: { item: Runstype }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/${item.id}`)}
      activeOpacity={0.7}
    >
      <View style={styles.cardContent}>
        <Image source={{ uri: item.image_url }} style={styles.cardImage} />
        <View style={styles.distanceBadge}>
          <Text style={styles.locationText}>{item.location}</Text>
          <Text style={styles.dateText}>
            {(() => {
              const date = new Date(item.run_date);
              const buddhistYear = "พ.ศ. " + (date.getFullYear() + 543);
              return (
                new Intl.DateTimeFormat("th-TH", {
                  month: "long",
                  day: "numeric",
                }).format(date) +
                " " +
                buddhistYear
              );
            })()}
          </Text>
        </View>
        <Text style={styles.distanceText}>{item.distance} km</Text>
      </View>

      <Ionicons name="chevron-forward" size={20} color="#CCC" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* แสดง Logo */}
      <Image source={run} style={styles.imgLogo} />

      {/* แสดงข้อมูลการวิ่ง จาก Supabase */}
      <FlatList
        data={runs}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listPadding}
      />

      {/* ปุ่มลอยสำหรับเพิ่มข้อมูล */}
      <TouchableOpacity
        style={styles.floatingBtn}
        onPress={() => router.push("/add")}
      >
        <Ionicons name="add" size={30} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  listPadding: {
    padding: 20,
    paddingBottom: 100,
  },
  card: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    // Shadow สำหรับ iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    // Elevation สำหรับ Android
    elevation: 3,
  },
  cardContent: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginRight: 10,
  },

  cardImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },

  distanceBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },

  locationText: {
    fontFamily: "Kanit_700Bold",
    fontSize: 18,
    color: "#333",
    marginBottom: 4,
  },

  dateText: {
    fontFamily: "Kanit_400Regular",
    fontSize: 14,
    color: "#888",
  },

  distanceText: {
    fontFamily: "Kanit_700Bold",
    fontSize: 14,
    color: "#007AFF",
  },

  imgLogo: {
    marginTop: 50,
    width: 120,
    height: 120,
    alignSelf: "center",
  },
  floatingBtn: {
    padding: 10,
    backgroundColor: "#5da0e2",
    width: 50,
    height: 50,
    borderRadius: 8,
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    right: 40,
    bottom: 40,
    elevation: 3,
  },
  container: {
    flex: 1,
  },
});
