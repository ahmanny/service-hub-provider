import { OnboardingHeader } from "@/components/onboarding/OnboardingHeader";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useAuthStore } from "@/stores/auth.store";
import { Redirect, Stack } from "expo-router";
import * as React from "react";

export default function OnboardingLayout() {
  const hasProfile = useAuthStore((s) => s.hasProfile);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const textColor = useThemeColor({}, "text");
  const headerBackground = useThemeColor({}, "background");

  if (!isAuthenticated) {
    return <Redirect href="/(auth)" />;
  }

  if (hasProfile && isAuthenticated) {
    return <Redirect href="/(tabs)/home" />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerTintColor: textColor,
        headerTitle: "",
        headerBackTitle: "",
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen
        name="basic-info"
        options={{
          headerShown: true,
          title: "Basic Details",
          header: () => <OnboardingHeader step={1} />,
        }}
      />
      <Stack.Screen
        name="service-category"
        options={{
          header: () => <OnboardingHeader step={2} />,
        }}
      />
      <Stack.Screen
        name="services-pricing"
        options={{
          header: () => <OnboardingHeader step={3} />,
        }}
      />
      <Stack.Screen
        name="service-mode"
        options={{
          header: () => <OnboardingHeader step={4} />,
        }}
      />
      <Stack.Screen
        name="service-area"
        options={{
          header: () => <OnboardingHeader step={5} />,
        }}
      />
      <Stack.Screen
        name="availability"
        options={{
          header: () => <OnboardingHeader step={6} />,
        }}
      />
      <Stack.Screen
        name="verification"
        options={{
          header: () => <OnboardingHeader step={7} />,
        }}
      />
      <Stack.Screen
        name="summary"
        options={{
          header: () => <OnboardingHeader step={8} />,
        }}
      />
    </Stack>
  );
}
