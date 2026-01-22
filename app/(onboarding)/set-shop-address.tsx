import SetLocationModalScreen from "@/components/screens/SetLocationModalScreen";
import { ThemedText } from "@/components/ui/Themed";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useAuthStore } from "@/stores/auth.store";
import { useOnboardingStore } from "@/stores/onboarding.store";
import { Ionicons } from "@expo/vector-icons";
import { router, Stack } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Platform,
  ToastAndroid,
  TouchableOpacity,
  Vibration,
} from "react-native";

export default function SetShopLocation() {
  const [isLoading, seIsLoading] = useState(false);
  const userLocation = useAuthStore((s) => s.userLocation);

  const defaultLat = 6.5244;
  const defaultLng = 3.3792;

  const tintColor = useThemeColor({}, "tint");
  const textColor = useThemeColor({}, "text");

  const { updateFields } = useOnboardingStore();

  const handleLocationSelected = async (data: {
    label: string;
    formattedAddress: string;
    latitude: number;
    longitude: number;
  }) => {
    console.log("Data", data);
    try {
      seIsLoading(true);
      updateFields({
        shopAddress: data,
      });
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
    } finally {
      seIsLoading(false);
    }
  };
  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          presentation: "modal",
          headerTitle: "", //set a title for me here
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
      <SetLocationModalScreen
        initialLat={userLocation ? userLocation[1] : defaultLat}
        initialLng={userLocation ? userLocation[0] : defaultLng}
        onConfirm={handleLocationSelected}
        isPending={isLoading}
        label={"Shop"}
      />
    </>
  );
}
