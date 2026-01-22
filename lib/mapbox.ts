const MAPBOX_TOKEN = process.env.EXPO_PUBLIC_MAPBOX_TOKEN;

export type MapboxFeature = {
  id: string;
  place_name: string;
  geometry: {
    coordinates: [number, number]; // [lng, lat]
  };
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
): Promise<string> {
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${MAPBOX_TOKEN}`;

  const res = await fetch(url);
  const data = await res.json();

  return data.features?.[0]?.place_name ?? "";
}