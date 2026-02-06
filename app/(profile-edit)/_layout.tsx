import { BackButton } from "@/components/ui/BackButton";
import { useThemeColor } from "@/hooks/use-theme-color";
import { Stack } from "expo-router";

export default function ProfileEditLayout() {
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
        presentation: "card",
      }}
    >
      <Stack.Screen name="personal-info" options={{ headerShown: false }} />
      <Stack.Screen
        name="services-prices"
        options={{ title: "Services & Prices" }}
      />

      <Stack.Screen
        name="delivery-mode"
        options={{ title: "Service Delivery" }}
      />
      <Stack.Screen name="shop-location" options={{ title: "Shop Address" }} />
      <Stack.Screen name="service-area" options={{ title: "Service Area" }} />
      <Stack.Screen name="availability" options={{ title: "Availability" }} />
      <Stack.Screen
        name="payout-details"
        options={{ title: "Payout Details" }}
      />
    </Stack>
  );
}
