import { useThemeColor } from "@/hooks/use-theme-color";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { ThemedText } from "../ui/Themed";

interface SectionHeaderProps {
  title: string;
  onViewAll: () => void;
}

export default function SectionHeader({
  title,
  onViewAll,
}: SectionHeaderProps) {
  const tint = useThemeColor({}, "tint");

  return (
    <View style={styles.container}>
      <ThemedText type="subtitle" style={styles.title}>
        {title}
      </ThemedText>
      <TouchableOpacity onPress={onViewAll}>
        <ThemedText style={{ color: tint, fontWeight: "600" }}>
          View all
        </ThemedText>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginVertical: 16,
  },
  title: {
    fontSize: 18,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
});
