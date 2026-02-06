import { BackButton } from "@/components/ui/BackButton";
import { useThemeColor } from "@/hooks/use-theme-color";
import { Stack } from "expo-router";

export default function PersonalInfoLayout() {
  const bg = useThemeColor({}, "background");
  const text = useThemeColor({}, "text");

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: bg },
        headerTitleStyle: {
          fontWeight: "800",
          fontSize: 20,
          color: text,
        },
        headerLeft: () => <BackButton />,
        headerShadowVisible: false,
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen name="index" options={{ title: "Personal Info" }} />
      <Stack.Screen name="edit-name" />
      <Stack.Screen name="edit-phone" />
      <Stack.Screen name="edit-email" />
      <Stack.Screen name="edit-bio" />
    </Stack>
  );
}
