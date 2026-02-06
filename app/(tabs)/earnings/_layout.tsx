import { useThemeColor } from "@/hooks/use-theme-color";
import { Stack } from "expo-router";

export default function EarningsLayout() {
  const headerBackground = useThemeColor({}, "background");

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: headerBackground },
        headerShadowVisible: false, // Clean look
        headerTitle: "", // We'll use the custom title in the component
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />
      {/* <Stack.Screen
        name="transactions"
        options={{
          headerShown: true,
          title: "All Transactions",
          headerBackTitle: "Earnings",
        }}
      /> */}
    </Stack>
  );
}
