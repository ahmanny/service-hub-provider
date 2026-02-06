import { ThemedText } from "@/components/ui/Themed";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useUpdateEmail } from "@/hooks/useProfile";
import { useAuthStore } from "@/stores/auth.store";
import { zodResolver } from "@hookform/resolvers/zod";
import { Stack, useRouter } from "expo-router";
import React from "react";
import { Controller, useForm } from "react-hook-form";
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
import * as Haptics from "expo-haptics"; // Essential for premium feel
import z from "zod";
import ThemedInput from "../ui/Themed/ThemedInput";

const schema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type SchemaData = z.infer<typeof schema>;

export default function EditEmailScreen() {
  const router = useRouter();
  const profile = useAuthStore((s) => s.user);
  const { mutateAsync, isPending } = useUpdateEmail();

  const initialEmail = profile?.userId?.email || "";
  const isAlreadyVerified = profile?.userId?.isEmailVerified;

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<SchemaData>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: {
      email: initialEmail,
    },
  });

  const email = watch("email");
  const tint = useThemeColor({}, "tint");
  const bg = useThemeColor({}, "background");
  const border = useThemeColor({}, "border");

  const hasChanges = email.trim().toLowerCase() !== initialEmail.toLowerCase();
  const shouldShowVerificationWarning = hasChanges || (!!initialEmail && !isAlreadyVerified);

  const handleVerify = async (data: SchemaData) => {
    if (!hasChanges && isAlreadyVerified) {
      router.back();
      return;
    }

    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      await mutateAsync({ email: data.email.trim().toLowerCase() });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.back();
    } catch (err: any) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      if (Platform.OS === "android") {
        ToastAndroid.show(err.message || "Failed to Send", ToastAndroid.SHORT);
      } else {
        Alert.alert("Error", err.message || "Failed to Send");
      }
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: bg }]}>
      <Stack.Screen
        options={{
          title: "Update Email",
          headerRight: () => (
            <View style={{ marginRight: 8 }}>
              {isPending ? (
                <ActivityIndicator size="small" color={tint} />
              ) : (
                <TouchableOpacity
                  onPress={handleSubmit(handleVerify)}
                  disabled={!isValid || isPending}
                  style={{ opacity: !isValid || ( !hasChanges && isAlreadyVerified ) ? 0.3 : 1 }}
                >
                  <ThemedText style={[styles.verifyText, { color: tint }]}>
                    {hasChanges ? "Verify" : "Done"}
                  </ThemedText>
                </TouchableOpacity>
              )}
            </View>
          ),
        }}
      />

      <View style={styles.content}>
        <ThemedText style={styles.topContext}>
          Your email is used for booking receipts, security updates, and account recovery.
        </ThemedText>

        <View style={styles.inputContainer}>
          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>Email Address</ThemedText>
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, value } }) => (
                <ThemedInput
                  placeholder="name@example.com"
                  value={value}
                  onChangeText={onChange}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoFocus
                  error={errors.email?.message}
                />
              )}
            />
          </View>
        </View>

        {shouldShowVerificationWarning && (
          <View style={[styles.warningBox, { borderColor: border }]}>
            <ThemedText style={styles.verificationInstruction}>
              We'll send a verification link to this address. Changes won't take effect until the email is confirmed.
            </ThemedText>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 20, paddingTop: 10 },
  topContext: {
    fontSize: 14,
    opacity: 0.6,
    marginBottom: 32,
    lineHeight: 20,
  },
  inputContainer: {
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 5,
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
  verifyText: {
    fontSize: 17,
    fontWeight: "700",
  },
  warningBox: {
    marginTop: 10,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: 'dashed',
    backgroundColor: 'rgba(0,0,0,0.02)',
  },
  verificationInstruction: {
    fontSize: 13,
    opacity: 0.5,
    lineHeight: 18,
    textAlign: 'center',
  },
});