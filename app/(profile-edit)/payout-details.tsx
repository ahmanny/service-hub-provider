import { BankPickerModal } from "@/components/BankPickerModal";
import { ThemedButton, ThemedText } from "@/components/ui/Themed";
import { BankLogos } from "@/constants/BankLogos";
import { BankInterface, NIGERIAN_BANKS } from "@/data/banks";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useResolveBank, useUpdatePayoutDetails } from "@/hooks/useProfile"; // Using your existing hooks
import { useAuthStore } from "@/stores/auth.store";
import { ApiError } from "@/types/api.error.types";
import { Ionicons } from "@expo/vector-icons";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import dayjs from "dayjs";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  ToastAndroid,
  View,
} from "react-native";

export default function PayoutDetailsScreen() {
  const profile = useAuthStore((s) => s.user);

  const [selectedBank, setSelectedBank] = useState<BankInterface | null>(null);
  const [accountNumber, setAccountNumber] = useState("");
  const [accountName, setAccountName] = useState("");
  const [isVerified, setIsVerified] = useState(false);

  const bankPickerRef = useRef<BottomSheetModal>(null);
  const tint = useThemeColor({}, "tint");
  const cardBg = useThemeColor({}, "card");
  const border = useThemeColor({}, "border");
  const textColor = useThemeColor({}, "text");
  const textMuted = "#999";

  // Mutations from your useProfile hooks
  const { mutateAsync: savePayout, isPending: saving } =
    useUpdatePayoutDetails();
  const { mutate: resolveAccount, isPending: isVerifying } = useResolveBank();

  // Initial load: Sync state with profile
  useEffect(() => {
    if (profile?.payoutDetails) {
      const savedBank = NIGERIAN_BANKS.find(
        (b) => b.code === profile.payoutDetails?.bankCode,
      );

      if (savedBank) setSelectedBank(savedBank);
      setAccountNumber(profile.payoutDetails.accountNumber || "");
      setAccountName(profile.payoutDetails.accountName || "");
      setIsVerified(!!profile.payoutDetails.accountNumber);
    }
  }, [profile]);

  // Auto-resolve when 10 digits + Bank are present
  useEffect(() => {
    const isNewInput =
      accountNumber !== profile?.payoutDetails?.accountNumber ||
      selectedBank?.code !== profile?.payoutDetails?.bankCode;

    if (accountNumber.length === 10 && selectedBank?.code && isNewInput) {
      handleVerify();
    } else if (accountNumber.length !== 10) {
      setAccountName("");
      setIsVerified(false);
    }
  }, [accountNumber, selectedBank]);

  const handleVerify = () => {
    if (!selectedBank) return;

    resolveAccount(
      { accountNumber, bankCode: selectedBank.code },
      {
        onSuccess: (data) => {
          const resolvedName = data?.accountName || data?.account_name;

          if (resolvedName) {
            setAccountName(resolvedName);
            setIsVerified(true);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          } else {
            setIsVerified(false);
            Alert.alert(
              "Error",
              "Could not find an account name for this number.",
            );
          }
        },
        onError: (err: ApiError) => {
          setIsVerified(false);
          setAccountName("");
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
          const errorMsg = err?.message || "Invalid account details";
          Alert.alert("Verification Failed", errorMsg);
        },
      },
    );
  };

  const onSavePayout = async () => {
    if (!selectedBank || !isVerified || !accountName) return;

    await savePayout(
      {
        bankCode: selectedBank.code,
        bankName: selectedBank.name,
        bankSlug: selectedBank.slug,
        accountNumber: accountNumber,
        accountName: accountName,
      },
      {
        onSuccess: (data) => {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

          if (Platform.OS === "android") {
            ToastAndroid.show(
              "Payout details updated successfully",
              ToastAndroid.SHORT,
            );
          }
          router.back();
        },
        onError: (err: ApiError) => {
          console.log(err);
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
          const errorMsg = err?.message || "Something went wrong";
          Alert.alert("Update Failed", errorMsg);
        },
      },
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <ThemedText style={styles.description}>
          Your earnings will be securely sent to this verified account.
        </ThemedText>

        <View style={styles.form}>
          {/* Bank Selection */}
          <ThemedText style={styles.label}>Bank Name</ThemedText>
          <Pressable
            style={[
              styles.inputContainer,
              { backgroundColor: cardBg, borderColor: border },
            ]}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              bankPickerRef.current?.present();
            }}
          >
            <View style={styles.bankSelectionLeft}>
              {selectedBank ? (
                <View style={styles.logoContainer}>
                  <Image
                    source={
                      BankLogos[selectedBank.slug] || BankLogos["default-image"]
                    }
                    style={styles.miniLogo}
                    contentFit="contain"
                  />
                </View>
              ) : (
                <View
                  style={[styles.logoPlaceholder, { backgroundColor: border }]}
                >
                  <Ionicons name="business" size={16} color={textMuted} />
                </View>
              )}
              <ThemedText
                style={[
                  styles.inputText,
                  { color: selectedBank ? textColor : textMuted },
                ]}
              >
                {selectedBank?.name || "Select receiving bank"}
              </ThemedText>
            </View>
            <Ionicons name="chevron-down" size={20} color={textMuted} />
          </Pressable>

          {/* Account Number */}
          <ThemedText style={styles.label}>Account Number</ThemedText>
          <View
            style={[
              styles.inputContainer,
              { backgroundColor: cardBg, borderColor: border },
            ]}
          >
            <TextInput
              style={[styles.input, { color: textColor }]}
              placeholder="0123456789"
              keyboardType="number-pad"
              maxLength={10}
              value={accountNumber}
              onChangeText={setAccountNumber}
              placeholderTextColor={textMuted}
            />
            {isVerifying && <ActivityIndicator size="small" color={tint} />}
          </View>

          {/* Account Name (Verification Status) */}
          <ThemedText style={styles.label}>Account Name</ThemedText>
          <View
            style={[
              styles.inputContainer,
              styles.readOnly,
              {
                backgroundColor: cardBg,
                borderColor: isVerified ? "#43A047" : border,
                borderStyle: isVerified ? "solid" : "dashed",
              },
            ]}
          >
            <ThemedText
              style={[
                styles.inputText,
                {
                  color: isVerified ? textColor : textMuted,
                  fontWeight: isVerified ? "700" : "500",
                },
              ]}
            >
              {isVerifying
                ? "Verifying account..."
                : accountName || "Account holder name"}
            </ThemedText>
            {isVerified && (
              <Ionicons name="checkmark-circle" size={22} color="#43A047" />
            )}
          </View>
        </View>

        <View style={{ marginTop: 40 }}>
          <ThemedButton
            title="Save Payout Details"
            disabled={!isVerified || isVerifying || saving}
            loading={saving}
            onPress={onSavePayout}
          />

          {profile?.payoutDetails?.verifiedAt && (
            <ThemedText style={styles.lastUpdated}>
              Last updated:{" "}
              {dayjs(profile.payoutDetails.verifiedAt).format(
                "MMM DD, YYYY [at] h:mm A",
              )}
            </ThemedText>
          )}
        </View>
      </ScrollView>

      <BankPickerModal
        ref={bankPickerRef}
        onSelect={(bank) => setSelectedBank(bank)}
        selectedBankCode={selectedBank?.code}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  content: { padding: 20 },
  description: { fontSize: 14, opacity: 0.6, marginBottom: 24, lineHeight: 20 },
  form: { gap: 16 },
  label: {
    fontSize: 13,
    fontWeight: "600",
    marginBottom: -8,
    marginLeft: 4,
    opacity: 0.8,
  },
  inputContainer: {
    height: 60,
    borderRadius: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    borderWidth: 1,
  },
  bankSelectionLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  logoContainer: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  logoPlaceholder: {
    width: 34,
    height: 34,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  miniLogo: { width: 22, height: 22 },
  inputText: { fontSize: 16 },
  input: { flex: 1, fontSize: 16, fontWeight: "600" },
  readOnly: { borderWidth: 1.5 },
  lastUpdated: {
    fontSize: 12,
    opacity: 0.5,
    marginTop: 12,
    textAlign: "center",
  },
});
