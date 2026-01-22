import { useThemeColor } from "@/hooks/use-theme-color";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { ThemedText } from "../ui/Themed";

interface QuickActionProps {
  title: string;
  description?: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  variant?: "default" | "danger";
}

export const QuickAction = ({
  title,
  description,
  icon,
  onPress,
  variant = "default",
}: QuickActionProps) => {
  const cardBg = useThemeColor({}, "card");
  const border = useThemeColor({}, "border");
  const textSecondary = useThemeColor({}, "textSecondary");
  const tint = useThemeColor({}, "tint");

  const iconColor = variant === "danger" ? "#EF4444" : tint;

  return (
    <TouchableOpacity
      style={[
        styles.container,
        { backgroundColor: cardBg, borderColor: border },
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View
        style={[styles.iconContainer, { backgroundColor: iconColor + "10" }]}
      >
        <Ionicons name={icon} size={22} color={iconColor} />
      </View>

      <View style={styles.textContainer}>
        <ThemedText style={styles.title}>{title}</ThemedText>
        {description && (
          <ThemedText style={[styles.description, { color: textSecondary }]}>
            {description}
          </ThemedText>
        )}
      </View>

      <Ionicons
        name="chevron-forward"
        size={18}
        color={textSecondary}
        style={{ opacity: 0.5 }}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 12,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontSize: 15,
    fontWeight: "700",
  },
  description: {
    fontSize: 12,
    lineHeight: 16,
  },
});
