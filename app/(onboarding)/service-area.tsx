import { ThemedButton, ThemedText, ThemedView } from "@/components/ui/Themed";
import { spacing } from "@/constants/Layout";
import { useThemeColor } from "@/hooks/use-theme-color";
import { reverseGeocode } from "@/lib/mapbox"; // Ensure this is imported
import { useAuthStore } from "@/stores/auth.store";
import { useOnboardingStore } from "@/stores/onboarding.store";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

export default function ServiceArea() {
  const router = useRouter();
  const { serviceArea, radiusKm, updateFields } = useOnboardingStore();
  const userLocation = useAuthStore((s) => s.userLocation);

  const [isInitializing, setIsInitializing] = useState(false);

  const tint = useThemeColor({}, "tint");
  const tintLight = useThemeColor({}, "tintLight");
  const textSecondary = useThemeColor({}, "textSecondary");
  const cardBg = useThemeColor({}, "card");
  const border = useThemeColor({}, "border");

  // Logic: Initial set if empty
  useEffect(() => {
    const initializeLocation = async () => {
      // Only trigger if we don't have a service area yet but we DO have user coordinates
      if (!serviceArea && userLocation) {
        setIsInitializing(true);
        try {
          const [lng, lat] = userLocation;
          const result = await reverseGeocode(lat, lng);

          updateFields({
            serviceArea: {
              formattedAddress: result.formattedAddress || "Current Location",
              center: { latitude: lat, longitude: lng },
            },
            radiusKm: radiusKm || 5, // Default to 5km if not set
          });
        } catch (error) {
          console.error("Failed to initialize service area:", error);
        } finally {
          setIsInitializing(false);
        }
      }
    };

    initializeLocation();
  }, [userLocation]);

  const onOpenMap = () => {
    router.push("/(onboarding)/set-coverage-modal");
  };

  const onNext = () => {
    router.push("/(onboarding)/availability");
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="title">Work Zone</ThemedText>
        <ThemedText style={[styles.subtitle, { color: textSecondary }]}>
          Where will you be providing your services?
        </ThemedText>
      </View>

      <View style={styles.content}>
        <View
          style={[
            styles.coverageCard,
            { backgroundColor: cardBg, borderColor: border },
          ]}
        >
          <View style={styles.cardHeader}>
            <View style={[styles.badge, { backgroundColor: `${tint}10` }]}>
              <Ionicons name="shield-checkmark" size={14} color={tint} />
              <ThemedText style={[styles.badgeText, { color: tint }]}>
                ACTIVE ZONE
              </ThemedText>
            </View>
            <TouchableOpacity onPress={onOpenMap} style={styles.editBtn}>
              <ThemedText style={[styles.editBtnText, { color: tint }]}>
                Adjust Map
              </ThemedText>
            </TouchableOpacity>
          </View>

          <View style={styles.locationInfo}>
            <ThemedText style={styles.addressLabel}>CENTERED AT</ThemedText>
            {isInitializing ? (
              <ActivityIndicator
                color={tint}
                style={{ alignSelf: "flex-start", marginTop: 4 }}
              />
            ) : (
              <ThemedText style={styles.addressText} numberOfLines={2}>
                {serviceArea?.formattedAddress || "No location set"}
              </ThemedText>
            )}
          </View>

          <View style={[styles.divider, { backgroundColor: border }]} />

          <View style={styles.radiusStats}>
            <View style={styles.statItem}>
              <ThemedText style={styles.statLabel}>RADIUS</ThemedText>
              <ThemedText style={[styles.statValue, { color: tint }]}>
                {radiusKm || 0} km
              </ThemedText>
            </View>
            <View style={[styles.statDivider, { backgroundColor: border }]} />
            <View style={styles.statItem}>
              <ThemedText style={styles.statLabel}>COVERAGE</ThemedText>
              <ThemedText style={styles.statValue}>
                {radiusKm > 10 ? "Regional" : "Local"}
              </ThemedText>
            </View>
          </View>

          <View style={styles.gaugeContainer}>
            <View style={[styles.gaugeBase, { backgroundColor: border }]}>
              <View
                style={[
                  styles.gaugeFill,
                  {
                    backgroundColor: tint,
                    width: `${((radiusKm || 0) / 20) * 100}%`,
                  },
                ]}
              />
            </View>
            <View style={styles.gaugeLabels}>
              <ThemedText style={styles.gaugeTip}>2km</ThemedText>
              <ThemedText style={styles.gaugeTip}>20km</ThemedText>
            </View>
          </View>
        </View>

        <TouchableOpacity onPress={onOpenMap} style={styles.mapPreviewTrigger}>
          <View style={[styles.iconCircle, { backgroundColor: tintLight }]}>
            <Ionicons name="map" size={24} color={"#fff"} />
          </View>
          <View style={{ flex: 1 }}>
            <ThemedText type="defaultSemiBold">Interactive Map View</ThemedText>
            <ThemedText style={{ color: textSecondary, fontSize: 13 }}>
              Visualize your reach and boundaries
            </ThemedText>
          </View>
          <Ionicons name="chevron-forward" size={20} color={textSecondary} />
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <ThemedButton
          title="CONFIRM & CONTINUE"
          onPress={onNext}
          disabled={!serviceArea || isInitializing}
        />
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: spacing.lg },
  header: { marginTop: 10, marginBottom: 32 },
  subtitle: { fontSize: 16, marginTop: 4, opacity: 0.8 },

  content: { flex: 1 },
  coverageCard: {
    padding: 24,
    borderRadius: 32,
    borderWidth: 1.5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 8,
    gap: 4,
  },
  badgeText: { fontSize: 10, fontWeight: "900", letterSpacing: 1 },

  editBtn: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  editBtnText: {
    fontSize: 14,
    fontWeight: "700",
    textTransform: "none",
  },

  locationInfo: { marginBottom: 20 },
  addressLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#999",
    letterSpacing: 1,
    marginBottom: 4,
  },
  addressText: { fontSize: 18, fontWeight: "800", lineHeight: 26 },

  divider: { height: 1, width: "100%", marginBottom: 20 },

  radiusStats: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  statItem: { flex: 1 },
  statLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#999",
    letterSpacing: 1,
    marginBottom: 4,
  },
  statValue: { fontSize: 20, fontWeight: "800" },
  statDivider: { width: 1, height: "100%", marginHorizontal: 20 },

  gaugeContainer: { marginTop: 10 },
  gaugeBase: { height: 8, borderRadius: 4, width: "100%", overflow: "hidden" },
  gaugeFill: { height: "100%", borderRadius: 4 },
  gaugeLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
  },
  gaugeTip: { fontSize: 10, color: "#999", fontWeight: "600" },

  mapPreviewTrigger: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 24,
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "transparent", // Subtle feel
    backgroundColor: "rgba(0,0,0,0.02)",
    gap: 16,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },

  footer: { paddingBottom: 40, paddingTop: 20 },
});
