import { useThemeColor } from "@/hooks/use-theme-color";
import dayjs from "dayjs";
import React, { useMemo, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { ThemedText } from "../ui/Themed";

export function EarningsChart({ data }: { data: number[] }) {
  const tint = useThemeColor({}, "tint");
  const cardBg = useThemeColor({}, "card");
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const dynamicLabels = useMemo(() => {
    return Array.from({ length: 7 }).map((_, i) => {
      return dayjs()
        .subtract(6 - i, "days")
        .format("ddd");
    });
  }, []);

  const maxValue = Math.max(...data, 1000);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="defaultSemiBold">Earnings Overview</ThemedText>
        <View style={styles.timeframes}>
          {/* {["Week", "Month"].map((t) => ( */}
          {["Week"].map((t) => (
            <TouchableOpacity
              key={t}
              style={[
                styles.timeBtn,
                t === "Week" && { backgroundColor: tint },
              ]}
            >
              <ThemedText
                style={[styles.timeText, t === "Week" && { color: "#fff" }]}
              >
                {t}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={[styles.chartBox, { backgroundColor: cardBg }]}>
        <View style={styles.barsContainer}>
          {data.map((val, i) => {
            const height = (val / maxValue) * 100;
            return (
              <View key={i} style={styles.barWrapper}>
                {selectedDay === i && (
                  <View style={[styles.tooltip, { backgroundColor: tint }]}>
                    <ThemedText style={styles.tooltipText}>
                      ₦{val >= 1000 ? `${(val / 1000).toFixed(1)}k` : val}
                    </ThemedText>
                  </View>
                )}
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPressIn={() => setSelectedDay(i)}
                  onPressOut={() => setSelectedDay(null)}
                  style={[
                    styles.bar,
                    {
                      height: `${Math.max(height, 5)}%`,
                      backgroundColor: tint,
                      opacity: selectedDay === i ? 1 : 0.6,
                    },
                  ]}
                />
                <ThemedText style={styles.dayText}>
                  {dynamicLabels[i]}
                </ThemedText>
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 16 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  timeframes: {
    flexDirection: "row",
    backgroundColor: "#F5F5F5",
    borderRadius: 10,
    padding: 2,
  },
  timeBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  timeText: { fontSize: 12, fontWeight: "600", color: "#666" },
  chartBox: {
    padding: 20,
    borderRadius: 24,
    height: 220,
    justifyContent: "flex-end",
  },
  barsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    height: 140,
  },
  barWrapper: { alignItems: "center", flex: 1 },
  bar: { width: 12, borderRadius: 6, marginBottom: 8 },
  dayText: { fontSize: 10, opacity: 0.4, fontWeight: "600" },
  tooltip: {
    position: "absolute",
    top: -35,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    zIndex: 10,
  },
  tooltipText: { color: "#fff", fontSize: 10, fontWeight: "700" },
});
