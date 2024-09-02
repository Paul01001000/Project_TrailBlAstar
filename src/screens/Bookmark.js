import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import FontAwesomeIcon from "react-native-vector-icons/FontAwesome";
import { Color, GlobalStyles } from "../utils/styles";
import Separator from "../components/Separator";
import { FlatList } from "react-native";
import { usePlaces } from "../hooks/usePlaces";
import { useRefresh } from "../hooks/useRefresh";
import { getData, removeData } from "../utils/storage";

const ListItem = ({ item }) => (
  <TouchableOpacity onPress={item.handlePress} style={GlobalStyles.listItemRow}>
    <View width="80%">
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
    <TouchableOpacity onPress={item.handleStarPress}>
      <FontAwesomeIcon name="star" style={styles.icon}></FontAwesomeIcon>
    </TouchableOpacity>
  </TouchableOpacity>
);

function Bookmark(props) {
  const [data, setData] = useState([]);

  const { refresh, setRefresh } = useRefresh();

  const { places } = usePlaces();

  useEffect(() => {
    const fetch = async () => {
      const result = await getData("Bookmark");
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
            handlePress: () =>
              props.navigation.navigate("Result", {
                startId: item.startId,
                endId: item.endId,
              }),
            handleStarPress: async () => {
              await removeData("Bookmark", index);
              setRefresh(refresh + 1);
            },
          });
        }
      });
      setData(newData);
    };
    fetch();
  }, [refresh, JSON.stringify(places)]);

  return (
    <View style={GlobalStyles.background}>
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
    color: Color.purple,
    fontSize: 25,
  },
});

export default Bookmark;
