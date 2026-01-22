import { useThemeColor } from "@/hooks/use-theme-color";
import { groupBookingsByMonth } from "@/lib/utils/booking.utils";
import { BookingListItem, BookingTab } from "@/types/booking.types";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useMemo } from "react";
import {
  Dimensions,
  Pressable,
  SectionList,
  StyleSheet,
  View,
} from "react-native";
import { ThemedText } from "../ui/Themed";
import { PastBookingCard } from "./PastBookingCard";
import { PendingBookingCard } from "./PendingBookingCard";
import { UpcomingBookingCard } from "./UpcomingBookingCard";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

interface Props {
  bookings: BookingListItem[];
  type: BookingTab;
  isRefetching: boolean;
  isError?: boolean;
  refetch: () => void;
}

export function BookingSectionList({
  bookings,
  type,
  isRefetching,
  isError,
  refetch,
}: Props) {
  const sections = useMemo(() => groupBookingsByMonth(bookings), [bookings]);
  const tint = useThemeColor({}, "tint");
  const success = useThemeColor({}, "success");
  const textSecondary = useThemeColor({}, "textSecondary");
  const danger = useThemeColor({}, "danger");

  // Configuration for Empty States
  const emptyConfig = {
    pending: {
      title: "All Caught Up!",
      sub: "You don't have any new booking requests right now. Make sure your status is set to 'Available' to receive new jobs.",
      icon: "sparkles-outline" as const,
      color: tint,
    },
    upcoming: {
      title: "Your Schedule is Clear",
      sub: "You have no confirmed bookings coming up. Once you accept a request, it will appear here.",
      icon: "calendar-outline" as const,
      color: success,
    },
    past: {
      title: "No History Yet",
      sub: "Your completed and cancelled bookings will be archived here for your records.",
      icon: "file-tray-full-outline" as const,
      color: textSecondary,
    },
  }[type];

  const renderEmptyState = () => {
    if (isError) {
      return (
        <View style={styles.emptyWrapper}>
          <View
            style={[styles.emptyIconCircle, { backgroundColor: `${danger}15` }]}
          >
            <Ionicons name="cloud-offline-outline" size={42} color={danger} />
          </View>
          <ThemedText style={styles.emptyTitle}>
            Something went wrong
          </ThemedText>
          <ThemedText style={[styles.emptySubtext, { color: textSecondary }]}>
            We couldn't load your bookings. Please check your internet
            connection and try again.
          </ThemedText>
          <Pressable
            style={[styles.emptyBtn, { backgroundColor: tint }]}
            onPress={refetch}
          >
            <ThemedText style={styles.emptyBtnText}>Try Again</ThemedText>
          </Pressable>
        </View>
      );
    }

    return (
      <View style={styles.emptyWrapper}>
        <View
          style={[
            styles.emptyIconCircle,
            { backgroundColor: `${emptyConfig.color}15` },
          ]}
        >
          <Ionicons
            name={emptyConfig.icon}
            size={42}
            color={emptyConfig.color}
          />
        </View>
        <ThemedText style={styles.emptyTitle}>{emptyConfig.title}</ThemedText>
        <ThemedText style={[styles.emptySubtext, { color: textSecondary }]}>
          {emptyConfig.sub}
        </ThemedText>

        {type === "pending" && (
          <Pressable
            style={[styles.emptyBtn, { backgroundColor: tint }]}
            onPress={() => router.push("/(tabs)/home")}
          >
            <ThemedText style={styles.emptyBtnText}>
              Check Availability
            </ThemedText>
          </Pressable>
        )}
      </View>
    );
  };

  const renderItem = ({ item }: { item: BookingListItem }) => {
    //  PENDING CATEGORY
    if (type === "pending") {
      return (
        <PendingBookingCard
          item={item}
          onAccept={(id) => console.log("Accepting", id)}
          onDecline={(id) => console.log("Declining", id)}
          onPress={() => router.push(`/booking-details/${item._id}`)}
        />
      );
    }

    // UPCOMING CATEGORY (Accepted & In Progress)
    if (type === "upcoming") {
      return (
        <UpcomingBookingCard
          item={item}
          onStart={(id) => console.log("Starting/Continuing", id)}
          onPress={() => router.push(`/booking-details/${item._id}`)}
        />
      );
    }

    //  PAST CATEGORY (Completed, Declined, Cancelled, Expired)
    return (
      <PastBookingCard
        item={item}
        onPress={() => router.push(`/booking-details/${item._id}`)}
      />
    );
  };

  return (
    <SectionList
      sections={sections}
      keyExtractor={(item) => item._id}
      stickySectionHeadersEnabled={false}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[
        styles.container,
        (!sections.length || isError) && { flex: 1 },
      ]}
      ListEmptyComponent={renderEmptyState}
      renderSectionHeader={({ section }) => (
        <ThemedText style={styles.monthHeader}>{section.title}</ThemedText>
      )}
      renderItem={renderItem}
      refreshing={isRefetching}
      onRefresh={refetch}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  monthHeader: {
    fontSize: 14,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginTop: 24,
    marginBottom: 16,
    opacity: 0.6,
  },
  emptyWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
    marginTop: SCREEN_HEIGHT * 0.1,
    marginBottom: SCREEN_HEIGHT * 0.1,
  },
  emptyIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 15,
    textAlign: "center",
    lineHeight: 22,
    opacity: 0.7,
  },
  emptyBtn: {
    marginTop: 24,
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  emptyBtnText: {
    color: "#FFF",
    fontWeight: "800",
    fontSize: 15,
  },
});
