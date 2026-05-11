import { ProfileStatus } from "@/types/user.types";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { ThemedText } from "../ui/Themed";

interface Props {
  status: ProfileStatus;
  reason?: string;
  onDismiss?: () => void;
}

export const StatusBanner = ({ status, reason, onDismiss }: Props) => {
  const [visible, setVisible] = useState(true);

  const config = {
    pending: {
      icon: "time",
      color: "#F59E0B",
      title: "Profile under review",
      desc: "We’re reviewing your details. Usually takes 24 hours.",
      action: "Learn more",
    },
    rejected: {
      icon: "alert-circle",
      color: "#EF4444",
      title: "Application Rejected",
      desc: reason || "Please check your documents and try again.",
      action: "View Details",
    },
    approved: {
      icon: "checkmark-circle",
      color: "#10B981",
      title: "Account Verified!",
      desc: "You are now live. Start accepting bookings.",
      action: "Dismiss",
    },
  };

  const current = config[status as keyof typeof config];

  if (!current || !visible) return null;

  const handleDismiss = () => {
    setVisible(false);
    onDismiss?.();
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: `${current.color}28`, borderColor: current.color },
      ]}
    >
      <View style={styles.content}>
        <Ionicons name={current.icon as any} size={22} color={current.color} />
        <View style={styles.textContainer}>
          <ThemedText style={[styles.title, { color: current.color }]}>
            {current.title}
          </ThemedText>
          <ThemedText style={styles.desc}>{current.desc}</ThemedText>

          <TouchableOpacity
            onPress={handleDismiss}
          >
            <ThemedText style={[styles.action, { color: current.color }]}>
              {current.action}
            </ThemedText>
          </TouchableOpacity>
        </View>

        {status === "approved" && (
          <TouchableOpacity onPress={handleDismiss}>
            <Ionicons name="close" size={20} color={current.color} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 20,
  },
  content: { flexDirection: "row", gap: 12 },
  textContainer: { flex: 1, gap: 4 },
  title: { fontWeight: "800", fontSize: 14 },
  desc: { fontSize: 13, opacity: 0.8, lineHeight: 18 },
  action: {
    fontSize: 13,
    fontWeight: "700",
    marginTop: 8,
    textDecorationLine: "underline",
  },
});
