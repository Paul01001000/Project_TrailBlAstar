import React from "react";
import { Image, View } from "react-native";
import loading from "../assets/images/loading.gif";

const Loading = () => {
  return (
    <View
      style={{
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Image
        source={loading}
        style={{ width: 120, height: 50 }}
        resizeMode="cover"
      />
    </View>
  );
};

export default Loading;
