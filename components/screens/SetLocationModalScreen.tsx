import { ThemedButton, ThemedText } from "@/components/ui/Themed";
import { useThemeColor } from "@/hooks/use-theme-color";
import { GeocodeResult, reverseGeocode, searchAddress } from "@/lib/mapbox";
import { useAuthStore } from "@/stores/auth.store";
import { Ionicons } from "@expo/vector-icons";
import Mapbox from "@rnmapbox/maps";
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
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MapPin } from "../ui/MapPin";

interface SetLocationProps {
  isEdit?: boolean;
  label?: string;
  isPending: boolean;
  initialLat: number;
  initialLng: number;
  onConfirm: (data: {
    label: string;
    formattedAddress: string;
    city?: string;
    state?: string;
    latitude: number;
    longitude: number;
  }) => void;
}

export default function SetLocationModalScreen({
  isEdit,
  label,
  isPending,
  initialLat,
  initialLng,
  onConfirm,
}: SetLocationProps) {
  const userLocation = useAuthStore((s) => s.userLocation);
  const tint = useThemeColor({}, "tint");
  const insets = useSafeAreaInsets();
  const cardBg = useThemeColor({}, "card");
  const textColor = useThemeColor({}, "text");
  const placeholderTextColor = useThemeColor({}, "placeholder");

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [lat, setLat] = useState(initialLat);
  const [lng, setLng] = useState(initialLng);

  const [cameraPos, setCameraPos] = useState<[number, number]>([
    initialLng,
    initialLat,
  ]);
  const [isDragging, setIsDragging] = useState(false);

  const [isGeocoding, setIsGeocoding] = useState(false);
  const [locationDetails, setLocationDetails] = useState<GeocodeResult>({
    formattedAddress: "",
    city: "",
    state: "",
  });

  // Sync Address with Coordinates
  useEffect(() => {
    const updateAddress = async () => {
      setIsGeocoding(true);
      try {
        const result = await reverseGeocode(lat, lng);
        setLocationDetails(result);
      } finally {
        setIsGeocoding(false);
      }
    };
    updateAddress();
  }, [lat, lng]);

  // Debounced Search Function
  const debouncedSearch = useCallback(
    debounce(async (text: string) => {
      if (text.length < 3) return;
      const places = await searchAddress(text);
      setResults(places);
    }, 500),
    [],
  );

  const handleSearch = (text: string) => {
    setQuery(text);
    debouncedSearch(text);
  };

  const selectPlace = (place: any) => {
    const [newLng, newLat] = place.center;
    setLat(newLat);
    setLng(newLng);
    setCameraPos([newLng, newLat]);
    setQuery(place.place_name);
    setResults([]);
  };

  const handleGetCurrentLocation = async () => {
    if (!userLocation) {
      return;
    }

    setLat(userLocation[1]);
    setLng(userLocation[0]);
    setCameraPos([userLocation[0], userLocation[1]]);
  };

  return (
    <>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <View style={{ flex: 1 }}>
          {/* FLOATING SEARCH BAR */}
          <View style={styles.floatingSearchContainer}>
            <View style={[styles.searchBar, { backgroundColor: cardBg }]}>
              <Ionicons name="search" size={20} color={placeholderTextColor} />
              <TextInput
                placeholder="Search for your street..."
                value={query}
                onChangeText={handleSearch}
                style={[styles.input, { color: textColor }]}
                placeholderTextColor={placeholderTextColor}
              />
              {query.length > 0 && (
                <TouchableOpacity onPress={() => setQuery("")}>
                  <Ionicons
                    name="close-circle"
                    size={18}
                    color={placeholderTextColor}
                  />
                </TouchableOpacity>
              )}
            </View>

            {/* RESULTS DROPDOWN */}
            {results.length > 0 && (
              <View
                style={[styles.resultsDropdown, { backgroundColor: cardBg }]}
              >
                <FlatList
                  data={results}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => (
                    <Pressable
                      style={styles.resultItem}
                      onPress={() => selectPlace(item)}
                    >
                      <Ionicons
                        name="location-outline"
                        size={18}
                        color={tint}
                      />
                      <ThemedText style={styles.resultText} numberOfLines={1}>
                        {item.place_name}
                      </ThemedText>
                    </Pressable>
                  )}
                />
              </View>
            )}
          </View>

          {/* MAPBOX */}
          <Mapbox.MapView
            style={{ flex: 1 }}
            logoEnabled={true}
            onPress={(feature: any) => {
              const [newLng, newLat] = feature.geometry.coordinates;
              setLat(newLat);
              setLng(newLng);
            }}
          >
            <Mapbox.Camera
              centerCoordinate={cameraPos}
              zoomLevel={15}
              animationDuration={1000}
            />

            <Mapbox.PointAnnotation
              id="pin"
              coordinate={[lng, lat]}
              draggable
              onDragStart={() => setIsDragging(true)}
              onDragEnd={(e) => {
                const [newLng, newLat] = e.geometry.coordinates;
                setLat(newLat);
                setLng(newLng);
                setIsDragging(false);
              }}
            >
              <MapPin tint={tint} isDragging={isDragging} />
            </Mapbox.PointAnnotation>
          </Mapbox.MapView>

          <TouchableOpacity
            style={[styles.locateBtn, { backgroundColor: cardBg }]}
            onPress={handleGetCurrentLocation}
          >
            <Ionicons name="locate" size={24} color={tint} />
          </TouchableOpacity>

          {/* BOTTOM SHEET INFO */}
          <View
            style={[
              styles.footer,
              {
                backgroundColor: cardBg,
                paddingBottom: insets.bottom > 0 ? insets.bottom : 20,
              },
            ]}
          >
            <View style={styles.addressContainer}>
              <Ionicons
                name="map-outline"
                size={20}
                color={tint}
                style={{ marginTop: 2 }}
              />
              <View style={{ flex: 1, marginLeft: 10 }}>
                <ThemedText
                  type="defaultSemiBold"
                  style={{
                    fontSize: 13,
                    color: tint,
                    textTransform: "uppercase",
                  }}
                >
                  CONFIRM {label} LOCATION
                </ThemedText>
                {isGeocoding ? (
                  <ActivityIndicator
                    size="small"
                    color={tint}
                    style={{ alignSelf: "flex-start" }}
                  />
                ) : (
                  <ThemedText numberOfLines={2} style={styles.addressText}>
                    {locationDetails.formattedAddress || "Locating..."}
                  </ThemedText>
                )}
              </View>
            </View>

            <ThemedButton
              title={isEdit ? "Update Location" : "Confirm Location"}
              loading={isPending}
              disabled={isPending}
              onPress={() =>
                onConfirm({
                  label: label || "Location",
                  formattedAddress: locationDetails.formattedAddress,
                  city: locationDetails.city,
                  state: locationDetails.state,
                  latitude: lat,
                  longitude: lng,
                })
              }
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  floatingSearchContainer: {
    position: "absolute",
    top: 5,
    left: 20,
    right: 20,
    zIndex: 10,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 15,
    paddingHorizontal: 15,
    height: 54,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  input: {
    flex: 1,
    fontSize: 16,
    marginLeft: 10,
  },

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
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#F0F0F0",
  },
  resultText: {
    marginLeft: 12,
    fontSize: 15,
  },

  footer: {
    padding: 14,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
  addressContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  addressText: {
    fontSize: 16,
    lineHeight: 22,
    marginTop: 4,
  },

  locateBtn: {
    position: "absolute",
    bottom: 180,
    right: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    zIndex: 10,
  },
});
