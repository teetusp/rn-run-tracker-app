import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Run() {
  return (
    <View style={styles.container}>
      <Text>run</Text>
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
