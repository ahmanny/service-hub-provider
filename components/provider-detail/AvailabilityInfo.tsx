import { IAvailabilityDay } from "@/types/provider.types";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { ThemedText } from "../ui/Themed";

interface Props {
  availability: IAvailabilityDay[];
}

const DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export default function AvailabilityInfo({ availability }: Props) {
  const [showFullSchedule, setShowFullSchedule] = useState(false);
  const BRAND_GREEN = "#0BB45E";

  const getDayData = (daysToAdd: number) => {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + daysToAdd);
    return {
      dayOfWeek: targetDate.getDay(),
      label:
        daysToAdd === 0
          ? "Today"
          : daysToAdd === 1
          ? "Tomorrow"
          : DAYS[targetDate.getDay()],
    };
  };

  const renderDayRow = (dayIdx: number, label: string, isCompact = false) => {
    const config = availability.find((d) => d.dayOfWeek === dayIdx);
    const isClosed = !config || config.isClosed || config.slots.length === 0;

    return (
      <View
        key={dayIdx}
        style={[styles.dayRow, isCompact && styles.compactRow]}
      >
        <ThemedText style={styles.dayLabel}>{label}</ThemedText>
        <View style={styles.slotsContainer}>
          {isClosed ? (
            <ThemedText style={styles.closedText}>Closed</ThemedText>
          ) : (
            config.slots.map((slot, i) => (
              <ThemedText
                key={i}
                style={[styles.timeRangeText, { color: BRAND_GREEN }]}
              >
                {slot.start} - {slot.end}
              </ThemedText>
            ))
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ThemedText style={styles.title}>Availability</ThemedText>

      {renderDayRow(getDayData(0).dayOfWeek, "Today")}
      {renderDayRow(getDayData(1).dayOfWeek, "Tomorrow")}

      <Pressable
        onPress={() => setShowFullSchedule(!showFullSchedule)}
        style={styles.expandButton}
      >
        <ThemedText style={styles.expandText}>
          {showFullSchedule ? "Hide full schedule" : "See full schedule"}
        </ThemedText>
        <Ionicons
          name={showFullSchedule ? "chevron-up" : "chevron-down"}
          size={16}
          color="#666"
        />
      </Pressable>

      {showFullSchedule && (
        <View style={styles.fullSchedule}>
          {DAYS.map((_, idx) => renderDayRow(idx, DAYS[idx], true))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 20, marginVertical: 10 },
  title: { fontSize: 16, fontWeight: "700", marginBottom: 12 },
  dayRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
    alignItems: "center",
  },
  compactRow: {
    marginBottom: 8,
    opacity: 0.7,
  },
  dayLabel: {
    fontSize: 14,
    fontWeight: "600",
    opacity: 0.8,
  },
  slotsContainer: { alignItems: "flex-end" },
  timeRangeText: { fontSize: 13, fontWeight: "700" },
  closedText: { fontSize: 13, color: "#FF3B30", fontWeight: "600" },
  expandButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingVertical: 5,
  },
  expandText: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  fullSchedule: {
    marginTop: 7,
    paddingTop: 7,
  },
});
