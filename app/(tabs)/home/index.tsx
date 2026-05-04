import HomeScreen from "@/components/screens/HomeScreen";
import Mapbox from "@rnmapbox/maps";
import React from "react";

const accessToken =
  process.env.EXPO_PUBLIC_MAPBOX_KEY ||
  process.env.EXPO_PUBLIC_MAPBOX_TOKEN ||
  "";

Mapbox.setAccessToken(accessToken);

export default function Home() {
  return <HomeScreen />;
}
