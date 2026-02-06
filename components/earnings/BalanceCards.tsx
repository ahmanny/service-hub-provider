import { useThemeColor } from "@/hooks/use-theme-color";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import { StyleSheet, View } from "react-native";
import { ThemedButton, ThemedText } from "../ui/Themed";

export function BalanceCards({ available, pending, nextPayout }: any) {
  const cardBg = useThemeColor({}, "card");
  const tint = useThemeColor({}, "tint");

  // Check if balance is 0 or less
  const isWithdrawDisabled = available <= 0;

  const handleWithdraw = () => {
    if (isWithdrawDisabled) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push("/(modals)/withdraw");
  };

  return (
    <View style={styles.container}>
      {/* Available Balance */}
      <View style={[styles.mainCard, { backgroundColor: cardBg }]}>
        <ThemedText style={styles.label}>Available balance</ThemedText>
        <ThemedText type="title" style={styles.amount}>
          ₦{available.toLocaleString()}
        </ThemedText>

        <View style={styles.payoutRow}>
          <Ionicons name="time-outline" size={14} color="#999" />
          <ThemedText style={styles.payoutText}>
            Next payout: {nextPayout}
          </ThemedText>
        </View>

        <ThemedButton
          title="Withdraw"
          style={styles.withdrawBtn}
          onPress={handleWithdraw}
          disabled={isWithdrawDisabled}
        />
      </View>

      {/* Pending Balance */}
      <View style={[styles.subCard, { backgroundColor: cardBg }]}>
        <View>
          <ThemedText style={styles.label}>Pending balance</ThemedText>
          <ThemedText style={styles.pendingAmount}>
            ₦{pending.toLocaleString()}
          </ThemedText>
        </View>
        {/* <ThemedText style={styles.releaseText}>Releases in 1h 24m</ThemedText> */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 12 },
  mainCard: {
    padding: 20,
    borderRadius: 24,
    elevation: 2,
    shadowOpacity: 0.05,
  },
  subCard: {
    padding: 16,
    borderRadius: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderStyle: "dashed",
    borderWidth: 1,
    borderColor: "#ccc",
  },
  label: { fontSize: 13, opacity: 0.6, marginBottom: 4 },
  amount: { fontSize: 32, fontWeight: "800" },
  pendingAmount: { fontSize: 18, fontWeight: "700" },
  payoutRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 8,
    marginBottom: 20,
  },
  payoutText: { fontSize: 12, color: "#999" },
  withdrawBtn: { height: 45, borderRadius: 12 },
  releaseText: { fontSize: 11, color: "#999" },
});
