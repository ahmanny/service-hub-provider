import { ThemedText } from "@/components/ui/Themed";
import { useThemeColor } from "@/hooks/use-theme-color";
import { formatNumber } from "@/lib/utils";
import { getBookingStatusConfig } from "@/lib/utils/booking.utils";
import { BookingListItem } from "@/types/booking.types";
import { Ionicons } from "@expo/vector-icons";
import { format } from "date-fns";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { AppAvatar } from "../ui/AppAvatar";

dayjs.extend(duration);

interface PastBookingCardProps {
  item: BookingListItem;
  onPress?: () => void;
}

export function PastBookingCard({ item, onPress }: PastBookingCardProps) {
  const cardBg = useThemeColor({}, "card");
  const border = useThemeColor({}, "border");
  const textSecondary = useThemeColor({}, "textSecondary");
  const tint = useThemeColor({}, "tint");
  const success = useThemeColor({}, "success");
  const danger = useThemeColor({}, "danger");
  const warning = useThemeColor({}, "warning");

  const statusConfig = getBookingStatusConfig(item.status, {
    tint,
    success,
    danger,
    border,
    textSecondary,
    warning,
  });

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: cardBg,
          borderColor: border,
          opacity: pressed ? 0.9 : 1,
        },
      ]}
    >
      {/* HEADER SECTION */}
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <ThemedText style={styles.serviceName}>{item.serviceName}</ThemedText>
          {/* Subtle creation date under service name */}
          <ThemedText style={[styles.createdDate, { color: textSecondary }]}>
            {format(new Date(item.createdAt), "d MMM, H:mm")}
          </ThemedText>
        </View>
        <ThemedText style={styles.price}>
          ₦{formatNumber(item.price)}
        </ThemedText>
      </View>

      {/* BODY SECTION */}
      <View style={styles.detailsContainer}>
        <View style={styles.infoRow}>
          <Ionicons
            name={
              item.status === "completed"
                ? "checkmark-done-circle"
                : "close-circle-outline"
            }
            size={16}
            color={statusConfig.color}
          />
          <ThemedText style={[styles.infoText, { color: textSecondary }]}>
            {item.status === "completed" ? "Completed on " : "Ended on "}
            {format(new Date(item.updatedAt || item.scheduledAt), "EEE do MMM")}
          </ThemedText>
        </View>
      </View>

      <View style={[styles.divider, { backgroundColor: border }]} />

      {/* FOOTER SECTION */}
      <View style={styles.footer}>
        <View style={styles.consumerInfo}>
          <AppAvatar
            source={
              item.consumer.profilePicture
                ? { uri: item.consumer.profilePicture }
                : null
            }
            initials={item.consumer.firstName}
            size={28}
            shape="rounded"
          />
          <ThemedText style={[styles.consumerName, { color: textSecondary }]}>
            {item.consumer.firstName}
          </ThemedText>
        </View>

        <View
          style={[
            styles.statusBadge,
            { backgroundColor: `${statusConfig.color}15` },
          ]}
        >
          <ThemedText
            style={[styles.statusText, { color: statusConfig.color }]}
          >
            {statusConfig.label}
          </ThemedText>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 14,
  },
  serviceName: { fontSize: 16, fontWeight: "800", lineHeight: 20 },
  createdDate: {
    fontSize: 12,
    fontWeight: "500",
    marginTop: 2,
    opacity: 0.6,
  },
  price: { fontSize: 17, fontWeight: "800" },
  detailsContainer: {
    marginBottom: 4,
  },
  infoRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  infoText: { fontSize: 14, fontWeight: "600" },
  divider: { height: 1, width: "100%", marginVertical: 14 },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  consumerInfo: { flexDirection: "row", alignItems: "center", gap: 8, flex: 1 },
  avatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#F3F4F6",
  },
  consumerName: { fontSize: 14, fontWeight: "700" },
  timerContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 10,
  },
  timerText: { fontSize: 11, fontWeight: "800" },
  actionRow: { flexDirection: "row", gap: 12 },
  btn: {
    flex: 1,
    height: 48,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  declineBtn: { borderWidth: 1 },
  declineBtnText: { fontWeight: "700", fontSize: 14 },
  acceptBtnText: { color: "#FFF", fontWeight: "700", fontSize: 14 },

  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "800",
    textTransform: "uppercase",
  },
});
