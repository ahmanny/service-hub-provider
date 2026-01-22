import { PriceStepper } from "@/components/onboarding/PriceStepper";
import { ThemedButton, ThemedText, ThemedView } from "@/components/ui/Themed";
import ThemedCard from "@/components/ui/Themed/ThemedCard";
import { spacing } from "@/constants/Layout";
import { getServicesForType, ServiceDefinition } from "@/constants/services";
import { useThemeColor } from "@/hooks/use-theme-color";
import { SelectedService, useOnboardingStore } from "@/stores/onboarding.store";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  LayoutAnimation,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

export default function ServicesPricing() {
  const router = useRouter();
  const { serviceType, updateFields, selectedServices } = useOnboardingStore();

  const tint = useThemeColor({}, "tint");
  const background = useThemeColor({}, "background");
  const textSecondary = useThemeColor({}, "textSecondary");
  const border = useThemeColor({}, "border");
  const cardBg = useThemeColor({}, "card");

  const availableServices = getServicesForType(
    serviceType as any
  ) as ServiceDefinition[];
  const [selections, setSelections] = useState<SelectedService[]>(
    selectedServices || []
  );
  const [currentlyEditing, setCurrentlyEditing] = useState<string | null>(null);

  const toggleServiceSelection = (service: ServiceDefinition) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
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
    setCurrentlyEditing(currentlyEditing === value ? null : value);
  };

  const updatePrice = (value: string, newPrice: number) => {
    setSelections(
      selections.map((s) => (s.value === value ? { ...s, price: newPrice } : s))
    );
  };

  const onNext = () => {
    updateFields({ selectedServices: selections });
    router.push("/(onboarding)/service-mode");
  };

  return (
    <ThemedView style={[styles.container, { backgroundColor: background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.headerArea}>
          <ThemedText type="title">Set your services & rates</ThemedText>
          <ThemedText style={[styles.subtitle, { color: textSecondary }]}>
            Select services you offer. Tap the arrow to edit your pricing.
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
                  },
                  // Selected state: thin border highlight
                  isSelected && { borderColor: tint },
                  // Editing state: soft brand wash
                  isEditing && { backgroundColor: `${tint}10` },
                ]}
              >
                <View style={styles.cardHeader}>
                  <TouchableOpacity
                    style={styles.mainSelectArea}
                    onPress={() => toggleServiceSelection(service)}
                    activeOpacity={0.6}
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
                        <Ionicons name="checkmark" size={16} color="#fff" />
                      )}
                    </View>

                    <View style={styles.nameContainer}>
                      <ThemedText style={styles.serviceName}>
                        {service.name}
                      </ThemedText>
                      {isSelected && !isEditing && (
                        <ThemedText
                          style={{
                            color: tint,
                            fontWeight: "800", // Popping the price
                            fontSize: 14,
                          }}
                        >
                          ₦{selection.price.toLocaleString()}
                        </ThemedText>
                      )}
                    </View>
                  </TouchableOpacity>

                  {isSelected && (
                    <TouchableOpacity
                      style={styles.expandTrigger}
                      onPress={() => togglePriceDropdown(service.value)}
                    >
                      <Ionicons
                        name={isEditing ? "chevron-up" : "chevron-down"}
                        size={24}
                        color={isEditing ? tint : textSecondary}
                      />
                    </TouchableOpacity>
                  )}
                </View>

                {isSelected && isEditing && (
                  <View
                    style={[styles.priceSection, { borderTopColor: border }]}
                  >
                    <View style={styles.priceRow}>
                      <ThemedText
                        style={[styles.priceLabel, { color: textSecondary }]}
                      >
                        Your Rate
                      </ThemedText>
                      <ThemedText style={[styles.rangeHint, { color: tint }]}>
                        ₦{service.minPrice.toLocaleString()} - ₦
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
                      onPress={() => togglePriceDropdown(service.value)}
                    >
                      <ThemedText style={styles.doneText}>
                        Save Price
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
          title="CONTINUE"
          onPress={onNext}
          disabled={selections.length === 0}
          // The button should automatically use your tint from the ThemedButton component
        />
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: spacing.lg },
  scrollContent: { paddingTop: 10, paddingBottom: 20 },
  headerArea: { marginBottom: 24 },
  subtitle: { fontSize: 16, marginTop: 8, lineHeight: 22 },
  list: { gap: 12 },
  card: { borderRadius: 20, borderWidth: 1.5, padding: 17, overflow: "hidden" },
  cardHeader: { flexDirection: "row", alignItems: "center" },
  mainSelectArea: { flex: 1, flexDirection: "row", alignItems: "center" },
  checkbox: {
    width: 26,
    height: 26,
    borderRadius: 8,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  nameContainer: { marginLeft: 12, flex: 1 },
  serviceName: { fontSize: 17, fontWeight: "700" },
  expandTrigger: { padding: 8, marginLeft: 4 },
  priceSection: { marginTop: 12, paddingTop: 16, borderTopWidth: 1 },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  priceLabel: { fontSize: 14, fontWeight: "600" },
  rangeHint: { fontSize: 12, fontWeight: "700" },
  doneButton: {
    marginTop: 16,
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  doneText: { color: "#fff", fontWeight: "700", fontSize: 14 },
  footer: { paddingBottom: 40, paddingTop: 10 },
});
