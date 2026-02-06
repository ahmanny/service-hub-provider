import { useThemeColor } from "@/hooks/use-theme-color";
import { useBookingActions } from "@/hooks/useBooking";
import { BookingStatus } from "@/types/booking.types";
import { Ionicons } from "@expo/vector-icons";
import dayjs from "dayjs";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import { ThemedModal, ThemedText } from "../ui/Themed";
import ThemedInput from "../ui/Themed/ThemedInput";

interface SmartActionProps {
  bookingId: string;
  onSuccess?: () => void;
  disabled?: boolean;
  label?: string;
  style?: StyleProp<ViewStyle>;
}

export const AcceptButton = ({
  bookingId,
  onSuccess,
  disabled,
  label = "Accept Request",
  style,
}: SmartActionProps) => {
  const tint = useThemeColor({}, "tint");
  const border = useThemeColor({}, "border");

  // Internal Mutation Logic
  const { mutate, isPending } = useBookingActions();

  const handlePress = () => {
    mutate(
      {
        bookingId,
        action: "accept",
      },
      {
        onSuccess: () => {
          if (onSuccess) onSuccess();
        },
      },
    );
  };

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled || isPending}
      style={({ pressed }) => [
        styles.btn,
        { backgroundColor: disabled || isPending ? border : tint },
        { opacity: pressed ? 0.8 : 1 },
        style,
      ]}
    >
      {isPending ? (
        <ActivityIndicator color="#FFF" size="small" />
      ) : (
        <ThemedText style={[styles.btnPriText, { color: "#FFF" }]}>
          {label.toUpperCase()}
        </ThemedText>
      )}
    </Pressable>
  );
};

