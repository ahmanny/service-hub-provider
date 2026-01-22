import { ThemedText } from "@/components/ui/Themed";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useUpdateName } from "@/hooks/useProfile";
import { useAuthStore } from "@/stores/auth.store";
import { Stack, router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Platform,
  StyleSheet,
  ToastAndroid,
  TouchableOpacity,
  Vibration,
  View,
} from "react-native";
import { ActivityIndicator } from "react-native-paper";
import ThemedInput from "../ui/Themed/ThemedInput";

export default function EditNameScreen() {
  const profile = useAuthStore((s) => s.user);
  const { mutateAsync, isPending } = useUpdateName();

  const [firstName, setFirstName] = useState(profile?.firstName || "");
  const [lastName, setLastName] = useState(profile?.lastName || "");

  const tint = useThemeColor({}, "tint");
  const bg = useThemeColor({}, "background");

  // Check if any data has actually changed
  const hasChanges =
    firstName.trim() !== profile?.firstName ||
    lastName.trim() !== profile?.lastName;

  const handleSave = async () => {
    if (!hasChanges || !firstName.trim() || !lastName.trim()) return;

    try {
      await mutateAsync({ firstName, lastName });
      router.back();
    } catch (err: any) {
      console.log(err);
      Vibration.vibrate(50);
      if (Platform.OS === "android") {
        ToastAndroid.show(
          err.message || "Failed to Update",
          ToastAndroid.SHORT
        );
      } else {
        Alert.alert("Error", err.message || "Failed to Update");
      }
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: bg }]}>
      <Stack.Screen
        options={{
          title: "Update your name",
          headerRight: () =>
            // Only show the button if there is a change
            hasChanges ? (
              <TouchableOpacity onPress={handleSave} disabled={isPending}>
                {isPending ? (
                  <ActivityIndicator size="small" color="#FF3B30" />
                ) : (
                  <ThemedText
                    style={{ color: tint, fontWeight: "700", fontSize: 20 }}
                  >
                    {isPending ? "Saving..." : "Save"}
                  </ThemedText>
                )}
              </TouchableOpacity>
            ) : null,
        }}
      />

      <View style={styles.content}>
        <ThemedText style={styles.instruction}>
          Please ensure your name exactly match the names on your official ID
          documents (e.g., Driver's License or Passport).
        </ThemedText>

        <View style={styles.inputGroup}>
          <ThemedText style={styles.label}>First Name</ThemedText>
          <ThemedInput
            value={firstName}
            onChangeText={setFirstName}
            placeholder="Enter first name"
            autoFocus
          />
        </View>

        <View style={styles.inputGroup}>
          <ThemedText style={styles.label}>Last Name</ThemedText>
          <ThemedInput
            value={lastName}
            onChangeText={setLastName}
            placeholder="Enter last name"
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20 },
  instruction: {
    fontSize: 14,
    opacity: 0.6,
    marginBottom: 30,
    lineHeight: 20,
  },
  inputGroup: {
    marginBottom: 8,
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
    opacity: 0.5,
    marginBottom: 8,
  },
  input: {
    fontSize: 18,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
});
