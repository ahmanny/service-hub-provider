import { getServicesForType, SERVICE_META } from "@/constants/services";
import { useThemeColor } from "@/hooks/use-theme-color";
import { formatNumber } from "@/lib/utils";
import { BookingSetupInfo, ProviderSearchResult } from "@/types/provider.types";
import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { StyleSheet, View } from "react-native";
import { ThemedText, ThemedView } from "../ui/Themed";

export function BookingCard({
  provider,
  bookingSetup,
}: {
  provider: ProviderSearchResult;
  bookingSetup: BookingSetupInfo | null;
}) {
  const fallbackImage = require("../../assets/images/fallback-profile.png");
  const metaColor = useThemeColor({}, "placeholder");
  const textColor = useThemeColor({}, "text");

  const selectedServiceName = bookingSetup?.service
    ? getServicesForType(provider.serviceType).find(
        (s) => s.value === bookingSetup.service
      )?.name
    : null;

  return (
    <ThemedView style={styles.container}>
      {/* PROVIDER HEADER */}
      <View style={styles.header}>
        <Image
          source={
            provider.profilePicture
              ? { uri: provider.profilePicture }
              : fallbackImage
          }
          style={styles.profileImage}
        />

        <View style={styles.info}>
          <View style={styles.nameRow}>
            <View>
              <ThemedText style={styles.name}>{provider.firstName}</ThemedText>
              <ThemedText style={styles.serviceType}>
                {SERVICE_META[provider.serviceType].label}
              </ThemedText>
            </View>

            <ThemedText style={styles.price}>
              ₦{formatNumber(provider.price ?? "---")}
            </ThemedText>
          </View>

          {/* META */}
          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Ionicons name="star" size={14} color="#F5A623" />
              <ThemedText style={styles.metaText}>
                {provider.rating.toFixed(1)}
              </ThemedText>
            </View>

            <View style={styles.metaItem}>
              <MaterialCommunityIcons
                name="map-marker-distance"
                size={14}
                color={metaColor}
              />
              <ThemedText style={styles.metaText}>
                {provider.distance} km
              </ThemedText>
            </View>

            <View style={styles.metaItem}>
              <Feather name="clock" size={14} color={metaColor} />
              <ThemedText style={styles.metaText}>
                {provider.duration} mins
              </ThemedText>
            </View>
          </View>
        </View>
      </View>

      {/* BOOKING SUMMARY */}
      {bookingSetup && (
        <>
          <View style={styles.divider} />

          <View style={styles.summary}>
            {/* SERVICE */}
            <View style={styles.summaryRow}>
              <Ionicons name="pricetag-outline" size={18} color={textColor} />
              <ThemedText style={styles.summaryPrimary}>
                {selectedServiceName ?? "Select service"} • ₦
                {formatNumber(provider.price ?? "---")}
              </ThemedText>
            </View>

            {/* LOCATION */}
            {bookingSetup.locationType && (
              <View style={styles.summaryRow}>
                <MaterialCommunityIcons
                  name={
                    bookingSetup.locationType === "home"
                      ? "home-outline"
                      : "storefront-outline"
                  }
                  size={18}
                  color={metaColor}
                />
                <ThemedText style={styles.summarySecondary}>
                  {bookingSetup.locationType === "home"
                    ? "Home service"
                    : "Come to shop"}
                </ThemedText>
              </View>
            )}

            {/* DATE & TIME */}
            <View style={styles.summaryRow}>
              <Ionicons name="calendar-outline" size={18} color={metaColor} />
              <ThemedText style={styles.summarySecondary}>
                {new Date(bookingSetup.bookingDateTime).toLocaleDateString(
                  undefined,
                  {
                    weekday: "short",
                    day: "numeric",
                    month: "short",
                  }
                )}{" "}
                •{" "}
                {new Date(bookingSetup.bookingDateTime).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </ThemedText>
            </View>
          </View>
        </>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    padding: 14,
    marginBottom: 14,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },

  header: {
    flexDirection: "row",
    gap: 14,
  },

  profileImage: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: "#eee",
  },

  info: {
    flex: 1,
    justifyContent: "center",
  },

  nameRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },

  name: {
    fontSize: 18,
    fontWeight: "700",
  },

  serviceType: {
    fontSize: 13,
    color: "#0BB45E",
    marginTop: 2,
  },

  price: {
    fontSize: 18,
    fontWeight: "800",
  },

  metaRow: {
    flexDirection: "row",
    gap: 14,
    marginTop: 6,
  },

  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  metaText: {
    fontSize: 13,
    color: "#666",
  },

  divider: {
    height: 1,
    backgroundColor: "rgba(0,0,0,0.06)",
    marginVertical: 12,
  },

  summary: {
    gap: 8,
  },

  summaryRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  summaryPrimary: {
    fontSize: 15,
    fontWeight: "600",
  },

  summarySecondary: {
    fontSize: 14,
    color: "#666",
  },
});
