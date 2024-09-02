import React, { Component } from "react";
import { StyleSheet, View, TouchableOpacity, TextInput } from "react-native";
import { Color, GlobalStyles } from "../utils/styles";

function MaterialSearchBar(props) {
  return (
    <TouchableOpacity
      onPress={props.onSearchPress}
      style={[GlobalStyles.searchContainer, props.style]}
    >
      <View style={GlobalStyles.searchBack}>
        <TextInput
          editable={false} // TextInput을 비활성화합니다.
          placeholder={props.placeholder} // 전달된 placeholder 값으로 설정
          placeholderTextColor={
            props.placeholder === "Departure" ||
            props.placeholder === "Destination"
              ? Color.lightGray
              : Color.black
          }
          style={styles.inputStyle}
          onPress={props.onSearchPress}
        ></TextInput>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  inputStyle: {
    height: 45,
    color: "#000",
    paddingRight: 5,
    fontSize: 16,
    alignSelf: "flex-start",
    width: 245,
    lineHeight: 16,
    marginLeft: 15,
  },
});

export default MaterialSearchBar;
