import { ThemedButton, ThemedText, ThemedView } from "@/components/ui/Themed";
import { spacing } from "@/constants/Layout";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useOnboardingStore } from "@/stores/onboarding.store";
import { IAvailabilityDay } from "@/types/provider.types";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

const DAYS_UI = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const DAY_NAME_TO_INDEX: Record<string, number> = {
  Sun: 0,
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
};

const DURATIONS = [
  { label: "30m", value: 30 },
  { label: "1h", value: 60 },
  { label: "2h", value: 120 },
  { label: "3h+", value: 180 },
];

export default function Availability() {
  const router = useRouter();
  const updateFields = useOnboardingStore((s) => s.updateFields);

  // UI State
  const [selectedDays, setSelectedDays] = useState<string[]>([
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
  ]);
  const [startTime, setStartTime] = useState("09:00 AM");
  const [endTime, setEndTime] = useState("06:00 PM");
  const [avgServiceTime, setAvgServiceTime] = useState(60);

  const [showPicker, setShowPicker] = useState(false);
  const [pickerMode, setPickerMode] = useState<"start" | "end">("start");

  // Theme
  const tint = useThemeColor({}, "tint");
  const tintLight = useThemeColor({}, "tintLight");
  const textSecondary = useThemeColor({}, "textSecondary");
  const cardBg = useThemeColor({}, "card");
  const border = useThemeColor({}, "border");

  const toggleDay = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const getTimeAsDate = (timeStr: string) => {
    const [time, modifier] = timeStr.split(" ");
    let [hours, minutes] = time.split(":").map(Number);
    if (modifier === "PM" && hours < 12) hours += 12;
    if (modifier === "AM" && hours === 12) hours = 0;
    const d = new Date();
    d.setHours(hours, minutes, 0, 0);
    return d;
  };

  const onTimeChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (Platform.OS === "android") setShowPicker(false);

    if (selectedDate) {
      const formattedTime = selectedDate
        .toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })
        .toUpperCase();

      if (pickerMode === "start") {
        setStartTime(formattedTime);
      } else {
        setEndTime(formattedTime);
      }
    }
  };

  const openPicker = (mode: "start" | "end") => {
    setPickerMode(mode);
    setShowPicker(true);
  };

  /**
   * Transforms UI state into IAvailabilityDay[]
   */
  const formatAvailability = (): IAvailabilityDay[] => {
    // Helper to convert "09:00 AM" to "09:00"
    const convertTime = (timeStr: string) => {
      const [time, modifier] = timeStr.split(" ");
      let [hours, minutes] = time.split(":");
      if (hours === "12") hours = "00";
      if (modifier === "PM") hours = (parseInt(hours, 10) + 12).toString();
      return `${hours.padStart(2, "0")}:${minutes}`;
    };

    const start = convertTime(startTime);
    const end = convertTime(endTime);

    // Generate array for all 7 days (0-6)
    return [0, 1, 2, 3, 4, 5, 6].map((index) => {
      const dayName = Object.keys(DAY_NAME_TO_INDEX).find(
        (key) => DAY_NAME_TO_INDEX[key] === index
      );
      const isSelected = dayName ? selectedDays.includes(dayName) : false;

      return {
        dayOfWeek: index,
        isClosed: !isSelected,
        slots: isSelected ? [{ start, end }] : [],
      };
    });
  };

  const onContinue = () => {
    const availabilityData = formatAvailability();

    updateFields({
      availability: availabilityData,
      avgServiceTime,
    });

    router.push("/(onboarding)/verification");
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <View style={styles.header}>
          <ThemedText type="title">Availability</ThemedText>
          <ThemedText style={[styles.subtitle, { color: textSecondary }]}>
            Set your working hours and service pace
          </ThemedText>
        </View>

        {/* WORKING DAYS PICKER */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionLabel}>WORKING DAYS</ThemedText>
          <View style={styles.daysGrid}>
            {DAYS_UI.map((day) => {
              const isActive = selectedDays.includes(day);
              return (
                <TouchableOpacity
                  key={day}
                  onPress={() => toggleDay(day)}
                  activeOpacity={0.7}
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

        {/* WORKING HOURS  */}
        <View
          style={[
            styles.timeCard,
            { backgroundColor: cardBg, borderColor: border },
          ]}
        >
          {/* Start Time Row */}
          <TouchableOpacity
            style={styles.timeRow}
            onPress={() => openPicker("start")}
            activeOpacity={0.6}
          >
            <View style={styles.timeInfo}>
              <View style={[styles.iconBox, { backgroundColor: tintLight }]}>
                <Ionicons name="time" size={18} color={"#fff"} />
              </View>
              <ThemedText style={styles.timeLabel}>START TIME</ThemedText>
            </View>
            <View
              style={[styles.timePickerBtn, { backgroundColor: tintLight }]}
            >
              <ThemedText
                style={{ opacity: 0.8, fontWeight: "800", color: "#fff" }}
              >
                {startTime}
              </ThemedText>
            </View>
          </TouchableOpacity>

          <View style={[styles.divider, { backgroundColor: border }]} />

          {/* End Time Row */}
          <TouchableOpacity
            style={styles.timeRow}
            onPress={() => openPicker("end")}
            activeOpacity={0.6}
          >
            <View style={styles.timeInfo}>
              <View style={[styles.iconBox, { backgroundColor: tintLight }]}>
                <Ionicons name="moon" size={18} color={"#fff"} />
              </View>
              <ThemedText style={styles.timeLabel}>END TIME</ThemedText>
            </View>
            <View
              style={[styles.timePickerBtn, { backgroundColor: tintLight }]}
            >
              <ThemedText
                style={{ opacity: 0.8, fontWeight: "800", color: "#fff" }}
              >
                {endTime}
              </ThemedText>
            </View>
          </TouchableOpacity>
        </View>

        {showPicker && (
          <DateTimePicker
            value={getTimeAsDate(pickerMode === "start" ? startTime : endTime)}
            mode="time"
            is24Hour={false}
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={onTimeChange}
          />
        )}

        {/* SERVICE DURATION */}
        <View style={styles.section}>
          <View style={styles.durationHeader}>
            <ThemedText style={styles.sectionLabel}>
              ESTIMATED SERVICE TIME
            </ThemedText>
            <Ionicons name="flash" size={14} color={tint} />
          </View>
          <ThemedText style={[styles.helperText, { color: textSecondary }]}>
            Approximate time needed to complete a standard task.
          </ThemedText>

          <View style={styles.durationGrid}>
            {DURATIONS.map((item) => {
              const isActive = avgServiceTime === item.value;
              return (
                <TouchableOpacity
                  key={item.value}
                  onPress={() => setAvgServiceTime(item.value)}
                  activeOpacity={0.8}
                  style={[
                    styles.durationBtn,
                    { borderColor: border },
                    isActive && {
                      borderColor: tint,
                      backgroundColor: tintLight,
                    },
                  ]}
                >
                  <ThemedText
                    style={[
                      styles.durationText,
                      isActive && { color: "#fff", fontWeight: "800" },
                    ]}
                  >
                    {item.label}
                  </ThemedText>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <ThemedButton
          title="SAVE & CONTINUE"
          onPress={onContinue}
          disabled={selectedDays.length === 0}
        />
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: spacing.lg },
  header: { marginTop: 10, marginBottom: 32 },
  subtitle: { fontSize: 16, marginTop: 4, opacity: 0.8 },

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

  durationHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 4,
  },
  helperText: { fontSize: 13, marginBottom: 16, lineHeight: 18 },
  durationGrid: { flexDirection: "row", gap: 10 },
  durationBtn: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 20,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  durationText: { fontSize: 14, fontWeight: "700" },

  footer: { paddingBottom: 40, paddingTop: 20 },
});
