import { BankPickerModal } from "@/components/BankPickerModal";
import { ThemedButton, ThemedText } from "@/components/ui/Themed";
import { BankLogos } from "@/constants/BankLogos";
import { NIGERIAN_BANKS, BankInterface } from "@/data/banks";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useResolveBank, useUpdatePayoutDetails } from "@/hooks/useProfile";
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

  // View/Edit State Logic
  const hasExistingDetails = !!profile?.payoutDetails?.accountNumber;
  const [isEditing, setIsEditing] = useState(!hasExistingDetails);

  // Form State
  const [selectedBank, setSelectedBank] = useState<BankInterface | null>(null);
  const [accountNumber, setAccountNumber] = useState("");
  const [accountName, setAccountName] = useState("");
  const [isVerified, setIsVerified] = useState(false);

  const bankPickerRef = useRef<BottomSheetModal>(null);

  // Theme
  const tint = useThemeColor({}, "tint");
  const cardBg = useThemeColor({}, "card");
  const border = useThemeColor({}, "border");
  const textColor = useThemeColor({}, "text");
  const textMuted = "#999";

  const { mutateAsync: savePayout, isPending: saving } =
    useUpdatePayoutDetails();
  const { mutate: resolveAccount, isPending: isVerifying } = useResolveBank();

  // Load existing data
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

  // Auto-resolve (Only runs when editing)
  useEffect(() => {
    if (!isEditing) return;

    const isNewInput =
      accountNumber !== profile?.payoutDetails?.accountNumber ||
      selectedBank?.code !== profile?.payoutDetails?.bankCode;

    if (accountNumber.length === 10 && selectedBank?.code && isNewInput) {
      handleVerify();
    } else if (accountNumber.length !== 10) {
      setAccountName("");
      setIsVerified(false);
    }
  }, [accountNumber, selectedBank, isEditing]);

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
          }
        },
        onError: (err: ApiError) => {
          setIsVerified(false);
          setAccountName("");
          Alert.alert(
            "Verification Failed",
            err?.message || "Invalid account details",
          );
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
        accountNumber,
        accountName,
      },
      {
        onSuccess: () => {
          setIsEditing(false);
          if (Platform.OS === "android")
            ToastAndroid.show("Updated successfully", ToastAndroid.SHORT);
        },
      },
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Header Toggle */}
        <View style={styles.headerRow}>
          <ThemedText style={styles.description}>
            {isEditing
              ? "Enter your new payout destination."
              : "Your verified payout account."}
          </ThemedText>
          {hasExistingDetails && (
            <Pressable
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                setIsEditing(!isEditing);
              }}
              style={[
                styles.editBtn,
                { borderColor: isEditing ? tint : border },
              ]}
            >
              <ThemedText
                style={{
                  color: isEditing ? tint : textColor,
                  fontSize: 12,
                  fontWeight: "700",
                }}
              >
                {isEditing ? "CANCEL" : "EDIT"}
              </ThemedText>
            </Pressable>
          )}
        </View>

        {!isEditing ? (
          /* VIEW MODE: Secure Card Display */
          <View
            style={[
              styles.viewCard,
              { backgroundColor: cardBg, borderColor: border },
            ]}
          >
            <View style={styles.cardHeader}>
              <Image
                source={
                  BankLogos[selectedBank?.slug || ""] ||
                  BankLogos["default-image"]
                }
                style={styles.cardBankLogo}
                contentFit="contain"
              />
              <Ionicons name="shield-checkmark" size={20} color="#43A047" />
            </View>
            <ThemedText style={styles.viewAccountName}>
              {accountName}
            </ThemedText>
            <ThemedText style={styles.viewAccountNumber}>
              {selectedBank?.name} • ****{accountNumber.slice(-4)}
            </ThemedText>
            <View style={styles.verifiedBadge}>
              <ThemedText style={styles.verifiedText}>
                VERIFIED ACCOUNT
              </ThemedText>
            </View>
          </View>
        ) : (
          /* EDIT MODE: Form Display */
          <View style={styles.form}>
            <ThemedText style={styles.label}>Bank Name</ThemedText>
            <Pressable
              style={[
                styles.inputContainer,
                { backgroundColor: cardBg, borderColor: border },
              ]}
              onPress={() => bankPickerRef.current?.present()}
            >
              <View style={styles.bankSelectionLeft}>
                <Image
                  source={
                    BankLogos[selectedBank?.slug || ""] ||
                    BankLogos["default-image"]
                  }
                  style={styles.miniLogo}
                  contentFit="contain"
                />
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

            <ThemedText style={styles.label}>Account Name</ThemedText>
            <View
              style={[
                styles.inputContainer,
                styles.readOnly,
                {
                  backgroundColor: cardBg,
                  borderColor: isVerified ? "#43A047" : border,
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
                  ? "Verifying..."
                  : accountName || "Account holder name"}
              </ThemedText>
              {isVerified && (
                <Ionicons name="checkmark-circle" size={22} color="#43A047" />
              )}
            </View>

            <ThemedButton
              title="Save Changes"
              disabled={!isVerified || isVerifying || saving}
              loading={saving}
              onPress={onSavePayout}
              style={{ marginTop: 20 }}
            />
          </View>
        )}

        {profile?.payoutDetails?.verifiedAt && (
          <ThemedText style={styles.lastUpdated}>
            Securely verified on{" "}
            {dayjs(profile.payoutDetails.verifiedAt).format("MMM DD, YYYY")}
          </ThemedText>
        )}
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
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 24,
  },
  description: { fontSize: 14, opacity: 0.6, flex: 1, marginRight: 10 },
  editBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },

  // View Card Styles
  viewCard: { padding: 24, borderRadius: 24, borderWidth: 1, gap: 8 },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  cardBankLogo: { width: 40, height: 40 },
  viewAccountName: { fontSize: 20, fontWeight: "900", letterSpacing: 0.5 },
  viewAccountNumber: { fontSize: 15, opacity: 0.7, fontWeight: "600" },
  verifiedBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#43A04715",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    marginTop: 10,
  },
  verifiedText: { color: "#43A047", fontSize: 10, fontWeight: "800" },

  // Form Styles
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
  miniLogo: { width: 24, height: 24 },
  inputText: { fontSize: 16 },
  input: { flex: 1, fontSize: 16, fontWeight: "600" },
  readOnly: { borderStyle: "solid" },
  lastUpdated: {
    fontSize: 12,
    opacity: 0.5,
    marginTop: 24,
    textAlign: "center",
  },
});
