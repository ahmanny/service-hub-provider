import { ThemedText } from "@/components/ui/Themed";
import { useThemeColor } from "@/hooks/use-theme-color";
import { DashboardData } from "@/types/dashboard";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";
import { UpcomingJobCard } from "../dashboard/UpcomingJobCard";
import { TouchableOpacity } from "react-native";

interface Props {
  data: DashboardData["upcomingBookings"];
}

export default function HomeUpcomingSchedule({ data }: Props) {
  const router = useRouter();
  const tint = useThemeColor({}, "tint");
  const border = useThemeColor({}, "border");
  const textSecondary = useThemeColor({}, "textSecondary");
  const cardBg = useThemeColor({}, "card");

  return (
    <View style={styles.upcomingWrapper}>
      <View style={styles.sectionHeader}>
        <View style={styles.titleRow}>
          <Ionicons name="calendar-outline" size={20} color={tint} />
          <ThemedText style={styles.sectionTitle}>
            Upcoming Schedule ({data.total})
          </ThemedText>
        </View>
      </View>

      {data.list.length === 0 ? (
        /* Static Empty State */
        <View
          style={[
            styles.emptyScheduleCard,
            { backgroundColor: cardBg, borderColor: border },
          ]}
        >
          <Ionicons
            name="calendar-clear-outline"
            size={32}
            color={textSecondary}
            style={{ opacity: 0.4, marginBottom: 4 }}
          />
          <ThemedText style={styles.emptyScheduleText}>
            No confirmed bookings yet
          </ThemedText>
          <ThemedText style={[styles.hintText, { color: textSecondary }]}>
            Toggle your status to{" "}
            <ThemedText style={{ fontWeight: "700", color: tint }}>
              Online
            </ThemedText>{" "}
            to start receiving requests.
          </ThemedText>
        </View>
      ) : (
        /* The List */
        <View
          style={[
            styles.upcomingList,
            { backgroundColor: cardBg, borderColor: border },
          ]}
        >
          {data.list.map((job) => (
            <UpcomingJobCard
              key={job.id}
              job={job}
              onPress={() => router.push(`/booking-details/${job.id}`)}
            />
          ))}

          {data.total > data.list.length && (
            <TouchableOpacity
              style={[styles.viewMoreItem, { borderTopColor: border }]}
              onPress={() => router.push("/(tabs)/bookings")}
            >
              <ThemedText style={[styles.viewMoreText, { color: tint }]}>
                View {data.total - data.list.length} more upcoming jobs
              </ThemedText>
              <Ionicons name="chevron-forward" size={16} color={tint} />
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  upcomingWrapper: { marginBottom: 24 },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  sectionTitle: { fontSize: 16, fontWeight: "800" },
  upcomingList: { borderRadius: 24, paddingHorizontal: 16, borderWidth: 1 },
  viewMoreText: { fontSize: 14, fontWeight: "700" },
  viewMoreItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderTopWidth: 1,
    gap: 4,
  },
  // Simplified Empty State
  emptyScheduleCard: {
    padding: 30,
    borderRadius: 24,
    borderWidth: 1,
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
  },
  emptyScheduleText: {
    fontSize: 15,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 4,
  },
  hintText: {
    fontSize: 13,
    textAlign: "center",
    lineHeight: 18,
    paddingHorizontal: 10,
  },
});
