import { ThemedText } from "@/components/ui/Themed";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useUpdateName } from "@/hooks/useProfile";
import { useAuthStore } from "@/stores/auth.store";
import * as Haptics from "expo-haptics";
import { Stack, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Platform,
  StyleSheet,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import { ActivityIndicator } from "react-native-paper";
import ThemedInput from "../ui/Themed/ThemedInput";

export default function EditNameScreen() {
  const router = useRouter();
  const profile = useAuthStore((s) => s.user);
  const { mutateAsync, isPending } = useUpdateName();

  const [firstName, setFirstName] = useState(profile?.firstName || "");
  const [lastName, setLastName] = useState(profile?.lastName || "");

  const tint = useThemeColor({}, "tint");
  const bg = useThemeColor({}, "background");
  const border = useThemeColor({}, "border");

  const hasChanges =
    firstName.trim() !== profile?.firstName ||
    lastName.trim() !== profile?.lastName;

  const handleSave = async () => {
    if (!hasChanges || !firstName.trim() || !lastName.trim()) return;

    try {
      await mutateAsync({ firstName, lastName });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.back();
    } catch (err: any) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      if (Platform.OS === "android") {
        ToastAndroid.show(
          err.message || "Failed to Update",
          ToastAndroid.SHORT,
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
          title: "Update Name",
          headerRight: () => (
            <View style={{ marginRight: 8 }}>
              {isPending ? (
                <ActivityIndicator size="small" color={tint} />
              ) : (
                <TouchableOpacity
                  onPress={handleSave}
                  disabled={!hasChanges}
                  style={{ opacity: hasChanges ? 1 : 0.3 }}
                >
                  <ThemedText style={[styles.saveText, { color: tint }]}>
                    Save
                  </ThemedText>
                </TouchableOpacity>
              )}
            </View>
          ),
        }}
      />

      <View style={styles.content}>
        <View style={styles.infoBox}>
          <ThemedText style={styles.instruction}>
            Ensure your name matches your official ID documents (e.g., Driver's
            License). This is required for identity verification.
          </ThemedText>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>First Name</ThemedText>
            <ThemedInput
              value={firstName}
              onChangeText={setFirstName}
              placeholder="e.g. Solomon"
              autoFocus
            />
          </View>

          <View style={[styles.divider, { backgroundColor: border }]} />

          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>Last Name</ThemedText>
            <ThemedInput
              value={lastName}
              onChangeText={setLastName}
              placeholder="e.g. Ahmanny"
            />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 20, paddingTop: 10 },
  infoBox: {
    backgroundColor: "rgba(0,0,0,0.03)",
    padding: 16,
    borderRadius: 12,
    marginBottom: 32,
  },
  instruction: {
    fontSize: 13,
    opacity: 0.6,
    lineHeight: 18,
  },
  form: {
    backgroundColor: "transparent",
  },
  inputGroup: {
    marginBottom: 12,
  },
  label: {
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    opacity: 0.4,
    letterSpacing: 1,
    marginBottom: 4,
    marginLeft: 4,
  },
  saveText: {
    fontSize: 17,
    fontWeight: "700",
  },
  divider: {
    height: 1,
    width: "100%",
    marginVertical: 3,
    opacity: 0.5,
  },
});
