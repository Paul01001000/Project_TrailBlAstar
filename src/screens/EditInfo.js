import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Alert,
  Text,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import MaterialCommunityIconsIcon from "react-native-vector-icons/MaterialCommunityIcons";
import MaterialStackedLabelTextbox from "../components/MaterialStackedLabelTextbox";
import MaterialButtonViolet1 from "../components/MaterialButtonViolet1";
import { Color, GlobalStyles } from "../utils/styles";
import { usePlaces } from "../hooks/usePlaces";
import Toast from "react-native-toast-message";
import Loading from "../components/Loading";

function EditInfo(props) {
  const {
    id,
    name,
    englishName,
    buildingNum,
    latitude,
    longitude,
    tags,
    description,
  } = props.route.params;

  // console.log(props.route.params);

  const { places, updatePlace } = usePlaces();

  const [newName, setNewName] = useState(name);
  const [newEnglishName, setNewEnglishName] = useState(englishName);
  const [newBuildingNum, setNewBuildingNum] = useState(buildingNum);
  const [newLatitude, setNewLatitude] = useState(latitude);
  const [newLongitude, setNewLongitude] = useState(longitude);
  const [newTags, setNewTags] = useState(tags);
  const [newDescription, setNewDescription] = useState(description);

  const [loading, setLoading] = useState(false); // 로딩 상태 추가
  const [errors, setErrors] = useState({});

  // console.log(
  //   newName,
  //   newEnglishName,
  //   newBuildingNum,
  //   newLatitude,
  //   newLongitude,
  //   newTags
  // );

  useEffect(() => {
    setNewName(name);
    setNewEnglishName(englishName);
    setNewBuildingNum(buildingNum);
    setNewLatitude(latitude);
    setNewLongitude(longitude);
    setNewTags(tags);
    setNewDescription(description);
  }, [name, englishName, buildingNum, latitude, longitude, tags, description]);

  // useEffect(() => {
  //   const unsubscribe = props.navigation.addListener("beforeRemove", (e) => {
  //     // Prevent default behavior of leaving the screen
  //     e.preventDefault();
  //     // Prompt the user before leaving the screen
  //     if (
  //       places[id - 1].name !== newName ||
  //       places[id - 1].englishName !== newEnglishName ||
  //       places[id - 1].buildingNum !== newBuildingNum ||
  //       places[id - 1].latitude != newLatitude ||
  //       places[id - 1].longitude != newLongitude ||
  //       places[id - 1].tags !== newTags
  //     ) {
  //       console.log(places[id - 1]);
  //       console.log(
  //         newName,
  //         newEnglishName,
  //         newBuildingNum,
  //         newLatitude,
  //         newLongitude,
  //         newTags
  //       );
  //       Alert.alert(
  //         "Discard changes?",
  //         "If you go back, your changes will be discarded.",
  //         [
  //           {
  //             text: "Stay",
  //             style: "cancel",
  //           },
  //           {
  //             text: "Discard",
  //             onPress: () => props.navigation.dispatch(e.data.action),
  //           },
  //         ]
  //       );
  //     } else {
  //       props.navigation.dispatch(e.data.action);
  //     }
  //   });

  //   return unsubscribe;
  // }, [
  //   newName,
  //   newEnglishName,
  //   newBuildingNum,
  //   newLatitude,
  //   newLongitude,
  //   newTags,
  //   props.navigation,
  // ]);

  const handlePress = async () => {
    if (
      places[id - 1].name !== newName ||
      places[id - 1].englishName !== newEnglishName ||
      places[id - 1].buildingNum !== newBuildingNum ||
      places[id - 1].latitude != newLatitude ||
      places[id - 1].longitude != newLongitude ||
      places[id - 1].tags !== newTags ||
      places[id - 1].description !== newDescription
    ) {
      const isValid = validateForm();

      if (isValid) {
        setLoading(true);

        await updatePlace(
          id,
          newName,
          newEnglishName,
          newBuildingNum,
          newLatitude,
          newLongitude,
          newTags,
          newDescription
        );
        setLoading(false);
        // Show toast message for successful save
        Toast.show({
          type: "success",
          text1: "Success",
          text2: "Changes saved successfully",
          visibilityTime: 2000, // 2 seconds
          autoHide: true,
          topOffset: 50,
          bottomOffset: 100,
          position: "bottom",
        });
        console.log("saved successly");
        props.navigation.navigate("EditStack");
      } else {
        console.log("Form validation failed");
      }
    } else {
      props.navigation.navigate("EditStack");
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Perform validation checks
    // Example validation:
    if (!newName.trim()) {
      newErrors.newName = "Name cannot be empty";
    }
    if (!newEnglishName.trim()) {
      newErrors.newEnglishName = "English Name cannot be empty";
    }
    if (
      isNaN(newLatitude) ||
      Number(newLatitude) < -90 ||
      Number(newLatitude) > 90
    ) {
      newErrors.newLatitude = "Latitude is not valid";
    } else if (
      Number(newLatitude) < 36.365 || // 최소 위도
      Number(newLatitude) > 36.376 // 최대 위도
    ) {
      newErrors.newLatitude = "Latitude is out of KAIST";
    }
    if (
      isNaN(newLongitude) ||
      Number(newLongitude) < -180 ||
      Number(newLongitude) > 180
    ) {
      newErrors.newLongitude = "Longitude is not valid";
    } else if (
      Number(newLongitude) < 127.355 || // 최소 경도
      Number(newLongitude) > 127.37 // 최대 경도
    ) {
      newErrors.newLongitude = "Longitude is out of KAIST";
    }

    const buildingNumRegex = /^(E|N|W)\d+(\-\d+)?$/;

    if (!buildingNumRegex.test(newBuildingNum)) {
      if (!newBuildingNum.match(/^(E|N|W)/)) {
        newErrors.newBuildingNum =
          "BuildingNum must start with 'E', 'N', or 'W'";
      } else if (!newBuildingNum.match(/^([ENW\d-])+$/)) {
        newErrors.newBuildingNum =
          "BuildingNum must consist of 'E', 'N', 'W', numbers, or '-' only";
      } else if (!newBuildingNum.match(/\d/)) {
        newErrors.newBuildingNum = "BuildingNum must contain a number";
      } else if (newBuildingNum.indexOf(" ") !== -1) {
        newErrors.newBuildingNum = "BuildingNum must not contain spaces";
      } else {
        newErrors.newBuildingNum = "BuildingNum is invalid";
      }
    }
    if (newBuildingNum.length > 5) {
      newErrors.newBuildingNum = "BuildingNum is too long";
    }
    // Set errors state
    setErrors(newErrors);

    // Return true if no errors, false otherwise
    return Object.keys(newErrors).length === 0;
  };

  return (
    <ScrollView>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
        <View style={GlobalStyles.background}>
          <View style={styles.row}>
            <MaterialCommunityIconsIcon
              name="office-building"
              style={styles.icon}
            ></MaterialCommunityIconsIcon>
            <View>
              <MaterialStackedLabelTextbox
                label="Building name"
                value={newName}
                style={styles.materialStackedLabelTextbox}
                setValue={setNewName}
              ></MaterialStackedLabelTextbox>
              {errors.newName && (
                <Text style={styles.errorText}>{errors.newName}</Text>
              )}
              <MaterialStackedLabelTextbox
                label="Building name"
                value={newEnglishName}
                style={styles.materialStackedLabelTextbox}
                setValue={setNewEnglishName}
              ></MaterialStackedLabelTextbox>
              {errors.newEnglishName && (
                <Text style={styles.errorText}>{errors.newEnglishName}</Text>
              )}
              <MaterialStackedLabelTextbox
                label="Building number"
                value={newBuildingNum}
                style={styles.materialStackedLabelTextbox}
                setValue={setNewBuildingNum}
              ></MaterialStackedLabelTextbox>
              {errors.newBuildingNum && (
                <Text style={styles.errorText}>{errors.newBuildingNum}</Text>
              )}
              <MaterialStackedLabelTextbox
                label="Latitude"
                value={newLatitude.toString()}
                style={styles.materialStackedLabelTextbox}
                setValue={setNewLatitude}
              ></MaterialStackedLabelTextbox>
              {errors.newLatitude && (
                <Text style={styles.errorText}>{errors.newLatitude}</Text>
              )}
              <MaterialStackedLabelTextbox
                label="Longitude"
                value={newLongitude.toString()}
                style={styles.materialStackedLabelTextbox}
                setValue={setNewLongitude}
              ></MaterialStackedLabelTextbox>
              {errors.newLongitude && (
                <Text style={styles.errorText}>{errors.newLongitude}</Text>
              )}
              <MaterialStackedLabelTextbox
                label="Tags"
                value={newTags}
                style={styles.materialStackedLabelTextbox}
                setValue={setNewTags}
              ></MaterialStackedLabelTextbox>
              <MaterialStackedLabelTextbox
                label="Description"
                value={newDescription}
                style={styles.materialStackedLabelTextbox}
                setValue={setNewDescription}
              ></MaterialStackedLabelTextbox>
            </View>
          </View>
          <MaterialButtonViolet1
            caption="Save"
            style={styles.materialButtonViolet1}
            onPress={handlePress}
          ></MaterialButtonViolet1>
          {loading && (
            <View style={styles.overlay}>
              <Loading />
            </View>
          )}
        </View>
      </KeyboardAvoidingView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    width: "100%",
    height: "100%",
    position: "absolute",
    left: 0,
    top: 0,
    backgroundColor: "rgba(255,255,255, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
    margin: 20,
  },
  materialStackedLabelTextbox: {
    width: 300,
    height: 50,
    overflow: "hidden",
    alignSelf: "center",
  },
  icon: {
    color: Color.gray,
    fontSize: 40,
    marginRight: 20,
  },
  materialButtonViolet1: {
    height: 36,
    width: 100,
    borderRadius: 20,
    alignSelf: "center",
  },
  errorText: {
    ...GlobalStyles.body2,
    color: "rgba(255,0,0,0.5)",
    marginTop: -15,
    marginBottom: 20,
  },
});

export default EditInfo;
