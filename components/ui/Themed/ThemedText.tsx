import { StyleSheet, Text, type TextProps } from "react-native";

import { fontSize, lineHeight } from "@/constants/Layout";
import { useThemeColor } from "@/hooks/use-theme-color";

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?:
    | "default"
    | "title"
    | "defaultSemiBold"
    | "subtitle"
    | "link"
    | "error";
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = "default",
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");

  return (
    <Text
      style={[
        { color },
        type === "default" ? styles.default : undefined,
        type === "title" ? styles.title : undefined,
        type === "defaultSemiBold" ? styles.defaultSemiBold : undefined,
        type === "subtitle" ? styles.subtitle : undefined,
        type === "link" ? styles.link : undefined,
        type === "error" ? styles.error : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontFamily: "Inter_500Medium",
    fontSize: 16,
    lineHeight: 24,
  },
  defaultSemiBold: {
    fontFamily: "Inter_500Medium",
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "700",
  },
  title: {
    fontFamily: "Inter_500Medium",
    fontSize: fontSize.xxl,
    fontWeight: "700",
    lineHeight: lineHeight.xl,
  },
  subtitle: {
    fontFamily: "Inter_500Medium",
    fontSize: 16,
    fontWeight: "600",
  },
  link: {
    fontFamily: "Inter_500Medium",
    lineHeight: 30,
    fontSize: 16,
    color: "#0a7ea4",
  },
  error: {
    fontFamily: "Inter_500Medium",
    lineHeight: 30,
    fontSize: 14,
    color: "red",
  },
});
