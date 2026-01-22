import { useThemeColor } from "@/hooks/use-theme-color";
import React from "react";
import { View, ViewProps } from "react-native";

export default function ThemedCard({ style, ...props }: ViewProps) {
  const background = useThemeColor({}, "card");
  const shadowColor = useThemeColor({}, "shadow");
  return (
    <View
      style={[
        {
          backgroundColor: background,
          borderRadius: 20,
          padding: 16,
          shadowColor,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 2,
        },
        style,
      ]}
      {...props}
    />
  );
}
