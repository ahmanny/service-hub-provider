import React from "react";
import { View, StyleSheet } from "react-native";
import { ProfileStats } from "./ProfileStats";
import { OnlineStatusCard } from "@/components/dashboard/OnlineStatusCard";
import { AppAvatar } from "@/components/ui/AppAvatar";
import { ThemedText } from "@/components/ui/Themed";
import { ProviderProfile } from "@/types/user.types";
import { SERVICE_META } from "@/constants/services";

interface Props {
  profile: ProviderProfile;
}

export function ProfileTabHeader({ profile }: Props) {
  const serviceLabel = SERVICE_META[profile.serviceType]?.label || "Service Provider";
  return (
    <View style={styles.header}>
      <AppAvatar
        size={120}
        source={profile.profilePicture ? { uri: profile.profilePicture } : null}
        initials={`${profile.firstName[0]}${profile.lastName[0]}`}
      />

      <ThemedText type="title" style={styles.userName}>
        {`${profile.firstName} ${profile.lastName}`}
      </ThemedText>

      <ThemedText style={styles.serviceType}>{serviceLabel}</ThemedText>

      <ProfileStats
        rating={profile.rating}
        reviewCount={profile.reviewCount}
        weightedRating={profile.weightedRating}
      />

      <OnlineStatusCard
        isOnline={profile.isAvailable}
        isApproved={profile.status === "approved"}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: { alignItems: "center", paddingVertical: 30 },
  userName: { fontSize: 24, marginTop: 12, fontWeight: "800" },
  serviceType: { opacity: 0.6, fontSize: 16, marginBottom: 8 },
});
