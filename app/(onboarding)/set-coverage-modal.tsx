import SetLocationCoverageModal from "@/components/onboarding/SetLocationCoverageModal";
import { ThemedText } from "@/components/ui/Themed";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useAuthStore } from "@/stores/auth.store";
import { useOnboardingStore } from "@/stores/onboarding.store";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import { Platform, TouchableOpacity } from "react-native";

export default function SetCoverageModalRoute() {
  const router = useRouter();
  const updateFields = useOnboardingStore((s) => s.updateFields);
  const serviceArea = useOnboardingStore((s) => s.serviceArea);
  const radiusKm = useOnboardingStore((s) => s.radiusKm);
  const userLocation = useAuthStore((s) => s.userLocation);

  const tintColor = useThemeColor({}, "tint");
  const textColor = useThemeColor({}, "text");

  const handleConfirm = (data: {
    formattedAddress: string;
    latitude: number;
    longitude: number;
    radiusKm: number;
  }) => {
    // Update the store
    updateFields({
      serviceArea: {
        formattedAddress: data.formattedAddress,
        center: {
          latitude: data.latitude,
          longitude: data.longitude,
        },
      },
      radiusKm: data.radiusKm,
    });

    // Go back to the Service Area step
    router.back();
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          presentation: "modal",
          headerTitle: "Coverage Zone",
          headerTitleAlign: "center",
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: Platform.OS === "ios" ? undefined : "transparent",
          },
          headerTitleStyle: {
            fontWeight: "700",
            fontSize: 17,
            fontFamily: Platform.OS === "ios" ? "System" : "sans-serif-medium",
          },
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.back()}
              style={{ marginLeft: Platform.OS === "ios" ? 0 : 4 }}
              activeOpacity={0.7}
            >
              {Platform.OS === "ios" ? (
                <ThemedText
                  style={{
                    color: tintColor,
                    fontSize: 17,
                    fontWeight: "500",
                  }}
                >
                  Cancel
                </ThemedText>
              ) : (
                <Ionicons name="close" size={24} color={textColor} />
              )}
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity
              onPress={() => {
                /* You could trigger form submit here if you move state up */
              }}
              style={{ marginRight: Platform.OS === "ios" ? 0 : 4 }}
            >
              <Ionicons
                name="help-circle-outline"
                size={22}
                color={textColor}
                style={{ opacity: 0.6 }}
              />
            </TouchableOpacity>
          ),
        }}
      />
      <SetLocationCoverageModal
        initialLat={
          serviceArea?.center.latitude || userLocation?.[1] || 6.465422
        }
        initialLng={
          serviceArea?.center.longitude || userLocation?.[0] || 3.406448
        }
        initialRadius={radiusKm || 5}
        onConfirm={handleConfirm}
      />
    </>
  );
}
