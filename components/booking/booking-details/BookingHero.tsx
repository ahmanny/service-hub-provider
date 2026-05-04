import { ThemedText } from "@/components/ui/Themed";
import { useThemeColor } from "@/hooks/use-theme-color";
import { formatNumber } from "@/lib/utils";
import { IPrice } from "@/types/booking.types";
import { Ionicons } from "@expo/vector-icons";
import dayjs from "dayjs";
import React from "react";
import { StyleSheet, View } from "react-native";

interface HeroProps {
  serviceName: string;
  price: IPrice;
  scheduledAt: string;
}

export function BookingHero({ serviceName, price, scheduledAt }: HeroProps) {
  const colors = {
    tint: useThemeColor({}, "tint"),
    success: useThemeColor({}, "success"),
  };
  return (
    <View style={styles.hero}>
      <ThemedText style={styles.serviceName}>{serviceName}</ThemedText>
      <ThemedText style={[styles.mainPrice, { color: colors.success }]}>
        ₦{formatNumber(price.total)}
      </ThemedText>

      <View style={styles.pillRow}>
        <View style={[styles.pill, { backgroundColor: `${colors.tint}15` }]}>
          <Ionicons name="time" size={14} color={colors.tint} />
          <ThemedText style={[styles.pillText, { color: colors.tint }]}>
            {dayjs(scheduledAt).format("ddd, MMM DD • h:mm A")}
          </ThemedText>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: { alignItems: "center", marginBottom: 30 },
  serviceName: {
    fontSize: 32,
    fontWeight: "900",
    textAlign: "center",
    letterSpacing: -1,
    lineHeight: 38,
    paddingBottom: 4,
  },
  mainPrice: {
    fontSize: 26,
    fontWeight: "800",
    marginTop: 4,
    lineHeight: 38,
  },
  pillRow: { marginTop: 15 },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 25,
  },
  pillText: { fontSize: 13, fontWeight: "700" },
});
