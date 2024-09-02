import React, { Component } from "react";
import { StyleSheet, TouchableOpacity, Text } from "react-native";
import MaterialCommunityIconsIcon from "react-native-vector-icons/MaterialCommunityIcons";
import { Color, GlobalStyles } from "../utils/styles";

function MaterialButtonWithShadow(props) {
  return (
    <TouchableOpacity
      style={[styles.container, props.style]}
      onPress={props.onPress}
    >
      <MaterialCommunityIconsIcon
        name={props.icon}
        style={{ ...GlobalStyles.colorIcon, fontSize: 20 }}
      ></MaterialCommunityIconsIcon>
      <Text style={styles.caption}>{props.caption || "BUTTON"}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    borderRadius: 25,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.35,
    shadowRadius: 5,
    elevation: 2,
    minWidth: 88,
    paddingLeft: 16,
    paddingRight: 16,
    marginLeft: 5,
    marginRight: 5,
  },
  caption: {
    color: Color.purple,
    fontSize: 14,
    margin: 0,
    marginLeft: 20,
  },
});

export default MaterialButtonWithShadow;
