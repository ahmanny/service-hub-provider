import { useThemeColor } from "@/hooks/use-theme-color";
import { formatNumber } from "@/lib/utils";
import { ProviderSearchResult } from "@/types/provider.types";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import ThemedCard from "../ui/Themed/ThemedCard";

export default function ProviderResultCard({
  item,
  onPress,
  selected,
}: {
  item: ProviderSearchResult;
  onPress: () => void;
  selected: boolean;
}) {
  const textColor = useThemeColor({}, "text");
  const muted = useThemeColor({}, "placeholder");

  const fallbackImage = require("../../assets/images/fallback-profile.png");

  return (
    <TouchableOpacity activeOpacity={0.7} onPress={onPress}>
      <ThemedCard style={[styles.card, selected && styles.selectedCard]}>
        <Image
          source={
            item.profilePicture ? { uri: item.profilePicture } : fallbackImage
          }
          style={styles.profileImage}
        />

        <View style={styles.content}>
          {/* Top row */}
          <View style={styles.topRow}>
            <Text style={[styles.name, { color: textColor }]}>
              {item.firstName}
            </Text>

            <View style={styles.rating}>
              {item.isClosest && (
                <View style={styles.closestTag}>
                  <Text style={styles.closestText}>Closest</Text>
                </View>
              )}
            </View>
          </View>

          {/* Middle row */}
          <View style={styles.middleRow}>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 14 }}
            >
              <View style={styles.rating}>
                <Ionicons name="star" style={styles.star} />
                <Text style={[styles.ratingText, { color: textColor }]}>
                  {item.rating.toFixed(1)}
                </Text>
              </View>
              <Text style={[styles.metaText, { color: muted }]}>
                {item.distance} km • {item.duration} mins away
              </Text>
            </View>
            {/* Price */}
            <Text style={[styles.price, { color: textColor }]}>
              ₦ {item.price ? formatNumber(item.price) : "3,000"}
            </Text>

            {/* Commented out availability mode for now */}
            {/*
            <View
              style={[
                styles.availabilityBadge,
                item.availabilityMode === "instant"
                  ? styles.instant
                  : styles.scheduled,
              ]}
            >
              <Text
                style={[
                  styles.availabilityText,
                  {
                    color:
                      item.availabilityMode === "instant"
                        ? "#0BB45E"
                        : "#C47A00",
                  },
                ]}
              >
                {item.availabilityMode === "instant"
                  ? "Available now"
                  : "Reservations only"}
              </Text>
            </View>
            */}
          </View>
        </View>
      </ThemedCard>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    padding: 16,
    borderRadius: 20,
    alignItems: "center",
    marginBottom: 14,
  },

  selectedCard: {
    borderWidth: 2,
    borderColor: "#0BB45E",
  },

  profileImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 14,
    backgroundColor: "#ddd",
  },

  content: {
    flex: 1,
    gap: 6,
  },

  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  name: {
    fontSize: 16,
    fontWeight: "600",
  },

  rating: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  star: {
    color: "#F5A623",
    fontSize: 14,
  },

  ratingText: {
    fontSize: 15,
    fontWeight: "500",
  },

  middleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  metaText: {
    fontSize: 13,
  },
  availabilityBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
  },

  instant: {
    backgroundColor: "rgba(11, 180, 94, 0.12)",
    borderColor: "rgba(11, 180, 94, 0.35)",
  },

  scheduled: {
    backgroundColor: "rgba(245, 166, 35, 0.12)",
    borderColor: "rgba(245, 166, 35, 0.35)",
  },

  availabilityText: {
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 0.3,
    color: "#0BB45E",
  },

  price: {
    fontSize: 16,
    fontWeight: "800",
    marginTop: 2,
  },

  closestTag: {
    backgroundColor: "#0BB45E",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginRight: 4,
  },

  closestText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "600",
  },
});
