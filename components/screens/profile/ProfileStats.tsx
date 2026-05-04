import React from "react";
import { View, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ThemedText } from "@/components/ui/Themed";

interface Props {
  rating: number;
  reviewCount: number;
  weightedRating: number;
}

export function ProfileStats({ rating, reviewCount, weightedRating }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.statItem}>
        <View style={styles.row}>
          <Ionicons name="star" size={16} color="#FFCC00" />
          <ThemedText style={styles.statValue}>{rating.toFixed(1)}</ThemedText>
        </View>
        <ThemedText style={styles.statLabel}>{reviewCount} Reviews</ThemedText>
      </View>

      <View style={styles.divider} />

      <View style={styles.statItem}>
        <View style={styles.row}>
          <Ionicons name="trending-up" size={16} color="#4CAF50" />
          <ThemedText style={styles.statValue}>
            {weightedRating.toFixed(2)}
          </ThemedText>
        </View>
        <ThemedText style={styles.statLabel}>Score Weight</ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "rgba(0,0,0,0.03)",
    borderRadius: 16,
    paddingVertical: 12,
    width: "90%",
    marginVertical: 15,
  },
  statItem: { flex: 1, alignItems: "center" },
  row: { flexDirection: "row", alignItems: "center", gap: 4 },
  statValue: { fontSize: 18, fontWeight: "800" },
  statLabel: {
    fontSize: 11,
    opacity: 0.5,
    fontWeight: "600",
    textTransform: "uppercase",
  },
  divider: {
    width: 1,
    height: "70%",
    backgroundColor: "rgba(0,0,0,0.1)",
    alignSelf: "center",
  },
});
