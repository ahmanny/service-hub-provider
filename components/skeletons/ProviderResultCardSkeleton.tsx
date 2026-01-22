import React from "react";
import { StyleSheet, View } from "react-native";
import ThemedCard from "../ui/Themed/ThemedCard";
import { ShimmerSkeleton } from "@/components/ui/ShimmerSkeleton";

export default function ProviderResultCardSkeleton() {
  return (
    <ThemedCard style={styles.card}>
      {/* Left Icon */}
      <ShimmerSkeleton width={46} height={46} borderRadius={23} />

      {/* Content */}
      <View style={styles.content}>
        {/* Top Row: Name + Rating */}
        <View style={styles.topRow}>
          <ShimmerSkeleton width="50%" height={16} borderRadius={4} />
          <ShimmerSkeleton width={40} height={14} borderRadius={4} />
        </View>

        {/* Bottom Row: Distance + Price */}
        <View style={styles.bottomRow}>
          <ShimmerSkeleton width="40%" height={12} borderRadius={4} />
          <ShimmerSkeleton width={60} height={14} borderRadius={4} />
        </View>
      </View>
    </ThemedCard>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    padding: 14,
    borderRadius: 18,
    alignItems: "center",
    marginBottom: 12,
  },

  content: {
    flex: 1,
    gap: 6,
    marginLeft: 14,
  },

  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
