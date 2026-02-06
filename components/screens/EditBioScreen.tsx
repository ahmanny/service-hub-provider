import { ThemedText } from "@/components/ui/Themed";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useUpdateBio } from "@/hooks/useProfile";
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

const MAX_BIO_LENGTH = 250;

export default function EditBioScreen() {
  const router = useRouter();
  const profile = useAuthStore((s) => s.user);
  const { mutateAsync, isPending } = useUpdateBio();

  const [bio, setBio] = useState(profile?.bio || "");

  const tint = useThemeColor({}, "tint");
  const bg = useThemeColor({}, "background");

  const hasChanges = bio.trim() !== (profile?.bio || "");
  const charCount = bio.length;

  const handleSave = async () => {
    if (!hasChanges || isPending) return;

    try {
      await mutateAsync({ bio: bio.trim() });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.back();
    } catch (err: any) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      const msg = err.message || "Failed to update bio";
      if (Platform.OS === "android") {
        ToastAndroid.show(msg, ToastAndroid.SHORT);
      } else {
        Alert.alert("Error", msg);
      }
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: bg }]}>
      <Stack.Screen
        options={{
          title: "Edit Bio",
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
            Briefly describe your expertise, years of experience, or what makes
            your service unique. This helps customers trust you.
          </ThemedText>
        </View>

        <View style={styles.inputContainer}>
          <ThemedText style={styles.label}>About You</ThemedText>
          <ThemedInput
            value={bio}
            onChangeText={setBio}
            placeholder="I am a professional..."
            multiline
            numberOfLines={6}
            maxLength={MAX_BIO_LENGTH}
            autoFocus
            textAlignVertical="top"
            style={styles.bioInput}
          />

          <View style={styles.counterContainer}>
            <ThemedText
              style={[
                styles.counterText,
                charCount >= MAX_BIO_LENGTH && { color: "#FF3B30" },
              ]}
            >
              {charCount}/{MAX_BIO_LENGTH}
            </ThemedText>
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
    marginBottom: 24,
  },
  instruction: {
    fontSize: 13,
    opacity: 0.6,
    lineHeight: 18,
  },
  inputContainer: {
    width: "100%",
  },
  label: {
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    opacity: 0.4,
    letterSpacing: 1,
    marginBottom: 8,
    marginLeft: 4,
  },
  bioInput: {
    minHeight: 120,
    paddingTop: 12,
    paddingBottom: 12,
  },
  counterContainer: {
    alignItems: "flex-end",
    marginTop: 8,
    marginRight: 4,
  },
  counterText: {
    fontSize: 12,
    opacity: 0.5,
    fontWeight: "600",
  },
  saveText: {
    fontSize: 17,
    fontWeight: "700",
  },
});
