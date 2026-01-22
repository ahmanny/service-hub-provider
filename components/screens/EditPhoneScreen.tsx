import { spacing } from "@/constants/Layout";
import { useSendOtp } from "@/hooks/auth/useAuths";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useAuthStore } from "@/stores/auth.store";
import { ApiError } from "@/types/api.error.types";
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
  Vibration,
  View,
} from "react-native";
import {
  ICountry,
  isValidPhoneNumber,
} from "react-native-international-phone-number";
import ModernPhoneInput from "../ui/PhoneInput"; // Path to your component
import { ThemedButton, ThemedText } from "../ui/Themed";

export default function EditPhoneScreen() {
  const { mutateAsync, isPending } = useSendOtp();
  const bg = useThemeColor({}, "background");
  const profile = useAuthStore((s) => s.user);
  const originalPhone = profile?.userId?.phone ?? "";

  const [loading, setLoading] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<ICountry | undefined>(
    undefined
  );
  const [localInputValue, setLocalInputValue] = useState("");

  const root = selectedCountry?.idd?.root ?? "";
  const suffix = selectedCountry?.idd?.suffixes?.[0] ?? "";
  const callingCode = `${root}${suffix}`;
  const cleanNumber = localInputValue.replace(/[^0-9]/g, "");
  const currentFullNumber = `${callingCode}${cleanNumber}`;

  const hasChanged =
    currentFullNumber !== originalPhone && cleanNumber.length > 0;

  const handleContinue = async () => {
    if (!selectedCountry || !hasChanged) return;

    setLoading(true);
    try {
      console.log(`Sending SMS to: ${currentFullNumber}`);
      const res = await mutateAsync({
        phone: currentFullNumber,
      });

      Vibration.vibrate(50);

      if (Platform.OS === "android") {
        ToastAndroid.show(res.message, ToastAndroid.SHORT);
      } else {
        Alert.alert("Success", res.message);
      }

      router.push({
        pathname: "/(tabs)/profile/verify-otp",
        params: { phone: currentFullNumber },
      });
    } catch (error) {
      const err = error as ApiError;
      const code = err.response?.data?.code ?? err.code;
      console.log(err);
      const message =
        err.response?.data?.message ?? err.message ?? "Failed to send code";

      if (code === 113) {
        // OTP already sent still continue
        router.push({
          pathname: "/(tabs)/profile/verify-otp",
          params: { phone: currentFullNumber },
        });
        return;
      }

      Vibration.vibrate(50);
      if (Platform.OS === "android") {
        ToastAndroid.show(message, ToastAndroid.LONG);
      } else {
        Alert.alert("Error", message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={[styles.container, { backgroundColor: bg }]}
      keyboardVerticalOffset={100}
    >
      <Stack.Screen options={{ title: "Update your phone" }} />

      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.inner}>
          <View style={styles.topContent}>
            <ThemedText type="subtitle" style={styles.subtitle}>
              We’ll send you a verification code via SMS.
            </ThemedText>

            <ModernPhoneInput
              defaultphone={profile?.userId?.phone ?? ""}
              localInputValue={localInputValue}
              selectedCountry={selectedCountry}
              setLocalInputValue={setLocalInputValue}
              setSelectedCountry={setSelectedCountry}
            />
          </View>

          {hasChanged && (
            <View style={styles.buttonContainer}>
              <ThemedButton
                title="Continue"
                loading={loading}
                onPress={handleContinue}
                disabled={
                  loading ||
                  !selectedCountry ||
                  !isValidPhoneNumber(localInputValue, selectedCountry)
                }
                style={styles.button}
              />
            </View>
          )}
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  inner: {
    flex: 1,
    padding: 20,
    justifyContent: "space-between",
  },
  topContent: {
    marginTop: spacing.md,
  },
  subtitle: {
    opacity: 0.6,
    marginBottom: spacing.lg,
  },
  buttonContainer: {},
  button: {
    width: "100%",
  },
});
