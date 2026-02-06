import { Ionicons } from "@expo/vector-icons";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import React, { useState } from "react";
import { Platform, StyleSheet, TouchableOpacity, View } from "react-native";
import Toast from "react-native-root-toast";

import { ThemedText } from "@/components/ui/Themed";
import { useThemeColor } from "@/hooks/use-theme-color";
import {
  DAYS_UI,
  DURATIONS,
  formatTimeFromDate,
  getTimeAsDate,
} from "@/lib/utils/date.utils";

interface AvailabilityManagerProps {
  selectedDays: string[];
  setSelectedDays: (days: string[]) => void;
  startTime: string;
  setStartTime: (time: string) => void;
  endTime: string;
  setEndTime: (time: string) => void;
  avgServiceTime: number;
  setAvgServiceTime: (mins: number) => void;
}

export default function AvailabilityManager({
  selectedDays,
  setSelectedDays,
  startTime,
  setStartTime,
  endTime,
  setEndTime,
  avgServiceTime,
  setAvgServiceTime,
}: AvailabilityManagerProps) {
  const [showPicker, setShowPicker] = useState(false);
  const [pickerMode, setPickerMode] = useState<"start" | "end">("start");

  const tint = useThemeColor({}, "tint");
  const cardBg = useThemeColor({}, "card");
  const border = useThemeColor({}, "border");

  const onTimeChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (Platform.OS === "android") setShowPicker(false);
    if (!selectedDate) return;

    const formattedTime = formatTimeFromDate(selectedDate);

    const startObj = getTimeAsDate(startTime);
    const endObj = getTimeAsDate(endTime);

    if (pickerMode === "start") {
      setStartTime(formattedTime);

      if (selectedDate >= endObj) {
        const pushedEnd = new Date(selectedDate.getTime() + 60 * 60000);
        setEndTime(formatTimeFromDate(pushedEnd));
      }
    } else {
      if (selectedDate <= startObj) {
        Toast.show("Your end time must be after start time", {
          duration: Toast.durations.LONG,
          position: Toast.positions.TOP,
          backgroundColor: "#FF4444",
          textColor: "#FFFFFF",
          opacity: 1,
          containerStyle: { borderRadius: 20, paddingHorizontal: 20 },
        });
        return; // Stop here! Don't update the state.
      }
      setEndTime(formattedTime);
    }
  };

  const toggleDay = (day: string) => {
    setSelectedDays(
      selectedDays.includes(day)
        ? selectedDays.filter((d) => d !== day)
        : [...selectedDays, day],
    );
  };

  return (
    <View style={styles.container}>
      {/* WORKING DAYS */}
      <View style={styles.section}>
        <ThemedText style={styles.sectionLabel}>WORKING DAYS</ThemedText>
        <View style={styles.daysGrid}>
          {DAYS_UI.map((day) => {
            const isActive = selectedDays.includes(day);
            return (
              <TouchableOpacity
                key={day}
                onPress={() => toggleDay(day)}
                style={[
                  styles.dayCircle,
                  { borderColor: border },
                  isActive && { backgroundColor: tint, borderColor: tint },
                ]}
              >
                <ThemedText
                  style={[styles.dayText, isActive && { color: "#fff" }]}
                >
                  {day}
                </ThemedText>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* TIME CARD */}
      <View
        style={[
          styles.timeCard,
          { backgroundColor: cardBg, borderColor: border },
        ]}
      >
        {[
          { mode: "start", label: "START TIME", val: startTime, icon: "time" },
          { mode: "end", label: "END TIME", val: endTime, icon: "moon" },
        ].map((item, idx) => (
          <React.Fragment key={item.mode}>
            <TouchableOpacity
              style={styles.timeRow}
              onPress={() => {
                setPickerMode(item.mode as any);
                setShowPicker(true);
              }}
            >
              <View style={styles.timeInfo}>
                <View
                  style={[styles.iconBox, { backgroundColor: `${tint}15` }]}
                >
                  <Ionicons name={item.icon as any} size={18} color={tint} />
                </View>
                <ThemedText style={styles.timeLabel}>{item.label}</ThemedText>
              </View>
              <View
                style={[styles.timePickerBtn, { backgroundColor: `${tint}15` }]}
              >
                <ThemedText style={{ fontWeight: "800", color: tint }}>
                  {item.val}
                </ThemedText>
              </View>
            </TouchableOpacity>
            {idx === 0 && (
              <View style={[styles.divider, { backgroundColor: border }]} />
            )}
          </React.Fragment>
        ))}
      </View>

      {showPicker && (
        <DateTimePicker
          value={getTimeAsDate(pickerMode === "start" ? startTime : endTime)}
          mode="time"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={onTimeChange}
        />
      )}

      {/* DURATION GRID */}
      <View style={styles.section}>
        <ThemedText style={styles.sectionLabel}>
          ESTIMATED SERVICE TIME
        </ThemedText>
        <View style={styles.durationGrid}>
          {DURATIONS.map((item) => {
            const isActive = avgServiceTime === item.value;
            return (
              <TouchableOpacity
                key={item.value}
                onPress={() => setAvgServiceTime(item.value)}
                style={[
                  styles.durationBtn,
                  { borderColor: border },
                  isActive && {
                    borderColor: tint,
                    backgroundColor: `${tint}10`,
                  },
                ]}
              >
                <ThemedText
                  style={[
                    styles.durationText,
                    isActive && { color: tint, fontWeight: "800" },
                  ]}
                >
                  {item.label}
                </ThemedText>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  section: { marginBottom: 32 },
  sectionLabel: {
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1.5,
    marginBottom: 16,
    opacity: 0.6,
  },
  daysGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  dayCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    borderWidth: 1.5,
    justifyContent: "center",
    alignItems: "center",
  },
  dayText: { fontSize: 12, fontWeight: "800" },
  timeCard: {
    borderRadius: 28,
    borderWidth: 1.5,
    padding: 20,
    marginBottom: 32,
  },
  timeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  timeInfo: { flexDirection: "row", alignItems: "center", gap: 12 },
  iconBox: {
    width: 32,
    height: 32,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  timeLabel: { fontSize: 12, fontWeight: "800", opacity: 0.6 },
  timePickerBtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  divider: { height: 1, width: "100%", marginVertical: 18, opacity: 0.5 },
  durationGrid: { flexDirection: "row", gap: 10 },
  durationBtn: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 20,
    borderWidth: 1.5,
    alignItems: "center",
  },
  durationText: { fontSize: 14, fontWeight: "700" },
});
