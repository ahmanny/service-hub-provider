import { BookingRequestCard } from "@/components/dashboard/BookingRequestCard";
import { StatusBanner } from "@/components/dashboard/StatusBanner";
import { ThemedText, ThemedView } from "@/components/ui/Themed";
import { spacing } from "@/constants/Layout";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useGetDashboardData } from "@/hooks/useDashboard";
import { getGreeting } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth.store";
import { BookingRequest } from "@/types/dashboard";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  FlatList,
  RefreshControl,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { OnlineStatusCard } from "../dashboard/OnlineStatusCard";
import { QuickAction } from "../dashboard/QuickAction";
import { UpcomingJobCard } from "../dashboard/UpcomingJobCard";
import HomeScreenSkeleton from "../skeletons/HomeScreenSkeleton";

export default function Home() {
  const profile = useAuthStore((s) => s.user);
  const [isOnline, setIsOnline] = useState(false);
  const router = useRouter();

  // Colors
  const bg = useThemeColor({}, "background");
  const cardBg = useThemeColor({}, "card");
  const tint = useThemeColor({}, "tint");
  const border = useThemeColor({}, "border");
  const textSecondary = useThemeColor({}, "textSecondary");
  const iconBg = useThemeColor({}, "iconBg");

  const greetingText = getGreeting();

  const {
    data: dashboardData,
    isLoading: isQueryLoading,
    refetch,
    isRefetching,
    error,
  } = useGetDashboardData();

  if (!profile) return null;

  const isApproved = profile.status === "approved";

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: bg }]}
      edges={["top"]}
    >
      <ThemedView style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scroll}
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
          <View style={styles.header}>
            <ThemedText style={styles.greeting}>
              {greetingText}, {profile.firstName}
            </ThemedText>

            <OnlineStatusCard
              isApproved={isApproved}
              isOnline={profile.isAvailable}
            />
          </View>

          <StatusBanner
            status={profile.status}
            reason={profile.rejectionReason}
          />

          {isQueryLoading ? (
            <HomeScreenSkeleton />
          ) : error || !dashboardData ? (
            /* Error State */
            <View style={styles.errorContainer}>
              <Ionicons
                name="cloud-offline-outline"
                size={48}
                color={textSecondary}
              />
              <ThemedText style={styles.errorText}>
                Failed to load dashboard data.
              </ThemedText>
              <TouchableOpacity
                style={[styles.retryButton, { backgroundColor: tint }]}
                onPress={() => refetch()}
              >
                <ThemedText style={{ color: "#FFF", fontWeight: "700" }}>
                  Retry
                </ThemedText>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              {/*  Booking Requests */}
              {isApproved && dashboardData?.pendingBooking && (
                <BookingSection
                  requests={dashboardData.pendingBooking.list}
                  totalCount={dashboardData.pendingBooking.total}
                />
              )}

              {/* Upcoming Schedule*/}
              {isApproved && dashboardData?.upcomingBookings && (
                <View style={styles.upcomingWrapper}>
                  <View style={styles.sectionHeader}>
                    <View style={styles.titleRow}>
                      <Ionicons
                        name="calendar-outline"
                        size={20}
                        color={tint}
                      />
                      <ThemedText style={styles.sectionTitle}>
                        Upcoming Schedule (
                        {dashboardData.upcomingBookings.total})
                      </ThemedText>
                    </View>
                  </View>

                  {dashboardData.upcomingBookings.list.length === 0 ? (
                    /* Empty State for Upcoming Schedule */
                    <View
                      style={[
                        styles.emptyScheduleCard,
                        { backgroundColor: cardBg, borderColor: border },
                      ]}
                    >
                      <Ionicons
                        name="calendar-clear"
                        size={32}
                        color={textSecondary}
                        style={{ opacity: 0.5 }}
                      />
                      <ThemedText
                        style={[
                          styles.emptyScheduleText,
                          { color: textSecondary },
                        ]}
                      >
                        No confirmed bookings yet
                      </ThemedText>
                      <TouchableOpacity
                        onPress={() => setIsOnline(true)} // Example: encourage going online
                        style={styles.emptyScheduleLink}
                      >
                        <ThemedText
                          style={{
                            color: tint,
                            fontWeight: "700",
                            fontSize: 13,
                          }}
                        >
                          Go online to receive requests
                        </ThemedText>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    /* The List (Existing Logic) */
                    <View
                      style={[
                        styles.upcomingList,
                        { backgroundColor: cardBg, borderColor: border },
                      ]}
                    >
                      {dashboardData.upcomingBookings.list.map((job) => (
                        <UpcomingJobCard
                          key={job.id}
                          job={job}
                          onPress={() =>
                            router.push(`/booking-details/${job.id}`)
                          }
                        />
                      ))}

                      {dashboardData.upcomingBookings.total >
                        dashboardData.upcomingBookings.list.length && (
                        <TouchableOpacity
                          style={[
                            styles.viewMoreItem,
                            { borderTopColor: border },
                          ]}
                          onPress={() => router.push("/(tabs)/bookings")}
                        >
                          <ThemedText
                            style={[styles.viewMoreText, { color: tint }]}
                          >
                            View{" "}
                            {dashboardData.upcomingBookings.total -
                              dashboardData.upcomingBookings.list.length}{" "}
                            more upcoming jobs
                          </ThemedText>
                          <Ionicons
                            name="chevron-forward"
                            size={16}
                            color={tint}
                          />
                        </TouchableOpacity>
                      )}
                    </View>
                  )}
                </View>
              )}

              {/*  Stats */}
              {isApproved && (
                <>
                  <ThemedText
                    style={[styles.sectionTitle, { marginBottom: 10 }]}
                  >
                    Today's Overview
                  </ThemedText>
                  <View style={styles.statsGrid}>
                    <View
                      style={[
                        styles.statCard,
                        { backgroundColor: cardBg, borderColor: border },
                      ]}
                    >
                      <ThemedText
                        style={[styles.statLabel, { color: textSecondary }]}
                      >
                        Earnings
                      </ThemedText>
                      <ThemedText style={[styles.statValue, { color: tint }]}>
                        ₦{dashboardData.todayStats.earnings.toLocaleString()}
                      </ThemedText>
                    </View>
                    <View
                      style={[
                        styles.statCard,
                        { backgroundColor: cardBg, borderColor: border },
                      ]}
                    >
                      <ThemedText
                        style={[styles.statLabel, { color: textSecondary }]}
                      >
                        Jobs
                      </ThemedText>
                      <ThemedText style={styles.statValue}>
                        {dashboardData.todayStats.completedJobs} completed
                      </ThemedText>
                    </View>
                  </View>
                </>
              )}
            </>
          )}

          {/* Management Quick Actions */}
          <ThemedText
            style={[styles.sectionTitle, { marginTop: 24, marginBottom: 10 }]}
          >
            Management
          </ThemedText>
          <View style={styles.actionList}>
            <QuickAction
              title="Edit Profile"
              description="Bio, name, and photo"
              icon="person-outline"
              onPress={() => {}}
            />
            <QuickAction
              title="Services"
              description="Catalog and pricing"
              icon="cut-outline"
              onPress={() => {}}
            />
            <QuickAction
              title="Availability"
              description="Working hours"
              icon="calendar-outline"
              onPress={() => {}}
            />
            <QuickAction
              title="Payouts"
              description="Wallet and bank info"
              icon="wallet-outline"
              onPress={() => {}}
            />
          </View>
        </ScrollView>
      </ThemedView>
    </SafeAreaView>
  );
}

