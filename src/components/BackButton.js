import React from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const BackButton = ({ onPress }) => {
  return (
    <MaterialCommunityIcons
      name="arrow-left"
      size={24}
      color="black"
      style={{ marginLeft: 10 }}
      onPress={onPress}
    />
  );
};

export default BackButton;
