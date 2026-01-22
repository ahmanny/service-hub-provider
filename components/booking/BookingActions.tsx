import { useThemeColor } from "@/hooks/use-theme-color";
import { useBookingActions } from "@/hooks/useBooking";
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
      }
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
        <ThemedText style={styles.btnPriText}>{label.toUpperCase()}</ThemedText>
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
      }
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

const styles = StyleSheet.create({
  btn: {
    flex: 1,
    height: 48,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
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

  btnPriText: { color: "#FFF", fontWeight: "800", fontSize: 13 },
});

// const styles = StyleSheet.create({

// });
