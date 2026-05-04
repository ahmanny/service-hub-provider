import { ThemedText } from "@/components/ui/Themed";
import { useThemeColor } from "@/hooks/use-theme-color";
import { BookingDetails } from "@/types/booking.types";
import { Ionicons } from "@expo/vector-icons";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import { Stack } from "expo-router";
import React, { useMemo } from "react";
import { RefreshControl, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BookingHero } from "../booking/booking-details/BookingHero";
import { BookingStatusAlert } from "../booking/booking-details/BookingStatusAlert";
import { FinancialBreakdown } from "../booking/booking-details/FinancialBreakdown";
import { FooterActions } from "../booking/booking-details/FooterActions";
import { ProcessTracker } from "../booking/booking-details/ProcessTracker";
import { RatingSection } from "../booking/booking-details/RatingSection";
import { BookingStatusBadge } from "../booking/BookingStatusBadge";
import { CustomerSection } from "../booking/CustomerSection";
import { BackButton } from "../ui/BackButton";

dayjs.extend(duration);

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
  const border = useThemeColor({}, "border");
  const card = useThemeColor({}, "card");
  const textSecondary = useThemeColor({}, "textSecondary");

  // Timeline Construction
  const timelineEvents = useMemo(() => {
    const events = [
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
        done: !!booking.actualStartTime,
      },
      {
        label: "Work Submitted",
        time: booking.completionPendingAt,
        done: !!booking.completionPendingAt,
      },
      {
        label: "Dispute Opened", // Only shows if a dispute actually happened
        time: booking.updatedAt,
        done: booking.status === "disputed",
      },
      {
        label: "Rescheduled",
        time: booking.rescheduledAt,
        done: !!booking.rescheduledAt,
      },
      {
        label:
          booking.status === "completed" ? "Payout Released" : "Job Completed",
        time: booking.completedAt,
        done: booking.status === "completed",
      },
    ];

    return events.filter((e) => e.done || e.label === "Request Placed");
  }, [booking]);
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
        <BookingHero
          serviceName={booking.serviceName}
          price={booking.price}
          scheduledAt={booking.scheduledAt}
        />

        <BookingStatusAlert booking={booking} />

        {/* Main Content Card */}
        <View
          style={[
            styles.glassCard,
            { backgroundColor: card, borderColor: border },
          ]}
        >
          <CustomerSection
            customer={booking.consumer}
            isAccepted={[
              "accepted",
              "in_progress",
              "completion_pending",
              "completed",
            ].includes(booking.status)}
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
                {booking.location?.textAddress || "Address hidden"}
              </ThemedText>
            </View>
          </View>
        </View>

        {/* Timeline Card */}
        <ProcessTracker events={timelineEvents} />

        {booking.isRated && booking.rating && (
          <RatingSection rating={booking.rating} />
        )}

        {/* Financial Breakdown */}
        <FinancialBreakdown
          price={booking.price}
          payoutStatus={booking.payoutStatus}
        />
      </ScrollView>

      <FooterActions booking={booking} onRefresh={onRefresh} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingHorizontal: 16, paddingTop: 20, paddingBottom: 180 },

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
});
