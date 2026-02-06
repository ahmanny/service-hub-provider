// app/(profile-edit)/availability.tsx

import AvailabilityManager from "@/components/profile/AvailabilityManager";
import { ThemedButton, ThemedText, ThemedView } from "@/components/ui/Themed";
import { spacing } from "@/constants/Layout";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useUpdateAvailability } from "@/hooks/useProfile";
import {
  DAYS_UI,
  formatAvailabilityData,
  formatTimeForUI,
  getTimeAsDate,
} from "@/lib/utils/date.utils";
import { useAuthStore } from "@/stores/auth.store";
import { Stack, useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

export default function AvailabilityEditScreen() {
  const router = useRouter();
  const profile = useAuthStore((s) => s.user);
  const { mutateAsync: update, isPending } = useUpdateAvailability();

  const textSecondary = useThemeColor({}, "textSecondary");

  //  INITIAL STATE (Store original values)
  const initialData = useMemo(() => {
    const days = !profile?.availability
      ? ["Mon", "Tue", "Wed", "Thu", "Fri"]
      : profile.availability
          .filter((d) => !d.isClosed)
          .map((d) => DAYS_UI[d.dayOfWeek === 0 ? 6 : d.dayOfWeek - 1]);

    const start = formatTimeForUI(
      profile?.availability?.find((d) => !d.isClosed)?.slots[0]?.start ||
        "09:00",
    );

    const end = formatTimeForUI(
      profile?.availability?.find((d) => !d.isClosed)?.slots[0]?.end || "18:00",
    );

    const serviceTime = profile?.avgServiceTime || 60;

    return { days, start, end, serviceTime };
  }, [profile]);

  //  CURRENT STATE
  const [selectedDays, setSelectedDays] = useState<string[]>(initialData.days);
  const [startTime, setStartTime] = useState(initialData.start);
  const [endTime, setEndTime] = useState(initialData.end);
  const [avgServiceTime, setAvgServiceTime] = useState(initialData.serviceTime);

  //  DETECT CHANGES
  const hasChanges = useMemo(() => {
    // Compare days
    const daysChanged =
      selectedDays.length !== initialData.days.length ||
      selectedDays.some((day) => !initialData.days.includes(day));

    const timeChanged =
      startTime !== initialData.start || endTime !== initialData.end;

    const serviceTimeChanged = avgServiceTime !== initialData.serviceTime;

    return daysChanged || timeChanged || serviceTimeChanged;
  }, [selectedDays, startTime, endTime, avgServiceTime, initialData]);

  const onSave = async () => {
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

    try {
      await update({
        availability: availabilityData,
        avgServiceTime,
      });
      router.back();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen
        options={{ title: "Edit Availability", headerShadowVisible: false }}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <View style={styles.header}>
          <ThemedText type="title">Work Hours</ThemedText>
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
          title={hasChanges ? "SAVE CHANGES" : "NO CHANGES"}
          loading={isPending}
          onPress={onSave}
          disabled={!hasChanges || selectedDays.length === 0 || isPending}
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
