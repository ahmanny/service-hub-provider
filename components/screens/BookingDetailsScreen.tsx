import { ThemedText } from "@/components/ui/Themed";
import { useCountdown } from "@/hooks/use-countdown";
import { useThemeColor } from "@/hooks/use-theme-color";
import { formatNumber } from "@/lib/utils";
import { BookingDetails } from "@/types/booking.types";
import { Ionicons } from "@expo/vector-icons";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import { Stack } from "expo-router";
import React, { useMemo } from "react";
import {
  Dimensions,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  AcceptButton,
  DeclineButton,
  ServiceActionButton,
} from "../booking/BookingActions";
import { BookingStatusBadge } from "../booking/BookingStatusBadge";
import { CustomerSection } from "../booking/CustomerSection";
import { BackButton } from "../ui/BackButton";

dayjs.extend(duration);

const { width } = Dimensions.get("window");

interface Props {
  booking: BookingDetails;
  isRefetching: boolean;
  onRefresh: () => void;
}

export default function BookingDetailsScreen({
  booking,
  isRefetching,
  onRefresh,
}: Props) {
  // Theme Hooks
  const backgroundColor = useThemeColor({}, "background");
  const tint = useThemeColor({}, "tint");
  const success = useThemeColor({}, "success");
  const danger = useThemeColor({}, "danger");
  const border = useThemeColor({}, "border");
  const card = useThemeColor({}, "card");
  const textSecondary = useThemeColor({}, "textSecondary");
  const warning = useThemeColor({}, "warning");

  const isPending = booking.status === "pending";
  const isExpiredStatus = booking.status === "expired";
  const isInProgress = booking.status === "in_progress";
  const isCompleted = booking.status === "completed";

  const { timeLeft, isExpired } = useCountdown(booking.deadlineAt);
  const { timeLeft: timeUntilService, isExpired: isServiceTime } = useCountdown(
    booking.scheduledAt,
  );

  // Timeline Construction
  const timelineEvents = useMemo(
    () =>
      [
        { label: "Request Placed", time: booking.createdAt, done: true },
        {
          label: "Accepted",
          time: booking.acceptedAt,
          done: !!booking.acceptedAt,
        },
        {
          label: "Declined",
          time: booking.declinedAt,
          done: !!booking.declinedAt,
        },
        {
          label: "Cancelled",
          time: booking.cancelledAt,
          done: !!booking.cancelledAt,
        },
        {
          label: booking.autoStarted
            ? "Auto-Started by System"
            : "Service Started",
          time: booking.actualStartTime,
          done: booking.actualStartTime,
        },
        {
          label: "Job Completed",
          time: booking.completedAt,
          done: booking.status === "completed",
        },
      ].filter((e) => e.done || e.label === "Request Placed"),
    [booking],
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor }} edges={["bottom"]}>
      <Stack.Screen
        options={{
          headerTitle: "Service Details",
          headerTitleStyle: {
            fontWeight: "800",
            fontSize: 20,
          },
          headerShadowVisible: false,
          headerStyle: { backgroundColor },
          headerRight: () => <BookingStatusBadge status={booking.status} />,
          headerLeft: () => <BackButton />,
        }}
      />

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={onRefresh}
            tintColor={tint}
          />
        }
      >
        {/* Hero Section */}
        <View style={styles.hero}>
          <ThemedText style={styles.serviceName}>
            {booking.serviceName}
          </ThemedText>
          <ThemedText style={[styles.mainPrice, { color: success }]}>
            ₦{formatNumber(booking.price.total)}
          </ThemedText>

          <View style={styles.pillRow}>
            <View style={[styles.pill, { backgroundColor: `${tint}15` }]}>
              <Ionicons name="time" size={14} color={tint} />
              <ThemedText style={[styles.pillText, { color: tint }]}>
                {dayjs(booking.scheduledAt).format("ddd, MMM DD • h:mm A")}
              </ThemedText>
            </View>
          </View>
        </View>

        {/* Status Message Alert */}
        {(booking.note || booking.declineReason || booking.expiredMessage) && (
          <View
            style={[
              styles.messageCard,
              { backgroundColor: `${tint}10`, borderColor: border },
            ]}
          >
            <Ionicons
              name={
                booking.status === "declined"
                  ? "close-circle"
                  : "information-circle"
              }
              size={20}
              color={booking.status === "declined" ? danger : tint}
            />
            <View style={{ flex: 1 }}>
              <ThemedText style={styles.messageLabel}>
                {booking.status === "declined"
                  ? "Decline Reason"
                  : booking.status === "expired"
                    ? "Expiry Info"
                    : "Booking Note"}
              </ThemedText>
              <ThemedText style={styles.messageText}>
                {booking.declineReason ||
                  booking.expiredMessage ||
                  booking.note}
              </ThemedText>
            </View>
          </View>
        )}

        {booking.autoStarted && isInProgress && (
          <View
            style={[
              styles.messageCard,
              { backgroundColor: `${warning}10`, borderColor: warning },
            ]}
          >
            <Ionicons name="flash" size={20} color={warning} />
            <View style={{ flex: 1 }}>
              <ThemedText style={[styles.messageLabel, { color: warning }]}>
                Notice
              </ThemedText>
              <ThemedText style={styles.messageText}>
                Service was automatically started because the scheduled time
                passed.
              </ThemedText>
            </View>
          </View>
        )}

        {/* Main Content Card */}
        <View
          style={[
            styles.glassCard,
            { backgroundColor: card, borderColor: border },
          ]}
        >
          <CustomerSection
            customer={booking.consumer}
            isAccepted={
              booking.status === "accepted" || booking.status === "in_progress"
            }
          />

          <View style={[styles.divider, { backgroundColor: border }]} />

          <View style={styles.infoRow}>
            <View
              style={[
                styles.iconBox,
                { backgroundColor: `${textSecondary}10` },
              ]}
            >
              <Ionicons name="location" size={20} color={textSecondary} />
            </View>
            <View style={{ flex: 1 }}>
              <ThemedText style={styles.label}>Location</ThemedText>
              <ThemedText style={styles.value} numberOfLines={2}>
                {booking.location?.textAddress ||
                  "Address hidden until accepted"}
              </ThemedText>
            </View>
          </View>
        </View>

        {/* Timeline Card */}
        <View
          style={[
            styles.glassCard,
            { backgroundColor: card, borderColor: border },
          ]}
        >
          <ThemedText style={styles.sectionTitle}>Process Tracker</ThemedText>
          {timelineEvents.map((event, index) => (
            <View key={index} style={styles.timelineRow}>
              <View style={styles.timelineLeft}>
                <View
                  style={[
                    styles.dot,
                    { backgroundColor: event.done ? success : border },
                  ]}
                />
                {index !== timelineEvents.length - 1 && (
                  <View style={[styles.line, { backgroundColor: border }]} />
                )}
              </View>
              <View style={styles.timelineRight}>
                <ThemedText
                  style={[styles.eventLabel, { opacity: event.done ? 1 : 0.5 }]}
                >
                  {event.label}
                </ThemedText>
                <ThemedText style={styles.eventTime}>
                  {event.time
                    ? dayjs(event.time).format("ddd, MMM DD • h:mm A")
                    : "Pending"}
                </ThemedText>
              </View>
            </View>
          ))}
        </View>

        {/* Financial Breakdown */}
        <View
          style={[
            styles.glassCard,
            { backgroundColor: card, borderColor: border },
          ]}
        >
          <ThemedText style={styles.sectionTitle}>Earnings Summary</ThemedText>
          {Object.entries(booking.price).map(([key, value]) => {
            if (key === "total" || !value) return null;
            return (
              <View key={key} style={styles.priceRow}>
                <ThemedText style={styles.priceLabel}>
                  {key.replace(/([A-Z])/g, " $1").toUpperCase()}
                </ThemedText>
                <ThemedText style={styles.priceValue}>
                  ₦{formatNumber(value as number)}
                </ThemedText>
              </View>
            );
          })}
          <View
            style={[
              styles.divider,
              { backgroundColor: border, marginVertical: 12 },
            ]}
          />
          <View style={styles.priceRow}>
            <ThemedText style={styles.totalLabel}>Final Payout</ThemedText>
            <ThemedText style={[styles.totalValue, { color: success }]}>
              ₦{formatNumber(booking.price.total)}
            </ThemedText>
          </View>
        </View>
      </ScrollView>

      {/* Floating Action Footer */}
      <View
        style={[styles.footer, { backgroundColor, borderTopColor: border }]}
      >
        {/*NEW REQUEST STATE: Show Accept/Decline */}
        {booking.status === "pending" && (
          <View style={styles.footerContent}>
            <View style={styles.timerBar}>
              <Ionicons name="flash" size={14} color={danger} />
              <ThemedText style={[styles.timerText, { color: danger }]}>
                {timeLeft} REMAINING TO ACCEPT
              </ThemedText>
            </View>
            <View style={styles.actionGrid}>
              <DeclineButton
                bookingId={booking._id}
                onSuccess={onRefresh}
                style={[styles.btnSec, { borderColor: border }]}
              />
              <AcceptButton
                bookingId={booking._id}
                label="Accept"
                onSuccess={onRefresh}
                style={[styles.btnPri, { backgroundColor: tint, flex: 2 }]}
              />
            </View>
          </View>
        )}

        {/* ONGOING JOB STATE: Show Start/Complete/Delivered */}
        {["accepted", "in_progress", "completed"].includes(booking.status) && (
          <View style={{ gap: 10 }}>
            {/* Show Countdown ONLY if it's accepted but not time to start yet */}
            {booking.status === "accepted" && !isServiceTime && (
              <View style={styles.timerBar}>
                <Ionicons name="time-outline" size={14} color={tint} />
                <ThemedText style={[styles.timerText, { color: tint }]}>
                  STARTS IN {timeUntilService}
                </ThemedText>
              </View>
            )}

            <ServiceActionButton
              bookingId={booking._id}
              status={booking.status}
              isServiceTime={isServiceTime}
              scheduledAt={booking.scheduledAt}
              onSuccess={onRefresh}
            />
          </View>
        )}

        {/* TERMINATED STATE: Show informative text */}
        {["declined", "cancelled", "expired"].includes(booking.status) && (
          <View style={{ alignItems: "center", padding: 10 }}>
            <ThemedText
              style={{
                color: danger,
                fontWeight: "700",
                textTransform: "uppercase",
              }}
            >
              This booking was {booking.status}
            </ThemedText>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingHorizontal: 16, paddingTop: 20, paddingBottom: 180 },
  hero: { alignItems: "center", marginBottom: 30 },
  serviceName: {
    fontSize: 32,
    fontWeight: "900",
    textAlign: "center",
    letterSpacing: -1,

    lineHeight: 38,
    paddingBottom: 4,
  },
  mainPrice: {
    fontSize: 26,
    fontWeight: "800",
    marginTop: 4,
    lineHeight: 38,
  },
  pillRow: { marginTop: 15 },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 25,
  },
  pillText: { fontSize: 13, fontWeight: "700" },

  glassCard: {
    padding: 20,
    borderRadius: 28,
    borderWidth: 1,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.03,
    shadowRadius: 20,
    elevation: 2,
  },
  divider: { height: 1, width: "100%", marginVertical: 20, opacity: 0.5 },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 1.5,
    opacity: 0.4,
    marginBottom: 16,
  },

  infoRow: { flexDirection: "row", alignItems: "center", gap: 15 },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  label: { fontSize: 12, fontWeight: "600", opacity: 0.5 },
  value: { fontSize: 15, fontWeight: "700", marginTop: 2 },

  timelineRow: { flexDirection: "row", minHeight: 60 },
  timelineLeft: { alignItems: "center", width: 20, marginRight: 15 },
  dot: { width: 10, height: 10, borderRadius: 5, marginTop: 6, zIndex: 2 },
  line: { width: 2, flex: 1, marginVertical: -4 },
  timelineRight: { flex: 1 },
  eventLabel: { fontSize: 15, fontWeight: "700" },
  eventTime: { fontSize: 12, opacity: 0.5, marginTop: 2 },

  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  priceLabel: { fontSize: 13, fontWeight: "600", opacity: 0.6 },
  priceValue: { fontSize: 14, fontWeight: "700" },
  totalLabel: { fontSize: 18, fontWeight: "800" },
  totalValue: {
    fontSize: 22,
    fontWeight: "900",
    lineHeight: 38,
  },

  footer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    padding: 20,
    paddingBottom: 40,
    borderTopWidth: 1,
  },
  footerContent: { gap: 16 },
  timerBar: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
  },
  timerText: { fontSize: 12, fontWeight: "800", letterSpacing: 1 },
  actionGrid: { flexDirection: "row", gap: 12 },
  btnPri: {
    height: 60,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  btnPriText: { color: "#FFF", fontSize: 16, fontWeight: "800" },
  btnSec: {
    flex: 1,
    height: 60,
    borderRadius: 20,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
  },

  messageCard: {
    flexDirection: "row",
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    gap: 12,
    marginBottom: 20,
    alignItems: "center",
  },
  messageLabel: {
    fontSize: 12,
    fontWeight: "800",
    textTransform: "uppercase",
    opacity: 0.6,
    letterSpacing: 0.5,
  },
  messageText: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 2,
    lineHeight: 20,
  },
});
