import React from "react";
import { StyleSheet, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Border } from "../utils/styles";

const GradientBox = ({ children, height }) => {
  return (
    <LinearGradient
      colors={[
        "rgba(136, 211, 206,1)",
        "rgba(135, 210, 206,1)",
        "rgba(79, 172, 254,1)",
        "rgba(131, 94, 235,1)",
      ]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      locations={[0.0764, 0.0764, 0.4066, 0.8534]} // 각 색상의 위치를 나타내는 배열
      style={[styles.rect1, { height: height }]}
    >
      {children}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  rect1: {
    width: "100%",
    borderBottomRightRadius: Border.br_xl,
    borderBottomLeftRadius: Border.br_xl,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default GradientBox;
