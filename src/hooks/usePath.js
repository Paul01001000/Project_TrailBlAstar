import { useCallback, useState } from "react";
import axios from "axios";

export const usePath = () => {
  const [loading, setLoading] = useState(false);

  const findPath = useCallback(async (start, end) => {
    setLoading(true);

    try {
      const response = await axios({
        url: `https://api.openrouteservice.org/v2/directions/foot-walking?api_key=5b3ce3597851110001cf62489f48b391e3974812871880f14baceeed&start=${start.longitude},${start.latitude}&end=${end.longitude},${end.latitude}`,
        method: "GET",
        headers: {
          Accept:
            "application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8",
        },
      });
      const features = response.data.features[0];

      const coordinates = features.geometry.coordinates;
      const distance = features.properties.summary.distance;
      const duration = Math.ceil(features.properties.summary.duration / 60);

      const p = [];

      for (let i = 0; i < coordinates.length; i++) {
        p.push({
          latitude: coordinates[i][1],
          longitude: coordinates[i][0],
        });
      }

      setLoading(false);
      return { distance: distance, duration: duration, path: p };
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }, []);

  return { loading, findPath };
};
