import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function Add() {
  const [location, setLocation] = useState("");
  const [distance, setDistance] = useState("");
  const [timeOfDay, setTimeOfDay] = useState("เช้า");
  const [image, setImage] = useState<string | null>(null);
  const [base64Image, setBase64Image] = useState<string | null>(null);

  const handleTakePhoto = async () => {
    // ขออนุญาตเข้าถึงกล้อง
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      alert("ขออนุญาตเข้าถึงกล้องเพื่อถ่ายภาพ");
      return;
    }
    // เปิดกล้องเพื่อถ่ายภาพ
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      base64: true,
    });
    //ไปกำหนดค่าให้กับ state
    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setBase64Image(result.assets[0].base64 || null);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20 }}>
        {/* ป้อนสถานที่วิ่ง */}
        <Text style={styles.titleShow}>สถานที่วิ่ง</Text>
        <TextInput
          style={styles.inputValue}
          placeholder="เช่น สวนลุมพินี"
          placeholderTextColor="#a8a8a8"
          value={location}
          onChangeText={setLocation}
        />
        {/* ป้อนระยะทาง */}
        <Text style={styles.titleShow}>ระยะทาง (กิโลเมตร)</Text>
        <TextInput
          keyboardType="numeric"
          style={styles.inputValue}
          placeholder="เช่น 5.2"
          placeholderTextColor="#a8a8a8"
          value={distance}
          onChangeText={setDistance}
        />
        {/* เลือกช่วงเวลา */}
        <Text style={styles.titleShow}>ช่วงเวลา</Text>
        <View style={{ flexDirection: "row", marginBottom: 20 }}>
          <TouchableOpacity
            onPress={() => setTimeOfDay("เช้า")}
            style={[
              styles.timeofDayBtn,
              { backgroundColor: timeOfDay === "เช้า" ? "#5da0e2" : "#a8a8a8" },
            ]}
          >
            <Text style={{ color: "#fff", fontFamily: "Kanit_400Regular" }}>
              เช้า
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setTimeOfDay("เย็น")}
            style={[
              styles.timeofDayBtn,
              { backgroundColor: timeOfDay === "เย็น" ? "#5da0e2" : "#a8a8a8" },
            ]}
          >
            <Text style={{ color: "#fff", fontFamily: "Kanit_400Regular" }}>
              เย็น
            </Text>
          </TouchableOpacity>
        </View>

        {/* ปุ่มถ่ายรูป */}
        <Text style={styles.titleShow}>รูปภาพสถานที่</Text>
        <TouchableOpacity style={styles.takePhotoBtn} onPress={handleTakePhoto}>
          {image ? (
            <Image
              source={{ uri: image }}
              style={{ width: "100%", height: 200 }}
            />
          ) : (
            <View style={{ alignItems: "center" }}>
              <Ionicons name="camera-outline" size={30} color="#a8a8a8" />
              <Text
                style={{ fontFamily: "Kanit_400Regular", color: "#a8a8a8" }}
              >
                กดเพื่อถ่ายภาพ
              </Text>
            </View>
          )}
        </TouchableOpacity>

        {/* ปุ่มบันทึก */}
        <TouchableOpacity style={styles.saveBtn}>
          <Text style={{ color: "#fff", fontFamily: "Kanit_400Regular" }}>
            บันทึกข้อมูล
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  timeofDayBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginRight: 10,
  },
  saveBtn: {
    padding: 10,
    backgroundColor: "#5da0e2",
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  takePhotoBtn: {
    width: "100%",
    height: 200,
    backgroundColor: "#e6e6e6",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  inputValue: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
    fontFamily: "Kanit_400Regular",
    backgroundColor: "#EFEFEF",
  },
  titleShow: {
    fontFamily: "Kanit_700Bold",
    marginBottom: 10,
  },
});
