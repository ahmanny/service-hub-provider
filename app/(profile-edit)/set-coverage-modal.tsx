import SetLocationCoverageModal from "@/components/onboarding/SetLocationCoverageModal";
import { useUpdateServiceArea } from "@/hooks/useProfile";
import { useAuthStore } from "@/stores/auth.store";
import { Stack, useRouter } from "expo-router";

export default function SetCoverageModalEditRoute() {
  const router = useRouter();
  const profile = useAuthStore((s) => s.user);
  const userLocation = useAuthStore((s) => s.userLocation);
  const { mutateAsync: updateArea, isPending } = useUpdateServiceArea();

  if (!profile) return null;

  const initialLng =
    profile?.serviceArea?.location?.coordinates?.[0] ??
    userLocation?.[0] ??
    4.54515095;

  const initialLat =
    profile?.serviceArea?.location?.coordinates?.[1] ??
    userLocation?.[1] ??
    9.57517722;

  const initialRadius = profile?.serviceArea?.radiusKm ?? 2;

  const handleConfirm = async (data: {
    formattedAddress: string;
    latitude: number;
    longitude: number;
    radiusKm: number;
  }) => {
    try {
      await updateArea({
        serviceArea: {
          formattedAddress: data.formattedAddress,
          center: { latitude: data.latitude, longitude: data.longitude },
        },
        radiusKm: data.radiusKm,
      });
      router.back();
    } catch (err) {
      // Error handled by hook
    }
  };

  return (
    <>
      <Stack.Screen
        options={{ title: "Adjust Coverage", presentation: "modal" }}
      />
      <SetLocationCoverageModal
        isPending={isPending}
        initialLat={initialLat}
        initialLng={initialLng}
        initialRadius={initialRadius}
        onConfirm={handleConfirm}
      />
    </>
  );
}
