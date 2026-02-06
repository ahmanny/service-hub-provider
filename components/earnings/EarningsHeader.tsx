import { useThemeColor } from "@/hooks/use-theme-color";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, View } from "react-native";
import { ThemedText } from "../ui/Themed";

type HeaderProps = {
  total: number;
  percentage: number;
  jobsCount: number;
  avg: number;
};

export function EarningsHeader({
  total,
  percentage,
  jobsCount,
  avg,
}: HeaderProps) {
  const tint = useThemeColor({}, "tint");
  const isPositive = percentage >= 0;

  return (
    <View style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        Earnings
      </ThemedText>
      <ThemedText type="subtitle" style={styles.subtitle}>
        Track your income
      </ThemedText>

      <View style={styles.mainStat}>
        <ThemedText style={styles.currency}>₦</ThemedText>
        <ThemedText type="title" style={styles.amount}>
          {total.toLocaleString()}
        </ThemedText>
      </View>

      <View style={styles.row}>
        <View
          style={[
            styles.badge,
            { backgroundColor: isPositive ? "#E8F5E9" : "#FFEBEE" },
          ]}
        >
          <Ionicons
            name={isPositive ? "trending-up" : "trending-down"}
            size={14}
            color={isPositive ? "#43A047" : "#D32F2F"}
          />
          <ThemedText
            style={[
              styles.percentage,
              { color: isPositive ? "#43A047" : "#D32F2F" },
            ]}
          >
            {isPositive ? "+" : ""}
            {percentage}%
          </ThemedText>
        </View>
        <ThemedText style={styles.comparison}>from last month</ThemedText>
      </View>

      <View style={styles.statsGrid}>
        <View style={styles.statBox}>
          <ThemedText style={styles.statLabel}>{jobsCount} jobs</ThemedText>
          <ThemedText style={styles.statSub}>Completed</ThemedText>
        </View>
        <View
          style={[styles.divider, { backgroundColor: tint, opacity: 0.2 }]}
        />
        <View style={styles.statBox}>
          <ThemedText style={styles.statLabel}>
            ₦{avg.toLocaleString()}
          </ThemedText>
          <ThemedText style={styles.statSub}>Avg. per job</ThemedText>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginTop: 10 },
  title: { fontSize: 28, fontWeight: "800" },
  subtitle: { fontSize: 16, opacity: 0.5, marginBottom: 18 },

  mainStat: {
    flexDirection: "row",
    alignItems: "baseline",
  },

  currency: {
    fontSize: 30,
    fontWeight: "700",
    marginRight: 4,
  },

  amount: {
    fontSize: 48,
    fontWeight: "800",
    letterSpacing: -1,
    lineHeight: 54,
    textAlignVertical: "center",
  },
  row: { flexDirection: "row", alignItems: "center", marginTop: 8, gap: 8 },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  percentage: { fontSize: 13, fontWeight: "700" },
  comparison: { fontSize: 13, opacity: 0.5 },
  statsGrid: {
    flexDirection: "row",
    marginTop: 24,
    alignItems: "center",
    gap: 20,
  },
  statBox: { flex: 1 },
  statLabel: { fontSize: 17, fontWeight: "700" },
  statSub: { fontSize: 12, opacity: 0.5, marginTop: 2 },
  divider: { width: 1, height: 30 },
});
