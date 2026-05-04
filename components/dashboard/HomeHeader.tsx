import React from "react";
import { StyleSheet, View } from "react-native";
import { ThemedText } from "../ui/Themed";
import { OnlineStatusCard } from "./OnlineStatusCard";

interface Props {
  firstName: string;
  greeting: string;
  isApproved: boolean;
  isOnline: boolean;
}

export function HomeHeader({
  firstName,
  greeting,
  isApproved,
  isOnline,
}: Props) {
  return (
    <View style={styles.header}>
      <ThemedText type="title" style={styles.greeting}>
        {greeting}, {firstName}
      </ThemedText>

      <OnlineStatusCard
        isApproved={isApproved}
        isOnline={isOnline}
        width={"100%"}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: { marginBottom: 24 },
  greeting: { fontSize: 23, fontWeight: "900", marginBottom: 20 },
});
