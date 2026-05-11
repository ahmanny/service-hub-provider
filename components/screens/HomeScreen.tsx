import { StatusBanner } from "@/components/dashboard/StatusBanner";
import { spacing } from "@/constants/Layout";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useGetDashboardData } from "@/hooks/useDashboard";
import { useDismissStatusBanner } from "@/hooks/useProfile";
import { getGreeting } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth.store";
import React from "react";
import { RefreshControl, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import HomeBookingRequests from "../dashboard/HomeBookingRequests";
import HomeErrorState from "../dashboard/HomeErrorState";
import { HomeHeader } from "../dashboard/HomeHeader";
import { HomeQuickActions } from "../dashboard/HomeQuickActions";
import { HomeStatsOverview } from "../dashboard/HomeStatsOverview";
import HomeUpcomingSchedule from "../dashboard/HomeUpcomingSchedule";
import HomeScreenSkeleton from "../skeletons/HomeScreenSkeleton";

export default function Home() {
  const profile = useAuthStore((s) => s.user);

  // Colors
  const bg = useThemeColor({}, "background");
  const tint = useThemeColor({}, "tint");

  const {
    data: dashboardData,
    isLoading: isQueryLoading,
    refetch,
    isRefetching,
    error,
  } = useGetDashboardData();
  const dismissBanner = useDismissStatusBanner();

  if (!profile) return null;

  const isApproved = profile.status === "approved";
  const shouldShowBanner = !profile.statusBannerDismissed;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: bg }} edges={["top"]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: spacing.lg, paddingBottom: 70 }}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor={tint}
            colors={[tint]}
          />
        }
      >
        {/* Header Section */}
        <HomeHeader
          firstName={profile.firstName}
          greeting={getGreeting()}
          isApproved={isApproved}
          isOnline={profile.isAvailable}
        />

        {shouldShowBanner && (
          <StatusBanner
            status={profile.status}
            reason={profile.rejectionReason}
            onDismiss={dismissBanner.mutate}
          />
        )}

        {isQueryLoading ? (
          <HomeScreenSkeleton />
        ) : error || !dashboardData ? (
          <HomeErrorState onRetry={refetch} />
        ) : (
          <>
            {/*  Booking Requests */}
            {isApproved && (
              <HomeBookingRequests
                requests={dashboardData.pendingBooking.list}
                total={dashboardData.pendingBooking.total}
              />
            )}

            {/* Upcoming Schedule*/}
            {isApproved && dashboardData?.upcomingBookings && (
              <HomeUpcomingSchedule data={dashboardData.upcomingBookings} />
            )}

            {/*  Stats */}
            {isApproved && (
              <HomeStatsOverview
                earnings={dashboardData.todayStats.earnings}
                completedJobs={dashboardData.todayStats.completedJobs}
              />
            )}
          </>
        )}

        {/* Management Quick Actions */}
        <HomeQuickActions />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { padding: spacing.lg, paddingBottom: 70 },
});
