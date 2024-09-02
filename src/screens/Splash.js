import React, { Component } from "react";
import { StyleSheet, View, ImageBackground, Image } from "react-native";
import { GlobalStyles } from "../utils/styles";
import GradientBox from "../components/GradientBox";

function Splash(props) {
  return (
    <View style={GlobalStyles.background}>
      <GradientBox height="110%">
        <Image
          source={require("../assets/images/자산_8Splash.png")}
          style={styles.image}
          resizeMode="center"
        ></Image>
      </GradientBox>
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    width: "75%",
    marginTop: "-15%",
  },
});

export default Splash;
