import { ThemedText } from "@/components/ui/Themed";
import { useThemeColor } from "@/hooks/use-theme-color";
import { formatNumber } from "@/lib/utils";
import { BookingListItem } from "@/types/booking.types";
import { Ionicons } from "@expo/vector-icons";
import { formatDate } from "date-fns";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import React, { useEffect, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { AppAvatar } from "../ui/AppAvatar";
import { AcceptButton, DeclineButton } from "./BookingActions";
import { useCountdown } from "@/hooks/use-countdown";

dayjs.extend(duration);

interface PendingBookingCardProps {
  item: BookingListItem;
  onAccept: (id: string) => void;
  onDecline: (id: string) => void;
  onPress?: () => void;
}

export function PendingBookingCard({
  item,
  onAccept,
  onDecline,
  onPress,
}: PendingBookingCardProps) {

  // Theme Hooks
  const cardBg = useThemeColor({}, "card");
  const border = useThemeColor({}, "border");
  const textSecondary = useThemeColor({}, "textSecondary");
  const tint = useThemeColor({}, "tint");
  const success = useThemeColor({}, "success");
  const danger = useThemeColor({}, "danger");

  const { timeLeft, isExpired } = useCountdown(item.deadlineAt);

  return (
    <Pressable
      onPress={onPress}
      disabled={isExpired}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: cardBg,
          borderColor: border,
          opacity: isExpired ? 0.6 : pressed ? 0.96 : 1,
        },
      ]}
    >
      {/* Header: Service & Earnings */}
      <View style={styles.header}>
        <ThemedText style={styles.serviceName}>{item.serviceName}</ThemedText>
        <ThemedText style={[styles.price, { color: success }]}>
          ₦{formatNumber(item.price)}
        </ThemedText>
      </View>

      {/* Logistics */}
      <View style={styles.detailsContainer}>
        <View style={styles.infoRow}>
          <Ionicons name="calendar-clear" size={14} color={tint} />
          <ThemedText style={[styles.infoText, { color: textSecondary }]}>
            {formatDate(new Date(item.scheduledAt), "EEE, dd MMM • p")}
          </ThemedText>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="location" size={14} color={tint} />
          <ThemedText style={[styles.infoText, { color: textSecondary }]}>
            {item.locationLabel} • {item.distance ?? "0"} km away
          </ThemedText>
        </View>
      </View>

      <View style={[styles.divider, { backgroundColor: border }]} />

      {/* Consumer & Timer */}
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
          <ThemedText style={styles.consumerName} numberOfLines={1}>
            {item.consumer.firstName}
          </ThemedText>
        </View>

        <View
          style={[
            styles.timerContainer,
            { backgroundColor: isExpired ? `${danger}20` : `${danger}10` },
          ]}
        >
          <Ionicons name="time-outline" size={14} color={danger} />
          <ThemedText style={[styles.timerText, { color: danger }]}>
            {isExpired ? "Expired" : `Expires in ${timeLeft}`}
          </ThemedText>
        </View>
      </View>

      {/* Actions */}
      <View style={styles.actionRow}>
        <DeclineButton
          label="Decline"
          bookingId={item._id}
          disabled={isExpired}
        />

        <AcceptButton
          bookingId={item._id}
          disabled={isExpired}
          label="Accept"
        />
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
    alignItems: "center",
    marginBottom: 10,
  },
  serviceName: { fontSize: 17, fontWeight: "800" },
  price: { fontSize: 17, fontWeight: "800" },
  detailsContainer: { gap: 6, marginBottom: 12 },
  infoRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  infoText: { fontSize: 13, fontWeight: "600" },
  divider: { height: 1, width: "100%", marginVertical: 12 },
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
});
