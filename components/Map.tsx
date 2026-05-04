import Mapbox, { MapView } from "@rnmapbox/maps";
import React from "react";

Mapbox.setAccessToken(
  process.env.EXPO_PUBLIC_MAPBOX_KEY ||
    process.env.EXPO_PUBLIC_MAPBOX_TOKEN ||
    ""
);

export default function Map() {
  return (
    <MapView style={{ flex: 1 }}>
      <Mapbox.Camera
        zoomLevel={12}
        centerCoordinate={[-122.4324, 37.78825]} // lng, lat
      />
    </MapView>
  );
}
