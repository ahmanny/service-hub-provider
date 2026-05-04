import { ThemedText } from "@/components/ui/Themed";
import { ProfileStatus } from "@/types/user.types";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, View } from "react-native";

export function ProfileStatusBanner({
  status,
  reason,
  colors,
}: {
  status: ProfileStatus;
  reason?: string;
  colors: any;
}) {
  if (status === "approved") return null;

  const isPending = status === "pending";
  const color = isPending ? colors.warning : colors.danger;

  return (
    <View
      style={[
        styles.banner,
        { backgroundColor: `${color}15`, borderColor: color },
      ]}
    >
      <Ionicons
        name={isPending ? "time-outline" : "alert-circle-outline"}
        size={24}
        color={color}
      />
      <View style={styles.textContainer}>
        <ThemedText type="defaultSemiBold">
          {isPending ? "Profile Under Review" : "Profile Rejected"}
        </ThemedText>
        <ThemedText style={styles.subtext}>
          {isPending
            ? "You can edit details, but you can't accept jobs yet."
            : reason || "Check your verification details."}
        </ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 16,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
  },
  textContainer: { flex: 1, marginLeft: 12 },
  subtext: { fontSize: 13, opacity: 0.8, marginTop: 2 },
});
