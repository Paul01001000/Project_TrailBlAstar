import React from "react";
import { TouchableOpacity, StyleSheet, View } from "react-native";
import { Svg, Ellipse } from "react-native-svg";
import { Color } from "../utils/styles";

const RoundIconButton = ({
  onPress = () => console.log("Button pressed"),
  icon,
  backgroundColor = Color.purple, // 기본값으로 Color.purple을 사용
}) => {
  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor }]}
      onPress={onPress}
    >
      <View style={styles.ellipseStack}>
        <Svg viewBox="0 0 44.51 44.51" style={styles.ellipse}>
          <Ellipse
            strokeWidth={0}
            fill={backgroundColor} // 배경색과 동일하게 설정
            cx={22}
            cy={22}
            rx={22}
            ry={22}
          />
        </Svg>
        {icon}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    justifyContent: "center",
    width: 50,
    height: 50,
    borderRadius: 30,
  },
  ellipse: {
    position: "absolute",
    left: 0,
    top: 0,
    width: 45,
    height: 45,
  },
  ellipseStack: {
    width: 45,
    height: 45,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default RoundIconButton;
