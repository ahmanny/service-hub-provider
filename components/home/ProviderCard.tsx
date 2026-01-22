import { SERVICE_META, ServiceType } from "@/constants/services";
import { useThemeColor } from "@/hooks/use-theme-color";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, Pressable, StyleSheet, View, ViewStyle } from "react-native";
import { ThemedText } from "../ui/Themed";

interface ProviderCardProps {
  name: string;
  category: ServiceType;
  rating: number;
  price: string;
  image: string;
  distance?: number | null; // Value from backend
  distanceUnit?: string; // Unit from backend (e.g., "km" or "m")
  isInstant?: boolean; // For the availabilityMode === 'instant'
  onPress: () => void;
  style?: ViewStyle;
}

export default function ProviderCard({
  name,
  category,
  rating,
  price,
  image,
  distance,
  distanceUnit = "km",
  isInstant,
  onPress,
  style,
}: ProviderCardProps) {
  const cardBg = useThemeColor({}, "card");
  const muted = useThemeColor({}, "placeholder");
  const success = "#22C55E";

  return (
    <Pressable
      style={[styles.container, { backgroundColor: cardBg }, style]}
      onPress={onPress}
    >
      <View>
        <Image source={{ uri: image }} style={styles.image} />
        {/* Instant Badge Overlay */}
        {isInstant && (
          <View style={styles.instantBadge}>
            <View style={[styles.pulseDot, { backgroundColor: success }]} />
            <ThemedText style={styles.instantText}>INSTANT</ThemedText>
          </View>
        )}
      </View>

      <View style={styles.info}>
        <ThemedText type="defaultSemiBold" numberOfLines={1}>
          {name}
        </ThemedText>

        <ThemedText style={[styles.category, { color: muted }]}>
          {SERVICE_META[category].label}
        </ThemedText>

        <View style={styles.footer}>
          <View style={styles.ratingRow}>
            <Ionicons name="star" size={14} color="#FFCC00" />
            <ThemedText style={styles.ratingText}>{rating}</ThemedText>

            {distance !== null && distance !== undefined && (
              <>
                <ThemedText style={[styles.dotSeparator, { color: muted }]}>
                  •
                </ThemedText>
                <ThemedText style={[styles.distanceSubtext, { color: muted }]}>
                  {distance}
                  {distanceUnit}
                </ThemedText>
              </>
            )}
          </View>

          <View style={styles.priceWrapper}>
            <ThemedText style={[styles.fromLabel, { color: muted }]}>
              Base
            </ThemedText>
            <ThemedText type="defaultSemiBold" style={styles.priceText}>
              {price}
            </ThemedText>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 180,
    borderRadius: 16,
    overflow: "hidden",
    marginRight: 16,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(0,0,0,0.05)",
  },
  image: {
    width: "100%",
    height: 125,
    backgroundColor: "#f0f0f0",
  },
  instantBadge: {
    position: "absolute",
    bottom: 8,
    left: 8,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 4,
  },
  instantText: {
    fontSize: 9,
    fontWeight: "800",
    color: "#000",
    letterSpacing: 0.2,
  },
  info: {
    padding: 12,
  },
  category: {
    fontSize: 12,
    marginTop: 2,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    fontSize: 12,
    fontWeight: "600",
    marginLeft: 4,
  },
  dotSeparator: {
    marginHorizontal: 4,
    fontSize: 12,
  },
  distanceSubtext: {
    fontSize: 11,
    fontWeight: "500",
  },
  priceWrapper: {
    alignItems: "flex-end",
  },
  fromLabel: {
    fontSize: 9,
    textTransform: "uppercase",
    fontWeight: "600",
    marginBottom: -2,
  },
  priceText: {
    fontSize: 15,
    color: "#22C55E",
  },
});
