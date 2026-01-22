import { useThemeColor } from "@/hooks/use-theme-color";
import React from "react";
import {
  KeyboardTypeOptions,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from "react-native";

type InputProps = TextInputProps & {
  label?: string; // Added label prop
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: KeyboardTypeOptions;
  error?: string;
};

export default function ThemedInput(props: InputProps) {
  const { label, error, style, ...rest } = props; // Destructure to separate custom props from rest

  const textColor = useThemeColor({}, "text");
  const border = useThemeColor({}, error ? "danger" : "border");
  const background = useThemeColor({}, "card");
  const placeholderColor = useThemeColor({}, "placeholder");
  const errorColor = useThemeColor({}, "danger");

  return (
    <View style={styles.container}>
      {/* Label Rendering */}
      {label ? (
        <Text style={[styles.label, { color: textColor }]}>{label}</Text>
      ) : null}

      <View
        style={[
          styles.inputWrapper,
          {
            borderColor: border,
            backgroundColor: background,
            // Adjust height if multiline for Bio
            height: rest.multiline ? "auto" : 56,
            minHeight: 56,
          },
        ]}
      >
        <TextInput
          {...rest}
          placeholderTextColor={placeholderColor}
          style={[
            {
              color: textColor,
              fontFamily: "Inter_500Medium",
              fontSize: 16,
              textAlignVertical: rest.multiline ? "top" : "center",
              paddingVertical: rest.multiline ? 12 : 0,
            },
            style,
          ]}
        />
      </View>

      {/* Error Rendering */}
      {error ? (
        <Text style={[styles.errorText, { color: errorColor }]}>{error}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    width: "100%",
  },
  label: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
    marginBottom: 8,
    opacity: 0.9,
  },
  inputWrapper: {
    borderRadius: 12,
    borderWidth: 1.5,
    paddingHorizontal: 16,
    justifyContent: "center",
  },
  errorText: {
    fontSize: 12,
    marginTop: 6,
    fontFamily: "Inter_400Regular",
  },
});
