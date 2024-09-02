import React, { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  View,
  FlatList,
  Text,
  TouchableOpacity,
} from "react-native";
import MaterialMapViewSelect from "../components/MaterialMapViewSelect";
import EntypoIcon from "react-native-vector-icons/Entypo";
import MaterialButtonWithShadow from "../components/MaterialButtonWithShadow";
import TransparentGradientBox from "../components/TransparentGradientBox";
import { GlobalStyles, Color } from "../utils/styles";
import WhiteBox from "../components/WhiteBox";
import RoundIconButton from "../components/RoundIconButton";
import FontAwesomeIcon from "react-native-vector-icons/FontAwesome";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { usePlaces } from "../hooks/usePlaces";

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

function SelectMap(props) {
  const params = props.route.params;

  const [whiteBoxHeight, setWhiteBoxHeight] = useState(0);
  const whiteBoxRef = useRef(null);

  const { places } = usePlaces();

  const [region, setRegion] = useState({
    latitude: 36.3703,
    longitude: 127.36251,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });
  const [closest, setClosest] = useState();

  const [refresh, setRefresh] = useState(0);

  const onWhiteBoxLayout = () => {
    if (whiteBoxRef.current) {
      whiteBoxRef.current.measure((x, y, width, height, pageX, pageY) => {
        setWhiteBoxHeight(height);
      });
    }
    // console.log(whiteBoxHeight);
  };

  useEffect(() => {
    if (places.length === 0) return;

    let temp = places[0];

    for (let i = 1; i < places.length; i++) {
      if (
        Math.abs(region.latitude - places[i].latitude) +
          Math.abs(region.longitude - places[i].longitude) <
        Math.abs(region.latitude - temp.latitude) +
          Math.abs(region.longitude - temp.longitude)
      ) {
        temp = places[i];
      }
    }
    setClosest(temp);
  }, [region, JSON.stringify(places)]);

  const handlePress = () => {
    if (params.type === "Departure") {
      if (params.endId < 0) {
        props.navigation.navigate("SettingStack", {
          startId: closest?.id ?? -1,
          endId: -1,
        });
      } else {
        props.navigation.navigate("Result", {
          startId: closest?.id ?? -1,
          endId: params.endId,
        });
      }
    } else if (params.type === "Destination") {
      if (params.startId < 0) {
        props.navigation.navigate("SettingStack", {
          startId: -1,
          endId: closest?.id ?? -1,
        });
      } else {
        props.navigation.navigate("Result", {
          startId: params.startId,
          endId: closest?.id ?? -1,
        });
      }
    }
  };

  return (
    <View style={GlobalStyles.background}>
      <View>
        <MaterialMapViewSelect
          style={{ height: "100%", width: "100%" }}
          setRegion={setRegion}
          refresh={refresh}
        ></MaterialMapViewSelect>
        <View style={styles.wrap}>
          <View style={{ margin: 10 }}>
            <TransparentGradientBox height={60}>
              <Text style={{ ...GlobalStyles.h3, color: "white" }}>
                Move the map to save the location
              </Text>
            </TransparentGradientBox>
          </View>
          <EntypoIcon name="location-pin" style={styles.loc_icon}></EntypoIcon>

          <View style={{ flex: 1 }} />
          <View
            style={{
              position: "absolute",
              right: 30,
              bottom: whiteBoxHeight + 30,
            }}
          >
            <RoundIconButton
              onPress={() => setRefresh(refresh + 1)}
              icon={
                <MaterialCommunityIcons
                  name="target"
                  style={styles.target_icon}
                />
              }
              backgroundColor="white"
            />
          </View>

          <WhiteBox>
            <View onLayout={onWhiteBoxLayout} ref={whiteBoxRef}>
              <View style={{ flexDirection: "row", margin: 20 }}>
                <Text
                  style={{ ...GlobalStyles.h2, flex: 1, whiteSpace: "nowrap" }}
                >
                  {closest?.buildingNum + " " + closest?.englishName}
                </Text>
                <View style={{ marginLeft: 30 }}>
                  <RoundIconButton
                    icon={
                      <FontAwesomeIcon
                        name="long-arrow-right"
                        style={styles.arrow_icon}
                      />
                    }
                    onPress={handlePress}
                  />
                </View>
              </View>
              <View>
                <Text
                  style={{
                    ...GlobalStyles.body2,
                    marginLeft: 20,
                    marginRight: 20,
                  }}
                >
                  {closest?.description}
                </Text>
              </View>
              <View
                style={{
                  margin: 20,
                  marginBottom: 0,
                  height:
                    tags.filter((tag) => closest?.tags.includes(tag.caption))
                      .length > 0
                      ? 50
                      : 0,
                  alignItems: "flex-start",
                  justifyContent: "center",
                }}
              >
                {tags.filter((tag) => closest?.tags.includes(tag.caption))
                  .length > 0 && (
                  <FlatList
                    data={tags.filter((tag) =>
                      closest?.tags.includes(tag.caption)
                    )}
                    renderItem={({ item }) => (
                      <View style={GlobalStyles.listItemRow}>
                        <MaterialButtonWithShadow
                          icon={item.icon}
                          caption={item.caption}
                          style={{ height: 40 }}
                          onPress={() => {
                            if (params.type === "Departure") {
                              props.navigation.navigate("Select", {
                                searchText: item.caption,
                                type: params.type,
                                startId: -1,
                                endId: params.endId,
                              });
                            } else {
                              props.navigation.navigate("Select", {
                                searchText: item.caption,
                                type: params.type,
                                startId: params.startId,
                                endId: -1,
                              });
                            }
                          }}
                        ></MaterialButtonWithShadow>
                      </View>
                    )}
                    keyExtractor={(item) => item.id}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    style={{ height: 50 }} // FlatList의 height를 고정값으로 설정
                  />
                )}
              </View>
              <TouchableOpacity
                onPress={
                  closest
                    ? () => {
                        props.navigation.navigate("Edit", {
                          screen: "EditInfo",
                          params: {
                            id: closest.id,
                            name: closest.name,
                            englishName: closest.englishName,
                            buildingNum: closest.buildingNum,
                            latitude: closest.latitude,
                            longitude: closest.longitude,
                            tags: closest.tags,
                          },
                        });
                        // console.log(closest.name);
                      }
                    : null
                }
              >
                <Text
                  style={{
                    ...GlobalStyles.body2,
                    margin: 20,
                    marginTop: 10,
                    marginBottom: 10,
                    textAlign: "right",
                  }}
                >
                  Edit the information
                </Text>
              </TouchableOpacity>
            </View>
          </WhiteBox>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  target_icon: {
    color: Color.purple,
    fontSize: 35,
  },
  arrow_icon: {
    color: "white",
    fontSize: 35,
  },
  wrap: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flex: 1,
  },
  loc_icon: {
    position: "absolute",
    alignSelf: "center",
    top: "30%",
    color: Color.purple,
    fontSize: 70,
  },
});

export default SelectMap;
