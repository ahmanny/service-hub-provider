import { LineLayer, ShapeSource } from "@rnmapbox/maps";

export default function LineRoute({
  coordinates,
  id = "routeSource",
}: {
  coordinates: any[];
  id?: string;
}) {
  return (
    <ShapeSource
      id={id}
      lineMetrics
      shape={{
        properties: {},
        type: "Feature",
        geometry: {
          type: "LineString",
          coordinates,
        },
      }}
    >
      <LineLayer
        id="exampleLineLayer"
        style={{
          lineColor: "#42E100",
          lineCap: "round",
          lineJoin: "round",
          lineWidth: 7,
        }}
      />
    </ShapeSource>
  );
}
