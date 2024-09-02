import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, View, TextInput, TouchableOpacity } from "react-native";
import MaterialCommunityIconsIcon from "react-native-vector-icons/MaterialCommunityIcons";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { GlobalStyles, Color } from "../utils/styles";

function MaterialSearchBar3(props) {
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    if (searchText !== props.searchText) {
      setSearchText(props.searchText);
    }
  }, [props.searchText]);

  // 검색어가 변경될 때 호출되는 함수
  const handleChangeText = (text) => {
    setSearchText(text); // 검색어 상태 업데이트
    props?.setSearchText(text); // 부모 컴포넌트로 검색어 전달
  };

  return (
    <View style={[GlobalStyles.searchContainer, props.style]}>
      <View style={GlobalStyles.searchBack}>
        <TextInput
          placeholder={props.placeholder}
          placeholderTextColor={Color.lightGray}
          style={styles.inputStyle}
          value={searchText}
          autoFocus={true}
          onChangeText={handleChangeText}
        />
        <TouchableOpacity
          onPress={() => props.navigation.goBack()}
          style={styles.leftIconButton}
        >
          <MaterialCommunityIconsIcon
            name="arrow-left"
            style={GlobalStyles.grayIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.rightIconButton}
          onPress={() => handleChangeText("")}
        >
          <Icon name="close" style={GlobalStyles.grayIcon}></Icon>
        </TouchableOpacity>
      </View>
    </View>
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
    marginLeft: 50,
  },
  leftIconButton: {
    position: "absolute",
    left: 5,
  },
  rightIconButton: {
    position: "absolute",
    right: 5,
  },
});

export default MaterialSearchBar3;
