import SetLocationModalScreen from "@/components/screens/SetLocationModalScreen";
import { useAddressActions } from "@/hooks/useAddressActions";
import { useAuthStore } from "@/stores/auth.store";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import { Alert, Platform, ToastAndroid, Vibration } from "react-native";

// Define the shape based on your backend
interface IConsumerAddress {
  id?: string;
  label: string;
  address: string;
  latitude: number;
  longitude: number;
}

export default function SetLocationPage() {
  // Grab params passed from the previous screen
  const params = useLocalSearchParams<{
    addressId?: string;
    label?: string;
    initialLat?: string;
    initialLng?: string;
    edit?: string;
  }>();

  const { addAddress, isAdding, updateAddress, isUpdating } =
    useAddressActions();

  const userLocation = useAuthStore((s) => s.userLocation);

  const defaultLat = 6.5244;
  const defaultLng = 3.3792;

  const handleLocationSelected = async (data: any) => {
    console.log("Data", data);
    try {
      if (params.addressId) {
        await updateAddress({
          id: params.addressId as string,
          payload: {
            ...data,
            label: params.label || data.label,
          },
        });
      } else {
        await addAddress(data);
      }

      Vibration.vibrate(50);
      if (Platform.OS === "android") {
        ToastAndroid.show("Address saved successfully", ToastAndroid.SHORT);
      }

      router.back();
    } catch (err: any) {
      console.log(err);
      Vibration.vibrate(50);
      const errorMsg = err.message || "Failed to save address";

      if (Platform.OS === "android") {
        ToastAndroid.show(errorMsg, ToastAndroid.SHORT);
      } else {
        Alert.alert("Error", errorMsg);
      }
    }
  };

  const isEditMode = !!params.addressId || params.edit === "true";

  return (
    <SetLocationModalScreen
      initialLat={
        params.initialLat
          ? parseFloat(params.initialLat)
          : userLocation
          ? userLocation[1]
          : defaultLat
      }
      initialLng={
        params.initialLng
          ? parseFloat(params.initialLng)
          : userLocation
          ? userLocation[0]
          : defaultLng
      }
      onConfirm={handleLocationSelected}
      isPending={isAdding || isUpdating}
      isEdit={isEditMode}
      label={params.label}
    />
  );
}
