import React, { Component } from "react";
import { StyleSheet, View, Text } from "react-native";

function Separator(props) {
  return <View style={styles.separator} />;
}

const styles = StyleSheet.create({
  separator: {
    width: "100%",
    height: 1,
    backgroundColor: "#E6E6E6",
    margin: 10,
  },
});

export default Separator;
