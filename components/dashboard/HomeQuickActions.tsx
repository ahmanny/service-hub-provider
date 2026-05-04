import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";
import { ThemedText } from "../ui/Themed";
import { QuickAction } from "./QuickAction";

export function HomeQuickActions() {
  const router = useRouter();
  return (
    <>
      <ThemedText
        style={[styles.sectionTitle, { marginTop: 24, marginBottom: 10 }]}
      >
        Management
      </ThemedText>
      <View style={styles.actionList}>
        <QuickAction
          title="Edit Profile"
          description="Bio, name, and photo"
          icon="person-outline"
          onPress={() => {
            router.push("/(profile-edit)/personal-info");
          }}
        />
        <QuickAction
          title="Services"
          description="Catalog and pricing"
          icon="cut-outline"
          onPress={() => {
            router.push("/(profile-edit)/services-prices");
          }}
        />
        <QuickAction
          title="Availability"
          description="Working hours"
          icon="calendar-outline"
          onPress={() => {
            router.push("/(profile-edit)/availability");
          }}
        />
        <QuickAction
          title="Payouts"
          description="Wallet and bank info"
          icon="wallet-outline"
          onPress={() => {
            router.push("/(profile-edit)/payout-details");
          }}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  sectionTitle: { fontSize: 16, fontWeight: "800" },
  actionList: { gap: 8 },
});
