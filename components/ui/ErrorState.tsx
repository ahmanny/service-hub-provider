import { useThemeColor } from "@/hooks/use-theme-color";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, TouchableOpacity, View, ViewStyle } from "react-native";
import { ThemedText } from "./Themed";

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
  style?: ViewStyle;
}

export const ErrorState = ({
  message = "Something went wrong. Please try again.",
  onRetry,
  style,
}: ErrorStateProps) => {
  const tint = useThemeColor({}, "tint");
  const subtext = useThemeColor({}, "tabIconDefault"); // Greyscale/muted color

  return (
    <View style={[styles.errorContainer, style]}>
      <View style={styles.iconCircle}>
        <MaterialIcons name="cloud-off" size={40} color={tint} />
      </View>

      <ThemedText style={styles.title}>Connection Issue</ThemedText>

      <ThemedText style={[styles.message, { color: subtext }]}>
        {message}
      </ThemedText>

      {onRetry && (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onRetry}
          style={[styles.retryBtn, { backgroundColor: tint }]}
        >
          <ThemedText style={styles.retryText}>Try Again</ThemedText>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(150, 150, 150, 0.1)", // Subtle shadow/circle
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 8,
    textAlign: "center",
  },
  message: {
    fontSize: 15,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 24,
  },
  retryBtn: {
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 12,
    elevation: 2, // Android shadow
    shadowColor: "#000", // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  retryText: {
    color: "#FFF",
    fontWeight: "600",
    fontSize: 16,
  },
});