export const DeclineButton = ({
  bookingId,
  onSuccess,
  disabled,
  label = "Decline",
  style,
}: SmartActionProps) => {
  const [showModal, setShowModal] = useState(false);
  const [reason, setReason] = useState("");

  const danger = useThemeColor({}, "danger");
  const border = useThemeColor({}, "border");
  const buttonSecondary = useThemeColor({}, "buttonSecondary");

  const { mutate, isPending } = useBookingActions();

  const handleDecline = () => {
    mutate(
      {
        action: "decline",
        bookingId,
        // Fallback to default if they don't type a reason
        reason:
          reason.trim() || "Service provider is unavailable at this time.",
      },
      {
        onSuccess: () => {
          setShowModal(false);
          setReason("");
          if (onSuccess) onSuccess();
        },
      },
    );
  };

  return (
    <>
      <Pressable
        onPress={() => setShowModal(true)}
        disabled={disabled || isPending}
        style={({ pressed }) => [
          styles.btn,
          styles.declineBtn,
          { borderColor: border, backgroundColor: buttonSecondary },
          { opacity: pressed ? 0.7 : 1 },
          style,
        ]}
      >
        <ThemedText style={[styles.declineBtnText, { color: danger }]}>
          {label.toUpperCase()}
        </ThemedText>
      </Pressable>

      <ThemedModal
        visible={showModal}
        onClose={() => !isPending && setShowModal(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <ThemedText style={styles.modalTitle}>Decline Request</ThemedText>
          <ThemedText style={styles.modalSubtitle}>
            Help the customer understand why you're declining.
          </ThemedText>

          <ThemedInput
            label="Reason (Optional)"
            placeholder="e.g. Schedule conflict, distance too far..."
            multiline
            numberOfLines={4}
            value={reason}
            onChangeText={setReason}
            style={{ minHeight: 100 }}
          />

          <View style={styles.modalActions}>
            <Pressable
              style={[styles.modalBtn, { flex: 1 }]}
              onPress={() => setShowModal(false)}
              disabled={isPending}
            >
              <ThemedText style={styles.cancelText}>Cancel</ThemedText>
            </Pressable>

            <Pressable
              style={[
                styles.modalBtn,
                { flex: 2, backgroundColor: danger, borderRadius: 12 },
              ]}
              onPress={handleDecline}
              disabled={isPending}
            >
              {isPending ? (
                <ActivityIndicator color="#FFF" size="small" />
              ) : (
                <ThemedText style={styles.confirmText}>
                  Confirm Decline
                </ThemedText>
              )}
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </ThemedModal>
    </>
  );
};

export const CompleteContinueBookingButton = ({
  bookingId,
  status,
  scheduledAt,
  isServiceTime,
  onSuccess,
  style,
}: {
  bookingId: string;
  status: BookingStatus;
  scheduledAt: string | Date;
  isServiceTime: boolean;
  onSuccess?: () => void;
  style?: StyleProp<ViewStyle>;
}) => {
  const tint = useThemeColor({}, "tint");
  const success = useThemeColor({}, "success");
  const border = useThemeColor({}, "border");
  const textSecondary = useThemeColor({}, "textSecondary"); 
  const { mutate, isPending } = useBookingActions();

  const isCompleted = status === "completed";
  const isInProgress = status === "in_progress";
  const isAccepted = status === "accepted";
  const isEarly = isAccepted && !isServiceTime;

  const handleAction = () => {
    if (isCompleted) return;
    if (isAccepted && !isServiceTime) {
      router.push(`/booking-details/${bookingId}`);
      return;
    }

    const action = isInProgress ? "complete" : "start";
    mutate({ bookingId, action }, { onSuccess: () => onSuccess?.() });
  };

  const getLabel = () => {
    if (isPending) return "PROCESSING...";
    if (isInProgress) return "COMPLETE SERVICE";
    if (isCompleted) return "SERVICE DELIVERED";
    if (isServiceTime) return "START SERVICE";

    const date = dayjs(scheduledAt);
    const isToday = date.isSame(dayjs(), "day");
    const formatStr = isToday ? "h:mm A" : "ddd, h:mm A";
    return `SERVICE STARTS ${date.format(formatStr).toUpperCase()}`;
  };

  const bgColor = isCompleted
    ? border
    : isInProgress
      ? success
      : isEarly
        ? border + "50"
        : tint;

  const textColorValue = isEarly ? textSecondary : "#FFF";

  return (
    <Pressable
      onPress={handleAction}
      disabled={isPending || isCompleted}
      style={({ pressed }) => [
        styles.btn,
        {
          backgroundColor: bgColor,
          marginTop: 4,
          opacity: pressed ? 0.8 : 1,
          borderWidth: isEarly ? 1 : 0,
          borderColor: border,
        },
        style,
      ]}
    >
      {isPending ? (
        <ActivityIndicator color={tint} size="small" />
      ) : (
        <View style={styles.content}>
          {isInProgress && (
            <Ionicons name="checkmark-circle" size={18} color="#FFF" />
          )}
          {isEarly && (
            <Ionicons name="time-outline" size={18} color={textColorValue} />
          )}
          <ThemedText style={[styles.btnPriText, { color: textColorValue }]}>
            {getLabel()}
          </ThemedText>
        </View>
      )}
    </Pressable>
  );
};
export const ServiceActionButton = ({
  bookingId,
  status,
  isServiceTime,
  scheduledAt,
  onSuccess,
}: {
  bookingId: string;
  status: string;
  isServiceTime: boolean;
  scheduledAt: string | Date;
  onSuccess?: () => void;
}) => {
  const tint = useThemeColor({}, "tint");
  const success = useThemeColor({}, "success");
  const border = useThemeColor({}, "border");

  const { mutate, isPending } = useBookingActions();

  const isCompleted = status === "completed";
  const isInProgress = status === "in_progress";
  const isAccepted = status === "accepted";

  const handlePress = () => {
    const action = isInProgress ? "complete" : "start";
    mutate(
      { bookingId, action },
      {
        onSuccess: () => {
          if (onSuccess) onSuccess();
        },
      },
    );
  };

  const isDisabled = isCompleted || (isAccepted && !isServiceTime) || isPending;

  const getLabel = () => {
    if (isInProgress) return "COMPLETE SERVICE";
    if (isCompleted) return "SERVICE DELIVERED";
    if (isServiceTime) return "START SERVICE";

    // Format logic for future dates
    const date = dayjs(scheduledAt);
    const isToday = date.isSame(dayjs(), "day");

    // If today: Starts 4:00 PM, If tomorrow/later: Starts Mon, 4:00 PM
    const formatStr = isToday ? "h:mm A" : "ddd, h:mm A";
    return `SERVICE STARTS ${date.format(formatStr).toUpperCase()}`;
  };

  return (
    <Pressable
      disabled={isDisabled}
      onPress={handlePress}
      style={({ pressed }) => [
        styles.btnPri,
        {
          backgroundColor: isCompleted ? border : isInProgress ? success : tint,
          width: "100%",
          opacity:
            (isAccepted && !isServiceTime) || isPending
              ? 0.6
              : pressed
                ? 0.8
                : 1,
        },
      ]}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
        {isPending ? (
          <ActivityIndicator color="#FFF" size="small" />
        ) : (
          <>
            {isInProgress && (
              <Ionicons name="checkmark-circle" size={18} color="#FFF" />
            )}
            <ThemedText style={styles.btnPriText}>{getLabel()}</ThemedText>
          </>
        )}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  btn: {
    flex: 1,
    height: 48,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  declineBtn: { borderWidth: 1 },
  declineBtnText: { fontWeight: "800", fontSize: 13 },
  modalTitle: {
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 4,
  },
  modalSubtitle: {
    fontSize: 14,
    opacity: 0.6,
    marginBottom: 20,
  },
  modalActions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
    alignItems: "center",
  },
  modalBtn: {
    height: 52,
    justifyContent: "center",
    alignItems: "center",
  },
  cancelText: {
    fontWeight: "600",
    fontSize: 15,
  },
  confirmText: {
    color: "#FFF",
    fontWeight: "700",
    fontSize: 15,
  },

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
  btnPriText: { fontSize: 14, fontWeight: "700", letterSpacing: 0.5 },
});
