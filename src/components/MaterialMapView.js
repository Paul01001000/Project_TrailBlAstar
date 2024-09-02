import React, {
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
  useState,
} from "react";
import { StyleSheet, View } from "react-native";
import MapView, { PROVIDER_GOOGLE, Marker, Polyline } from "react-native-maps";
import { Color } from "../utils/styles";
import { getCurrentPosition } from "../utils/location";

import Foundation from "react-native-vector-icons/Foundation";

const MaterialMapView = forwardRef((props, ref) => {
  const mapViewRef = useRef(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const gradientColors = [Color.lightBlue, Color.blue, Color.purple];

  const totalPoints = props.path?.length;
  const colorsPerSection = gradientColors.length; // 색상 그라데이션 간격 계산

  const strokeColors = props.path?.map((point, index) => {
    const colorIndex = Math.floor((index / totalPoints) * colorsPerSection);
    return gradientColors[colorIndex];
  });

  const animate = async () => {
    if (mapViewRef?.current && props?.path) {
      const minLat = Math.min(...props.path.map((point) => point.latitude));
      const maxLat = Math.max(...props.path.map((point) => point.latitude));
      const minLng = Math.min(...props.path.map((point) => point.longitude));
      const maxLng = Math.max(...props.path.map((point) => point.longitude));

      const latitudeDelta = maxLat - minLat;
      const longitudeDelta = maxLng - minLng;

      mapViewRef.current.animateToRegion(
        {
          latitude: (minLat + maxLat) / 2,
          longitude: (minLng + maxLng) / 2,
          latitudeDelta: latitudeDelta,
          longitudeDelta: longitudeDelta + 0.005,
        },
        500
      );
    }
  };

  const animateToCurrent = async () => {
    if (mapViewRef?.current) {
      const current = await getCurrentPosition();
      if (!current) return;

      mapViewRef.current.animateToRegion(
        {
          latitude: current.latitude,
          longitude: current.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        },
        1000
      );
    }
  };

  useEffect(() => {
    animate();
  }, [props?.path]);

  useEffect(() => {
    const fetchCurrentLocation = async () => {
      const location = await getCurrentPosition();
      if (location) {
        setCurrentLocation(location);
      }
    };

    fetchCurrentLocation();
  }, []);

  // 부모 컴포넌트로부터 ref로 받은 메서드 제공
  useImperativeHandle(ref, () => ({
    animateToRegion: async () => {
      await animate();
    },
    animateToCurrent: async () => {
      await animateToCurrent();
    },
  }));

  return (
    <View style={[styles.container, props.style]}>
      <MapView
        ref={mapViewRef}
        style={styles.MapView1}
        initialRegion={{
          latitude: props.path ? props.path[0].latitude : 36.3703,
          longitude: props.path ? props.path[0].longitude : 127.36251,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        provider={PROVIDER_GOOGLE}
      >
        {!props.loading && props.path ? (
          <Marker
            coordinate={{
              latitude: props.path[0].latitude,
              longitude: props.path[0].longitude,
            }}
            pinColor="green"
          />
        ) : null}
        {!props.loading && props.path ? (
          <Marker
            coordinate={{
              latitude: props.path[props.path.length - 1].latitude,
              longitude: props.path[props.path.length - 1].longitude,
            }}
            pinColor="red"
          />
        ) : null}
        {!props.loading && props.path ? (
          <Polyline
            coordinates={props.path}
            strokeColor="#000" // fallback for when `strokeColors` is not supported by the map-provider
            strokeColors={strokeColors}
            strokeWidth={4}
          />
        ) : null}

        {!props.loading && currentLocation ? (
          <Marker coordinate={currentLocation} title="Current Location">
            <View style={styles.currentLocationMarker}>
              <Foundation name="target-two" size={30} color={Color.purple} />
            </View>
          </Marker>
        ) : null}
      </MapView>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
  },
  MapView1: {
    flex: 1,
    backgroundColor: "rgb(230,230,230)",
  },
});

export default MaterialMapView;
