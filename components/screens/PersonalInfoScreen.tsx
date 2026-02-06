import { ThemedText } from "@/components/ui/Themed";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useAuthStore } from "@/stores/auth.store";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { ProfileHeader } from "../profile/ProfileHeader";

// Prop Types
interface InfoRowProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  isVerified?: boolean;
  onPress: () => void;
  isMultiline?: boolean;
}

export default function PersonalInfoScreen() {
  const profile = useAuthStore((s) => s.user);
  const bg = useThemeColor({}, "background");

  if (!profile) return null;

  return (
    <View style={{ flex: 1, backgroundColor: bg }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        <ProfileHeader profile={profile} />

        <View style={styles.infoGroup}>
          <InfoRow
            icon="person-outline"
            label="Full Name"
            value={`${profile.firstName} ${profile.lastName}`}
            onPress={() =>
              router.push("/(profile-edit)/personal-info/edit-name")
            }
          />

          <InfoRow
            icon="call-outline"
            label="Phone Number"
            value={profile.userId.phone}
            onPress={() =>
              router.push("/(profile-edit)/personal-info/edit-phone")
            }
          />
          <InfoRow
            icon="document-text-outline"
            label="Short Bio"
            value={profile.bio || "Tell providers about yourself..."}
            isMultiline
            onPress={() =>
              router.push("/(profile-edit)/personal-info/edit-bio")
            }
          />

          <InfoRow
            icon="mail-outline"
            label="Email"
            value={profile.userId.email || "Not Added"}
            isVerified={profile.userId.isEmailVerified}
            onPress={() =>
              router.push("/(profile-edit)/personal-info/edit-email")
            }
          />
        </View>
      </ScrollView>
    </View>
  );
}

const InfoRow = ({
  icon,
  label,
  value,
  isVerified,
  onPress,
  isMultiline,
}: InfoRowProps) => {
  const muted = useThemeColor({}, "placeholder");
  const tint = useThemeColor({}, "tint");
  const errorColor = "#FF3B30";

  return (
    <TouchableOpacity
      style={[styles.row, isMultiline && styles.multilineRow]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View
        style={[styles.rowLeft, isMultiline && { alignItems: "flex-start" }]}
      >
        <View style={[styles.iconContainer, isMultiline && { marginTop: 2 }]}>
          <Ionicons name={icon} size={22} color={muted} />
        </View>

        <View style={{ marginLeft: 15, flex: 1 }}>
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

          <ThemedText
            style={[styles.value, isMultiline && styles.bioValue]}
            numberOfLines={isMultiline ? 4 : 1}
          >
            {value}
          </ThemedText>
        </View>
      </View>

      <Ionicons
        name="chevron-forward"
        size={18}
        color="#D1D5DB"
        style={isMultiline ? { alignSelf: "center" } : {}}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, paddingBottom: 40 },
  infoGroup: { marginTop: 10 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 18,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(0,0,0,0.05)",
  },
  multilineRow: {
    alignItems: "flex-start",
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
    marginBottom: 4,
  },
  label: {
    fontSize: 13,
    opacity: 0.5,
    fontWeight: "600",
  },
  value: {
    fontSize: 16,
    fontWeight: "500",
  },
  bioValue: {
    lineHeight: 22,
    fontSize: 15,
    opacity: 0.8,
    marginTop: 2,
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
