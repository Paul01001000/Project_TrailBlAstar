import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  FlatList,
  Text,
  TouchableOpacity,
} from "react-native";
import MaterialSearchBar3 from "../components/MaterialSearchBar3";
import MaterialButtonViolet from "../components/MaterialButtonViolet";
import EntypoIcon from "react-native-vector-icons/Entypo";
import FeatherIcon from "react-native-vector-icons/Feather";
import MaterialButtonWithShadow from "../components/MaterialButtonWithShadow";
import { GlobalStyles } from "../utils/styles";
import Separator from "../components/Separator";
import GradientBox from "../components/GradientBox";
import { usePlaces } from "../hooks/usePlaces";
import { useRefresh } from "../hooks/useRefresh";
import { getData, removeData } from "../utils/storage";
import { getCurrentPosition } from "../utils/location";

const ListItem = ({ item }) => (
  <TouchableOpacity
    onPress={item.handlePress}
    style={{ ...GlobalStyles.listItemRow, height: 40 }}
  >
    <EntypoIcon name="location-pin" style={GlobalStyles.colorIcon}></EntypoIcon>
    <View
      style={{
        flexDirection: "row",
        flex: 1,
        alignItems: "center",
      }}
    >
      <View style={{ marginLeft: 10, width: "95%" }}>
        <Text style={GlobalStyles.listText}>{item.num + " " + item.text}</Text>
      </View>
    </View>
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <Text style={GlobalStyles.body2}>
        {item.date ? item.date.split(" ")[0] : ""}{" "}
      </Text>
      {item.handleRemovePress ? (
        <TouchableOpacity onPress={item.handleRemovePress}>
          <FeatherIcon name="x" style={GlobalStyles.grayListIcon}></FeatherIcon>
        </TouchableOpacity>
      ) : null}
    </View>
  </TouchableOpacity>
);

const tags = [
  {
    id: "1",
    icon: "silverware-fork-knife",
    caption: "Restaurant",
  },
  {
    id: "2",
    icon: "coffee",
    caption: "Cafe",
  },
  {
    id: "3",
    icon: "printer",
    caption: "Printer",
  },
  {
    id: "4",
    icon: "store",
    caption: "Store",
  },
  {
    id: "5",
    icon: "home-city",
    caption: "Dormitory",
  },

  {
    id: "6",
    icon: "book-open-variant",
    caption: "Study",
  },
  {
    id: "7",
    icon: "cash-multiple",
    caption: "ATM",
  },
];

