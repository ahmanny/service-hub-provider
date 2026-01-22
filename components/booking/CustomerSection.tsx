import { useThemeColor } from "@/hooks/use-theme-color";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { AppAvatar } from "../ui/AppAvatar"; 
import { ThemedText } from "../ui/Themed";

export function CustomerSection({
  customer,
  isAccepted,
}: {
  customer: any;
  isAccepted: boolean;
}) {
  const tint = useThemeColor({}, "tint");
  const border = useThemeColor({}, "border");
  const textSecondary = useThemeColor({}, "textSecondary");

  if (!customer) return null;

  return (
    <View style={styles.customerContainer}>
      <View style={styles.customerRow}>
        <AppAvatar
          source={
            customer.profilePicture ? { uri: customer.profilePicture } : null
          }
          initials={customer.firstName}
          size={56}
          shape="rounded"
        />
        <View style={{ flex: 1 }}>
          <ThemedText style={styles.customerName}>
            {customer.firstName} {customer.lastName || ""}
          </ThemedText>
          <View style={styles.ratingPill}>
            <Ionicons name="star" size={12} color="#F59E0B" />
            <ThemedText style={styles.ratingText}>
              {customer.rating || "5.0"} • Trusted Client
            </ThemedText>
          </View>
        </View>
      </View>

      {isAccepted && (
        <View style={styles.contactRow}>
          <Pressable style={[styles.contactBtn, { borderColor: border }]}>
            <Ionicons name="call" size={18} color={tint} />
            <ThemedText style={[styles.contactBtnText, { color: tint }]}>
              Call
            </ThemedText>
          </Pressable>
          <Pressable style={[styles.contactBtn, { borderColor: border }]}>
            <Ionicons name="chatbubble-ellipses" size={18} color={tint} />
            <ThemedText style={[styles.contactBtnText, { color: tint }]}>
              Message
            </ThemedText>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  customerContainer: { width: "100%" },
  customerRow: { flexDirection: "row", alignItems: "center", gap: 15 },
  customerName: { fontSize: 20, fontWeight: "800" },
  ratingPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 4,
  },
  ratingText: { fontSize: 13, fontWeight: "600", opacity: 0.6 },
  contactRow: { flexDirection: "row", gap: 10, marginTop: 20 },
  contactBtn: {
    flex: 1,
    flexDirection: "row",
    height: 48,
    borderRadius: 15,
    borderWidth: 1.5,
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  contactBtnText: { fontSize: 14, fontWeight: "700" },
});
