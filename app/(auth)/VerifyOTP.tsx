import { ThemedButton, ThemedText, ThemedView } from "@/components/ui/Themed";
import { spacing } from "@/constants/Layout";
import {
  useGetOtpCooldown,
  useResendOtp,
  useVerifyOtp,
} from "@/hooks/auth/useAuths";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useHeaderHeight } from "@react-navigation/elements";
import * as Haptics from "expo-haptics";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  StyleSheet,
  ToastAndroid,
  View,
} from "react-native";
import { OtpInput } from "react-native-otp-entry";

export default function VerifyOTP() {
  const router = useRouter();
  const headerHeight = useHeaderHeight();
  const { phone } = useLocalSearchParams<{ phone: string }>();

  const [loading, setLoading] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const { mutateAsync: verifyMutateAsync } = useVerifyOtp();
  const { mutateAsync: resendMutateAsync, isPending: resending } =
    useResendOtp();
  const { mutateAsync: getCooldownMutateAsync } = useGetOtpCooldown();

  const tint = useThemeColor({}, "tint");
  const border = useThemeColor({}, "border");
  const background = useThemeColor({}, "card");
  const textColor = useThemeColor({}, "text");

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

  useEffect(() => {
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

  const handleVerify = async (otpCode: string) => {
    setLoading(true);
    try {
      await verifyMutateAsync({ phone, otp: otpCode });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.push("/(onboarding)");
    } catch (err: any) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      const msg = err.response?.data?.message || err.message || "Invalid Code";
      Platform.OS === "android"
        ? ToastAndroid.show(msg, ToastAndroid.LONG)
        : Alert.alert("Verification Failed", msg);
      setLoading(false);
    }
  };

  const onFilled = (code: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    handleVerify(code);
  };

  const handleResend = async () => {
    if (secondsLeft > 0 || resending) return;
    try {
      const res = await resendMutateAsync({ phone });
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      startTimer(res.cooldown);
    } catch (err: any) {
      Alert.alert("Error", "Could not resend code.");
    }
  };

  return (
    <ThemedView style={[styles.container]}>
      <View style={styles.content}>
        <View style={styles.textGroup}>
          <ThemedText type="title" style={styles.title}>
            Verify it's you
          </ThemedText>
          <ThemedText style={styles.subtitle}>
            Enter the code sent to{" "}
            <ThemedText style={[styles.phoneHighlight, { color: textColor }]}>
              {phone}
            </ThemedText>
          </ThemedText>
        </View>

        <View style={styles.otpWrapper}>
          {loading && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color={tint} />
              <ThemedText style={styles.loadingText}>Verifying...</ThemedText>
            </View>
          )}

          <View style={{ opacity: loading ? 0.3 : 1 }}>
            <OtpInput
              numberOfDigits={4}
              autoFocus
              onFilled={onFilled}
              disabled={loading}
              theme={{
                containerStyle: styles.otpContainer,
                pinCodeContainerStyle: {
                  ...styles.pinBox,
                  borderColor: border,
                  backgroundColor: background,
                },
                pinCodeTextStyle: { ...styles.pinText, color: textColor },
                focusedPinCodeContainerStyle: {
                  borderColor: tint,
                  borderWidth: 2,
                },
              }}
            />
          </View>
        </View>

        <View style={styles.footer}>
          {secondsLeft > 0 ? (
            <ThemedText style={styles.timerText}>
              Resend code in{" "}
              <ThemedText style={{ color: tint }}>{secondsLeft}s</ThemedText>
            </ThemedText>
          ) : (
            <ThemedButton
              title={resending ? "Sending..." : "Resend Code"}
              variant="secondary"
              onPress={handleResend}
              style={styles.resendBtn}
            />
          )}
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: spacing.xl },
  content: { flex: 1, gap: 40 },
  textGroup: { gap: 8 },
  title: { fontSize: 32, fontWeight: "800", letterSpacing: -1 },
  subtitle: { fontSize: 16, opacity: 0.6, lineHeight: 24 },
  phoneHighlight: { fontWeight: "700" },
  otpWrapper: { position: "relative", justifyContent: "center", minHeight: 80 },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 10,
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  loadingText: { fontSize: 12, fontWeight: "600", opacity: 0.8 },
  otpContainer: { width: "100%", justifyContent: "center", gap: 16 },
  pinBox: { width: 70, height: 70, borderRadius: 20, borderWidth: 1.5 },
  pinText: { fontSize: 24, fontWeight: "700" },
  footer: { alignItems: "center" },
  timerText: { fontSize: 14, fontWeight: "500", opacity: 0.7 },
  resendBtn: { backgroundColor: "transparent", height: 40 },
});
