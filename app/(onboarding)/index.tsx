// app/(onboarding)/index.tsx
import OnboardingScreenLayout from "@/components/layouts/OnboardingScreenLayout";
import { ThemedButton, ThemedText, ThemedView } from "@/components/ui/Themed";
import ThemedCard from "@/components/ui/Themed/ThemedCard";
import { useThemeColor } from "@/hooks/use-theme-color";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function OnboardingWelcome() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const tintColor = useThemeColor({}, "tint");
  const tintLight = useThemeColor({}, "tintLight");
  const textSecondary = useThemeColor({}, "textSecondary");
  const iconBg = useThemeColor({}, "iconBg");

  const checklistItems = [
    { id: 1, text: "Verify your identity", sub: "Basic details and ID" },
    { id: 2, text: "Professional setup", sub: "Services, rates and portfolio" },
    { id: 3, text: "Work preferences", sub: "Location and availability" },
  ];

  return (
    <OnboardingScreenLayout>
      <ThemedView style={[styles.container, { paddingTop: insets.top + 20 }]}>
        <View style={styles.topContent}>
          {/* Progress Indicator */}
          <View style={styles.progressContainer}>
            <ThemedText style={[styles.stepText, { color: tintColor }]}>
              GETTING STARTED
            </ThemedText>
            <View style={[styles.progressBar, { backgroundColor: tintLight }]}>
              <View
                style={[
                  styles.progressFill,
                  { width: "12.5%", backgroundColor: tintColor },
                ]}
              />
            </View>
          </View>

          <ThemedText type="title" style={styles.greeting}>
            Become a ServiceHub Provider
          </ThemedText>
          <ThemedText style={[styles.subtitle, { color: textSecondary }]}>
            You're just a few steps away from reaching thousands of customers.
          </ThemedText>

          {/* Checklist Card */}
          <ThemedCard style={styles.card}>
            {checklistItems.map((item) => (
              <View key={item.id} style={styles.checkItem}>
                <View style={[styles.iconCircle, { backgroundColor: iconBg }]}>
                  <Ionicons name="flash" size={14} color={tintColor} />
                </View>
                <View>
                  <ThemedText style={[styles.checkText]}>
                    {item.text}
                  </ThemedText>
                  <ThemedText
                    style={[styles.checkSubText, { color: textSecondary }]}
                  >
                    {item.sub}
                  </ThemedText>
                </View>
              </View>
            ))}
          </ThemedCard>
        </View>

        {/* Bottom Action */}
        <View style={styles.footer}>
          <ThemedText style={[styles.infoText, { color: textSecondary }]}>
            Average setup time: 2 minutes
          </ThemedText>
          <ThemedButton
            title="START APPLICATION"
            onPress={() => router.push("/(onboarding)/basic-info")}
            variant="primary"
            style={styles.button}
          />
        </View>
      </ThemedView>
    </OnboardingScreenLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 4, // Layout handles the rest
    justifyContent: "space-between",
  },
  topContent: {
    marginTop: 20,
  },
  progressContainer: {
    marginBottom: 32,
  },
  stepText: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    width: 100,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 3,
  },
  greeting: {
    fontSize: 34,
    fontWeight: "900",
    lineHeight: 40,
  },
  subtitle: {
    fontSize: 16,
    marginTop: 12,
    lineHeight: 24,
  },
  card: {
    borderRadius: 24,
    padding: 24,
    marginTop: 40,
    gap: 24,
    // Add shadow/elevation based on theme in your ThemedCard component
  },
  checkItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 16,
  },
  iconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 2,
  },
  checkText: {
    fontSize: 16,
    fontWeight: "700",
  },
  checkSubText: {
    fontSize: 13,
    marginTop: 2,
  },
  infoText: {
    fontSize: 13,
    textAlign: "center",
    marginBottom: 16,
    fontWeight: "600",
    opacity: 0.7,
  },
  footer: {
    marginBottom: 20,
  },
  button: {
    height: 60,
    borderRadius: 18,
  },
});
