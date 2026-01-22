import { useThemeColor } from "@/hooks/use-theme-color";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Pressable, StyleProp, StyleSheet, ViewStyle } from "react-native";

interface BackButtonProps {
  onPress?: () => void;
  color?: string;
  style?: StyleProp<ViewStyle>;
  size?: number;
}

export const BackButton = ({
  onPress,
  color,
  style,
  size = 30,
}: BackButtonProps) => {
  const tint = useThemeColor({}, "tint");

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else if (router.canGoBack()) {
      router.back();
    }
  };

  return (
    <Pressable
      onPress={handlePress}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      style={({ pressed }) => [
        styles.button,
        { opacity: pressed ? 0.6 : 1 },
        style,
      ]}
    >
      <Ionicons name="chevron-back" size={size} color={color || tint} />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    marginRight: 10,
    paddingRight: 8,
    justifyContent: "center",
    alignItems: "center",
  },
});
