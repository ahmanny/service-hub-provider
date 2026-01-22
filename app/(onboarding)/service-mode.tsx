import { ThemedButton, ThemedText, ThemedView } from "@/components/ui/Themed";
import ThemedCard from "@/components/ui/Themed/ThemedCard";
import { spacing } from "@/constants/Layout";
import { homeBasedServices } from "@/constants/services";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useOnboardingStore } from "@/stores/onboarding.store";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";

export default function ServiceMode() {
  const router = useRouter();
  const {
    serviceType,
    updateFields,
    shopAddress,
    offersHomeService: savedHome,
    offersShopVisit: savedShop,
  } = useOnboardingStore();

  // Theme Colors
  const tint = useThemeColor({}, "tint");
  const text = useThemeColor({}, "text");
  const textSecondary = useThemeColor({}, "textSecondary");
  const border = useThemeColor({}, "border");
  const cardBg = useThemeColor({}, "card");
  const background = useThemeColor({}, "background");

  const [homeService, setHomeService] = useState(
    savedHome || homeBasedServices.includes(serviceType)
  );
  const [shopVisit, setShopVisit] = useState(savedShop || false);

  const canContinue = homeService || (shopVisit && shopAddress);

  const onNext = () => {
    if (shopVisit && !shopAddress) return;
    updateFields({
      offersHomeService: homeService,
      offersShopVisit: shopVisit,
    });
    router.push("/(onboarding)/service-area");
  };

  return (
    <ThemedView style={[styles.container, { backgroundColor: background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <ThemedText type="title">Service Delivery</ThemedText>
        <ThemedText style={[styles.subtitle, { color: textSecondary }]}>
          How do you want to reach your customers?
        </ThemedText>

        <View style={styles.optionsContainer}>
          {/* Home Service Option */}
          <ThemedCard
            style={[
              styles.card,
              {
                borderColor: homeService ? tint : border,
              },
            ]}
          >
            <TouchableOpacity
              onPress={() => setHomeService(!homeService)}
              activeOpacity={0.8}
            >
              <View style={styles.cardHeader}>
                <View
                  style={[
                    styles.iconCircle,
                    { backgroundColor: homeService ? tint : `${tint}15` },
                  ]}
                >
                  <Ionicons
                    name="home"
                    size={24}
                    color={homeService ? "#fff" : tint}
                  />
                </View>
                <View style={{ flex: 1, marginLeft: 16 }}>
                  <ThemedText style={styles.cardTitle}>Home Service</ThemedText>
                  <ThemedText
                    style={[styles.cardDesc, { color: textSecondary }]}
                  >
                    You travel to the customer's location
                  </ThemedText>
                </View>
                <View
                  style={[
                    styles.checkbox,
                    { borderColor: homeService ? tint : border },
                    homeService && { backgroundColor: tint },
                  ]}
                >
                  {homeService && (
                    <Ionicons name="checkmark" size={16} color="#fff" />
                  )}
                </View>
              </View>

              {homeService && (
                <View
                  style={[styles.infoBox, { backgroundColor: `${tint}15` }]}
                >
                  <Ionicons name="information-circle" size={18} color={tint} />
                  <ThemedText style={[styles.infoText, { color: tint }]}>
                    Transport fee is calculated automatically based on distance.
                  </ThemedText>
                </View>
              )}
            </TouchableOpacity>
          </ThemedCard>

          {/* Shop Visit Option */}
          <ThemedCard
            style={[
              styles.card,
              {
                borderColor: homeService ? tint : border,
              },
            ]}
          >
            <TouchableOpacity
              onPress={() => setShopVisit(!shopVisit)}
              activeOpacity={0.8}
            >
              <View style={styles.cardHeader}>
                <View
                  style={[
                    styles.iconCircle,
                    { backgroundColor: shopVisit ? tint : `${tint}15` },
                  ]}
                >
                  <MaterialCommunityIcons
                    name="storefront"
                    size={24}
                    color={shopVisit ? "#fff" : tint}
                  />
                </View>
                <View style={{ flex: 1, marginLeft: 16 }}>
                  <ThemedText style={styles.cardTitle}>Visit Shop</ThemedText>
                  <ThemedText
                    style={[styles.cardDesc, { color: textSecondary }]}
                  >
                    Customers come to your place of work
                  </ThemedText>
                </View>
                <View
                  style={[
                    styles.checkbox,
                    { borderColor: shopVisit ? tint : border },
                    shopVisit && { backgroundColor: tint },
                  ]}
                >
                  {shopVisit && (
                    <Ionicons name="checkmark" size={16} color="#fff" />
                  )}
                </View>
              </View>

              {shopVisit && (
                <View
                  style={[styles.addressSection, { borderTopColor: border }]}
                >
                  <TouchableOpacity
                    style={[
                      styles.addressBtn,
                      { backgroundColor: cardBg, borderColor: border },
                    ]}
                    onPress={() =>
                      router.push("/(onboarding)/set-shop-address")
                    }
                  >
                    <Ionicons name="location" size={18} color={tint} />
                    <ThemedText
                      style={[styles.addressBtnText, { color: text }]}
                      numberOfLines={1}
                    >
                      {shopAddress?.formattedAddress ?? "Set Shop Address"}
                    </ThemedText>
                    <Ionicons
                      name="chevron-forward"
                      size={18}
                      color={textSecondary}
                    />
                  </TouchableOpacity>
                  {!shopAddress && (
                    <ThemedText type="error" style={styles.errorText}>
                      Please set your shop location
                    </ThemedText>
                  )}
                </View>
              )}
            </TouchableOpacity>
          </ThemedCard>
        </View>
      </ScrollView>

      <View style={[styles.footer, { backgroundColor: background }]}>
        <ThemedButton
          title="CONTINUE"
          onPress={onNext}
          disabled={!canContinue}
        />
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: spacing.lg },
  scrollContent: { paddingTop: 10, paddingBottom: 20 },
  subtitle: { fontSize: 16, marginTop: 8, marginBottom: 32 },
  optionsContainer: { gap: 20 },
  card: {
    padding: 20,
    borderRadius: 20,
    borderWidth: 1.5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  cardHeader: { flexDirection: "row", alignItems: "center" },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  cardTitle: { fontSize: 18, fontWeight: "800" },
  cardDesc: { fontSize: 13, marginTop: 2 },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  infoBox: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
    padding: 12,
    borderRadius: 12,
    gap: 8,
  },
  infoText: { flex: 1, fontSize: 12, fontWeight: "600" },
  addressSection: {
    marginTop: 16,
    borderTopWidth: 1,
    paddingTop: 16,
  },
  addressBtn: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    gap: 10,
  },
  addressBtnText: {
    flex: 1,
    fontSize: 14,
    fontWeight: "600",
  },
  errorText: {
    marginTop: 4,
    marginLeft: 4,
  },
  footer: { paddingBottom: 40, paddingTop: 10 },
});
