import { ThemedText } from "@/components/ui/Themed";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useAuthStore } from "@/stores/auth.store";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { AppAvatar } from "../ui/AppAvatar";

export default function PersonalInfoScreen() {
  const profile = useAuthStore((s) => s.user);
  const tint = useThemeColor({}, "tint");
  const bg = useThemeColor({}, "background");

  if (!profile) return null;

  return (
    <View style={{ flex: 1, backgroundColor: bg }}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* 1. HUGE SQUARE AVATAR SECTION */}
        <View style={styles.avatarSection}>
          <AppAvatar
            shape="square"
            source={{ uri: profile.avatarUrl }}
            initials={`${profile.firstName[0]}${profile.lastName[0]}`}
            onEdit={() => {}}
          />
          <ThemedText style={styles.changePhotoText}>
            {profile.avatarUrl
              ? "Change Profile Photo"
              : "Add profile picture so providers can recognise you"}
          </ThemedText>
        </View>

        {/* 2. INFO ROWS */}
        <View style={styles.infoGroup}>
          <InfoRow
            icon="person-outline"
            label="Full Name"
            value={`${profile.firstName} ${profile.lastName}`}
            onPress={() => router.push("/(tabs)/profile/edit-name")}
          />

          <InfoRow
            icon="call-outline"
            label="Phone Number"
            value={profile.userId.phone}
            onPress={() => router.push("/(tabs)/profile/edit-phone")}
          />

          <InfoRow
            icon="mail-outline"
            label="Email"
            value={profile.userId.email || "Not Added"}
            isVerified={profile.userId.isEmailVerified}
            onPress={() => router.push("/(tabs)/profile/edit-email")}
          />
        </View>
      </ScrollView>
    </View>
  );
}

// Internal Helper Component
const InfoRow = ({
  icon,
  label,
  value,
  isVerified,
  onPress,
}: {
  onPress: () => void;
  icon: any;
  label: string;
  value: string;
  isVerified?: boolean;
}) => {
  const muted = useThemeColor({}, "placeholder");
  const tint = useThemeColor({}, "tint");
  const errorColor = "#FF3B30";

  return (
    <TouchableOpacity style={styles.row} onPress={onPress}>
      <View style={styles.rowLeft}>
        <View style={styles.iconContainer}>
          <Ionicons name={icon} size={22} color={muted} />
        </View>

        <View style={{ marginLeft: 15, flex: 1 }}>
          {/* LABEL & BADGE ROW */}
          <View style={styles.labelRow}>
            <ThemedText style={styles.label}>{label}</ThemedText>

            {label === "Email" && (
              <View
                style={[
                  styles.badge,
                  {
                    backgroundColor: isVerified
                      ? tint + "15"
                      : errorColor + "15",
                  },
                ]}
              >
                <Ionicons
                  name={isVerified ? "checkmark-circle" : "alert-circle"}
                  size={12}
                  color={isVerified ? tint : errorColor}
                />
                <ThemedText
                  style={[
                    styles.badgeText,
                    { color: isVerified ? tint : errorColor },
                  ]}
                >
                  {isVerified ? "Verified" : "Not verified"}
                </ThemedText>
              </View>
            )}
          </View>

          {/* VALUE */}
          <ThemedText style={styles.value} numberOfLines={1}>
            {value}
          </ThemedText>
        </View>
      </View>

      <Ionicons name="chevron-forward" size={18} color="#D1D5DB" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  avatarSection: {
    alignItems: "center",
    marginVertical: 30,
  },
  avatarSquare: {
    width: 140,
    height: 140,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    overflow: "visible",
  },
  fullImage: {
    width: "100%",
    height: "100%",
    borderRadius: 30,
  },
  initials: {
    fontSize: 42,
    fontWeight: "bold",
    letterSpacing: -1,
  },
  editPhotoBadge: {
    position: "absolute",
    bottom: -10,
    right: -10,
    backgroundColor: "#0BB45E",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 4,
    borderColor: "white",
  },
  changePhotoText: {
    marginTop: 20,
    fontSize: 14,
    fontWeight: "600",
    color: "#0BB45E",
  },
  infoGroup: {
    marginTop: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 18,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(0,0,0,0.05)",
  },
  rowLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconContainer: {
    width: 32,
    alignItems: "center",
  },
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2,
  },
  label: {
    fontSize: 13,
    opacity: 0.5,
  },
  value: {
    fontSize: 16,
    fontWeight: "500",
  },
  badge: {
    marginLeft: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    flexDirection: "row",
    alignItems: "center",
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "700",
    textTransform: "uppercase",
    marginLeft: 3,
  },
});
