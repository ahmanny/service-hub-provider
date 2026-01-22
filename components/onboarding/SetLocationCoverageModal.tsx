import { ThemedButton, ThemedText } from "@/components/ui/Themed";
import { useThemeColor } from "@/hooks/use-theme-color";
import { reverseGeocode, searchAddress } from "@/lib/mapbox";
import { Ionicons } from "@expo/vector-icons";
import Mapbox from "@rnmapbox/maps";
import * as turf from "@turf/turf";
import { debounce } from "lodash";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface CoverageLocationProps {
  initialLat: number;
  initialLng: number;
  initialRadius: number;
  onConfirm: (data: {
    formattedAddress: string;
    latitude: number;
    longitude: number;
    radiusKm: number;
  }) => void;
}

const RADIUS_OPTIONS = [2, 5, 10, 20];

export default function SetLocationCoverageModal({
  initialLat,
  initialLng,
  initialRadius,
  onConfirm,
}: CoverageLocationProps) {
  const tint = useThemeColor({}, "tint");
  const tintLight = useThemeColor({}, "tintLight");
  const cardBg = useThemeColor({}, "card");

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);

  const [lat, setLat] = useState(initialLat);
  const [lng, setLng] = useState(initialLng);

  const [radius, setRadius] = useState(initialRadius);
  const [address, setAddress] = useState("");
  const [isGeocoding, setIsGeocoding] = useState(false);

  const circleFeature = turf.circle([lng, lat], radius, {
    units: "kilometers",
    steps: 64, // Makes the circle smooth
  });

  useEffect(() => {
    const updateAddress = async () => {
      setIsGeocoding(true);
      try {
        const addr = await reverseGeocode(lat, lng);
        setAddress(addr);
      } finally {
        setIsGeocoding(false);
      }
    };
    updateAddress();
  }, [lat, lng]);

  const debouncedSearch = useCallback(
    debounce(async (text: string) => {
      if (text.length < 3) return;
      const places = await searchAddress(text);
      setResults(places);
    }, 500),
    []
  );

  const selectPlace = (place: any) => {
    const [newLng, newLat] = place.center;
    setLat(newLat);
    setLng(newLng);
    setQuery(place.place_name);
    setResults([]);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <View style={{ flex: 1 }}>
        {/* FLOATING SEARCH BAR */}
        <View style={styles.floatingSearchContainer}>
          <View style={[styles.searchBar, { backgroundColor: cardBg }]}>
            <Ionicons name="search" size={20} color="#999" />
            <TextInput
              placeholder="Search center location..."
              value={query}
              onChangeText={(t) => {
                setQuery(t);
                debouncedSearch(t);
              }}
              style={styles.input}
              placeholderTextColor="#999"
            />
            {query.length > 0 && (
              <TouchableOpacity onPress={() => setQuery("")}>
                <Ionicons name="close-circle" size={18} color="#999" />
              </TouchableOpacity>
            )}
          </View>

          {results.length > 0 && (
            <View style={[styles.resultsDropdown, { backgroundColor: cardBg }]}>
              <FlatList
                data={results}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <Pressable
                    style={styles.resultItem}
                    onPress={() => selectPlace(item)}
                  >
                    <Ionicons name="location-outline" size={18} color={tint} />
                    <ThemedText style={styles.resultText} numberOfLines={1}>
                      {item.place_name}
                    </ThemedText>
                  </Pressable>
                )}
              />
            </View>
          )}
        </View>

        {/* MAPBOX WITH RADIUS VISUALIZATION */}
        <Mapbox.MapView
          style={{ flex: 1 }}
          onPress={(feature: any) => {
            const [newLng, newLat] = feature.geometry.coordinates;
            setLat(newLat);
            setLng(newLng);
          }}
        >
          <Mapbox.Camera
            centerCoordinate={[lng, lat]}
            zoomLevel={radius > 10 ? 11 : 13}
            animationDuration={1000}
          />

          {/* RADIUS CIRCLE LAYER */}
          <Mapbox.ShapeSource id="coverageSource" shape={circleFeature}>
            <Mapbox.FillLayer
              id="coverageFill"
              style={{
                fillColor: tint,
                fillOpacity: 0.15,
                fillOutlineColor: tint,
              }}
            />
            <Mapbox.LineLayer
              id="coverageOutline"
              style={{
                lineColor: tint,
                lineWidth: 2,
                lineDasharray: [2, 2],
              }}
            />
          </Mapbox.ShapeSource>

          <Mapbox.PointAnnotation
            id="centerPin"
            coordinate={[lng, lat]}
            draggable
            onDragEnd={(e) => {
              const [newLng, newLat] = e.geometry.coordinates;
              setLat(newLat);
              setLng(newLng);
            }}
          >
            <View style={[styles.pinCircle, { backgroundColor: tint }]}>
              <View style={styles.pinInner} />
            </View>
          </Mapbox.PointAnnotation>
        </Mapbox.MapView>

        {/* BOTTOM PANEL */}
        <View style={[styles.footer, { backgroundColor: cardBg }]}>
          <View style={styles.addressBox}>
            <ThemedText
              type="defaultSemiBold"
              style={{ color: tint, fontSize: 12 }}
            >
              SERVICE CENTER
            </ThemedText>
            {isGeocoding ? (
              <ActivityIndicator size="small" color={tint} />
            ) : (
              <ThemedText numberOfLines={1} style={styles.addressText}>
                {address}
              </ThemedText>
            )}
          </View>

          <ThemedText style={styles.label}>Coverage Radius</ThemedText>
          <View style={styles.radiusPicker}>
            {RADIUS_OPTIONS.map((r) => (
              <TouchableOpacity
                key={r}
                onPress={() => setRadius(r)}
                style={[
                  styles.radiusBtn,
                  { borderColor: tintLight },
                  radius === r && { backgroundColor: tint, borderColor: tint },
                ]}
              >
                <ThemedText
                  style={[
                    styles.radiusBtnText,
                    radius === r && { color: "#fff" },
                  ]}
                >
                  {r}km
                </ThemedText>
              </TouchableOpacity>
            ))}
          </View>

          <ThemedButton
            title="Set Service Area"
            onPress={() =>
              onConfirm({
                formattedAddress: address,
                latitude: lat,
                longitude: lng,
                radiusKm: radius,
              })
            }
          />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  floatingSearchContainer: {
    position: "absolute",
    top: 60,
    left: 20,
    right: 20,
    zIndex: 10,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    paddingHorizontal: 15,
    height: 54,
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  input: { flex: 1, fontSize: 16, marginLeft: 10 },
  resultsDropdown: {
    marginTop: 8,
    borderRadius: 16,
    maxHeight: 200,
    overflow: "hidden",
    elevation: 5,
  },
  resultItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: "#eee",
  },
  resultText: { marginLeft: 12, fontSize: 14 },
  pinCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 3,
    borderColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
  pinInner: { width: 6, height: 6, borderRadius: 3, backgroundColor: "#fff" },
  footer: {
    padding: 24,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
  addressBox: { marginBottom: 20 },
  addressText: { fontSize: 16, fontWeight: "700", marginTop: 4 },
  label: { fontSize: 14, fontWeight: "600", marginBottom: 12, opacity: 0.6 },
  radiusPicker: { flexDirection: "row", gap: 10, marginBottom: 24 },
  radiusBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: "center",
  },
  radiusBtnText: { fontWeight: "700", fontSize: 14 },
});
