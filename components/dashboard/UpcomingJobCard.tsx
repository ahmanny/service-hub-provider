// @/components/dashboard/UpcomingJobCard.tsx
import { useThemeColor } from "@/hooks/use-theme-color";
import { formatBookingDate } from "@/lib/utils/date";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { ThemedText } from "../ui/Themed";

interface Props {
  job: { id: string; title: string; time: string };
  onPress: () => void;
}

export const UpcomingJobCard = ({ job, onPress }: Props) => {
  const tint = useThemeColor({}, "tint");
  const textSecondary = useThemeColor({}, "textSecondary");
  const borderColor = useThemeColor({}, "border");
  const cardBg = useThemeColor({}, "card");

  return (
    <TouchableOpacity
      style={[
        styles.container,
        { backgroundColor: cardBg, borderBottomColor: borderColor },
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.indicator, { backgroundColor: tint }]} />

      <View style={styles.content}>
        <ThemedText style={styles.title}>{job.title}</ThemedText>
        <View style={styles.timeRow}>
          <Ionicons name="time-outline" size={14} color={textSecondary} />
          <ThemedText style={[styles.timeText, { color: textSecondary }]}>
            {formatBookingDate(job.time)}
          </ThemedText>
        </View>
      </View>

      <Ionicons
        name="chevron-forward"
        size={18}
        color={textSecondary}
        style={{ opacity: 0.5 }}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  indicator: {
    width: 6,
    height: 32,
    borderRadius: 4,
    marginRight: 16,
  },
  content: {
    flex: 1,
    gap: 4,
  },
  title: {
    fontSize: 15,
    fontWeight: "700",
  },
  timeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  timeText: {
    fontSize: 13,
  },
});
