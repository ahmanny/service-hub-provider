import { PriceStepper } from "@/components/onboarding/PriceStepper";
import { ThemedButton, ThemedText, ThemedView } from "@/components/ui/Themed";
import ThemedCard from "@/components/ui/Themed/ThemedCard";
import { spacing } from "@/constants/Layout";
import { getServicesForType, ServiceDefinition } from "@/constants/services";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useUpdateServices } from "@/hooks/useProfile";
import { useAuthStore } from "@/stores/auth.store";
import { SelectedService } from "@/stores/onboarding.store";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Stack, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  LayoutAnimation,
  Platform,
  ScrollView,
  StyleSheet,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";

export default function ServicesPricesScreen() {
  const router = useRouter();
  const profile = useAuthStore((s) => s.user);

  // Early return if no profile
  if (!profile) {
    router.replace("/(tabs)/profile");
    return null;
  }

  const serviceType = profile.serviceType;
  const tint = useThemeColor({}, "tint");
  const background = useThemeColor({}, "background");
  const textSecondary = useThemeColor({}, "textSecondary");
  const border = useThemeColor({}, "border");
  const cardBg = useThemeColor({}, "card");

  const availableServices = getServicesForType(
    serviceType as any,
  ) as ServiceDefinition[];

  const [selections, setSelections] = useState<SelectedService[]>(
    profile?.services || [],
  );
  const [currentlyEditing, setCurrentlyEditing] = useState<string | null>(null);

  const { mutateAsync: updateServices, isPending: saving } =
    useUpdateServices();

  const toggleServiceSelection = (service: ServiceDefinition) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    const exists = selections.find((s) => s.value === service.value);
    if (exists) {
      if (currentlyEditing === service.value) setCurrentlyEditing(null);
      setSelections(selections.filter((s) => s.value !== service.value));
    } else {
      setSelections([
        ...selections,
        { name: service.name, value: service.value, price: service.minPrice },
      ]);
      setCurrentlyEditing(service.value);
    }
  };

  const togglePriceDropdown = (value: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    Haptics.selectionAsync();
    setCurrentlyEditing(currentlyEditing === value ? null : value);
  };

  const handleSavePrice = (value: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setCurrentlyEditing(null);
  };

  const updatePrice = (value: string, newPrice: number) => {
    setSelections((s) =>
      s.map((item) =>
        item.value === value ? { ...item, price: newPrice } : item,
      ),
    );
  };

  const handleSaveProfile = async () => {
    if (selections.length === 0) {
      Alert.alert(
        "Menu Empty",
        "Please select at least one service to continue.",
      );
      return;
    }
    try {
      await updateServices(selections);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      if (Platform.OS === "android")
        ToastAndroid.show("Profile Updated", ToastAndroid.SHORT);
      router.back();
    } catch (err: any) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert("Update Failed", err.message);
    }
  };

  return (
    <ThemedView style={[styles.container, { backgroundColor: background }]}>
      <Stack.Screen
        options={{ title: "Menu & Pricing", headerShadowVisible: false }}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.headerArea}>
          <ThemedText style={styles.mainTitle}>Service Menu</ThemedText>
          <ThemedText style={[styles.subtitle, { color: textSecondary }]}>
            Customize your offerings and rates. Your profile updates instantly.
          </ThemedText>
        </View>

        <View style={styles.list}>
          {availableServices.map((service) => {
            const selection = selections.find((s) => s.value === service.value);
            const isSelected = !!selection;
            const isEditing = currentlyEditing === service.value;

            return (
              <ThemedCard
                key={service.value}
                style={[
                  styles.card,
                  {
                    borderColor: isSelected ? tint : border,
                    backgroundColor: isSelected ? `${tint}05` : cardBg,
                  },
                  isEditing && styles.activeCardShadow,
                ]}
              >
                <View style={styles.cardHeader}>
                  <TouchableOpacity
                    style={styles.mainSelectArea}
                    onPress={() => toggleServiceSelection(service)}
                    activeOpacity={0.7}
                  >
                    <View
                      style={[
                        styles.checkbox,
                        { borderColor: border },
                        isSelected && {
                          backgroundColor: tint,
                          borderColor: tint,
                        },
                      ]}
                    >
                      {isSelected && (
                        <Ionicons name="checkmark" size={14} color="#fff" />
                      )}
                    </View>

                    <View style={styles.nameContainer}>
                      <ThemedText style={[styles.serviceName]}>
                        {service.name}
                      </ThemedText>
                      {isSelected && !isEditing && (
                        <View style={styles.pricePill}>
                          <ThemedText
                            style={[styles.priceTag, { color: tint }]}
                          >
                            ₦{selection.price.toLocaleString()}
                          </ThemedText>
                        </View>
                      )}
                    </View>
                  </TouchableOpacity>

                  {isSelected && (
                    <TouchableOpacity
                      style={styles.expandTrigger}
                      onPress={() => togglePriceDropdown(service.value)}
                    >
                      <View
                        style={[
                          styles.iconCircle,
                          {
                            backgroundColor: isEditing
                              ? tint
                              : `${textSecondary}15`,
                          },
                        ]}
                      >
                        <Ionicons
                          name={isEditing ? "chevron-up" : "options-outline"}
                          size={18}
                          color={isEditing ? "#fff" : textSecondary}
                        />
                      </View>
                    </TouchableOpacity>
                  )}
                </View>

                {isSelected && isEditing && (
                  <View
                    style={[
                      styles.priceSection,
                      { borderTopColor: `${border}50` },
                    ]}
                  >
                    <View style={styles.priceRow}>
                      <ThemedText
                        style={[styles.priceLabel, { color: textSecondary }]}
                      >
                        SET YOUR RATE
                      </ThemedText>
                      <ThemedText
                        style={[styles.rangeHint, { color: textSecondary }]}
                      >
                        Range: ₦{service.minPrice.toLocaleString()} -{" "}
                        {service.maxPrice.toLocaleString()}
                      </ThemedText>
                    </View>

                    <PriceStepper
                      value={selection.price}
                      onChange={(val) => updatePrice(service.value, val)}
                      min={service.minPrice}
                      max={service.maxPrice}
                    />

                    <TouchableOpacity
                      style={[styles.doneButton, { backgroundColor: tint }]}
                      onPress={() => handleSavePrice(service.value)}
                    >
                      <ThemedText style={styles.doneText}>
                        Confirm Price
                      </ThemedText>
                    </TouchableOpacity>
                  </View>
                )}
              </ThemedCard>
            );
          })}
        </View>
      </ScrollView>

      <View style={[styles.footer, { backgroundColor: background }]}>
        <ThemedButton
          title="Update"
          onPress={handleSaveProfile}
          loading={saving}
          style={styles.mainBtn}
        />
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: 10,
    paddingBottom: 140,
  },
  headerArea: { marginBottom: 28 },
  mainTitle: { fontSize: 28, fontWeight: "800", letterSpacing: -0.5 },
  subtitle: { fontSize: 15, marginTop: 6, lineHeight: 22, fontWeight: "500" },
  list: { gap: 14 },
  card: {
    borderRadius: 24,
    borderWidth: 1.5,
    padding: 14,
    overflow: "hidden",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
      },
      android: { elevation: 2 },
    }),
  },
  activeCardShadow: {
    ...Platform.select({
      ios: { shadowOpacity: 0.15, shadowRadius: 15 },
      android: { elevation: 6 },
    }),
  },
  cardHeader: { flexDirection: "row", alignItems: "center", minHeight: 48 },
  mainSelectArea: { flex: 1, flexDirection: "row", alignItems: "center" },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 7,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  nameContainer: {
    marginLeft: 14,
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingRight: 8,
  },
  serviceName: { fontSize: 17, fontWeight: "600", letterSpacing: -0.3 },
  pricePill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: "transparent",
  },
  priceTag: { fontSize: 15, fontWeight: "800", fontVariant: ["tabular-nums"] },
  expandTrigger: { padding: 4 },
  iconCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: "center",
    alignItems: "center",
  },
  priceSection: { marginTop: 16, paddingTop: 20, borderTopWidth: 1 },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  priceLabel: { fontSize: 11, fontWeight: "800", letterSpacing: 1 },
  rangeHint: { fontSize: 11, fontWeight: "600" },
  doneButton: {
    marginTop: 20,
    padding: 14,
    borderRadius: 16,
    alignItems: "center",
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  doneText: { color: "#fff", fontWeight: "700", fontSize: 15 },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: spacing.lg,
    paddingBottom: Platform.OS === "ios" ? 40 : 20,
    paddingTop: 15,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "rgba(0,0,0,0.1)",
  },
  mainBtn: { borderRadius: 18, height: 56 },
});
