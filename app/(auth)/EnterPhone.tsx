import ModernPhoneInput from "@/components/ui/PhoneInput";
import { ThemedButton, ThemedText, ThemedView } from "@/components/ui/Themed";
import { spacing } from "@/constants/Layout";
import { useSendOtp } from "@/hooks/auth/useAuths";
import { useThemeColor } from "@/hooks/use-theme-color";
import { ApiError } from "@/types/api.error.types";
import { useHeaderHeight } from "@react-navigation/elements";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  ToastAndroid,
  View,
} from "react-native";
import {
  ICountry,
  isValidPhoneNumber,
} from "react-native-international-phone-number";

export default function EnterPhone() {
  const router = useRouter();
  const { mutateAsync, isPending } = useSendOtp();

  const bg = useThemeColor({}, "background");

  const [selectedCountry, setSelectedCountry] = useState<ICountry | undefined>(
    undefined
  );
  const [localInputValue, setLocalInputValue] = useState("");

  const isInputValid =
    selectedCountry && isValidPhoneNumber(localInputValue, selectedCountry);

  const handleContinue = async () => {
    if (!selectedCountry || !isInputValid) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    const root = selectedCountry.idd?.root ?? "";
    const suffix = selectedCountry.idd?.suffixes?.[0] ?? "";
    const callingCode = `${root}${suffix}`;
    const cleanNumber = localInputValue.replace(/[^0-9]/g, "");
    const phoneNumber = `${callingCode}${cleanNumber}`;

    try {
      const res = await mutateAsync({ phone: phoneNumber });

      if (Platform.OS === "android") {
        ToastAndroid.show(res.message, ToastAndroid.SHORT);
      }

      router.push(`/(auth)/VerifyOTP?phone=${encodeURIComponent(phoneNumber)}`);
    } catch (error) {
      const err = error as ApiError;
      const code = err.response?.data?.code ?? err.code;
      const message =
        err.response?.data?.message ?? err.message ?? "Failed to send code";

      if (code === 113) {
        router.push(
          `/(auth)/VerifyOTP?phone=${encodeURIComponent(phoneNumber)}`
        );
        return;
      }

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert("Authentication Error", message);
    }
  };

  return (
    <>
      <StatusBar style="auto" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1, backgroundColor: bg }}
        keyboardVerticalOffset={100}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          <ThemedView style={styles.container}>
            <View style={styles.textSection}>
              <ThemedText type="title" style={styles.title}>
                What's your number?
              </ThemedText>
              <ThemedText style={styles.subtitle}>
                We'll send a secure code to verify your identity.
              </ThemedText>
            </View>

            <View style={styles.inputSection}>
              <ModernPhoneInput
                localInputValue={localInputValue}
                selectedCountry={selectedCountry}
                setLocalInputValue={setLocalInputValue}
                setSelectedCountry={setSelectedCountry}
                defaultphone={""}
              />
              {/* <ThemedText style={styles.hintText}>
              Messaging rates may apply.
            </ThemedText> */}
            </View>

            <ThemedButton
              title="Send Code"
              loading={isPending}
              onPress={handleContinue}
              disabled={isPending || !isInputValid}
              style={[styles.button, !isInputValid && styles.disabledButton]}
              variant="primary"
            />
          </ThemedView>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
  },
  textSection: {
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    marginBottom: spacing.sm,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    opacity: 0.6,
  },
  inputSection: {
    gap: 12,
    marginBottom: "auto",
  },
  hintText: {
    fontSize: 12,
    opacity: 0.4,
    textAlign: "center",
  },
  button: {
    height: 58,
    borderRadius: 16,
    marginTop: spacing.xl,
  },
  disabledButton: {
    opacity: 0.5,
  },
});
