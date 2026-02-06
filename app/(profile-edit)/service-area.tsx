import { ThemedText, ThemedView } from "@/components/ui/Themed";
import { spacing } from "@/constants/Layout";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useAuthStore } from "@/stores/auth.store";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

export default function ServiceAreaEditScreen() {
  const router = useRouter();
  const profile = useAuthStore((s) => s.user);

  const tint = useThemeColor({}, "tint");
  const textSecondary = useThemeColor({}, "textSecondary");
  const border = useThemeColor({}, "border");
  const cardBg = useThemeColor({}, "card");

  if (!profile) return null;

  const radiusKm = profile.serviceArea?.radiusKm || 5;

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen options={{ title: "Work Zone" }} />

      <View style={styles.header}>
        <ThemedText type="title">Service Area</ThemedText>
        <ThemedText style={{ color: textSecondary }}>
          Define the radius where you are willing to travel for clients.
        </ThemedText>
      </View>

      <View
        style={[
          styles.coverageCard,
          { backgroundColor: cardBg, borderColor: border },
        ]}
      >
        <View style={styles.locationInfo}>
          <ThemedText style={styles.addressLabel}>CURRENT CENTER</ThemedText>
          <ThemedText style={styles.addressText}>
            {profile.serviceArea?.address || "Not set"}
          </ThemedText>
        </View>

        <View style={[styles.divider, { backgroundColor: border }]} />

        <View style={styles.radiusStats}>
          <View style={styles.statItem}>
            <ThemedText style={styles.statLabel}>RADIUS</ThemedText>
            <ThemedText style={[styles.statValue, { color: tint }]}>
              {radiusKm} km
            </ThemedText>
          </View>
          <View style={styles.statItem}>
            <ThemedText style={styles.statLabel}>TYPE</ThemedText>
            <ThemedText style={styles.statValue}>
              {radiusKm > 10 ? "Regional" : "Local"}
            </ThemedText>
          </View>
        </View>

        {/* Gauge visualization reused from your design */}
        <View style={styles.gaugeBase}>
          <View
            style={[
              styles.gaugeFill,
              { backgroundColor: tint, width: `${(radiusKm / 20) * 100}%` },
            ]}
          />
        </View>
      </View>

      <TouchableOpacity
        style={[styles.mapTrigger, { backgroundColor: `${tint}10` }]}
        onPress={() => router.push("/(profile-edit)/set-coverage-modal")}
      >
        <Ionicons name="map" size={24} color={tint} />
        <View style={{ flex: 1, marginLeft: 12 }}>
          <ThemedText type="defaultSemiBold">Adjust Coverage</ThemedText>
          <ThemedText style={{ color: textSecondary, fontSize: 13 }}>
            Change your center point or radius
          </ThemedText>
        </View>
        <Ionicons name="chevron-forward" size={20} color={tint} />
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: spacing.lg },
  header: { marginBottom: 32 },
  coverageCard: { padding: 24, borderRadius: 24, borderWidth: 1 },
  locationInfo: { marginBottom: 20 },
  addressLabel: {
    fontSize: 10,
    fontWeight: "800",
    color: "#999",
    letterSpacing: 1,
  },
  addressText: { fontSize: 18, fontWeight: "700", marginTop: 4 },
  divider: { height: 1, marginVertical: 20 },
  radiusStats: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  statItem: { flex: 1 },
  statLabel: { fontSize: 10, fontWeight: "800", color: "#999" },
  statValue: { fontSize: 20, fontWeight: "800" },
  gaugeBase: {
    height: 6,
    backgroundColor: "#eee",
    borderRadius: 3,
    overflow: "hidden",
  },
  gaugeFill: { height: "100%" },
  mapTrigger: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    borderRadius: 20,
    marginTop: 24,
  },
});
