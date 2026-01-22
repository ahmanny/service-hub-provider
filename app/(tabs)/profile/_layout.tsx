// app/(tabs)/profile/_layout.tsx
import { ThemedText } from "@/components/ui/Themed";
import { fontSize } from "@/constants/Layout";
import { useThemeColor } from "@/hooks/use-theme-color";
import { router, Stack } from "expo-router";
import { TouchableOpacity } from "react-native";

export default function ProfileLayout() {
  const textColor = useThemeColor({}, "text");
  const headerBackground = useThemeColor({}, "background");
  const tint = useThemeColor({}, "tint");

  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: headerBackground },
        headerTitleStyle: { fontWeight: "700", fontSize: fontSize.xl },
        headerTintColor: textColor,
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
          title: "Profile",
        }}
      />
      {/* Personal Info Hub */}
      <Stack.Screen
        name="personal-info"
        options={{ headerShown: true, title: "Personal Info" }}
      />
    </Stack>
  );
}
