import { ThemedText } from "@/components/ui/Themed";
import { useThemeColor } from "@/hooks/use-theme-color";
import { BookingDetails } from "@/types/booking.types";
import { Ionicons } from "@expo/vector-icons";
import dayjs from "dayjs";
import React from "react";
import { StyleSheet, View } from "react-native";

interface RatingSectionProps {
  rating: BookingDetails["rating"];
}

export function RatingSection({ rating }: RatingSectionProps) {
  const colors = {
    card: useThemeColor({}, "card"),
    border: useThemeColor({}, "border"),
    textSecondary: useThemeColor({}, "textSecondary"),
  };

  if (!rating) return null;

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.card, borderColor: colors.border },
      ]}
    >
      <View style={styles.header}>
        <View>
          <ThemedText style={styles.title}>Customer Feedback</ThemedText>
          {rating.createdAt && (
            <ThemedText style={[styles.date, { color: colors.textSecondary }]}>
              {dayjs(rating.createdAt).format("MMM DD, YYYY")}
            </ThemedText>
          )}
        </View>
        <View style={styles.stars}>
          {[1, 2, 3, 4, 5].map((s) => (
            <Ionicons
              key={s}
              name={s <= rating.score ? "star" : "star-outline"}
              size={14}
              color={s <= rating.score ? "#FFD700" : "#999"}
            />
          ))}
        </View>
      </View>

      <View style={[styles.content, { borderLeftColor: colors.border }]}>
        {rating.comment ? (
          <ThemedText style={styles.comment}>"{rating.comment}"</ThemedText>
        ) : (
          <ThemedText
            style={[styles.comment, { fontStyle: "italic", opacity: 0.5 }]}
          >
            No written review provided.
          </ThemedText>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    borderRadius: 28,
    borderWidth: 1,
    marginBottom: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  title: {
    fontSize: 14,
    fontWeight: "800",
    marginBottom: 2,
  },
  date: {
    fontSize: 11,
    fontWeight: "600",
    opacity: 0.7,
  },
  stars: {
    flexDirection: "row",
    gap: 2,
    marginTop: 2,
  },
  content: {
    paddingLeft: 12,
    borderLeftWidth: 3,
  },
  comment: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: "500",
  },
});
