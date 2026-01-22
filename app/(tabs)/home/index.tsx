import HomeScreen from "@/components/screens/HomeScreen";
import Mapbox from "@rnmapbox/maps";
import React from "react";

const accessToken =
  "pk.eyJ1IjoiYWhtYW5ueSIsImEiOiJjbWplcjZlaDcwZ2VrM2RzbWdleGlhNmNzIn0.82jeiD0j7aR-Y5nj1T0ByA";

Mapbox.setAccessToken(accessToken);

export default function Home() {
  return <HomeScreen />;
}
