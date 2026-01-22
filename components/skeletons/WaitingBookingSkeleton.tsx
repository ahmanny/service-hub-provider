import React from "react";
import { StyleSheet, View } from "react-native";
import { ShimmerSkeleton } from "../ui/ShimmerSkeleton";

export function WaitingBookingSkeleton() {
  return (
    <View style={styles.container}>
      <ShimmerSkeleton width={52} height={52} borderRadius={26} />

      <ShimmerSkeleton width={180} height={18} style={{ marginTop: 12 }} />

      <ShimmerSkeleton width={240} height={14} style={{ marginTop: 8 }} />

      <ShimmerSkeleton
        width={120}
        height={40}
        borderRadius={20}
        style={{ marginTop: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    alignItems: "center",
  },
});
