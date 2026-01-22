import { ThemedButton, ThemedText, ThemedView } from "@/components/ui/Themed";
import ThemedCard from "@/components/ui/Themed/ThemedCard";
import { spacing } from "@/constants/Layout";
import { SERVICE_META } from "@/constants/services";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useCompleteProfile } from "@/hooks/useProfile";
import { useOnboardingStore } from "@/stores/onboarding.store";
import { FontAwesome6, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  ToastAndroid,
  Vibration,
  View,
} from "react-native";

export default function Summary() {
  const { mutateAsync, isPending } = useCompleteProfile();
  const router = useRouter();
  const state = useOnboardingStore();

  const [isSuccess, setIsSuccess] = useState(false);

  const tint = useThemeColor({}, "tint");
  const textSecondary = useThemeColor({}, "textSecondary");
  const border = useThemeColor({}, "border");

  const meta = SERVICE_META[state.serviceType];

  const handleFinalSubmit = async () => {
    try {
      const formData = new FormData();

      console.log();

      if (
        !state.profilePicture ||
        !state.verification?.idUrl ||
        !state.verification?.selfieUrl
      ) {
        throw new Error("Missing required images for verification.");
      }

      // profilePicture
      formData.append("profilePicture", {
        uri: state.profilePicture,
        name: "profile.jpg",
        type: "image/jpeg",
      } as any);

      // verification files
      formData.append("idImage", {
        uri: state.verification.idUrl,
        name: "id_card.jpg",
        type: "image/jpeg",
      } as any);

      formData.append("selfieImage", {
        uri: state.verification.selfieUrl,
        name: "selfie.jpg",
        type: "image/jpeg",
      } as any);

      //Text Fields
      formData.append("firstName", state.firstName || "");
      formData.append("lastName", state.lastName || "");
      formData.append("email", state.email || "");
      formData.append("bio", state.bio || "");
      formData.append("serviceType", state.serviceType || "");

      // Stringified Objects
      formData.append("services", JSON.stringify(state.selectedServices || []));
      formData.append("shopAddress", JSON.stringify(state.shopAddress || {}));
      formData.append("serviceArea", JSON.stringify(state.serviceArea || {}));
      formData.append("availability", JSON.stringify(state.availability || []));

      // Numbers/Booleans (Must be strings in FormData)
      formData.append("offersHomeService", String(!!state.offersHomeService));
      formData.append("offersShopVisit", String(!!state.offersShopVisit));
      formData.append("radiusKm", String(state.radiusKm || 5));
      formData.append("avgServiceTime", String(state.avgServiceTime || 30));

      // Execute Mutation
      console.log("FormData:", formData);
      await mutateAsync(formData);
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || err.message || "Failed to Submit";
      console.error("Submission Error:", errorMessage);

      Vibration.vibrate(50);
      if (Platform.OS === "android") {
        ToastAndroid.show(errorMessage, ToastAndroid.LONG);
      } else {
        Alert.alert("Error", errorMessage);
      }
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <View style={styles.header}>
          <ThemedText type="title">Review Profile</ThemedText>
          <ThemedText style={[styles.subtitle, { color: textSecondary }]}>
            Verify your details. This is exactly how you'll appear to potential
            customers.
          </ThemedText>
        </View>

        {/* PROFESSIONAL IDENTITY */}
        <ThemedCard style={[styles.reviewCard, { borderColor: border }]}>
          <View style={styles.cardHeader}>
            <Ionicons name="id-card-outline" size={18} color={tint} />
            <ThemedText style={styles.cardTitle}>
              PROFESSIONAL IDENTITY
            </ThemedText>
          </View>
          <View style={styles.profileSummary}>
            {state.profilePicture && (
              <Image
                source={{ uri: state.profilePicture }}
                style={styles.miniAvatar}
              />
            )}
            <View>
              <ThemedText style={styles.value}>
                {state.firstName} {state.lastName}
              </ThemedText>
              <ThemedText style={[styles.label, { fontSize: 12 }]}>
                {state.email}
              </ThemedText>
            </View>
          </View>
          <View style={[styles.bioBox, { backgroundColor: `${tint}10` }]}>
            <ThemedText style={styles.label}>Bio</ThemedText>
            <ThemedText style={styles.bioText} numberOfLines={3}>
              {state.bio || "No bio provided."}
            </ThemedText>
          </View>
        </ThemedCard>

        {/* SERVICES & PRICING */}
        <ThemedCard style={[styles.reviewCard, { borderColor: border }]}>
          <View style={styles.cardHeader}>
            <FontAwesome6 name={meta.icon} size={18} color={tint} />
            <ThemedText style={styles.cardTitle}>SERVICES</ThemedText>
          </View>
          <View style={styles.row}>
            <ThemedText style={styles.label}>Category</ThemedText>
            <ThemedText style={styles.value}>{meta.label}</ThemedText>
          </View>
          <View style={styles.serviceTags}>
            {state.selectedServices?.map((s: any, i: number) => (
              <View
                key={i}
                style={[styles.tag, { backgroundColor: tint + "10" }]}
              >
                <ThemedText style={[styles.tagText, { color: tint }]}>
                  {s.name}
                </ThemedText>
              </View>
            ))}
          </View>
        </ThemedCard>

        {/* LOGISTICS & LOCATION */}
        <ThemedCard style={[styles.reviewCard, { borderColor: border }]}>
          <View style={styles.cardHeader}>
            <Ionicons name="location-outline" size={18} color={tint} />
            <ThemedText style={styles.cardTitle}>OPERATIONS</ThemedText>
          </View>

          <View style={styles.row}>
            <ThemedText style={styles.label}>Service Mode</ThemedText>
            <ThemedText style={styles.value}>
              {state.offersHomeService && "Home"}{" "}
              {state.offersShopVisit && "& Shop"}
            </ThemedText>
          </View>

          {state.offersShopVisit && (
            <View style={styles.row}>
              <ThemedText style={styles.label}>Shop Address</ThemedText>
              <View style={styles.addressValueContainer}>
                <ThemedText
                  style={styles.value}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {state.shopAddress?.formattedAddress}
                </ThemedText>
              </View>
            </View>
          )}

          {state.offersHomeService && (
            <View style={styles.row}>
              <ThemedText style={styles.label}>Travel Radius</ThemedText>
              <View style={styles.addressValueContainer}>
                <ThemedText
                  style={styles.value}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {state.radiusKm}km around{" "}
                  {state.serviceArea?.formattedAddress || "Selected Area"}
                </ThemedText>
              </View>
            </View>
          )}
        </ThemedCard>

        {/* AVAILABILITY */}
        <ThemedCard style={[styles.reviewCard, { borderColor: border }]}>
          <View style={styles.cardHeader}>
            <Ionicons name="time-outline" size={18} color={tint} />
            <ThemedText style={styles.cardTitle}>AVAILABILITY</ThemedText>
          </View>
          <View style={styles.row}>
            <ThemedText style={styles.label}>Average Job Time</ThemedText>
            <ThemedText style={styles.value}>
              {state.avgServiceTime} Minutes
            </ThemedText>
          </View>
          <View style={styles.statusRow}>
            <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
            <ThemedText style={styles.statusText}>
              Schedule Set (Mon-Fri)
            </ThemedText>
          </View>
        </ThemedCard>

        {/* VERIFICATION */}
        <ThemedCard style={[styles.reviewCard, { borderColor: border }]}>
          <View style={styles.cardHeader}>
            <Ionicons
              name="shield-checkmark-outline"
              size={18}
              color="#4CAF50"
            />
            <ThemedText style={styles.cardTitle}>
              VERIFICATION DOCUMENTS
            </ThemedText>
          </View>
          <View style={styles.docsGrid}>
            <View style={[styles.docItem, { backgroundColor: `${tint}10` }]}>
              <Ionicons name="image-outline" size={14} color={textSecondary} />
              <ThemedText style={styles.docName}>Live Selfie</ThemedText>
            </View>
            <View style={[styles.docItem, { backgroundColor: `${tint}10` }]}>
              <Ionicons name="card-outline" size={14} color={textSecondary} />
              <ThemedText style={styles.docName}>Gov. ID</ThemedText>
            </View>
          </View>
        </ThemedCard>

        <ThemedText style={[styles.noticeText, { color: textSecondary }]}>
          By submitting, you agree to our Service Provider Agreement and Privacy
          Policy.
        </ThemedText>
      </ScrollView>

      <View style={styles.footer}>
        <ThemedButton
          title="SUBMIT FOR APPROVAL"
          loading={isPending}
          onPress={handleFinalSubmit}
          disabled={isPending}
        />
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: spacing.lg },
  header: { marginTop: 10, marginBottom: 24 },
  subtitle: { fontSize: 14, marginTop: 4, opacity: 0.7, lineHeight: 20 },

  reviewCard: {
    padding: 16,
    marginBottom: 16,
    borderRadius: 20,
    borderWidth: 1,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
    opacity: 0.8,
  },
  cardTitle: { fontSize: 11, fontWeight: "900", letterSpacing: 1.2 },

  profileSummary: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
  },
  miniAvatar: { width: 44, height: 44, borderRadius: 22 },

  bioBox: { padding: 12, backgroundColor: "#f9f9f9", borderRadius: 12 },
  bioText: { fontSize: 13, marginTop: 4, lineHeight: 18, fontStyle: "italic" },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    alignItems: "center",
    width: "100%",
    gap: 12,
  },
  label: {
    fontSize: 12,
    opacity: 0.5,
    fontWeight: "600",
    flexShrink: 0,
  },
  value: { fontSize: 13, fontWeight: "700" },

  serviceTags: { flexDirection: "row", flexWrap: "wrap", gap: 6, marginTop: 4 },
  tag: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  tagText: { fontSize: 11, fontWeight: "700" },

  docsGrid: { flexDirection: "row", gap: 12 },
  docItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    padding: 8,
    borderRadius: 8,
    flex: 1,
  },
  docName: { fontSize: 11, fontWeight: "600" },

  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 5,
  },
  statusText: { fontSize: 12, fontWeight: "700", color: "#4CAF50" },

  noticeText: {
    fontSize: 11,
    textAlign: "center",
    marginVertical: 20,
    paddingHorizontal: 30,
    opacity: 0.6,
  },

  addressValueContainer: {
    flex: 1,
    alignItems: "flex-end",
    justifyContent: "flex-end",
  },

  // Success Styles
  successContainer: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    justifyContent: "center",
  },
  successContent: { flex: 1, justifyContent: "center", alignItems: "center" },
  checkCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  successTitle: { fontSize: 32, fontWeight: "900", marginBottom: 12 },
  successSubtitle: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
    paddingHorizontal: 20,
  },

  footer: { paddingBottom: 40, paddingTop: 10 },
});
