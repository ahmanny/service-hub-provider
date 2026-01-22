import { useThemeColor } from "@/hooks/use-theme-color";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React from "react";
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import { ThemedText } from "../ui/Themed";

interface PriceStepperProps {
  value: number;
  onChange: (val: number) => void;
  min: number; // Required
  max: number; // Required
  step?: number;
}

export function PriceStepper({
  value,
  onChange,
  min,
  max,
  step = 500,
}: PriceStepperProps) {
  // Theme Hooks
  const tint = useThemeColor({}, "tint");
  const text = useThemeColor({}, "text");
  const cardBg = useThemeColor({}, "card");
  const border = useThemeColor({}, "border");

  const handleIncrement = () => {
    if (value + step <= max) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onChange(value + step);
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    }
  };

  const handleDecrement = () => {
    if (value - step >= min) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onChange(value - step);
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    }
  };

  const handleInputChange = (textValue: string) => {
    const num = Number(textValue.replace(/[^0-9]/g, ""));
    if (num > max) {
      onChange(max);
    } else {
      onChange(num);
    }
  };

  const isMin = value <= min;
  const isMax = value >= max;

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: cardBg, borderColor: border },
      ]}
    >
      {/* Decrement Button */}
      <TouchableOpacity
        onPress={handleDecrement}
        style={[styles.button, isMin && styles.disabledButton]}
        disabled={isMin}
        activeOpacity={0.7}
      >
        <Ionicons name="remove" size={20} color={isMin ? "#CCC" : tint} />
      </TouchableOpacity>

      <View style={styles.inputWrapper}>
        <ThemedText style={[styles.currency, { color: tint }]}>₦</ThemedText>
        <TextInput
          style={[styles.input, { color: text }]}
          keyboardType="numeric"
          value={value.toLocaleString()}
          onChangeText={handleInputChange}
          onBlur={() => {
            if (value < min) onChange(min);
          }}
        />
      </View>

      {/* Increment Button */}
      <TouchableOpacity
        onPress={handleIncrement}
        style={[styles.button, isMax && styles.disabledButton]}
        disabled={isMax}
        activeOpacity={0.7}
      >
        <Ionicons name="add" size={20} color={isMax ? "#CCC" : tint} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    padding: 6,
    borderWidth: 1,
    justifyContent: "space-between",
  },
  button: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  disabledButton: {
    backgroundColor: "transparent",
    elevation: 0,
    shadowOpacity: 0,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  currency: {
    fontSize: 18,
    fontWeight: "800",
    marginRight: 2,
  },
  input: {
    fontSize: 20,
    fontWeight: "900",
    textAlign: "center",
    minWidth: 80,
    padding: 0,
    height: 50,
  },
});
