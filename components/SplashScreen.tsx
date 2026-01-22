import { ActivityIndicator, useColorScheme } from "react-native";
import { ThemedText, ThemedView } from "./ui/Themed";

export default function SplashScreen() {
  const theme = useColorScheme();

  return (
    <ThemedView
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <ThemedText
        style={{
          fontSize: 28,
          fontWeight: "700",
          marginBottom: 16,
        }}
      >
        YourApp
      </ThemedText>

      <ActivityIndicator size="large" />
    </ThemedView>
  );
}
