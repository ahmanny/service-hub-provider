import { useThemeColor } from "@/hooks/use-theme-color";
import {
  ActivityIndicator,
  Pressable,
  PressableProps,
  StyleProp,
  TextStyle,
  ViewStyle,
} from "react-native";
import { ThemedText } from "./ThemedText";

type ButtonProps = PressableProps & {
  title: string;
  loading?: boolean;
  variant?: "primary" | "secondary" | "outline";
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>; // Added this prop
};

export function ThemedButton({
  title,
  loading = false,
  variant = "primary",
  style,
  textStyle, // Destructure here
  ...rest
}: ButtonProps) {
  const backgroundPrimary = useThemeColor({}, "buttonPrimary");
  const backgroundSecondary = useThemeColor({}, "buttonSecondary");
  const tint = useThemeColor({}, "tint");
  const border = useThemeColor({}, "border");

  // View Styles based on Variant
  const backgroundColor =
    variant === "primary"
      ? backgroundPrimary
      : variant === "secondary"
        ? backgroundSecondary
        : "transparent";

  const borderStyle =
    variant === "outline" ? { borderColor: border, borderWidth: 1 } : {};

  // Default Text Styles based on Variant
  const defaultTextColor = variant === "outline" ? tint : "#FFFFFF";

  return (
    <Pressable
      disabled={loading || rest.disabled}
      style={[
        {
          backgroundColor,
          height: 56,
          borderRadius: 16,
          alignItems: "center",
          justifyContent: "center",
          opacity: rest.disabled || loading ? 0.6 : 1,
        },
        borderStyle,
        style,
      ]}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator color={defaultTextColor} />
      ) : (
        <ThemedText
          type="defaultSemiBold"
          style={[{ color: defaultTextColor }, textStyle]} // Merged custom text styles
        >
          {title}
        </ThemedText>
      )}
    </Pressable>
  );
}
