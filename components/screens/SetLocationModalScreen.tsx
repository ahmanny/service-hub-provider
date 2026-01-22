import { ThemedButton, ThemedText } from "@/components/ui/Themed";
import { useThemeColor } from "@/hooks/use-theme-color";
import { reverseGeocode, searchAddress } from "@/lib/mapbox";
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

interface SetLocationProps {
  isEdit?: boolean;
  label?: string;
  isPending: boolean;
  initialLat: number;
  initialLng: number;
  onConfirm: (data: {
    label: string;
    formattedAddress: string;
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
  const tint = useThemeColor({}, "tint");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [lat, setLat] = useState(initialLat);
  const [lng, setLng] = useState(initialLng);
  const [address, setAddress] = useState("");
  const [isGeocoding, setIsGeocoding] = useState(false);

  // Sync Address with Coordinates
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

  // Debounced Search Function
  const debouncedSearch = useCallback(
    debounce(async (text: string) => {
      if (text.length < 3) return;
      const places = await searchAddress(text);
      setResults(places);
    }, 500),
    []
  );

  const handleSearch = (text: string) => {
    setQuery(text);
    debouncedSearch(text);
  };

  const selectPlace = (place: any) => {
    const [newLng, newLat] = place.center;
    setLat(newLat);
    setLng(newLng);
    setQuery(place.place_name);
    setResults([]);
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
            <View style={styles.searchBar}>
              <Ionicons name="search" size={20} color="#999" />
              <TextInput
                placeholder="Search for your street..."
                value={query}
                onChangeText={handleSearch}
                style={styles.input}
                placeholderTextColor="#999"
              />
              {query.length > 0 && (
                <TouchableOpacity onPress={() => setQuery("")}>
                  <Ionicons name="close-circle" size={18} color="#999" />
                </TouchableOpacity>
              )}
            </View>

            {/* RESULTS DROPDOWN */}
            {results.length > 0 && (
              <View style={styles.resultsDropdown}>
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
              centerCoordinate={[lng, lat]}
              zoomLevel={15}
              animationDuration={1000}
            />

            <Mapbox.PointAnnotation
              id="pin"
              coordinate={[lng, lat]}
              draggable
              onDragEnd={(e) => {
                const [newLng, newLat] = e.geometry.coordinates;
                setLat(newLat);
                setLng(newLng);
              }}
            >
              <View style={styles.pinShadow}>
                <View style={[styles.pinCircle, { backgroundColor: tint }]}>
                  <View style={styles.pinInner} />
                </View>
              </View>
            </Mapbox.PointAnnotation>
          </Mapbox.MapView>

          {/* BOTTOM SHEET INFO */}
          <View style={styles.footer}>
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
                  style={{ fontSize: 13, color: tint }}
                >
                  CONFIRM HOME LOCATION
                </ThemedText>
                {isGeocoding ? (
                  <ActivityIndicator
                    size="small"
                    color={tint}
                    style={{ alignSelf: "flex-start" }}
                  />
                ) : (
                  <ThemedText numberOfLines={2} style={styles.addressText}>
                    {address || "Locating..."}
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
                  label: "Home",
                  formattedAddress: address,
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
  // 1. FLOATING SEARCH SECTION
  floatingSearchContainer: {
    position: "absolute",
    top: Platform.OS === "ios" ? 60 : 20, // Adjust for status bar
    left: 20,
    right: 20,
    zIndex: 10,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    paddingHorizontal: 15,
    height: 54,
    // Shadow for iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    // Elevation for Android
    elevation: 5,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    marginLeft: 10,
    height: "100%",
  },

  // 2. SEARCH RESULTS DROPDOWN
  resultsDropdown: {
    backgroundColor: "#FFFFFF",
    marginTop: 8,
    borderRadius: 15,
    maxHeight: 250,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
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
    color: "#444",
  },

  // 3. MAP PIN UI
  pinShadow: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  pinCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 3,
    borderColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    // Shadow to make pin pop
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 4,
  },
  pinInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#FFFFFF",
  },

  // 4. FOOTER PANEL
  footer: {
    backgroundColor: "#FFFFFF",
    padding: 24,
    paddingBottom: Platform.OS === "ios" ? 40 : 24, // Safe area for home indicator
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
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
    color: "#333",
  },
  confirmBtn: {
    height: 56,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  confirmText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
});
