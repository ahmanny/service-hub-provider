import { ThemedButton, ThemedText, ThemedView } from "@/components/ui/Themed";
import { useGetOtpCooldown, useResendOtp } from "@/hooks/auth/useAuths";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useUpdatePhone } from "@/hooks/useProfile";
import * as Haptics from "expo-haptics";
import { router, Stack, useLocalSearchParams } from "expo-router";
import React, { useCallback, useRef, useState } from "react";
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  ToastAndroid,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { OtpInput } from "react-native-otp-entry";

export default function ProfileVerifyOtp() {
  const { phone } = useLocalSearchParams<{ phone: string }>();
  const displayPhone = phone || "your number";
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const { mutateAsync: verifyMutateAsync } = useUpdatePhone();
  const { mutateAsync: resendMutateAsync, isPending: resending } =
    useResendOtp();
  const { mutateAsync: getCooldownMutateAsync } = useGetOtpCooldown();

  const tint = useThemeColor({}, "tint");
  const bg = useThemeColor({}, "background");
  const border = useThemeColor({}, "border");
  const card = useThemeColor({}, "card");
  const textColor = useThemeColor({}, "text");

  const formatTime = (seconds: number) =>
    `${Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0")}:${(seconds % 60).toString().padStart(2, "0")}`;

  const startTimer = useCallback((duration: number) => {
    setSecondsLeft(duration);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
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
  }, [phone, startTimer]);

  const handleVerify = async (codeToVerify?: string) => {
    const finalOtp = codeToVerify || otp;
    if (finalOtp.length < 4) return;

    setLoading(true);
    try {
      await verifyMutateAsync({ phone, otp: finalOtp });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      // Navigate back to the list cleanly
      if (router.canGoBack()) {
        router.dismiss(2);
      } else {
        router.replace("/(profile-edit)/personal-info");
      }
    } catch (err: any) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      const msg = err.message || "Invalid verification code";
      Platform.OS === "android"
        ? ToastAndroid.show(msg, ToastAndroid.LONG)
        : Alert.alert("Error", msg);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (secondsLeft > 0 || resending) return;
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      const res = await resendMutateAsync({ phone });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      startTimer(res.cooldown || 60);
      ToastAndroid.show("Code resent successfully", ToastAndroid.SHORT);
    } catch (err: any) {
      Alert.alert("Error", err.message || "Failed to resend");
    }
  };

  return (
    <ThemedView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
        keyboardVerticalOffset={Platform.OS === "ios" ? 120 : 90}
      >
        <Stack.Screen options={{ title: "Security Verification" }} />

        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.inner}>
            <View style={styles.topContent}>
              <ThemedText style={styles.subtitle}>
                We've sent a 4-digit code to{"\n"}
                <ThemedText style={{ fontWeight: "800", color: textColor }}>
                  {displayPhone}
                </ThemedText>
              </ThemedText>

              <OtpInput
                numberOfDigits={4}
                autoFocus
                onTextChange={(text) => {
                  setOtp(text);
                  Haptics.selectionAsync(); // Clicky feel as they type
                }}
                onFilled={(code) => handleVerify(code)}
                theme={{
                  containerStyle: styles.otpContainer,
                  pinCodeContainerStyle: {
                    ...styles.otpBox,
                    borderColor: border,
                    backgroundColor: card,
                  },
                  pinCodeTextStyle: { ...styles.otpText, color: textColor },
                  focusedPinCodeContainerStyle: {
                    borderColor: tint,
                    borderWidth: 2,
                  },
                }}
              />

              <View style={styles.timerContainer}>
                {secondsLeft > 0 ? (
                  <ThemedText style={styles.timerText}>
                    Resend code in{" "}
                    <ThemedText style={{ color: tint, fontWeight: "700" }}>
                      {formatTime(secondsLeft)}
                    </ThemedText>
                  </ThemedText>
                ) : (
                  <TouchableOpacity
                    onPress={handleResend}
                    style={styles.resendBtn}
                  >
                    <ThemedText style={[styles.resendLink, { color: tint }]}>
                      {resending ? "Resending..." : "Resend code"}
                    </ThemedText>
                  </TouchableOpacity>
                )}
              </View>
            </View>

            <View style={styles.buttonContainer}>
              <ThemedButton
                title="Verify Code"
                loading={loading}
                onPress={() => handleVerify()}
                disabled={otp.length < 4 || loading}
                style={[styles.button, otp.length < 4 && { opacity: 0.5 }]}
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
    paddingBottom: Platform.OS === "ios" ? 40 : 24,
    justifyContent: "space-between",
  },
  topContent: {
    marginTop: 20,
    alignItems: "center",
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.6,
    lineHeight: 24,
    marginBottom: 48,
    textAlign: "center",
  },
  otpContainer: {
    width: "100%",
    paddingHorizontal: 10,
    marginBottom: 32,
  },
  otpBox: {
    width: 68,
    height: 68,
    borderRadius: 16,
    borderWidth: 1.5,
  },
  otpText: {
    fontSize: 28,
    fontWeight: "700",
  },
  timerContainer: {
    marginTop: 10,
  },
  timerText: {
    fontSize: 14,
    opacity: 0.8,
  },
  resendBtn: {
    padding: 10,
  },
  resendLink: {
    fontSize: 15,
    fontWeight: "700",
    textDecorationLine: "underline",
  },
  buttonContainer: {
    width: "100%",
  },
  button: {
    height: 58,
    borderRadius: 18,
  },
});
