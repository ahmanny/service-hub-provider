import { getServicesForType, SERVICE_META } from "@/constants/services";
import { useThemeColor } from "@/hooks/use-theme-color";
import { BookingSetupInfo, ProviderWithServices } from "@/types/provider.types";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { StyleSheet, View } from "react-native";
import { ThemedText } from "../themed-text";

export function WaitingForProviderCard({
  provider,
  bookingSetup,
}: {
  provider: ProviderWithServices;
  bookingSetup: BookingSetupInfo;
}) {
  const muted = useThemeColor({}, "placeholder");
  const fallbackImage = require("../../assets/images/fallback-profile.png");
  const selectedServiceName = bookingSetup?.service
    ? getServicesForType(provider.serviceType).find(
        (s) => s.value === bookingSetup.service
      )?.name
    : null;

  return (
    <View style={styles.container}>
      {/* Header */}
      <ThemedText type="defaultSemiBold" style={styles.header}>
        Booking request sent
      </ThemedText>

      {/* Provider */}
      <Image
        source={
          provider.profilePicture
            ? { uri: provider.profilePicture }
            : fallbackImage
        }
        style={styles.avatar}
      />

      <ThemedText type="defaultSemiBold" style={styles.name}>
        {provider.firstName}
      </ThemedText>

      <ThemedText style={[styles.meta, { color: muted }]}>
        {SERVICE_META[provider.serviceType].label} • ⭐{" "}
        {provider.rating.toFixed(1)}
      </ThemedText>

      {/* Status */}
      <View style={styles.statusRow}>
        <Ionicons name="time-outline" size={18} color={muted} />
        <ThemedText style={[styles.statusText, { color: muted }]}>
          Waiting for provider to confirm…
        </ThemedText>
      </View>

      {/* Summary */}
      <View style={styles.summary}>
        <SummaryRow label="Service" value={`${selectedServiceName}`} />
        <SummaryRow
          label="Where"
          value={
            bookingSetup.locationType === "home"
              ? "Home service"
              : "Come to shop"
          }
        />
        <SummaryRow
          label="When"
          value={`${new Date(bookingSetup.bookingDateTime).toLocaleDateString(
            undefined,
            {
              weekday: "short",
              day: "numeric",
              month: "short",
            }
          )} • ${new Date(bookingSetup.bookingDateTime).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}`}
        />
      </View>
    </View>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  const muted = useThemeColor({}, "placeholder");

  return (
    <View style={styles.row}>
      <ThemedText style={[styles.rowLabel, { color: muted }]}>
        {label}
      </ThemedText>
      <ThemedText style={styles.rowValue}>{value}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // padding: 24,
    alignItems: "center",
    gap: 10,
  },

  header: {
    fontSize: 18,
    marginBottom: 12,
  },

  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    marginTop: 10,
    backgroundColor: "#eee",
  },

  name: {
    fontSize: 20,
    marginTop: 8,
  },

  meta: {
    fontSize: 14,
    marginBottom: 8,
  },

  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginVertical: 10,
  },

  statusText: {
    fontSize: 14,
  },

  summary: {
    width: "100%",
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderColor: "rgba(0,0,0,0.08)",
    gap: 10,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  rowLabel: {
    fontSize: 14,
  },

  rowValue: {
    fontSize: 14,
    fontWeight: "600",
  },
});
