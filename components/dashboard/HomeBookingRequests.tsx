import { useThemeColor } from "@/hooks/use-theme-color";
import { BookingRequest } from "@/types/dashboard";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";
import { ThemedText } from "../ui/Themed";
import { BookingRequestCard } from "./BookingRequestCard";

export default function HomeBookingRequests({
  requests,
  total,
}: {
  requests: BookingRequest[];
  total: number;
}) {
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
            New Requests ({total})
          </ThemedText>
        </View>

        {total > requests.length && (
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
            total > 5 ? (
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
                  +{total - requests.length} More
                </ThemedText>
              </TouchableOpacity>
            ) : null
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  bookingSectionContainer: { marginBottom: 24 },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  horizontalListContent: { paddingRight: 20 },

  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 12,
  },
  sectionTitle: { fontSize: 16, fontWeight: "800" },
  viewMoreText: { fontSize: 14, fontWeight: "700" },

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
});
