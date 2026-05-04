import { ThemedText } from "@/components/ui/Themed";
import { useTimer } from "@/hooks/use-countdown";
import { useTheme } from "@/hooks/use-theme-color";
import { formatNumber } from "@/lib/utils";
import { getBookingStatusConfig } from "@/lib/utils/booking.utils";
import { BookingListItem, BookingStatus } from "@/types/booking.types";
import { Ionicons } from "@expo/vector-icons";
import dayjs from "dayjs";
import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { AppAvatar } from "../ui/AppAvatar";
import { PulseDot } from "../ui/PulseDot";
import { CompleteContinueBookingButton } from "./BookingActions";

interface UpcomingBookingCardProps {
  item: BookingListItem;
  onPress?: () => void;
}

export function UpcomingBookingCard({
  item,
  onPress,
}: UpcomingBookingCardProps) {
  const { tint, border, textSecondary, success, danger, warning, card } =
    useTheme();

  //  Timers & Status Logic
  const { timeLeft: arrivalTime } = useTimer(item.scheduledAt, "countdown");
  const { timeLeft: activeTime } = useTimer(item.actualStartTime, "countup");
  const { isExpired: isServiceTime } = useTimer(item.scheduledAt, "countdown");

  const statusConfig = getBookingStatusConfig(item.status, {
    tint,
    success,
    danger,
    border,
    textSecondary,
    warning,
  });

  const isInProgress = item.status === BookingStatus.IN_PROGRESS;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: card,
          borderColor: border,
          opacity: pressed ? 0.96 : 1,
        },
      ]}
    >
      {/* HEADER: Service & Price */}
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <ThemedText style={styles.serviceName}>{item.serviceName}</ThemedText>
          <ThemedText style={[styles.createdDate, { color: textSecondary }]}>
            {dayjs(item.createdAt).format("D MMM, H:mm")}
          </ThemedText>
        </View>

        <View style={{ alignItems: "flex-end" }}>
          <ThemedText style={[styles.price, { color: success }]}>
            ₦{formatNumber(item.price)}
          </ThemedText>
          <ThemedText style={[styles.payoutLabel, { color: textSecondary }]}>
            Earn
          </ThemedText>
        </View>
      </View>

      {/* LOGISTICS SECTION: Time (Left) and Location (Right) */}
      <View style={styles.logisticsRow}>
        {/* TIME / LIVE TRACKING (Stays Left) */}
        <View style={styles.logisticsItem}>
          {isInProgress ? (
            <View style={[styles.timerBadge, { backgroundColor: `${tint}10` }]}>
              <PulseDot color={tint} />
              <ThemedText style={[styles.timerText, { color: tint }]}>
                Active • {activeTime}
              </ThemedText>
            </View>
          ) : (
            <View style={styles.infoRow}>
              <Ionicons name="calendar-outline" size={14} color={tint} />
              <ThemedText style={[styles.infoText, { color: textSecondary }]}>
                {dayjs(item.scheduledAt).format("D MMM, h:mm A")}
              </ThemedText>
            </View>
          )}
        </View>

        {/* LOCATION (Pushed to Right) */}
        <View style={{ alignItems: "flex-end" }}>
          <View style={styles.infoRow}>
            <Ionicons name="location-sharp" size={14} color={tint} />
            <ThemedText
              style={[
                styles.infoText,
                { color: textSecondary, textAlign: "right" },
              ]}
              numberOfLines={1}
            >
              {item.locationLabel}
            </ThemedText>
          </View>
        </View>
      </View>

      <View style={[styles.divider, { backgroundColor: border }]} />

      {/* FOOTER: Consumer & Status */}
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
          />
          <ThemedText style={styles.consumerName}>
            {item.consumer.firstName}
          </ThemedText>
        </View>

        <View style={{ flexDirection: "row", gap: 6 }}>
          {item.autoStarted && (
            <View
              style={[styles.statusBadge, { backgroundColor: `${warning}15` }]}
            >
              <ThemedText style={[styles.statusText, { color: warning }]}>
                AUTO
              </ThemedText>
            </View>
          )}
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
      </View>

      {/* PRIMARY ACTION BUTTON */}
      <CompleteContinueBookingButton
        bookingId={item._id}
        status={item.status}
        isServiceTime={isServiceTime}
        scheduledAt={item.scheduledAt}
        onSuccess={() => {}}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  serviceName: { fontSize: 16, fontWeight: "800" },
  createdDate: { fontSize: 11, fontWeight: "500", marginTop: 2 },
  price: { fontSize: 18, fontWeight: "900" },
  payoutLabel: { fontSize: 10, fontWeight: "700", textTransform: "uppercase" },

  logisticsRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  logisticsItem: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  trackingContainer: { marginBottom: 8 },
  timerBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  timerText: { fontSize: 11, fontWeight: "800" },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  infoText: { fontSize: 13, fontWeight: "600" },
  arrivalText: { fontSize: 12, fontWeight: "800" },
  divider: { height: 1, width: "100%", marginVertical: 14 },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  consumerInfo: { flexDirection: "row", alignItems: "center", gap: 8 },
  consumerName: { fontSize: 14, fontWeight: "700" },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: { fontSize: 11, fontWeight: "800", textTransform: "uppercase" },
});
