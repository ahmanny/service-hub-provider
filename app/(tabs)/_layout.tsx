// app/(tabs)/_layout.tsx
import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useAuthStore } from "@/stores/auth.store";
import { Redirect, Tabs } from "expo-router";
import * as React from "react";

export default function TabsLayout() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const hasProfile = useAuthStore((s) => s.hasProfile);

  const tint = useThemeColor({}, "tint");
  const inactive = useThemeColor({}, "inactive");
  const background = useThemeColor({}, "background");
  const border = useThemeColor({}, "border");

  if (!isAuthenticated) return <Redirect href="/(auth)" />;
  if (!hasProfile) return <Redirect href="/(onboarding)" />;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarActiveTintColor: tint,
        tabBarInactiveTintColor: inactive,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "700",
          marginTop: 4,
        },
        tabBarStyle: {
          backgroundColor: background,
          borderTopColor: border,
          elevation: 0,
          shadowOpacity: 0,
          height: 85,
          paddingHorizontal: 8,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="house.fill" color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="bookings"
        options={{
          title: "Bookings",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="calendar" color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="earnings"
        options={{
          title: "Earnings",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="banknote.fill" color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="person.crop.circle" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
