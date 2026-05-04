import { useThemeColor } from "@/hooks/use-theme-color";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { ThemedText } from "../ui/Themed";

interface Props {
  onRetry: () => void;
}

export default function HomeErrorState({ onRetry }: Props) {
  const textSecondary = useThemeColor({}, "textSecondary");
  const tint = useThemeColor({}, "tint");
  return (
    <View style={styles.errorContainer}>
      <Ionicons name="cloud-offline-outline" size={48} color={textSecondary} />
      <ThemedText style={styles.errorText}>
        Failed to load dashboard data.
      </ThemedText>
      <TouchableOpacity
        style={[styles.retryButton, { backgroundColor: tint }]}
        onPress={() => onRetry()}
      >
        <ThemedText style={{ color: "#FFF", fontWeight: "700" }}>
          Retry
        </ThemedText>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  errorContainer: {
    padding: 40,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  errorText: {
    textAlign: "center",
    opacity: 0.6,
    fontSize: 15,
  },
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 12,
    marginTop: 8,
  },
});
