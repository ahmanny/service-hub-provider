import { useThemeColor } from "@/hooks/use-theme-color";
import { StyleSheet, View } from "react-native";

export function BookingCardSkeleton() {
  const skeletonBg = useThemeColor({}, "border"); // subtle gray placeholder
  const iconBg = useThemeColor({}, "placeholder"); // for icon
  return (
    <View style={styles.container}>
      {/* TOP ROW */}
      <View style={styles.topRow}>
        {/* PROFILE */}
        <View style={styles.profileLeft}>
          <View style={[styles.avatar, { backgroundColor: iconBg }]} />
          <View>
            <View style={[styles.name, { backgroundColor: skeletonBg }]} />
            <View style={[styles.meta, { backgroundColor: skeletonBg }]} />
          </View>
        </View>

        {/* LOCATION */}
        <View style={styles.locationRow}>
          <View
            style={[styles.locationPill, { backgroundColor: skeletonBg }]}
          />
          <View
            style={[styles.locationPill, { backgroundColor: skeletonBg }]}
          />
        </View>
      </View>

      {/* SERVICES TITLE */}
      <View style={[styles.sectionTitle, { backgroundColor: iconBg }]} />

      {/* SERVICES GRID */}
      <View style={styles.servicesGrid}>
        <View style={[styles.serviceCard, { backgroundColor: skeletonBg }]} />
        <View style={[styles.serviceCard, { backgroundColor: skeletonBg }]} />
        <View style={[styles.serviceCard, { backgroundColor: skeletonBg }]} />
        <View style={[styles.serviceCard, { backgroundColor: skeletonBg }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 8,
  },

  topRow: {
    marginBottom: 12,
  },

  profileLeft: {
    flexDirection: "row",
    gap: 12,
  },

  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
  },

  name: {
    width: 120,
    height: 18,
    borderRadius: 6,
    marginBottom: 8,
  },

  meta: {
    width: 90,
    height: 14,
    borderRadius: 6,
  },

  locationRow: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  locationPill: {
    width: 96,
    height: 28,
    borderRadius: 14,
    marginBottom: 6,
  },

  sectionTitle: {
    width: 140,
    height: 14,
    borderRadius: 6,
    marginVertical: 10,
  },

  servicesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },

  serviceCard: {
    width: "48%",
    height: 64,
    borderRadius: 14,
  },
});
