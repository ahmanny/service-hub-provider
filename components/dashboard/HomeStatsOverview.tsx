import { useThemeColor } from "@/hooks/use-theme-color";
import React from "react";
import { StyleSheet, View } from "react-native";
import { ThemedText } from "../ui/Themed";
import { DashboardData } from "@/types/dashboard";

interface Props {
  earnings: DashboardData["todayStats"]["earnings"];
  completedJobs: DashboardData["todayStats"]["completedJobs"];
}

export function HomeStatsOverview({ earnings, completedJobs }: Props) {
  const colors = {
    tint: useThemeColor({}, "tint"),
    textSecondary: useThemeColor({}, "textSecondary"),
    card: useThemeColor({}, "card"),
    border: useThemeColor({}, "border"),
  };
  return (
    <>
      <ThemedText style={[styles.sectionTitle, { marginBottom: 10 }]}>
        Today's Overview
      </ThemedText>
      <View style={styles.statsGrid}>
        <View
          style={[
            styles.statCard,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <ThemedText
            style={[styles.statLabel, { color: colors.textSecondary }]}
          >
            Earnings
          </ThemedText>
          <ThemedText style={[styles.statValue, { color: colors.tint }]}>
            ₦{earnings.toLocaleString()}
          </ThemedText>
        </View>
        <View
          style={[
            styles.statCard,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <ThemedText
            style={[styles.statLabel, { color: colors.textSecondary }]}
          >
            Jobs
          </ThemedText>
          <ThemedText style={styles.statValue}>
            {completedJobs} completed
          </ThemedText>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  sectionTitle: { fontSize: 16, fontWeight: "800" },
  statsGrid: { flexDirection: "row", gap: 12 },
  statCard: { flex: 1, padding: 16, borderRadius: 16, borderWidth: 1 },
  statLabel: { fontSize: 12, marginBottom: 4 },
  statValue: { fontSize: 16, fontWeight: "800" },
});
