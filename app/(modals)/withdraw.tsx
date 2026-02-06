import { ThemedButton, ThemedText } from "@/components/ui/Themed";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useAuthStore } from "@/stores/auth.store"; // Import store
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router"; // Import router
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function WithdrawScreen() {
  const router = useRouter();
  const profile = useAuthStore((s) => s.user);
  const payoutDetails = profile?.payoutDetails;

  const [amount, setAmount] = useState("");
  const tint = useThemeColor({}, "tint");
  const cardBg = useThemeColor({}, "card");
  const bg = useThemeColor({}, "background");
  const errorColor = useThemeColor({}, "danger");

  // Mock balance - usually this would come from profile or a separate query
  // const availableBalance = profile?.balance || 0;
  const availableBalance = 400000; // Mock balance for demonstration

  const handleQuickSelect = (percent: number) => {
    const value = Math.floor(availableBalance * percent).toString();
    setAmount(value);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const navigateToPayout = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push("/(profile-edit)/payout-details");
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: bg }} edges={["bottom"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={[styles.container]}
        keyboardVerticalOffset={100}
      >
        <View style={styles.content}>
          {/* BALANCE HEADER */}
          <View style={styles.balanceHeader}>
            <ThemedText style={styles.label}>Available Balance</ThemedText>
            <ThemedText type="title" style={styles.balanceAmount}>
              ₦{availableBalance.toLocaleString()}
            </ThemedText>
          </View>

          {/* AMOUNT INPUT */}
          <View style={[styles.inputContainer, { backgroundColor: cardBg }]}>
            <ThemedText style={styles.currencyPrefix}>₦</ThemedText>
            <TextInput
              style={[styles.input, { color: tint }]}
              placeholder="0"
              keyboardType="numeric"
              value={amount}
              onChangeText={setAmount}
              autoFocus
              placeholderTextColor="#999"
            />
          </View>

          {/* QUICK SELECT BUTTONS */}
          <View style={styles.quickSelectRow}>
            {[0.25, 0.5, 0.75, 1].map((pct) => (
              <Pressable
                key={pct}
                onPress={() => handleQuickSelect(pct)}
                style={[styles.pctBtn, { borderColor: tint + "40" }]}
              >
                <ThemedText style={{ color: tint, fontWeight: "600" }}>
                  {pct === 1 ? "MAX" : `${pct * 100}%`}
                </ThemedText>
              </Pressable>
            ))}
          </View>

          {/* BANK SELECTION */}
          <ThemedText
            style={[styles.label, { marginTop: 30, marginBottom: 10 }]}
          >
            Destination Bank
          </ThemedText>

          <Pressable
            onPress={navigateToPayout}
            style={({ pressed }) => [
              styles.bankCard,
              { backgroundColor: cardBg, opacity: pressed ? 0.7 : 1 },
            ]}
          >
            <View style={[styles.bankIcon, { backgroundColor: tint + "15" }]}>
              <Ionicons
                name={payoutDetails ? "business" : "add-circle"}
                size={24}
                color={payoutDetails ? tint : errorColor}
              />
            </View>

            <View style={{ flex: 1, marginLeft: 12 }}>
              {payoutDetails ? (
                <>
                  <ThemedText type="defaultSemiBold">
                    {payoutDetails.bankName}
                  </ThemedText>
                  <ThemedText style={styles.bankAccount}>
                    {payoutDetails.accountName} • {payoutDetails.accountNumber}
                  </ThemedText>
                </>
              ) : (
                <>
                  <ThemedText
                    type="defaultSemiBold"
                    style={{ color: errorColor }}
                  >
                    Missing Payout Details
                  </ThemedText>
                  <ThemedText style={styles.bankAccount}>
                    Tap to set up your bank account
                  </ThemedText>
                </>
              )}
            </View>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </Pressable>

          <View style={{ flex: 1 }} />

          {/* CONFIRM BUTTON */}
          <ThemedButton
            title={
              payoutDetails ? "Confirm Withdrawal" : "Set up Payout Details"
            }
            disabled={
              payoutDetails
                ? !amount ||
                  Number(amount) <= 0 ||
                  Number(amount) > availableBalance
                : false
            }
            onPress={() => {
              if (!payoutDetails) {
                navigateToPayout();
                return;
              }
              // Withdrawal logic here
              Haptics.notificationAsync(
                Haptics.NotificationFeedbackType.Success,
              );
            }}
            style={[
              styles.confirmBtn,
              !payoutDetails && { backgroundColor: errorColor + "20" },
            ]}
            // Optional: change text color for missing payout
            textStyle={!payoutDetails ? { color: errorColor } : undefined}
          />

          <ThemedText style={styles.disclaimer}>
            {payoutDetails
              ? "Funds usually arrive within 10–30 minutes."
              : "You must verify a bank account before withdrawing."}
          </ThemedText>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, padding: 24 },
  balanceHeader: { alignItems: "center", marginBottom: 30 },
  label: {
    fontSize: 12,
    opacity: 0.5,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  balanceAmount: { fontSize: 32, fontWeight: "800", marginTop: 4 },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    height: 90,
    borderRadius: 24,
    justifyContent: "center",
  },
  currencyPrefix: { fontSize: 32, fontWeight: "700", marginRight: 8 },
  input: { fontSize: 40, fontWeight: "800", flex: 1 },
  quickSelectRow: { flexDirection: "row", gap: 10, marginTop: 15 },
  pctBtn: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  bankCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
  },
  bankIcon: {
    width: 52,
    height: 52,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  bankAccount: { fontSize: 13, opacity: 0.5, marginTop: 2 },
  confirmBtn: { height: 60, borderRadius: 18 },
  disclaimer: {
    textAlign: "center",
    fontSize: 12,
    opacity: 0.4,
    marginTop: 15,
  },
});
