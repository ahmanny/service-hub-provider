import { useThemeColor } from "@/hooks/use-theme-color";
import React from "react";
import { Platform, Pressable, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ThemedText } from "../ui/Themed";

export default function StickyBookingBar({
  price,
  onBook,
}: {
  price: number;
  onBook: () => void;
}) {
  const insets = useSafeAreaInsets();
  const BRAND_GREEN = useThemeColor({}, "tint");
  const bg = useThemeColor({}, "background");
  const border = useThemeColor({}, "border");

  const safePrice = price ?? 0;

  return (
    <View
      style={[
        styles.container,
        {
          paddingBottom: Math.max(insets.bottom - 4, 12),
          backgroundColor: bg,
          borderTopColor: border,
        },
      ]}
    >
      <View style={styles.content}>
        <View style={styles.priceContainer}>
          <ThemedText style={styles.priceLabel}>TOTAL PRICE</ThemedText>
          <ThemedText style={[styles.priceValue, { color: BRAND_GREEN }]}>
            ₦{safePrice.toLocaleString()}
          </ThemedText>
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.button,
            { backgroundColor: BRAND_GREEN },
            pressed && { opacity: 0.8, transform: [{ scale: 0.98 }] },
          ]}
          onPress={onBook}
        >
          <ThemedText style={styles.buttonText}>Book Now</ThemedText>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  content: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 50,
  },
  priceContainer: {
    justifyContent: "center",
  },
  priceLabel: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.5,
    opacity: 0.5,
    marginBottom: -2,
  },
  priceValue: {
    fontSize: 20,
    fontWeight: "900",
  },
  button: {
    height: 45, 
    paddingHorizontal: 32,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "800",
    fontSize: 15,
  },
});
