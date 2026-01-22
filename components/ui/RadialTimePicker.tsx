import { useThemeColor } from "@/hooks/use-theme-color";
import React, { useMemo } from "react";
import { Dimensions, StyleSheet, TouchableOpacity, View } from "react-native";
import { ThemedText } from "../ui/Themed";

const { width } = Dimensions.get("window");
const PICKER_SIZE = width * 0.8;
const RADIUS = PICKER_SIZE / 2.6;

interface Props {
  selectedDate: Date | null;
  selectedTime: Date | null;
  onSelectTime: (date: Date) => void;
  disabledHours: number[];
  startHour: number;
  endHour: number;
}

export default function RadialTimePicker({
  selectedDate,
  selectedTime,
  onSelectTime,
  disabledHours,
  startHour,
  endHour,
}: Props) {
  const tint = useThemeColor({}, "tint");
  const cardBg = useThemeColor({}, "card");
  const border = useThemeColor({}, "border");

  const slots = useMemo(() => {
    const hours = [];
    // Use selectedDate if available, otherwise fallback to today
    const baseDate = selectedDate ? new Date(selectedDate) : new Date();

    // Loop from startHour to endHour (inclusive)
    for (let h = startHour; h <= endHour; h++) {
      const slot = new Date(baseDate);
      slot.setHours(h, 0, 0, 0);
      hours.push(slot);
    }
    return hours;
  }, [selectedDate, startHour, endHour]); // Ensure these are watched!

  return (
    <View style={styles.container}>
      <View style={[styles.clockFace, { borderColor: border }]}>
        <View style={styles.centerInfo}>
          <ThemedText style={styles.centerLabel}>Selected</ThemedText>
          <ThemedText
            type="defaultSemiBold"
            style={{ color: tint, fontSize: 18 }}
          >
            {selectedTime
              ? selectedTime.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "-- : --"}
          </ThemedText>
        </View>

        {slots.map((slot, index) => {
          const hour = slot.getHours();
          const isDisabled = disabledHours.includes(hour);
          const isSelected = selectedTime?.getHours() === hour;

          // Spread slots evenly around the circle
          // If we have many slots, they might overlap;
          // we use the actual count of 'slots' to determine spacing
          const angle = (index / slots.length) * 2 * Math.PI - Math.PI / 2;
          const x = RADIUS * Math.cos(angle);
          const y = RADIUS * Math.sin(angle);

          return (
            <TouchableOpacity
              key={`${hour}-${index}`}
              disabled={isDisabled}
              onPress={() => onSelectTime(slot)}
              style={[
                styles.slot,
                {
                  transform: [{ translateX: x }, { translateY: y }],
                  backgroundColor: isSelected
                    ? tint
                    : isDisabled
                    ? "transparent"
                    : cardBg,
                  borderColor: isSelected ? tint : border,
                  opacity: isDisabled ? 0.2 : 1,
                },
              ]}
            >
              <ThemedText
                style={[styles.slotText, isSelected && { color: "#fff" }]}
              >
                {hour > 12 ? hour - 12 : hour === 0 ? 12 : hour}
              </ThemedText>
              <ThemedText
                style={[styles.period, isSelected && { color: "#fff" }]}
              >
                {hour >= 12 ? "PM" : "AM"}
              </ThemedText>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

// ... styles remain the same
const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 30,
  },
  clockFace: {
    width: PICKER_SIZE,
    height: PICKER_SIZE,
    borderRadius: PICKER_SIZE / 2,
    borderWidth: 1,
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
  },
  centerInfo: { alignItems: "center" },
  centerLabel: { fontSize: 10, opacity: 0.5, textTransform: "uppercase" },
  slot: {
    position: "absolute",
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  slotText: { fontSize: 13, fontWeight: "800" },
  period: { fontSize: 7, fontWeight: "bold" },
});
