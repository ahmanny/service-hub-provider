import { useThemeColor } from "@/hooks/use-theme-color";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { StyleSheet, View } from "react-native";
import { ThemedText } from "../ui/Themed";

export default function PopularProviderCard({ name, rating, image }: any) {
  const cardBg = useThemeColor({}, "card");
  return (
    <View style={[styles.popularCard, { backgroundColor: cardBg }]}>
      <Image source={{ uri: image }} style={styles.popularImage} />
      <View style={{ flex: 1, paddingLeft: 12 }}>
        <ThemedText type="defaultSemiBold">{name}</ThemedText>
        <View
          style={{ flexDirection: "row", alignItems: "center", marginTop: 4 }}
        >
          <Ionicons name="star" size={14} color="#FFCC00" />
          <ThemedText style={{ fontSize: 12, marginLeft: 4 }}>
            {rating} • 2.5km away
          </ThemedText>
        </View>
      </View>
      <Ionicons name="heart-outline" size={22} color="#999" />
    </View>
  );
}

const styles = StyleSheet.create({
  popularCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 16,
    marginHorizontal: 20,
    marginBottom: 12,
  },
  popularImage: { width: 60, height: 60, borderRadius: 12 },
});
