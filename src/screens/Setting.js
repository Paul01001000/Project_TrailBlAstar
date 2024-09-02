// Setting.js

import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  ImageBackground,
  TouchableOpacity,
  Image,
  Text,
  FlatList,
} from "react-native";
import MaterialSearchBar from "../components/MaterialSearchBar";
import EntypoIcon from "react-native-vector-icons/Entypo";
import FeatherIcon from "react-native-vector-icons/Feather";
import { Color, GlobalStyles } from "../utils/styles";
import Separator from "../components/Separator";
import RoundImageButton from "../components/RoundImageButton";
import GradientBox from "../components/GradientBox";
import { usePlaces } from "../hooks/usePlaces";
import { useRefresh } from "../hooks/useRefresh";
import { getData, removeData } from "../utils/storage";

const ListItem = ({ item }) => (
  <TouchableOpacity onPress={item.handlePress} style={GlobalStyles.listItemRow}>
    <EntypoIcon name="back-in-time" style={GlobalStyles.colorIcon}></EntypoIcon>
    <View
      style={{
        flexDirection: "row",
        flex: 1,
        alignItems: "center",
      }}
    >
      <View style={{ marginLeft: 10, width: "90%" }}>
        <Text style={GlobalStyles.listText}>
          {item.departureId + " " + item.departure}
        </Text>
        <View
          style={{
            flexDirection: "row",
            alignItems: "flex-start",
          }}
        >
          <Text style={GlobalStyles.listText}>{" →   "}</Text>
          <Text style={GlobalStyles.listText}>
            {item.destinationId + " " + item.destination}
          </Text>
        </View>
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
      <TouchableOpacity onPress={item.handleRemovePress}>
        <FeatherIcon name="x" style={GlobalStyles.grayListIcon}></FeatherIcon>
      </TouchableOpacity>
    </View>
  </TouchableOpacity>
);

function Setting(props) {
  const [data, setData] = useState([]);

  const { refresh, setRefresh } = useRefresh();

  const { places } = usePlaces();

  const params = props.route.params;

  const [ids, setIds] = useState({
    startId: params?.startId ?? -1,
    endId: params?.endId ?? -1,
  });

  useEffect(() => {
    setIds({
      startId: params?.startId ?? -1,
      endId: params?.endId ?? -1,
    });
  }, [params]);

  const handleSearchPress = (type) => {
    props.navigation.navigate("Select", {
      type: type,
      startId: ids.startId,
      endId: ids.endId,
    });
  };

  useEffect(() => {
    const fetch = async () => {
      const result = await getData("RecentPath");
      if (result === null) return;

      const newData = [];
      result.forEach((item, index) => {
        if (item.startId <= places.length && item.endId <= places.length) {
          newData.push({
            id: index,
            departureId: places[item.startId - 1].buildingNum,
            departure: places[item.startId - 1].englishName,
            destinationId: places[item.endId - 1].buildingNum,
            destination: places[item.endId - 1].englishName,
            date: item.date,
            handlePress: () =>
              props.navigation.navigate("Result", {
                startId: item.startId,
                endId: item.endId,
              }),
            handleRemovePress: async () => {
              await removeData("RecentPath", index);
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
      setData(newData);
    };
    fetch();
  }, [refresh, JSON.stringify(places)]);

  return (
    <View style={GlobalStyles.background}>
      <GradientBox height={200}>
        <View style={{ marginTop: 20 }}>
          <MaterialSearchBar
            type="Departure"
            placeholder={
              ids.startId > 0
                ? places[ids.startId - 1]?.buildingNum +
                    " " +
                    places[ids.startId - 1]?.englishName ?? "Departure"
                : "Departure"
            }
            onSearchPress={() => handleSearchPress("Departure")}
          />
          <MaterialSearchBar
            type="Destination"
            placeholder={
              ids.endId > 0
                ? places[ids.endId - 1]?.buildingNum +
                    " " +
                    places[ids.endId - 1]?.englishName ?? "Destination"
                : "Destination"
            }
            onSearchPress={() => handleSearchPress("Destination")}
          />
        </View>
        <View style={styles.button}>
          <RoundImageButton
            onPress={() => setIds({ startId: ids.endId, endId: ids.startId })}
            imageSource={require("../assets/images/자산_2switch_icon.png")}
          />
        </View>
      </GradientBox>
      <Text
        style={{
          ...GlobalStyles.body2,
          margin: 20,
          marginLeft: 35,
          marginBottom: 10,
        }}
      >
        Recent Path
      </Text>
      <FlatList
        data={data}
        renderItem={({ item }) => <ListItem item={item} />}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={Separator}
        style={GlobalStyles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  icon: {
    color: Color.gray,
    fontSize: 25,
    marginLeft: 10,
    marginRight: 10,
  },
  button: {
    top: 85,
    right: 50,
    width: 45,
    height: 45,
    position: "absolute",
    zIndex: 1,
  },
});

export default Setting;
