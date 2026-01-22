import { ShimmerSkeleton } from "@/components/ui/ShimmerSkeleton";
import { ThemedView } from "@/components/ui/Themed";
import { useThemeColor } from "@/hooks/use-theme-color";
import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";

export default function ProviderDetailSkeleton() {
  const divider = useThemeColor({}, "border");
  const bg = useThemeColor({}, "background");

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollBody}
      >
        <View style={styles.headerSection}>
          <ShimmerSkeleton width={100} height={100} borderRadius={50} />
          <View style={styles.headerTextGap}>
            <ShimmerSkeleton width="60%" height={24} />
            <ShimmerSkeleton width="40%" height={16} style={{ marginTop: 8 }} />
          </View>
        </View>

        <View style={[styles.divider, { backgroundColor: divider }]} />

        <View style={styles.section}>
          <ShimmerSkeleton
            width={100}
            height={20}
            style={{ marginBottom: 15 }}
          />
          {[1, 2, 3].map((i) => (
            <View key={i} style={styles.serviceRow}>
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
              >
                <ShimmerSkeleton width={20} height={20} borderRadius={10} />
                <ShimmerSkeleton width={150} height={18} />
              </View>
              <ShimmerSkeleton width={60} height={18} />
            </View>
          ))}
        </View>

        <View style={[styles.divider, { backgroundColor: divider }]} />

        <View style={styles.section}>
          <ShimmerSkeleton
            width={140}
            height={20}
            style={{ marginBottom: 15 }}
          />
          <View style={styles.rowGap}>
            <ShimmerSkeleton width="100%" height={40} borderRadius={10} />
            <ShimmerSkeleton width="100%" height={40} borderRadius={10} />
          </View>
        </View>
      </ScrollView>

      <View
        style={[
          styles.stickyBar,
          { borderTopColor: divider, backgroundColor: bg },
        ]}
      >
        <View>
          <ShimmerSkeleton width={60} height={12} style={{ marginBottom: 5 }} />
          <ShimmerSkeleton width={100} height={24} />
        </View>
        <ShimmerSkeleton width={140} height={48} borderRadius={12} />
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollBody: { paddingBottom: 120, paddingTop: 20 },
  headerSection: { alignItems: "center", paddingHorizontal: 20, gap: 15 },
  headerTextGap: { width: "100%", alignItems: "center" },
  section: { paddingHorizontal: 20, marginVertical: 10 },
  serviceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  rowGap: { gap: 10 },
  divider: { height: 1, marginVertical: 15, marginHorizontal: 20 },
  stickyBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 90,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    borderTopWidth: 1,
  },
});
