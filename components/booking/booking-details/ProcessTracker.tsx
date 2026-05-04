import { ThemedText } from "@/components/ui/Themed";
import { useThemeColor } from "@/hooks/use-theme-color";
import dayjs from "dayjs";
import React from "react";
import { StyleSheet, View } from "react-native";

interface ProcessTrackerProps {
  events: {
    label: string;
    time?: string;
    done: boolean;
  }[];
}

export function ProcessTracker({ events }: ProcessTrackerProps) {
  const colors = {
    card: useThemeColor({}, "card"),
    border: useThemeColor({}, "border"),
    success: useThemeColor({}, "success"),
  };
  return (
    <View
      style={[
        styles.glassCard,
        { backgroundColor: colors.card, borderColor: colors.border },
      ]}
    >
      <ThemedText style={styles.sectionTitle}>Process Tracker</ThemedText>
      {events.map((event: any, index: number) => (
        <View key={index} style={styles.timelineRow}>
          <View style={styles.timelineLeft}>
            <View
              style={[
                styles.dot,
                {
                  backgroundColor: event.done ? colors.success : colors.border,
                },
              ]}
            />
            {index !== events.length - 1 && (
              <View style={[styles.line, { backgroundColor: colors.border }]} />
            )}
          </View>
          <View style={styles.timelineRight}>
            <ThemedText
              style={[styles.eventLabel, { opacity: event.done ? 1 : 0.5 }]}
            >
              {event.label}
            </ThemedText>
            <ThemedText style={styles.eventTime}>
              {event.time
                ? dayjs(event.time).format("ddd, MMM DD • h:mm A")
                : "Pending"}
            </ThemedText>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  glassCard: {
    padding: 20,
    borderRadius: 28,
    borderWidth: 1,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.03,
    shadowRadius: 20,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 1.5,
    opacity: 0.4,
    marginBottom: 16,
  },
  timelineRow: { flexDirection: "row", minHeight: 60 },
  timelineLeft: { alignItems: "center", width: 20, marginRight: 15 },
  dot: { width: 10, height: 10, borderRadius: 5, marginTop: 6, zIndex: 2 },
  line: { width: 2, flex: 1, marginVertical: -4 },
  timelineRight: { flex: 1 },
  eventLabel: { fontSize: 15, fontWeight: "700" },
  eventTime: { fontSize: 12, opacity: 0.5, marginTop: 2 },
});
