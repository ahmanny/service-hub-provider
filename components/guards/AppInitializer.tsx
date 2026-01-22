import SplashScreen from "@/components/SplashScreen";
import { useAuthStore } from "@/stores/auth.store";
import * as Location from "expo-location";
import React, { useEffect, useState } from "react";

const FALLBACK_LOCATION: [number, number] = [3.3792, 6.5244];

export function AppInitializer({
  children,
  disabled,
}: {
  children: React.ReactNode;
  disabled?: boolean;
}) {
  const [locationLoading, setLocationLoading] = useState(true);

  // Get hydration status and actions from store
  const isHydrated = useAuthStore((s) => s.hydrated);
  const setLocation = useAuthStore((s) => s.setLocation);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  useEffect(() => {
    if (disabled) {
      setLocationLoading(false);
      return;
    }

    async function initLocation() {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === "granted") {
          const loc = await Location.getCurrentPositionAsync({});
          setLocation([loc.coords.longitude, loc.coords.latitude]);
        } else {
          setLocation(FALLBACK_LOCATION);
        }
      } catch (e) {
        console.error("Location Init Error:", e);
        setLocation(FALLBACK_LOCATION);
      } finally {
        setLocationLoading(false);
      }
    }

    initLocation();
  }, [disabled]);

  // Block UI until:
  //  Zustand has finished reading from AsyncStorage
  //  Location has been resolved
  if (!isHydrated || (locationLoading && !disabled)) {
    return <SplashScreen />;
  }

  return <>{children}</>;
}
