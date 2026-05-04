import { ThemedText } from "@/components/ui/Themed";
import { useTimer } from "@/hooks/use-countdown";
import { useThemeColor } from "@/hooks/use-theme-color";
import { BookingDetails, BookingStatus } from "@/types/booking.types";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, View } from "react-native";
import {
  AcceptButton,
  DeclineButton,
  ServiceActionButton,
} from "../BookingActions";

interface Props {
  booking: BookingDetails;
  onRefresh: () => void;
}

export function FooterActions({ booking, onRefresh }: Props) {
  const backgroundColor = useThemeColor({}, "background");
  const tint = useThemeColor({}, "tint");
  const danger = useThemeColor({}, "danger");
  const border = useThemeColor({}, "border");
  const success = useThemeColor({}, "success");

  // Timer: Countdown for accepting request
  const { timeLeft: acceptTimeLeft } = useTimer(
    booking.deadlineAt,
    "countdown",
  );

  // Timer: Countdown to service start
  const { timeLeft: startTimeLeft, isExpired: isServiceTime } = useTimer(
    booking.scheduledAt,
    "countdown",
  );

  // Timer: Count UP for active service duration
  const { timeLeft: activeDuration } = useTimer(
    booking.actualStartTime,
    "countup",
  );

  // Timer: Countdown for auto-payout release
  const { timeLeft: payoutTimeLeft } = useTimer(
    booking.disputeDeadline,
    "countdown",
  );

  return (
    <View style={[styles.footer, { backgroundColor, borderTopColor: border }]}>
      {/* NEW REQUEST STATE */}
      {booking.status === BookingStatus.PENDING && (
        <View style={styles.footerContent}>
          <View style={styles.timerBar}>
            <Ionicons name="flash" size={14} color={danger} />
            <ThemedText style={[styles.timerText, { color: danger }]}>
              {acceptTimeLeft} REMAINING TO ACCEPT
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

      {/* UPCOMING / ACTIVE JOB */}
      {["accepted", "in_progress"].includes(booking.status) && (
        <View style={{ gap: 10 }}>
          {/* Status Specific Timers */}
          <View style={styles.timerBar}>
            {booking.status === "accepted" ? (
              <>
                <Ionicons name="time-outline" size={14} color={tint} />
                <ThemedText style={[styles.timerText, { color: tint }]}>
                  {isServiceTime
                    ? "SERVICE TIME REACHED"
                    : `STARTS IN ${startTimeLeft}`}
                </ThemedText>
              </>
            ) : (
              <>
                <Ionicons name="play-circle" size={14} color={success} />
                <ThemedText style={[styles.timerText, { color: success }]}>
                  ACTIVE DURATION: {activeDuration}
                </ThemedText>
              </>
            )}
          </View>

          <ServiceActionButton
            bookingId={booking._id}
            status={booking.status}
            isServiceTime={isServiceTime}
            scheduledAt={booking.scheduledAt}
            onSuccess={onRefresh}
          />
        </View>
      )}

      {/*  COMPLETION PENDING (Escrow period) */}
      {booking.status === BookingStatus.COMPLETION_PENDING && (
        <View style={styles.payoutNotice}>
          <View style={styles.timerBar}>
            <Ionicons name="shield-checkmark" size={14} color={tint} />
            <ThemedText style={[styles.timerText, { color: tint }]}>
              AUTO-RELEASE IN: {payoutTimeLeft}
            </ThemedText>
          </View>
          <ThemedText style={styles.subText}>
            Awaiting client confirmation or timer expiry for payout release.
          </ThemedText>
        </View>
      )}

      {/*  TERMINATED STATES */}
      {["declined", "cancelled", "expired", "completed"].includes(
        booking.status,
      ) && (
        <View style={{ alignItems: "center", padding: 10 }}>
          <ThemedText
            style={[
              styles.terminalText,
              { color: booking.status === "completed" ? success : danger },
            ]}
          >
            This booking is {booking.status}
          </ThemedText>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
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
    marginBottom: 4,
  },
  timerText: { fontSize: 12, fontWeight: "800", letterSpacing: 1 },
  actionGrid: { flexDirection: "row", gap: 12 },
  btnPri: {
    height: 60,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  btnSec: {
    flex: 1,
    height: 60,
    borderRadius: 20,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  payoutNotice: {
    alignItems: "center",
    gap: 4,
  },
  subText: {
    fontSize: 12,
    opacity: 0.6,
    textAlign: "center",
    fontWeight: "600",
  },
  terminalText: {
    fontWeight: "800",
    textTransform: "uppercase",
    fontSize: 13,
    letterSpacing: 1,
  },
});