// --- Internal  Components ---

const BookingSection = ({
  requests,
  totalCount,
}: {
  requests: BookingRequest[];
  totalCount: number;
}) => {
  const router = useRouter();
  const tint = useThemeColor({}, "tint");
  const border = useThemeColor({}, "border");
  const textSecondary = useThemeColor({}, "textSecondary");
  const cardBg = useThemeColor({}, "card");

  return (
    <View style={styles.bookingSectionContainer}>
      <View style={styles.sectionHeader}>
        <View style={styles.titleRow}>
          <Ionicons name="notifications-outline" size={20} color={tint} />
          <ThemedText style={styles.sectionTitle}>
            New Requests ({totalCount})
          </ThemedText>
        </View>

        {totalCount > requests.length && (
          <TouchableOpacity onPress={() => router.push("/(tabs)/bookings")}>
            <ThemedText style={[styles.viewMoreText, { color: textSecondary }]}>
              View All
            </ThemedText>
          </TouchableOpacity>
        )}
      </View>

      {requests.length === 0 ? (
        /* Empty State Card */
        <View
          style={[
            styles.emptyStateCard,
            { backgroundColor: cardBg, borderColor: border },
          ]}
        >
          <View
            style={[
              styles.emptyIconContainer,
              { backgroundColor: tint + "10" },
            ]}
          >
            <Ionicons name="calendar-clear-outline" size={28} color={tint} />
          </View>
          <ThemedText style={styles.emptyTitle}>No new requests</ThemedText>
          <ThemedText style={[styles.emptySubtitle, { color: textSecondary }]}>
            When clients book your services, they will appear here.
          </ThemedText>
          <TouchableOpacity
            style={[styles.emptyAction, { borderColor: tint }]}
            onPress={() => router.push("/(tabs)/bookings")}
          >
            <ThemedText style={[styles.emptyActionText, { color: tint }]}>
              Check Booking History
            </ThemedText>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          horizontal
          data={requests}
          keyExtractor={(item) => item._id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalListContent}
          ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
          renderItem={({ item }) => (
            <View style={{ width: 300 }}>
              <BookingRequestCard request={item} />
            </View>
          )}
          ListFooterComponent={
            totalCount > 5 ? (
              <TouchableOpacity
                style={styles.horizontalFooter}
                onPress={() => router.push("/(tabs)/bookings")}
              >
                <View style={[styles.footerCircle, { borderColor: border }]}>
                  <Ionicons name="arrow-forward" size={24} color={tint} />
                </View>
                <ThemedText
                  style={[styles.footerCircleText, { color: textSecondary }]}
                >
                  +{totalCount - requests.length} More
                </ThemedText>
              </TouchableOpacity>
            ) : null
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { padding: spacing.lg, paddingBottom: 70 },
  header: { marginBottom: 24 },
  greeting: {
    fontSize: 23,
    fontWeight: "900",
    marginBottom: 20,
  },
  onlineStatusCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 18,
    borderRadius: 24,
    borderWidth: 1,
  },
  statusInfoRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  statusIndicator: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  statusLabel: { fontWeight: "800", fontSize: 16 },
  statusSubtext: { fontSize: 12 },
  sectionTitle: { fontSize: 16, fontWeight: "800" },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 12,
  },
  viewMoreText: { fontSize: 14, fontWeight: "700" },

  viewMoreItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderTopWidth: 1,
    gap: 4,
  },
  statsGrid: { flexDirection: "row", gap: 12 },
  statCard: { flex: 1, padding: 16, borderRadius: 16, borderWidth: 1 },
  statLabel: { fontSize: 12, marginBottom: 4 },
  statValue: { fontSize: 16, fontWeight: "800" },
  actionList: { gap: 8 },
  bookingSectionContainer: { marginBottom: 24 },
  horizontalListContent: { paddingRight: 20 },
  upcomingWrapper: { marginBottom: 24 },
  upcomingList: { borderRadius: 20, paddingHorizontal: 16, borderWidth: 1 },
  horizontalFooter: {
    width: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  footerCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  footerCircleText: { fontSize: 12, fontWeight: "700" },

  // empty states
  emptyStateCard: {
    padding: 26,
    borderRadius: 24,
    borderStyle: "dashed",
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 4,
  },
  emptySubtitle: {
    fontSize: 13,
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 18,
  },
  emptyAction: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
  },
  emptyActionText: {
    fontSize: 13,
    fontWeight: "700",
  },

  // upcoming bookings empty state
  emptyScheduleCard: {
    padding: 24,
    borderRadius: 20,
    borderWidth: 1,
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  emptyScheduleText: {
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
  emptyScheduleLink: {
    marginTop: 4,
  },

  // error state styles
  errorContainer: {
    padding: 40,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  errorText: {
    textAlign: "center",
    opacity: 0.6,
    fontSize: 15,
  },
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 12,
    marginTop: 8,
  },
});
