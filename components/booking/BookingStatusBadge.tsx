import { useThemeColor } from "@/hooks/use-theme-color";
import { getBookingStatusConfig } from "@/lib/utils/booking.utils";
import { StyleSheet, View } from "react-native";
import { ThemedText } from "../ui/Themed";

export function BookingStatusBadge({ status }: { status: string }) {
  const colors = {
    tint: useThemeColor({}, "tint"),
    success: useThemeColor({}, "success"),
    danger: useThemeColor({}, "danger"),
    border: useThemeColor({}, "border"),
    warning: useThemeColor({}, "warning"),
    textSecondary: useThemeColor({}, "textSecondary"),
  };

  const config = getBookingStatusConfig(status, colors);

  return (
    <View style={[styles.badge, { backgroundColor: `${config.color}15` }]}>
      <View style={[styles.dot, { backgroundColor: config.color }]} />
      <ThemedText style={[styles.text, { color: config.color }]}>
        {config.label}
      </ThemedText>
    </View>
  );
}
const styles = StyleSheet.create({
  badge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 6,
  },
  dot: { width: 6, height: 6, borderRadius: 3 },
  text: { fontSize: 12, fontWeight: "800", textTransform: "uppercase" },
});