function Select(props) {
  const params = props.route.params;

  const [searchText, setSearchText] = useState(""); // 검색어 상태
  useEffect(() => {
    if (params.searchText !== undefined) {
      setSearchText(params.searchText);
    }
  }, [params]);
  // console.log(params.searchText, searchText);

  const [recentData, setRecentData] = useState([]);

  const { refresh, setRefresh } = useRefresh();

  const { places } = usePlaces();

  const handlePress = (id) => {
    if (params.type === "Departure") {
      if (params.endId < 0) {
        props.navigation.navigate("SettingStack", {
          startId: id,
          endId: -1,
        });
      } else {
        props.navigation.navigate("Result", {
          startId: id,
          endId: params.endId,
        });
      }
    } else if (params.type === "Destination") {
      if (params.startId < 0) {
        props.navigation.navigate("SettingStack", {
          startId: -1,
          endId: id,
        });
      } else {
        props.navigation.navigate("Result", {
          startId: params.startId,
          endId: id,
        });
      }
    }
  };

  const handleCurrentLocation = async () => {
    // TODO: getCurrentPosition loading
    const current = await getCurrentPosition();

    if (!current || places.length === 0) return;

    let temp = places[0];

    for (let i = 1; i < places.length; i++) {
      if (
        Math.abs(current.latitude - places[i].latitude) +
          Math.abs(current.longitude - places[i].longitude) <
        Math.abs(current.latitude - temp.latitude) +
          Math.abs(current.longitude - temp.longitude)
      ) {
        temp = places[i];
      }
    }
    handlePress(temp.id);
  };

  useEffect(() => {
    const fetch = async () => {
      const result = await getData("RecentPlace");
      if (result === null) return;
      // console.log("result");
      // console.log(result);

      const newData = [];
      result.forEach((item, index) => {
        // console.log(item.date);
        if (item.placeId <= places.length) {
          newData.push({
            id: index,
            num: places[item.placeId - 1].buildingNum,
            text: places[item.placeId - 1].englishName,
            date: item.date,
            handlePress: () => {
              handlePress(item.placeId);
            },
            handleRemovePress: async () => {
              await removeData("RecentPlace", index);
              setRefresh(refresh + 1);
            },
          });
        }
      });
      // newData를 date 속성을 기준으로 내림차순으로 정렬
      newData.sort((a, b) => {
        // 날짜와 시간 문자열을 공백으로 분리하여 비교
        const [aDate, aTime] = a.date.split(" ");
        const [bDate, bTime] = b.date.split(" ");
        // 날짜와 시간이 같으면 시간으로 비교, 아니면 날짜로 비교
        if (aDate === bDate) {
          return bTime?.localeCompare(aTime); // 시간으로 내림차순 정렬
        } else {
          return bDate?.localeCompare(aDate); // 날짜로 내림차순 정렬
        }
      });
      // console.log("newData");
      // console.log(newData);
      setRecentData(newData);
    };
    fetch();
  }, [refresh, JSON.stringify(places)]);

  // MaterialSearchBar3에서 검색어가 변경될 때 호출되는 함수
  const handleSearch = (text) => {
    if (typeof text === "string") setSearchText(text); // 검색어 상태 업데이트
  };

  // 검색어를 포함한 결과를 반환하는 함수
  const getFilteredData = () => {
    if (searchText.trim() === "") {
      // 검색어가 없는 경우 recentData 반환
      return recentData.length > 0
        ? recentData
        : places.map((item) => ({
            id: item.id,
            num: item.buildingNum,
            text: item.englishName,
            handlePress: () => {
              handlePress(item.id);
            },
          }));
    } else {
      // 검색어가 있는 경우 matchingData에서 검색어를 포함하는 결과 반환
      const matchingData = [];
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
            handlePress: () => {
              handlePress(item.id);
            },
          });
        }
      });
      return matchingData;
    }
  };

  return (
    <View style={GlobalStyles.background}>
      <GradientBox height={200}>
        <View style={{ marginTop: 20 }}>
          <MaterialSearchBar3
            placeholder={params.type}
            navigation={props.navigation}
            searchText={searchText}
            setSearchText={handleSearch} // 검색어가 변경될 때 호출되는 콜백 함수 전달
          ></MaterialSearchBar3>
        </View>
        <View style={styles.buttonRow}>
          <MaterialButtonViolet
            caption="Current Location"
            icon="location-arrow"
            onPress={handleCurrentLocation}
          ></MaterialButtonViolet>
          <MaterialButtonViolet
            caption="Select on Map"
            icon="map"
            onPress={() =>
              props.navigation.navigate("SelectMap", {
                type: params.type,
                startId: params.startId,
                endId: params.endId,
              })
            }
          ></MaterialButtonViolet>
        </View>
      </GradientBox>
      <View
        style={{
          ...GlobalStyles.listContainer,
          height: 50,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <FlatList
          data={tags}
          renderItem={({ item }) => (
            <View style={GlobalStyles.listItemRow}>
              <MaterialButtonWithShadow
                icon={item.icon}
                caption={item.caption}
                style={{ height: 40 }}
                onPress={() => setSearchText(item.caption)}
              ></MaterialButtonWithShadow>
            </View>
          )}
          keyExtractor={(item) => item.id}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
        />
      </View>
      <Text style={{ ...GlobalStyles.body2, marginLeft: 35, marginBottom: 10 }}>
        {searchText.trim() === "" && recentData.length > 0
          ? "Recent Searches"
          : "Matching Results"}
      </Text>
      {searchText.trim() !== "" && getFilteredData().length === 0 ? (
        <Text style={{ ...GlobalStyles.listContainer, textAlign: "center" }}>
          No matching results found.
        </Text>
      ) : (
        <FlatList
          data={getFilteredData()} // 검색어에 따라 필터된 데이터를 보여줌
          renderItem={({ item }) => <ListItem item={item} />}
          keyExtractor={(item) => item.id}
          ItemSeparatorComponent={Separator}
          style={GlobalStyles.listContainer}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  buttonRow: {
    height: 50,
    width: 350,
    paddingTop: 15,
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

export default Select;
