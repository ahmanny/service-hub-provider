import { ThemedText } from "@/components/ui/Themed";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useUpdateEmail } from "@/hooks/useProfile";
import { useAuthStore } from "@/stores/auth.store";
import { zodResolver } from "@hookform/resolvers/zod";
import { Stack, router } from "expo-router";
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
import z from "zod";
import ThemedInput from "../ui/Themed/ThemedInput";

const schema = z.object({
  email: z.email("Please enter a valid email address"),
});
type SchemaData = z.infer<typeof schema>;
export default function EditEmailScreen() {
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

  const hasChanges = email.trim().toLowerCase() !== initialEmail.toLowerCase();

  // Show warning if user changed email OR if the current one isn't verified yet
  const shouldShowVerificationWarning =
    hasChanges || (!!initialEmail && !isAlreadyVerified);

  const handleVerify = async (data: SchemaData) => {
    // Prevent unnecessary API calls
    if (!hasChanges && isAlreadyVerified) {
      router.back();
      return;
    }

    try {
      await mutateAsync({ email: data.email.trim().toLowerCase() });
      router.back();
    } catch (err: any) {
      console.log(err);
      Vibration.vibrate(50);
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
          title: "Update your Email",
          headerRight: () =>
            hasChanges ? (
              <TouchableOpacity
                onPress={handleSubmit(handleVerify)}
                disabled={!isValid || isPending}
              >
                {isPending ? (
                  <ActivityIndicator size="small" color="#FF3B30" />
                ) : (
                  <ThemedText
                    style={{ color: tint, fontWeight: "700", fontSize: 20 }}
                  >
                    Verify
                  </ThemedText>
                )}
              </TouchableOpacity>
            ) : null,
        }}
      />

      <View style={styles.content}>
        {/* TOP CONTEXT */}
        <ThemedText style={styles.topContext}>
          Your email is used for booking receipts and account recovery.
        </ThemedText>

        <View style={styles.inputGroup}>
          <ThemedText style={styles.label}>Email Address</ThemedText>

          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value } }) => (
              <ThemedInput
                placeholder="Email"
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

        {/* BOTTOM DYNAMIC INSTRUCTION */}
        {shouldShowVerificationWarning && (
          <ThemedText style={styles.verificationInstruction}>
            A verification link {initialEmail ? "was" : "will be"} sent to your
            email address. Please make sure the email is active and accessible.
          </ThemedText>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20 },
  topContext: {
    fontSize: 15,
    opacity: 0.7,
    marginBottom: 30,
    lineHeight: 22,
  },
  verificationInstruction: {
    fontSize: 13,
    color: "#666",
    marginTop: 15,
    lineHeight: 18,
    fontStyle: "italic",
  },
  inputGroup: {
    marginBottom: 5,
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
  errorText: {
    color: "#FF3B30",
    fontSize: 12,
    marginTop: 8,
  },
});
