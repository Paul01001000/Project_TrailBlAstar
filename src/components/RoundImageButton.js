import React from "react";
import { TouchableOpacity, StyleSheet, View, Image } from "react-native";
import { Svg, Ellipse } from "react-native-svg";
import { Color } from "../utils/styles";

const RoundImageButton = ({
  onPress = () => console.log("Button pressed"),
  imageSource,
}) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <View style={styles.ellipseStack}>
        <Svg viewBox="0 0 44.51 44.51" style={styles.ellipse}>
          <Ellipse
            strokeWidth={0}
            fill={Color.purple}
            cx={22}
            cy={22}
            rx={22}
            ry={22}
          />
        </Svg>
        <Image
          source={imageSource}
          resizeMode="contain"
          style={styles.switch_icon}
        />
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
    backgroundColor: Color.purple,
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
  switch_icon: {
    width: 24,
    height: 24,
    alignSelf: "center",
  },
});

export default RoundImageButton;
