import { ThemedButton, ThemedText, ThemedView } from "@/components/ui/Themed";
import { spacing } from "@/constants/Layout";
import { SERVICE_META, ServiceType } from "@/constants/services"; // Adjust path
import { useThemeColor } from "@/hooks/use-theme-color";
import { useOnboardingStore } from "@/stores/onboarding.store";
import { FontAwesome6, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";

export default function ServiceCategory() {
  const router = useRouter();
  const updateFields = useOnboardingStore((s) => s.updateFields);
  const existingService = useOnboardingStore((s) => s.serviceType);

  // Theme Colors
  const tint = useThemeColor({}, "tint");
  const text = useThemeColor({}, "text");
  const textSecondary = useThemeColor({}, "textSecondary");
  const border = useThemeColor({}, "border");
  const cardBg = useThemeColor({}, "card");
  const background = useThemeColor({}, "background");

  const [selectedService, setSelectedService] = useState<ServiceType | null>(
    (existingService as ServiceType) || null
  );

  const onNext = () => {
    if (selectedService) {
      updateFields({ serviceType: selectedService });
      router.push("/(onboarding)/services-pricing");
    }
  };

  return (
    <ThemedView style={[styles.container, { backgroundColor: background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <ThemedText type="title">What service do you offer?</ThemedText>
        <ThemedText style={[styles.subtitle, { color: textSecondary }]}>
          Choose your primary specialty. You can add more later.
        </ThemedText>

        <View style={styles.grid}>
          {(Object.entries(SERVICE_META) as [ServiceType, any][]).map(
            ([key, meta]) => {
              const isSelected = selectedService === key;

              return (
                <TouchableOpacity
                  key={key}
                  activeOpacity={0.7}
                  onPress={() => setSelectedService(key)}
                  style={[
                    styles.serviceCard,
                    {
                      borderColor: isSelected ? tint : border,
                      backgroundColor: isSelected ? `${tint}10` : cardBg, // "10" adds 6% opacity to your tint
                    },
                  ]}
                >
                  {/* Icon Container */}
                  <View
                    style={[
                      styles.iconContainer,
                      { backgroundColor: isSelected ? tint : `${tint}15` }, // Soft blue background for inactive icons
                    ]}
                  >
                    <FontAwesome6
                      name={meta.icon}
                      size={20}
                      color={isSelected ? "#fff" : tint}
                    />
                  </View>

                  <View style={styles.textContainer}>
                    <ThemedText
                      style={[
                        styles.label,
                        { color: isSelected ? tint : text },
                      ]}
                    >
                      {meta.label}
                    </ThemedText>
                    <ThemedText
                      style={[styles.description, { color: textSecondary }]}
                    >
                      {meta.description}
                    </ThemedText>
                  </View>

                  {/* Radio Button */}
                  <View
                    style={[
                      styles.radio,
                      { borderColor: isSelected ? tint : border },
                      isSelected && { backgroundColor: tint },
                    ]}
                  >
                    {isSelected && (
                      <Ionicons name="checkmark" size={14} color="#fff" />
                    )}
                  </View>
                </TouchableOpacity>
              );
            }
          )}
        </View>
      </ScrollView>

      <View style={[styles.footer, { backgroundColor: background }]}>
        <ThemedButton
          title="CONTINUE"
          onPress={onNext}
          disabled={!selectedService}
          style={{ backgroundColor: selectedService ? tint : "#CBD5E1" }}
        />
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: spacing.lg },
  scrollContent: { paddingTop: 10, paddingBottom: 20 },
  subtitle: {
    fontSize: 16,
    marginTop: 8,
    lineHeight: 22,
    marginBottom: 25,
  },
  grid: { gap: 12 },
  serviceCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 20,
    borderWidth: 1.5,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  textContainer: { flex: 1, marginLeft: 16 },
  label: {
    fontSize: 17,
    fontWeight: "800",
  },
  description: {
    fontSize: 13,
    marginTop: 2,
    lineHeight: 18,
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  footer: { paddingBottom: 40, paddingTop: 10 },
});
