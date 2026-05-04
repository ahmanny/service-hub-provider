import { useThemeColor } from "@/hooks/use-theme-color";
import { useAuthStore } from "@/stores/auth.store";
import React from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LogoutButton } from "./LogoutButton";
import { ProfileStatusBanner } from "./ProfileStatusBanner";
import { ProfileTabHeader } from "./ProfileTabHeader";
import { ProfileTabMenuGroups } from "./ProfileTabsMenuGroups";

export default function ProfileScreen() {
  const profile = useAuthStore((s) => s.user);

  const colors = {
    tint: useThemeColor({}, "tint"),
    bg: useThemeColor({}, "background"),
    border: useThemeColor({}, "border"),
    success: useThemeColor({}, "success"),
    danger: useThemeColor({}, "danger"),
    warning: useThemeColor({}, "warning"),
  };

  if (!profile) return null;

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: colors.bg }}
      edges={["top"]}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 60 }}
      >
        {/*  HEADER */}
        <ProfileTabHeader profile={profile} />

        {/* STATUS BANNER (if not approved) */}
        {profile.status !== "approved" && (
          <ProfileStatusBanner
            status={profile.status}
            reason={profile.rejectionReason}
            colors={colors}
          />
        )}

        {/* All Business, Performance, and Support Links */}
        <ProfileTabMenuGroups profile={profile} />

        {/* LOGOUT */}
        <View style={{ paddingHorizontal: 20 }}>
          <LogoutButton />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
