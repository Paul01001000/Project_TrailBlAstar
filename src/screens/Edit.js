import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
} from "react-native";
import MaterialSearchBar2 from "../components/MaterialSearchBar2";
import EntypoIcon from "react-native-vector-icons/Entypo";
import Separator from "../components/Separator";
import GradientBox from "../components/GradientBox";
import { GlobalStyles } from "../utils/styles";
import { usePlaces } from "../hooks/usePlaces";

const ListItem = ({ item, onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    style={{ ...GlobalStyles.listItemRow, height: 40 }}
  >
    <View
      style={{
        flexDirection: "row",
        flex: 1,
        alignItems: "center",
      }}
    >
      <EntypoIcon
        name="location-pin"
        style={GlobalStyles.colorIcon}
      ></EntypoIcon>
      <View style={{ marginLeft: 10, width: "90%" }}>
        <Text style={GlobalStyles.listText}>{item.num + " " + item.text}</Text>
      </View>
    </View>
  </TouchableOpacity>
);

function Edit(props) {
  const [searchText, setSearchText] = useState(""); // MaterialSearchBar2의 value 상태

  const { places } = usePlaces();

  // MaterialSearchBar2의 값이 변경될 때 호출되는 함수
  const handleSearch = (text) => {
    setSearchText(text); // 검색어를 상태에 설정
  };

  // 검색어를 포함하는 데이터만 필터링하여 반환하는 함수
  const filterData = () => {
    const matchingData = [];

    if (searchText.trim() === "") {
      places.forEach((item) => {
        matchingData.push({
          id: item.id,
          num: item.buildingNum,
          text: item.englishName,
        });
      });
    } else {
      places.forEach((item) => {
        if (
          item.name.toLowerCase().includes(searchText.toLowerCase()) ||
          item.englishName.toLowerCase().includes(searchText.toLowerCase()) ||
          item.buildingNum.toLowerCase().includes(searchText.toLowerCase()) ||
          item.tags.toLowerCase().includes(searchText.toLowerCase())
        ) {
          matchingData.push({
            id: item.id,
            num: item.buildingNum,
            text: item.englishName,
          });
        }
      });
    }

    return matchingData;
  };

  // ListItem을 클릭했을 때 호출되는 함수
  const handleListItemPress = (id) => {
    // ItemInfo 스크린으로 이동하면서 item.name 전달
    props.navigation.navigate("EditInfo", {
      id: places[id - 1].id,
      name: places[id - 1].name,
      englishName: places[id - 1].englishName,
      buildingNum: places[id - 1].buildingNum,
      latitude: places[id - 1].latitude,
      longitude: places[id - 1].longitude,
      tags: places[id - 1].tags,
      description: places[id - 1].description,
    });
  };

  return (
    <View style={GlobalStyles.background}>
      <GradientBox height={90}>
        <MaterialSearchBar2
          style={styles.materialSearchBar2}
          onSearch={handleSearch} // 검색어 입력 시 호출되는 함수 전달
        />
      </GradientBox>
      <Text
        style={{
          ...GlobalStyles.body2,
          margin: 20,
          marginLeft: 35,
          marginBottom: 10,
        }}
      >
        Matching Results
      </Text>
      {filterData().length > 0 ? (
        <FlatList
          data={filterData()} // 필터링된 데이터를 FlatList에 전달
          renderItem={({ item }) => (
            <ListItem
              item={item}
              onPress={() => handleListItemPress(item.id)}
            />
          )}
          keyExtractor={(item) => item.id}
          ItemSeparatorComponent={Separator}
          style={GlobalStyles.listContainer}
        />
      ) : (
        <Text style={{ ...GlobalStyles.listContainer, textAlign: "center" }}>
          No matching results found.
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  materialSearchBar2: {
    height: 50,
    width: 350,
  },
});

export default Edit;
