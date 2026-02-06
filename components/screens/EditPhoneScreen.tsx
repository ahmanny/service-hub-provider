import { useSendOtp } from "@/hooks/auth/useAuths";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useAuthStore } from "@/stores/auth.store";
import { ApiError } from "@/types/api.error.types";
import * as Haptics from "expo-haptics";
import { router, Stack } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  ToastAndroid,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import {
  ICountry,
  isValidPhoneNumber,
} from "react-native-international-phone-number";
import ModernPhoneInput from "../ui/PhoneInput";
import { ThemedButton, ThemedText, ThemedView } from "../ui/Themed";

export default function EditPhoneScreen() {
  const { mutateAsync, isPending } = useSendOtp();
  const bg = useThemeColor({}, "background");
  const tint = useThemeColor({}, "tint");
  const profile = useAuthStore((s) => s.user);
  const originalPhone = profile?.userId?.phone ?? "";

  const [loading, setLoading] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<ICountry | undefined>(
    undefined,
  );
  const [localInputValue, setLocalInputValue] = useState("");

  const root = selectedCountry?.idd?.root ?? "";
  const suffix = selectedCountry?.idd?.suffixes?.[0] ?? "";
  const callingCode = `${root}${suffix}`;
  const cleanNumber = localInputValue.replace(/[^0-9]/g, "");
  const currentFullNumber = `${callingCode}${cleanNumber}`;

  const hasChanged =
    currentFullNumber !== originalPhone && cleanNumber.length > 0;
  const isPhoneValid = selectedCountry
    ? isValidPhoneNumber(localInputValue, selectedCountry)
    : false;
  const canContinue = hasChanged && isPhoneValid && !loading;

  const handleContinue = async () => {
    if (!canContinue) return;

    setLoading(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    try {
      const res = await mutateAsync({ phone: currentFullNumber });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      if (Platform.OS === "android") {
        ToastAndroid.show(res.message, ToastAndroid.SHORT);
      }

      router.push({
        pathname: "/(profile-edit)/personal-info/verify-otp",
        params: { phone: currentFullNumber },
      });
    } catch (error) {
      const err = error as ApiError;
      const code = err.response?.data?.code ?? err.code;
      const message =
        err.response?.data?.message ?? err.message ?? "Failed to send code";

      if (code === 113) {
        router.push({
          pathname: "/(profile-edit)/personal-info/verify-otp",
          params: { phone: currentFullNumber },
        });
        return;
      }

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Platform.OS === "ios"
        ? Alert.alert("Error", message)
        : ToastAndroid.show(message, ToastAndroid.LONG);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemedView style={{ flex: 1, backgroundColor: bg }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={[styles.container, { backgroundColor: bg }]}
        keyboardVerticalOffset={80}
      >
        <Stack.Screen options={{ title: "Update Phone" }} />

        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.inner}>
            <View style={styles.topContent}>
              <ThemedText style={styles.description}>
                We’ll send a secure code to verify your new phone number.
              </ThemedText>

              <View style={styles.inputSection}>
                <ThemedText style={styles.label}>Phone Number</ThemedText>
                <ModernPhoneInput
                  defaultphone={profile?.userId?.phone ?? ""}
                  localInputValue={localInputValue}
                  selectedCountry={selectedCountry}
                  setLocalInputValue={setLocalInputValue}
                  setSelectedCountry={setSelectedCountry}
                />
              </View>
            </View>

            <View style={styles.buttonContainer}>
              <ThemedButton
                title="Send Code"
                loading={loading || isPending}
                onPress={handleContinue}
                disabled={!canContinue}
                style={[
                  styles.button,
                  !canContinue && { opacity: 0.5, backgroundColor: "#ccc" }, // Or use a theme color for disabled
                ]}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  inner: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 40,
    justifyContent: "space-between",
  },
  topContent: {
    flex: 1,
  },
  description: {
    fontSize: 14,
    opacity: 0.6,
    lineHeight: 22,
    marginBottom: 32,
  },
  inputSection: {
    width: "100%",
  },
  label: {
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    opacity: 0.4,
    letterSpacing: 1.2,
    marginBottom: 12,
    marginLeft: 4,
  },
  buttonContainer: {
    marginTop: 20,
  },
  button: {
    borderRadius: 16,
    height: 56,
    elevation: 0,
    shadowOpacity: 0,
  },
});
