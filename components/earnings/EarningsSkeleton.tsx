import { ScrollView, StyleSheet, View } from "react-native";
import { ShimmerSkeleton } from "../ui/ShimmerSkeleton";

export function EarningsSkeleton() {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ padding: 20, gap: 20 }}
    >
      {/* Header Stat */}
      <View>
        <ShimmerSkeleton width={120} height={20} style={{ marginBottom: 10 }} />
        <ShimmerSkeleton width={200} height={45} style={{ marginBottom: 10 }} />
        <ShimmerSkeleton width={150} height={15} />
      </View>

      {/* Balance Card */}
      <ShimmerSkeleton width="100%" height={160} borderRadius={20} />

      {/* Chart Area */}
      <View style={{ gap: 10 }}>
        <ShimmerSkeleton width={150} height={20} />
        <ShimmerSkeleton width="100%" height={200} borderRadius={15} />
      </View>

      {/* List Items */}
      {[1, 2, 3].map((i) => (
        <View
          key={i}
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <View style={{ gap: 5 }}>
            <ShimmerSkeleton width={140} height={18} />
            <ShimmerSkeleton width={80} height={14} />
          </View>
          <ShimmerSkeleton width={60} height={25} />
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "transparent" },
});
