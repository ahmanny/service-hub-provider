import { ThemedText } from "@/components/ui/Themed";
import { useThemeColor } from "@/hooks/use-theme-color";
import { formatNumber } from "@/lib/utils";
import { IPrice, PayoutStatus } from "@/types/booking.types";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, View } from "react-native";

interface Props {
  price: IPrice;
  payoutStatus: PayoutStatus;
}

export function FinancialBreakdown({ price, payoutStatus }: Props) {
  // The Payout is Total - Platform Fee (or Service + Home Fee - Platform Fee)
  const providerEarnings = price.total - (price.platformFee || 0);

  const colors = {
    card: useThemeColor({}, "card"),
    border: useThemeColor({}, "border"),
    textSecondary: useThemeColor({}, "textSecondary"),
    success: useThemeColor({}, "success"),
  };

  return (
    <View
      style={[
        styles.glassCard,
        { backgroundColor: colors.card, borderColor: colors.border },
      ]}
    >
      <View style={styles.header}>
        <ThemedText style={styles.sectionTitle}>Earnings Summary</ThemedText>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: `${colors.success}15` },
          ]}
        >
          <ThemedText style={[styles.statusText, { color: colors.success }]}>
            {payoutStatus.replace("_", " ").toUpperCase()}
          </ThemedText>
        </View>
      </View>

      {/* Gross Amounts */}
      <View style={styles.priceRow}>
        <ThemedText style={styles.priceLabel}>Service Charge</ThemedText>
        <ThemedText style={styles.priceValue}>
          ₦{formatNumber(price.service)}
        </ThemedText>
      </View>

      {price.homeServiceFee ? (
        <View style={styles.priceRow}>
          <ThemedText style={styles.priceLabel}>Home Service Fee</ThemedText>
          <ThemedText style={styles.priceValue}>
            ₦{formatNumber(price.homeServiceFee)}
          </ThemedText>
        </View>
      ) : null}

      {/* Deductions */}
      <View style={styles.priceRow}>
        <View style={styles.labelWithIcon}>
          <ThemedText style={[styles.priceLabel, { color: "#FF4444" }]}>
            Platform Fee
          </ThemedText>
          <Ionicons
            name="information-circle-outline"
            size={14}
            color={colors.textSecondary}
          />
        </View>
        <ThemedText style={[styles.priceValue, { color: "#FF4444" }]}>
          - ₦{formatNumber(price.platformFee)}
        </ThemedText>
      </View>

      <View style={[styles.divider, { backgroundColor: colors.border }]} />

      {/* Final Payout */}
      <View style={styles.priceRow}>
        <View>
          <ThemedText style={styles.totalLabel}>Your Payout</ThemedText>
          <ThemedText style={styles.subLabel}>After all deductions</ThemedText>
        </View>
        <ThemedText style={[styles.totalValue, { color: colors.success }]}>
          ₦{formatNumber(providerEarnings)}
        </ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  glassCard: {
    padding: 20,
    borderRadius: 28,
    borderWidth: 1,
    marginBottom: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 1.5,
    opacity: 0.4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 10,
    fontWeight: "800",
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  labelWithIcon: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  priceLabel: { fontSize: 14, fontWeight: "600", opacity: 0.7 },
  priceValue: { fontSize: 15, fontWeight: "700" },
  divider: { height: 1, width: "100%", marginVertical: 12, opacity: 0.5 },
  totalLabel: { fontSize: 18, fontWeight: "800" },
  subLabel: { fontSize: 12, opacity: 0.5, fontWeight: "500" },
  totalValue: { fontSize: 24, fontWeight: "900" },
});
