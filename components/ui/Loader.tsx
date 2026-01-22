import { ActivityIndicator, View } from "react-native";
import { useThemeColor } from "@/hooks/use-theme-color";

export function Loader() {
  const tint = useThemeColor({}, "tint");

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" color={tint} />
    </View>
  );
}
