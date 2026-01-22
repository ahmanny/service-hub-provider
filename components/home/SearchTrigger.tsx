import { useThemeColor } from "@/hooks/use-theme-color";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, View } from "react-native";
import { ThemedText } from "../ui/Themed";

export default function SearchTrigger({ onPress }: { onPress: () => void }) {
  const cardBg = useThemeColor({}, "card");
  const muted = useThemeColor({}, "placeholder");

  return (
    <Pressable
      style={[styles.container, { backgroundColor: cardBg }]}
      onPress={onPress}
    >
      <Ionicons name="search" size={20} color={muted} />
      <ThemedText style={[styles.placeholder, { color: muted }]}>
        Search for a service or provider
      </ThemedText>
      <View style={[styles.filterIcon, { borderLeftColor: muted + "30" }]}>
        <Ionicons name="options-outline" size={20} color={muted} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
    paddingHorizontal: 15,
    height: 54,
    borderRadius: 15,
    marginTop: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  placeholder: {
    flex: 1,
    marginLeft: 10,
    fontSize: 15,
  },
  filterIcon: {
    paddingLeft: 12,
    borderLeftWidth: 1,
  },
});
