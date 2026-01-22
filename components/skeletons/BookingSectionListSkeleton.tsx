import { useThemeColor } from "@/hooks/use-theme-color";
import React from "react";
import { SectionList, StyleSheet, View } from "react-native";
import { ShimmerSkeleton } from "../ui/ShimmerSkeleton"; // <-- import your shimmer component

/* FAKE DATA */
const SKELETON_SECTIONS = [
  { title: "March 2026", data: Array.from({ length: 3 }) },
  { title: "February 2026", data: Array.from({ length: 4 }) },
];

/* COMPONENT */
export function BookingSectionListSkeleton() {
  return (
    <SectionList
      sections={SKELETON_SECTIONS}
      keyExtractor={(_, index) => index.toString()}
      stickySectionHeadersEnabled={false}
      contentContainerStyle={styles.container}
      renderSectionHeader={() => (
        <ShimmerSkeleton width={140} height={18} borderRadius={6} />
      )}
      renderItem={() => <BookingCardSkeleton />}
    />
  );
}

/* CARD SKELETON */
function BookingCardSkeleton() {
  const skeletonBg = useThemeColor({}, "border");
  const iconBg = useThemeColor({}, "placeholder");

  return (
    <View style={styles.card}>
      {/* Avatar */}
      <ShimmerSkeleton
        width={44}
        height={44}
        borderRadius={22}
        style={{ marginRight: 12, backgroundColor: iconBg }}
      />

      {/* Content */}
      <View style={styles.content}>
        <View style={styles.lineContainer}>
          <ShimmerSkeleton
            width="70%"
            height={14}
            borderRadius={6}
            style={{ marginBottom: 8, backgroundColor: skeletonBg }}
          />
          <ShimmerSkeleton
            width="55%"
            height={12}
            borderRadius={6}
            style={{ marginBottom: 6, backgroundColor: skeletonBg }}
          />
          <ShimmerSkeleton
            width="40%"
            height={10}
            borderRadius={6}
            style={{ backgroundColor: skeletonBg }}
          />
        </View>
      </View>

      {/* Status */}
      <ShimmerSkeleton
        width={70}
        height={26}
        borderRadius={999}
        style={{ marginLeft: 12, backgroundColor: skeletonBg }}
      />
    </View>
  );
}

/* STYLES */
const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 32,
  },

  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 16,
    marginBottom: 12,
  },

  content: {
    flex: 1,
  },

  lineContainer: {
    flexDirection: "column",
    gap: 4,
  },
});
