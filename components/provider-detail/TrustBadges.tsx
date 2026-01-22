import { useThemeColor } from "@/hooks/use-theme-color";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";
import { ThemedText } from "../ui/Themed";

export default function TrustBadges() {
  const benefits = [
    { icon: "shield-checkmark-outline", text: "Verified providers" },
    { icon: "card-outline", text: "Secure payments" },
    { icon: "headset-outline", text: "Customer support guarantee" },
  ];

  const tint = useThemeColor({}, "tint");

  return (
    <View style={styles.container}>
      <ThemedText style={styles.title}>Why book with us?</ThemedText>
      {benefits.map((b, i) => (
        <View key={i} style={styles.benefitRow}>
          <Ionicons name={b.icon as any} size={18} color={tint} />
          <ThemedText style={styles.benefitText}>{b.text}</ThemedText>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "rgba(76, 175, 80, 0.05)",
    borderRadius: 12,
    margin: 20,
  },
  title: { fontSize: 15, fontWeight: "700", marginBottom: 12 },
  benefitRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 8,
  },
  benefitText: { fontSize: 14, opacity: 0.8 },
});
