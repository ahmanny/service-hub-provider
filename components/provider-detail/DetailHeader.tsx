import { SERVICE_META } from "@/constants/services";
import { useThemeColor } from "@/hooks/use-theme-color";
import { IProviderProfile } from "@/types/provider.types";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, View } from "react-native";
import { AppAvatar } from "../ui/AppAvatar";
import { ThemedText } from "../ui/Themed";
import ThemedCard from "../ui/Themed/ThemedCard";

export default function DetailHeader({ data }: { data: IProviderProfile }) {
  const fallbackImage = require("../../assets/images/fallback-profile.png");
  const avatarSource = data.profilePicture
    ? { uri: data.profilePicture }
    : fallbackImage;

  const tint = useThemeColor({}, "tint");
  const categoryColor = useThemeColor({}, "buttonSecondary");

  return (
    <View style={styles.container}>
      <View style={styles.avatarContainer}>
        <AppAvatar source={avatarSource} size={110} />
      </View>

      {/* Name and Category Badge Row */}
      <View style={styles.nameRow}>
        <ThemedText style={styles.name}>{data.firstName}</ThemedText>
        <View style={[styles.categoryBadge, { backgroundColor: tint + 10 }]}>
          <ThemedText style={[styles.categoryText, { color: tint }]}>
            {SERVICE_META[data.serviceType].label}
          </ThemedText>
        </View>
      </View>

      <View style={styles.ratingRow}>
        <Ionicons name="star" size={14} color="#FFD700" />
        <ThemedText style={styles.ratingText}>
          {data.rating.toFixed(1)}
          <ThemedText style={styles.reviewCount}>
            {" "}
            ({data.reviewCount ?? 0} reviews)
          </ThemedText>
        </ThemedText>
      </View>

      {/* Replaced Emoji with Ionicons */}
      <View style={styles.locationRow}>
        <Ionicons name="location-sharp" size={14} color="#666" />
        <ThemedText style={styles.locationText}>
          {data.shopAddress?.city}, {data.shopAddress?.state}
          {data.distance ? ` • ${data.distance.toFixed(1)} km away` : ""}
        </ThemedText>
      </View>

      <View style={styles.badgeRow}>
        {data.isVerified && (
          <ThemedCard style={styles.badge}>
            <Ionicons name="shield-checkmark" size={14} color="#4CAF50" />
            <ThemedText style={styles.badgeText}>Verified</ThemedText>
          </ThemedCard>
        )}
        {data.yearsOfExperience && (
          <ThemedCard style={styles.badge}>
            <Ionicons name="briefcase-outline" size={14} color="#666" />
            <ThemedText style={styles.badgeText}>
              {data.yearsOfExperience}+ years
            </ThemedText>
          </ThemedCard>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: "center", paddingVertical: 24 },
  avatarContainer: { marginBottom: 16 },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 6,
  },
  name: { fontSize: 26, fontWeight: "800" },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 8,
  },
  ratingText: { fontWeight: "700", fontSize: 14 },
  reviewCount: { fontWeight: "400", opacity: 0.6 },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  locationText: { fontSize: 14, opacity: 0.5, fontWeight: "500" },
  badgeRow: { flexDirection: "row", gap: 8, marginTop: 20 },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  badgeText: { fontSize: 13, fontWeight: "600" },
});
