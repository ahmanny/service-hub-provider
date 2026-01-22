import { useThemeColor } from "@/hooks/use-theme-color";
import React from "react";
import { Dimensions, ScrollView, StyleSheet, View } from "react-native";
import { ShimmerSkeleton } from "../ui/ShimmerSkeleton";

const { width } = Dimensions.get("window");

export default function BookingDetailsSkeleton() {
  const bg = useThemeColor({}, "background");
  const card = useThemeColor({}, "card");
  const border = useThemeColor({}, "border");

  return (
    <View style={{ flex: 1, backgroundColor: bg }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* HERO SECTION SKELETON */}
        <View style={styles.heroSkeleton}>
          {/* Service Name */}
          <ShimmerSkeleton width={width * 0.7} height={32} borderRadius={8} />
          {/* Price  */}
          <View style={{ marginTop: 12 }}>
            <ShimmerSkeleton width={120} height={28} borderRadius={8} />
          </View>
          {/* Date */}
          <View style={{ marginTop: 15 }}>
            <ShimmerSkeleton width={160} height={36} borderRadius={25} />
          </View>
        </View>

        {/* CUSTOMER & LOCATION CARD */}
        <View
          style={[
            styles.glassCard,
            { backgroundColor: card, borderColor: border },
          ]}
        >
          <View style={styles.customerRow}>
            <ShimmerSkeleton width={56} height={56} borderRadius={18} />
            <View style={{ gap: 8 }}>
              <ShimmerSkeleton width={140} height={20} borderRadius={6} />
              <ShimmerSkeleton width={100} height={14} borderRadius={4} />
            </View>
          </View>

          <View style={[styles.divider, { backgroundColor: border }]} />

          <View style={styles.infoRow}>
            <ShimmerSkeleton width={44} height={44} borderRadius={15} />
            <View style={{ gap: 6 }}>
              <ShimmerSkeleton width={60} height={12} borderRadius={4} />
              <ShimmerSkeleton width={180} height={16} borderRadius={4} />
            </View>
          </View>
        </View>

        {/* PROCESS TRACKER CARD */}
        <View
          style={[
            styles.glassCard,
            { backgroundColor: card, borderColor: border },
          ]}
        >
          <View style={{ marginBottom: 20 }}>
            <ShimmerSkeleton width={100} height={12} borderRadius={4} />
          </View>
          {[1, 2, 3].map((_, i) => (
            <View key={i} style={styles.timelineRow}>
              <View style={styles.timelineLeft}>
                <ShimmerSkeleton width={10} height={10} borderRadius={5} />
                {i !== 2 && (
                  <View style={[styles.line, { backgroundColor: border }]} />
                )}
              </View>
              <View style={{ flex: 1, gap: 6, paddingBottom: 20 }}>
                <ShimmerSkeleton width={120} height={16} borderRadius={4} />
                <ShimmerSkeleton width={60} height={12} borderRadius={4} />
              </View>
            </View>
          ))}
        </View>

        {/* PAYMENT SUMMARY CARD */}
        <View
          style={[
            styles.glassCard,
            { backgroundColor: card, borderColor: border },
          ]}
        >
          <View style={{ marginBottom: 16 }}>
            <ShimmerSkeleton width={120} height={12} borderRadius={4} />
          </View>
          <View style={styles.priceRow}>
            <ShimmerSkeleton width={80} height={14} />
            <ShimmerSkeleton width={60} height={14} />
          </View>
          <View style={[styles.priceRow, { marginTop: 12 }]}>
            <ShimmerSkeleton width={80} height={14} />
            <ShimmerSkeleton width={60} height={14} />
          </View>
          <View
            style={[
              styles.divider,
              { backgroundColor: border, marginVertical: 15 },
            ]}
          />
          <View style={styles.priceRow}>
            <ShimmerSkeleton width={100} height={20} />
            <ShimmerSkeleton width={120} height={24} />
          </View>
        </View>
      </ScrollView>

      {/* FOOTER BUTTONS SKELETON */}
      <View
        style={[styles.footer, { backgroundColor: bg, borderTopColor: border }]}
      >
        <View style={{ alignItems: "center", marginBottom: 16 }}>
          <ShimmerSkeleton width={150} height={14} borderRadius={4} />
        </View>
        <View style={styles.actionGrid}>
          <ShimmerSkeleton width="33%" height={60} borderRadius={20} />
          <ShimmerSkeleton width="63%" height={60} borderRadius={20} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingHorizontal: 16, paddingTop: 20, paddingBottom: 180 },
  heroSkeleton: {
    alignItems: "center",
    marginBottom: 30,
    paddingTop: 10,
  },
  glassCard: {
    padding: 20,
    borderRadius: 28,
    borderWidth: 1,
    marginBottom: 16,
  },
  customerRow: { flexDirection: "row", alignItems: "center", gap: 15 },
  divider: { height: 1, width: "100%", marginVertical: 20, opacity: 0.3 },
  infoRow: { flexDirection: "row", alignItems: "center", gap: 15 },

  timelineRow: { flexDirection: "row", minHeight: 50 },
  timelineLeft: { alignItems: "center", width: 20, marginRight: 15 },
  line: { width: 2, flex: 1, marginVertical: 4 },

  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  footer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    padding: 20,
    paddingBottom: 20,
    borderTopWidth: 1,
  },
  actionGrid: { flexDirection: "row", justifyContent: "space-between" },
});
