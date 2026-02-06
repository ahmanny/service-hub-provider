import { useThemeColor } from "@/hooks/use-theme-color";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { ThemedText } from "../ui/Themed";

export function RecentTransactions({ transactions }: { transactions: any[] }) {
  const tint = useThemeColor({}, "tint");

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="defaultSemiBold">Recent Transactions</ThemedText>
        <TouchableOpacity>
          <ThemedText style={{ color: tint, fontSize: 13 }}>
            View all
          </ThemedText>
        </TouchableOpacity>
      </View>

      {transactions.map((item) => (
        <View key={item.id} style={styles.item}>
          <View style={styles.leftCol}>
            <ThemedText type="defaultSemiBold">{item.title}</ThemedText>
            <ThemedText style={styles.date}>
              {item.date} • {item.status}
            </ThemedText>
          </View>
          <View style={styles.rightCol}>
            <ThemedText type="defaultSemiBold">
              ₦{item.net.toLocaleString()}
            </ThemedText>
            <ThemedText style={styles.fee}>Fee: ₦{item.fee || 0}</ThemedText>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 16 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: "#eee",
  },
  leftCol: { flex: 1, gap: 4 },
  rightCol: { alignItems: "flex-end", gap: 2 },
  date: { fontSize: 12, opacity: 0.5 },
  fee: { fontSize: 11, color: "#ff4444", opacity: 0.7 },
});
