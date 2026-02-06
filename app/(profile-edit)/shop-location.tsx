import SetLocationModalScreen from "@/components/screens/SetLocationModalScreen";
import { useUpdateShopLocation } from "@/hooks/useProfile";
import { useAuthStore } from "@/stores/auth.store";
import { Stack, useRouter } from "expo-router";
import React from "react";
import { Alert, Platform, ToastAndroid } from "react-native";

export default function ShopLocationScreen() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const { mutateAsync, isPending } = useUpdateShopLocation();

  const initialLat = user?.shopAddress?.location.coordinates[1] || 6.5244;
  const initialLng = user?.shopAddress?.location.coordinates[0] || 3.3792;

  const handleConfirm = async (data: {
    label: string;
    formattedAddress: string;
    city?: string;
    state?: string;
    latitude: number;
    longitude: number;
  }) => {
    try {
      await mutateAsync({
        shopAddress: data,
        offersShopVisit: true,
      });

      if (Platform.OS === "android") {
        ToastAndroid.show("Location updated", ToastAndroid.SHORT);
      }
      router.back();
    } catch (err: any) {
      Alert.alert("Error", err.message || "Failed to save location");
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: "Set Shop Location",
          headerTransparent: Platform.OS === "ios",
          headerBlurEffect: "light",
        }}
      />
      <SetLocationModalScreen
        isEdit={true}
        label="Shop"
        initialLat={initialLat}
        initialLng={initialLng}
        isPending={isPending}
        onConfirm={handleConfirm}
      />
    </>
  );
}
