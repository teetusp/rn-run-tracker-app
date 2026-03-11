import { supabase } from "@/services/supabase";
import { Ionicons } from "@expo/vector-icons";
import { decode } from "base64-arraybuffer";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
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

  // ฟังก์ชันสำหรับบันทึกข้อมูล
  const handleSavetToSupabase = async () => {
    // validate ตรวจสอบข้อมูลก่อนบันทึก
    if (!location || !distance || !image) {
      Alert.alert("คำเตือน", "กรุณากรอกข้อมูลให้ครบถ้วน และถ่ายภาพสถานที่");
      return;
    }
    //อัพโหลดรูปภาพไปยัง Supabase Storage
    let image_url = null;
    const filename = `img_${Date.now()}.jpg`; //ตั้งชื่อไฟล์
    const { error: uploadError } = await supabase.storage
      .from("run_bk")
      .upload(filename, decode(base64Image!), {
        contentType: "image/jpeg",
      });
    if (uploadError) throw uploadError;
    // เอา url ของรูปที่ storage มากำหนดให้กับตัวแปรเพื่อเอาไปบันทึกลงตาราง
    image_url = await supabase.storage.from("run_bk").getPublicUrl(filename)
      .data.publicUrl;

    // บันทึกข้อมูลลง table Database
    const { error: insetError } = await supabase.from("runs").insert({
      location: location,
      distance: distance,
      time_of_day: timeOfDay,
      run_date: new Date().toISOString().split("T")[0], //เก็บแค่วันที่
      image_url: image_url,
    });
    if (insetError) {
      Alert.alert(
        "คำเตือน",
        "พบข้อผิดพลาดในการบันทึกข้อมูล กรุณาลองใหม่อีกครั้ง",
      );
      return;
    }

    Alert.alert("สำเร็จ", "บันทึกข้อมูลเรียบร้อยแล้ว");
    router.back();
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
        <TouchableOpacity
          style={styles.saveBtn}
          onPress={handleSavetToSupabase}
        >
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
