import { ThemedText } from "@/components/ui/Themed";
import { useTheme } from "@/hooks/use-theme-color";
import { BookingDetails, BookingStatus } from "@/types/booking.types";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";

export const BookingStatusAlert = ({ booking }: { booking: BookingDetails }) => {
  const { tint, danger, warning, border, textSecondary } = useTheme();

  const isInProgress = booking.status === BookingStatus.IN_PROGRESS;

  // System/Status Notices (Disputes, Auto-starts, Completion Pending)
  const renderSystemNotice = () => {
    if (booking.status === BookingStatus.DISPUTED) {
      return (
        <View style={[styles.banner, { backgroundColor: `${danger}10`, borderColor: danger }]}>
          <Ionicons name="alert-circle" size={20} color={danger} />
          <View style={styles.content}>
            <ThemedText style={[styles.label, { color: danger }]}>Payment Frozen</ThemedText>
            <ThemedText style={styles.text}>
              The client has raised a dispute. Payout is suspended while our team reviews the case.
            </ThemedText>
          </View>
        </View>
      );
    }

    if (booking.status === BookingStatus.COMPLETION_PENDING) {
      return (
        <View style={[styles.banner, { backgroundColor: `${tint}10`, borderColor: tint }]}>
          <Ionicons name="hourglass-outline" size={20} color={tint} />
          <View style={styles.content}>
            <ThemedText style={[styles.label, { color: tint }]}>Awaiting Verification</ThemedText>
            <ThemedText style={styles.text}>
              Job submitted! Your payout will be released as soon as the client confirms or after the auto-confirm period.
            </ThemedText>
          </View>
        </View>
      );
    }

    if (booking.autoStarted && isInProgress) {
      return (
        <View style={[styles.banner, { backgroundColor: `${warning}10`, borderColor: warning }]}>
          <Ionicons name="flash" size={20} color={warning} />
          <View style={styles.content}>
            <ThemedText style={[styles.label, { color: warning }]}>System Auto-Start</ThemedText>
            <ThemedText style={styles.text}>
              Service was automatically marked active because the scheduled time passed.
            </ThemedText>
          </View>
        </View>
      );
    }
    return null;
  };

  // Messaging Notices (Notes, Decline Reasons, Expiry)
  const renderMessageNotice = () => {
    const hasMessage = booking.note || booking.declineReason || booking.expiredMessage;
    if (!hasMessage) return null;

    const isNegative = ["declined", "expired", "cancelled"].includes(booking.status);

    return (
      <View style={[styles.banner, { backgroundColor: `${textSecondary}05`, borderColor: border }]}>
        <Ionicons 
          name={isNegative ? "close-circle" : "information-circle"} 
          size={20} 
          color={isNegative ? danger : textSecondary} 
        />
        <View style={styles.content}>
          <ThemedText style={styles.label}>
            {booking.status === "declined" ? "Decline Reason" : 
             booking.status === "expired" ? "Expiry Info" : "Client Note"}
          </ThemedText>
          <ThemedText style={styles.text}>
            {booking.declineReason || booking.expiredMessage || booking.note}
          </ThemedText>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {renderSystemNotice()}
      {renderMessageNotice()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    gap: 12,
  },
  banner: {
    flexDirection: "row",
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    gap: 12,
    alignItems: "flex-start",
  },
  content: {
    flex: 1,
  },
  label: {
    fontSize: 12,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  text: {
    fontSize: 14,
    fontWeight: "600",
    lineHeight: 20,
  },
});