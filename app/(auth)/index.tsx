import { ThemedButton } from "@/components/ui/Themed/ThemedButton";
import { ThemedText } from "@/components/ui/Themed/ThemedText";
import { spacing } from "@/constants/Layout";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";

const { width, height } = Dimensions.get("window");

export default function Welcome() {
  const styles = createStyles();

  const handlePhoneContinue = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push("/(auth)/EnterPhone");
  };

  return (
    <>
      <StatusBar style="light" />
      <View style={styles.container}>
        <View style={styles.heroContainer}>
          <Image
            source="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=1000&auto=format&fit=crop"
            placeholder={{ blurhash: "L6PZf60100%~_49F-pNH00~p]~4n" }}
            style={styles.image}
            contentFit="cover"
            transition={1000}
          />
          <View style={styles.overlay} />
        </View>

        <View style={styles.contentContainer}>
          <View style={styles.textWrapper}>
            <ThemedText type="title" style={styles.title}>
              Empower Your{"\n"}Professional Journey
            </ThemedText>
            <ThemedText style={styles.subtitle}>
              Join thousands of top-tier professionals earning more with
              ServiceHub.
            </ThemedText>
          </View>

          <View style={styles.buttonWrapper}>
            <ThemedButton
              title="Continue with Phone"
              onPress={handlePhoneContinue}
              variant="primary"
              style={styles.mainButton}
            />

            <View style={styles.dividerContainer}>
              <View style={styles.line} />
              <ThemedText style={styles.dividerText}>or</ThemedText>
              <View style={styles.line} />
            </View>

            <ThemedButton
              title="Continue with Google"
              onPress={() => Haptics.selectionAsync()}
              variant="secondary"
              style={styles.secondaryButton}
            />

            <Text style={styles.termsText}>
              By signing up, you agree to our{" "}
              <Text style={styles.link}>Terms</Text> and{" "}
              <Text style={styles.link}>Privacy Policy</Text>.
            </Text>
          </View>
        </View>
      </View>
    </>
  );
}

function createStyles() {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#fff",
    },
    heroContainer: {
      height: height * 0.5,
      width: width,
      position: "relative",
    },
    image: {
      flex: 1,
      width: "100%",
    },
    overlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: "rgba(0, 109, 91, 0.15)",
    },
    contentContainer: {
      flex: 1,
      marginTop: -30,
      backgroundColor: "#fff",
      borderTopLeftRadius: 32,
      borderTopRightRadius: 32,
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.xl,
      gap: 50,
    },
    textWrapper: {
      gap: spacing.sm,
    },
    title: {
      fontSize: 32,
      fontWeight: "800",
      lineHeight: 38,
      color: "#1A1A1A",
      letterSpacing: -0.5,
    },
    subtitle: {
      fontSize: 16,
      color: "#666",
      lineHeight: 24,
      marginTop: 8,
    },
    buttonWrapper: {
      paddingBottom: 40,
      gap: spacing.sm,
    },
    mainButton: {
      height: 56,
      borderRadius: 16,
      backgroundColor: "#006D5B",
    },
    secondaryButton: {
      height: 56,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: "#E5E5E5",
    },
    dividerContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginVertical: spacing.sm,
    },
    line: {
      flex: 1,
      height: 1,
      backgroundColor: "#F0F0F0",
    },
    dividerText: {
      marginHorizontal: spacing.md,
      color: "#999",
      fontSize: 14,
    },
    termsText: {
      fontSize: 12,
      color: "#999",
      textAlign: "center",
      marginTop: spacing.md,
      lineHeight: 18,
    },
    link: {
      color: "#006D5B",
      fontWeight: "600",
    },
  });
}
