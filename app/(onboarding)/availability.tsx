import AvailabilityManager from "@/components/profile/AvailabilityManager";
import { ThemedButton, ThemedText, ThemedView } from "@/components/ui/Themed";
import { spacing } from "@/constants/Layout";
import { useThemeColor } from "@/hooks/use-theme-color";
import {
  formatAvailabilityData,
  formatTimeForUI,
  getTimeAsDate,
} from "@/lib/utils/date.utils";
import { useOnboardingStore } from "@/stores/onboarding.store";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

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
  const [startTime, setStartTime] = useState(formatTimeForUI("09:00"));
  const [endTime, setEndTime] = useState(formatTimeForUI("18:00"));
  const [avgServiceTime, setAvgServiceTime] = useState(60);

  // Theme
  const textSecondary = useThemeColor({}, "textSecondary");

  const onContinue = () => {
    const startObj = getTimeAsDate(startTime);
    const endObj = getTimeAsDate(endTime);

    if (startObj.getTime() >= endObj.getTime()) {
      alert(
        "Wait a second! Your start time must be earlier than your end time.",
      );
      return;
    }

    const availabilityData = formatAvailabilityData(
      selectedDays,
      startTime,
      endTime,
    );

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

        <AvailabilityManager
          selectedDays={selectedDays}
          setSelectedDays={setSelectedDays}
          startTime={startTime}
          setStartTime={setStartTime}
          endTime={endTime}
          setEndTime={setEndTime}
          avgServiceTime={avgServiceTime}
          setAvgServiceTime={setAvgServiceTime}
        />
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
  footer: { paddingBottom: 40, paddingTop: 20 },
});
