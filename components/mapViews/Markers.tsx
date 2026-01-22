import pinBarber from "@/assets/images/pins/barber.png";
import pinCleaning from "@/assets/images/pins/cleaning.png";
import pinElectrician from "@/assets/images/pins/electrician.png";
import pinHair from "@/assets/images/pins/hair.png";
import pinPlumber from "@/assets/images/pins/plumber.png";

import providers from "@/data/mockProviders.json";
import { CircleLayer, Images, ShapeSource, SymbolLayer } from "@rnmapbox/maps";
import { featureCollection, point } from "@turf/helpers";
import React from "react";

const SERVICE_ICONS: Record<string, string> = {
  Plumber: "pin-plumber",
  Electrician: "pin-electrician",
  "House Cleaning": "pin-cleaning",
  Barber: "pin-barber",
  "Hair Stylist": "pin-hair",
};

export default function MapMarkers() {
  const points = providers.map((provider) =>
    point([provider.location.longitude, provider.location.latitude], {
      icon: SERVICE_ICONS[provider.service] ?? "pin-plumber",
      ...provider,
    })
  );
  // const onPointPress = async (event: any) => {
  //   const feature = event.features?.[0];
  //   if (!feature) return;

  //   console.log(feature);

  //   const provider = feature.properties;

  //   if (provider) {
  //     setSelectedProvider(provider);
  //   }
  // };

  return (
    <ShapeSource
      id="providers"
      shape={featureCollection(points)}
      cluster
      clusterRadius={50}
      // onPress={(e) => onPointPress(e)}
    >
      {/* CLUSTER CIRCLE */}
      <CircleLayer
        id="clusters"
        filter={["has", "point_count"]}
        style={{
          circlePitchAlignment: "map",
          circleColor: "#13A354",
          circleRadius: 15,
          circleOpacity: 0.9,
          circleStrokeWidth: 2,
          circleStrokeColor: "#ffffff",
        }}
      />
      {/* CLUSTER COUNT */}
      <SymbolLayer
        id="clusters-count"
        filter={["has", "point_count"]}
        style={{
          textField: ["get", "point_count"],
          textSize: 18,
          textColor: "#ffffff",
          textIgnorePlacement: true,
        }}
      />

      <SymbolLayer
        id="provider-icons"
        filter={["!", ["has", "point_count"]]}
        style={{
          iconImage: ["get", "icon"],
          iconSize: 0.6,
          iconAllowOverlap: true,
          iconAnchor: "bottom",
        }}
      />
      <Images
        images={{
          "pin-plumber": pinPlumber,
          "pin-electrician": pinElectrician,
          "pin-cleaning": pinCleaning,
          "pin-barber": pinBarber,
          "pin-hair": pinHair,
        }}
      />
    </ShapeSource>
  );
}
