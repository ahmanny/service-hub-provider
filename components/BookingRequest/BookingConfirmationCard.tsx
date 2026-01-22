import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { StyleSheet, View } from "react-native";

import { getServicesForType, SERVICE_META } from "@/constants/services";
import { useThemeColor } from "@/hooks/use-theme-color";
import { formatNumber } from "@/lib/utils";
import { BookingSetupInfo, ProviderSearchResult } from "@/types/provider.types";
import { BottomSheetTextInput } from "@gorhom/bottom-sheet";
import { ThemedText } from "../ui/Themed";

export function BookingConfirmationCard({
  provider,
  bookingSetup,
  onNoteChange,
}: {
  provider: ProviderSearchResult;
  bookingSetup: BookingSetupInfo;
  onNoteChange?: (note: string) => void;
}) {
  const fallbackImage = require("../../assets/images/fallback-profile.png");
  const muted = useThemeColor({}, "placeholder");
  const textColor = useThemeColor({}, "text");
  const border = useThemeColor({}, "border");
  const tint = useThemeColor({}, "tint");

  const selectedServiceName = getServicesForType(provider.serviceType).find(
    (s) => s.value === bookingSetup.service
  )?.name;

  // Calculate Fees
  const basePrice = provider.price ?? 0;
  const homeFee =
    bookingSetup.locationType === "home"
      ? provider.homeServiceFee ?? 2000
      : 1000;
  const totalPrice = basePrice + homeFee;

  return (
    <View style={styles.container}>
      {/* PROVIDER HEADER */}
      <View style={styles.header}>
        <Image
          source={
            provider.profilePicture
              ? { uri: provider.profilePicture }
              : fallbackImage
          }
          style={styles.avatar}
          contentFit="cover"
          transition={200}
        />
        <View style={{ flex: 1 }}>
          <ThemedText style={styles.name}>{provider.firstName}</ThemedText>
          <ThemedText style={[styles.serviceType, { color: tint }]}>
            {SERVICE_META[provider.serviceType].label}
          </ThemedText>
        </View>
        <View style={{ alignItems: "flex-end" }}>
          <ThemedText style={styles.totalLabel}>Total</ThemedText>
          <ThemedText style={[styles.price, { color: tint }]}>
            ₦{formatNumber(totalPrice)}
          </ThemedText>
        </View>
      </View>

      <View
        style={[styles.divider, { backgroundColor: border, opacity: 0.3 }]}
      />

      {/* DETAILS GRID */}
      <View style={styles.summaryGrid}>
        <DetailItem
          icon={<Ionicons name="calendar-outline" size={18} color={tint} />}
          label="Date & Time"
          value={`${new Date(bookingSetup.bookingDateTime).toLocaleDateString(
            [],
            { day: "numeric", month: "short" }
          )} • ${new Date(bookingSetup.bookingDateTime).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}`}
        />
        <DetailItem
          icon={<Ionicons name="location-outline" size={18} color={tint} />}
          label="Location"
          value={
            bookingSetup.locationType === "home"
              ? bookingSetup.addressText || "Home Service"
              : "Provider Shop"
          }
        />
      </View>

      {/* PRICE BREAKDOWN PILLS */}
      <View style={styles.pricePills}>
        <View style={[styles.pill, { backgroundColor: border + "20" }]}>
          <ThemedText style={styles.pillText}>
            Service: ₦{formatNumber(basePrice)}
          </ThemedText>
        </View>
        {homeFee > 0 && (
          <View style={[styles.pill, { backgroundColor: "#FFB80020" }]}>
            <ThemedText style={[styles.pillText, { color: "#B88600" }]}>
              Home Fee: ₦{formatNumber(homeFee)}
            </ThemedText>
          </View>
        )}
      </View>

      {/* NOTE INPUT */}
      <View style={styles.noteContainer}>
        <ThemedText style={styles.noteLabel}>
          Instructions for {provider.firstName}
        </ThemedText>
        <BottomSheetTextInput
          placeholder="e.g. Please bring extra towels..."
          onChangeText={onNoteChange}
          style={[styles.input, { borderColor: border, color: textColor }]}
          placeholderTextColor={muted}
          multiline
        />
      </View>
    </View>
  );
}

// Sub-component for clean layout
function DetailItem({
  icon,
  label,
  value,
}: {
  icon: any;
  label: string;
  value: string;
}) {
  return (
    <View style={styles.detailItem}>
      <View style={styles.iconCircle}>{icon}</View>
      <View>
        <ThemedText style={styles.detailLabel}>{label}</ThemedText>
        <ThemedText style={styles.detailValue} numberOfLines={1}>
          {value}
        </ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 16 },
  header: { flexDirection: "row", alignItems: "center", gap: 12 },
  avatar: { width: 54, height: 54, borderRadius: 16, backgroundColor: "#eee" },
  name: { fontSize: 17, fontWeight: "700" },
  serviceType: {
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  totalLabel: {
    fontSize: 10,
    fontWeight: "700",
    opacity: 0.5,
    textTransform: "uppercase",
  },
  price: { fontSize: 20, fontWeight: "800" },
  divider: { height: 1, marginVertical: 4 },
  summaryGrid: { gap: 12 },
  detailItem: { flexDirection: "row", alignItems: "center", gap: 10 },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "rgba(11, 180, 94, 0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  detailLabel: { fontSize: 11, fontWeight: "600", opacity: 0.5 },
  detailValue: { fontSize: 14, fontWeight: "600" },
  pricePills: { flexDirection: "row", gap: 8 },
  pill: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 },
  pillText: { fontSize: 12, fontWeight: "700" },
  noteContainer: { marginTop: 4 },
  noteLabel: {
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 6,
    marginLeft: 4,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    height: 80,
    padding: 12,
    textAlignVertical: "top",
    fontSize: 14,
  },
});
