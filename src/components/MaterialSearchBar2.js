import React, { useState } from "react";
import { StyleSheet, View, TextInput, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { GlobalStyles, Color } from "../utils/styles";

function MaterialSearchBar2(props) {
  const [searchText, setSearchText] = useState("");

  // 검색어가 변경될 때 호출되는 함수
  const handleSearch = (text) => {
    setSearchText(text); // 검색어 상태 업데이트

    // 부모 컴포넌트로 검색어 전달
    if (props.onSearch) {
      props.onSearch(text);
    }
  };

  return (
    <View style={[GlobalStyles.searchContainer, props.style]}>
      <View style={GlobalStyles.searchBack}>
        <TextInput
          placeholder="Building"
          placeholderTextColor={Color.lightGray}
          style={styles.inputStyle1}
          value={searchText}
          onChangeText={handleSearch} // 검색어 변경 시 handleSearch 함수 호출
        />
        <TouchableOpacity onPress={() => handleSearch("")}>
          <Icon name="close" style={GlobalStyles.grayIcon}></Icon>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  inputStyle1: {
    height: 48,
    color: "#000",
    paddingRight: 5,
    fontSize: 16,
    alignSelf: "center",
    width: 280,
    lineHeight: 16,
    marginLeft: 23,
  },
});

export default MaterialSearchBar2;
