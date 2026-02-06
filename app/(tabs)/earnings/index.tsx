import { BalanceCards } from "@/components/earnings/BalanceCards";
import { EarningsChart } from "@/components/earnings/EarningsChart";
import { EarningsHeader } from "@/components/earnings/EarningsHeader";
import { EarningsSkeleton } from "@/components/earnings/EarningsSkeleton";
import { RecentTransactions } from "@/components/earnings/RecentTransactions";
import { ErrorState } from "@/components/ui/ErrorState";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useEarnings } from "@/hooks/useProfile";
import * as Haptics from "expo-haptics";
import React from "react";
import { RefreshControl, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function EarningsScreen() {
  const bgColor = useThemeColor({}, "background");
  const tint = useThemeColor({}, "tint");

  const { data, isLoading, error, isRefetching, isError, refetch } =
    useEarnings();

  if (isLoading)
    return (
      <SafeAreaView
        style={{ flex: 1, backgroundColor: bgColor }}
        edges={["top"]}
      >
        <ScrollView
          style={[styles.container]}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <EarningsSkeleton />
        </ScrollView>
      </SafeAreaView>
    );

  if (isError || !data) {
    return (
      <SafeAreaView
        style={{ flex: 1, backgroundColor: bgColor }}
        edges={["top"]}
      >
        <ScrollView
          style={[styles.container]}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <ErrorState
            message={error?.message || "We couldn't find this provider."}
            onRetry={refetch}
          />
        </ScrollView>
      </SafeAreaView>
    );
  }

  const onRefresh = React.useCallback(async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    refetch();
  }, [refetch]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: bgColor }} edges={["top"]}>
      <ScrollView
        style={[styles.container]}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={onRefresh}
            tintColor={tint}
            colors={[tint]}
          />
        }
      >
        <EarningsHeader
          total={data.totalMonthly}
          percentage={data.growth}
          jobsCount={data.jobsCompleted}
          avg={data.avgPerJob}
        />

        <BalanceCards
          available={data.availableBalance}
          pending={data.pendingBalance}
          nextPayout={data.nextPayout}
        />

        <EarningsChart data={data.chartData} />

        <RecentTransactions transactions={data.transactions} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20, paddingBottom: 40, gap: 24 },
});
