import { useThemeColor } from "@/hooks/use-theme-color";
import { Stack } from "expo-router";

export default function HomeLayout() {
  const textColor = useThemeColor({}, "text");
  const headerBackground = useThemeColor({}, "background");

  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: headerBackground },
        headerTitleStyle: { fontWeight: "700", fontSize: 27 },
        headerTintColor: textColor,
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
          title: "Home",
        }}
      />
    </Stack>
  );
}
