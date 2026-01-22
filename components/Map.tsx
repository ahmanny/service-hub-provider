import Mapbox, { MapView } from "@rnmapbox/maps";
import React from "react";

Mapbox.setAccessToken(
  process.env.EXPO_PUBLIC_MAPBOX_KEY ||
    "pk.eyJ1IjoiYWhtYW5ueSIsImEiOiJjbWplcjZlaDcwZ2VrM2RzbWdleGlhNmNzIn0.82jeiD0j7aR-Y5nj1T0ByA"
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
