import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import ThemedInput from "./Themed/ThemedInput";

type PasswordInputProps = {
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
};

export default function PasswordInput({
  placeholder = "Password",
  value,
  onChangeText,
}: PasswordInputProps) {
  const [hidden, setHidden] = useState(true);
  const theme = useColorScheme() ?? "light";

  return (
    <View style={styles.container}>
      <ThemedInput
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={hidden}
        style={styles.input}
      />

      <Pressable
        onPress={() => setHidden(!hidden)}
        hitSlop={10}
        accessibilityLabel={hidden ? "Show password" : "Hide password"}
        style={styles.icon}
      >
        <Ionicons
          name={hidden ? "eye-off" : "eye"}
          size={18}
          color={Colors[theme].icon}
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    width: "100%",
  },
  input: {
    paddingRight: 40,
  },
  icon: {
    position: "absolute",
    right: 12,
    top: "50%",
    transform: [{ translateY: -9 }],
  },
});
