import AsyncStorage from "@react-native-async-storage/async-storage";
import { getDate } from "./time";

const storeData = async (key, value) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    if (jsonValue === null) {
      await AsyncStorage.setItem(key, JSON.stringify([value]));
    } else {
      const arr = JSON.parse(jsonValue);
      // Check if the value already exists in the array
      for (let i = 0; i < arr.length; i++) {
        if (JSON.stringify(arr[i]) === JSON.stringify(value)) {
          return;
        }
      }
      arr.push(value);
      await AsyncStorage.setItem(key, JSON.stringify(arr));
    }
  } catch (e) {
    console.log(e);
  }
};

export const storeBookmark = async (startId, endId) => {
  await storeData("Bookmark", { startId, endId });
};

export const storeRecentPath = async (startId, endId) => {
  const date = getDate();
  try {
    let recentData = await getData("RecentPath");
    if (recentData === null) {
      // RecentPath 데이터가 없는 경우 새로 추가
      await storeData("RecentPath", { startId, endId, date });
    } else {
      // RecentPath 데이터가 있는 경우
      let found = false;
      for (let i = 0; i < recentData.length; i++) {
        if (
          recentData[i].startId === startId &&
          recentData[i].endId === endId
        ) {
          // 이미 해당 startId와 endId가 있는 경우 날짜만 업데이트하고 found를 true로 변경
          recentData[i].date = date;
          found = true;
          break;
        }
      }
      if (!found) {
        // 해당 startId와 endId가 없는 경우 새로 추가
        recentData.push({ startId, endId, date });
      }
      // 업데이트된 recentData를 저장
      await AsyncStorage.setItem("RecentPath", JSON.stringify(recentData));
    }
  } catch (e) {
    console.log(e);
  }
};

export const storeRecentPlace = async (placeId) => {
  const date = getDate();
  try {
    let recentData = await getData("RecentPlace");
    if (recentData === null) {
      // RecentPlace 데이터가 없는 경우 새로 추가
      await storeData("RecentPlace", { placeId, date });
    } else {
      // RecentPlace 데이터가 있는 경우
      let found = false;
      for (let i = 0; i < recentData.length; i++) {
        if (recentData[i].placeId === placeId) {
          // 이미 해당 placeId가 있는 경우 날짜만 업데이트하고 found를 true로 변경
          recentData[i].date = date;
          found = true;
          break;
        }
      }
      if (!found) {
        // 해당 placeId가 없는 경우 새로 추가
        recentData.push({ placeId, date });
      }
      // 업데이트된 recentData를 저장
      await AsyncStorage.setItem("RecentPlace", JSON.stringify(recentData));
    }
  } catch (e) {
    console.log(e);
  }
};

export const getData = async (key) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.log(e);
  }
};

export const removeData = async (key, index) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    if (jsonValue !== null) {
      const arr = JSON.parse(jsonValue);
      if (arr.length < index) {
        return;
      }
      arr.splice(index, 1);
      await AsyncStorage.setItem(key, JSON.stringify(arr));
    }
  } catch (e) {
    console.log(e);
  }
};

export const removeAllData = async (key) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (e) {
    console.log(e);
  }
};
