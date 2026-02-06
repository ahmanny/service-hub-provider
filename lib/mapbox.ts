const MAPBOX_TOKEN = process.env.EXPO_PUBLIC_MAPBOX_TOKEN;

export type MapboxFeature = {
  id: string;
  place_name: string;
  geometry: {
    coordinates: [number, number]; // [lng, lat]
  };
  context?: Array<{ id: string; text: string }>;
};

export interface GeocodeResult {
  formattedAddress: string;
  city: string;
  state: string;
}

/**
 * Helper to extract specific levels from Mapbox context
 */
const extractFromContext = (context: any[], type: string) => {
  return context?.find((item) => item.id.startsWith(type))?.text || "";
};

export async function searchAddress(query: string): Promise<MapboxFeature[]> {
  if (!query) return [];

  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
    query
  )}.json?autocomplete=true&limit=6&country=NG&access_token=${MAPBOX_TOKEN}`;

  const res = await fetch(url);
  const data = await res.json();
  return data.features ?? [];
}

export async function reverseGeocode(
  latitude: number,
  longitude: number
): Promise<GeocodeResult> {
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${MAPBOX_TOKEN}`;

  const res = await fetch(url);
  const data = await res.json();
  const mainFeature = data.features?.[0];

  if (!mainFeature) {
    return { formattedAddress: "", city: "", state: "" };
  }

  return {
    formattedAddress: mainFeature.place_name,
    city: extractFromContext(mainFeature.context, "place"),
    state: extractFromContext(mainFeature.context, "region"),
  };
}