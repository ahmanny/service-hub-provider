import { BackButton } from "@/components/ui/BackButton"; 
import { useThemeColor } from "@/hooks/use-theme-color";
import { Stack } from "expo-router";

export default function ModalLayout() {
  const bg = useThemeColor({}, "background");
  const text = useThemeColor({}, "text");

  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: bg },
        headerTitleStyle: {
          fontWeight: "800",
          fontSize: 20,
          color: text,
        },
        headerLeft: () => <BackButton />,
        headerShadowVisible: false,
        animation: "slide_from_right",
        presentation: "modal",
      }}
    >
      <Stack.Screen name="withdraw" options={{ title: "Withdraw Funds" }} />
    </Stack>
  );
}
