import { ThemedButton, ThemedText } from "@/components/ui/Themed";
import { fontSize, radius, spacing } from "@/constants/Layout";
import { useGetOtpCooldown, useResendOtp } from "@/hooks/auth/useAuths";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useUpdatePhone } from "@/hooks/useProfile";
import { router, Stack, useLocalSearchParams } from "expo-router";
import React, { useCallback, useRef, useState } from "react";
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableWithoutFeedback,
  Vibration,
  View,
} from "react-native";
import { OtpInput } from "react-native-otp-entry";

export default function ProfileVerifyOtp() {
  const { phone } = useLocalSearchParams<{ phone: string }>();
  const displayPhone = phone || "No number provided";
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const timerRef = useRef<number | null>(null);

  const { mutateAsync: verifyMutateAsync } = useUpdatePhone();
  const { mutateAsync: resendMutateAsync, isPending: resending } =
    useResendOtp();
  const { mutateAsync: getCooldownMutateAsync } = useGetOtpCooldown();

  const formatTime = (seconds: number) =>
    `${Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0")}:${(seconds % 60).toString().padStart(2, "0")}`;

  const bg = useThemeColor({}, "background");
  const border = useThemeColor({}, "border");
  const background = useThemeColor({}, "card");
  const textColor = useThemeColor({}, "text");

  const startTimer = useCallback((duration: number) => {
    setSecondsLeft(duration);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  React.useEffect(() => {
    const fetchCooldown = async () => {
      if (!phone) return;
      try {
        const res = await getCooldownMutateAsync({ phone });
        if (res.cooldown > 0) startTimer(res.cooldown);
      } catch {}
    };
    fetchCooldown();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [phone]);

  const handleVerify = async () => {
    if (otp.length < 4) {
      Alert.alert("Invalid OTP", "Please enter full code");
      return;
    }
    setLoading(true);
    try {
      await verifyMutateAsync({ phone, otp });
      Vibration.vibrate(50);
      if (router.canGoBack()) {
        router.dismiss(2);
      } else {
        router.navigate("/(tabs)/profile/personal-info");
      }
    } catch (err: any) {
      Platform.OS === "android"
        ? ToastAndroid.show(err.message || "Failed", ToastAndroid.LONG)
        : Alert.alert("Error", err.message || "Failed");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (secondsLeft > 0 || resending) return;
    try {
      const res = await resendMutateAsync({ phone });
      Vibration.vibrate(50);
      Platform.OS === "android"
        ? ToastAndroid.show(res.message, ToastAndroid.SHORT)
        : Alert.alert("Success", res.message);
      startTimer(res.cooldown);
    } catch (err: any) {
      Platform.OS === "android"
        ? ToastAndroid.show(err.message || "Failed", ToastAndroid.LONG)
        : Alert.alert("Error", err.message || "Failed");
    } finally {
      setOtp("");
    }
  };
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={[styles.container, { backgroundColor: bg }]}
      keyboardVerticalOffset={100}
    >
      <Stack.Screen options={{ title: "Verify code" }} />

      {/* Wrap the entire inner content here */}
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.inner}>
          <View style={styles.topContent}>
            <ThemedText style={styles.subtitle}>
              Enter the 4-digit code sent to {displayPhone}
            </ThemedText>

            <OtpInput
              numberOfDigits={4}
              autoFocus
              onTextChange={setOtp}
              theme={{
                containerStyle: {
                  justifyContent: "space-between",
                  width: "100%",
                  marginBottom: 10,
                },
                pinCodeContainerStyle: {
                  width: 60,
                  height: 60,
                  borderRadius: radius.md,
                  borderWidth: 1,
                  borderColor: border,
                  backgroundColor: background,
                  justifyContent: "center",
                  alignItems: "center",
                },
                pinCodeTextStyle: {
                  fontSize: fontSize.xl,
                  fontWeight: "600",
                  color: textColor,
                },
                focusedPinCodeContainerStyle: { borderColor: "#1E8A4B" },
              }}
            />

            <ThemedText style={styles.timerText}>
              {secondsLeft > 0 ? (
                `Resend in ${formatTime(secondsLeft)}`
              ) : (
                <Text
                  style={[styles.resendLink, { opacity: resending ? 0.5 : 1 }]}
                  onPress={handleResend}
                >
                  {resending ? "Resending..." : "Resend code"}
                </Text>
              )}
            </ThemedText>
          </View>
          <View style={styles.buttonContainer}>
            <ThemedButton
              title="Verify"
              loading={loading}
              onPress={handleVerify}
              disabled={otp.length < 4}
            />
          </View>
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
  timerText: {
    textAlign: "center",
    marginTop: spacing.md,
    color: "#666",
  },
  resendLink: {
    color: "#1E8A4B",
    fontWeight: "600",
  },
});
