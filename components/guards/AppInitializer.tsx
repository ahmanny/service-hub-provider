import SplashScreen from "@/components/SplashScreen";
import { useAuthStore } from "@/stores/auth.store";
import * as Location from "expo-location";
import React, { useEffect, useRef, useState } from "react";
import { Animated } from "react-native";

const FALLBACK_LOCATION: [number, number] = [3.3792, 6.5244];
const MIN_SPLASH_MS = 2500;

export function AppInitializer({
  children,
  disabled,
}: {
  children: React.ReactNode;
  disabled?: boolean;
}) {
  const [locationLoading, setLocationLoading] = useState(true);
  const [minTimeElapsed, setMinTimeElapsed] = useState(false);
  const [splashVisible, setSplashVisible] = useState(true);
  const fadeOut = useRef(new Animated.Value(1)).current;

  const isHydrated = useAuthStore((s) => s.hydrated);
  const setLocation = useAuthStore((s) => s.setLocation);

  useEffect(() => {
    const minTimer = setTimeout(() => setMinTimeElapsed(true), MIN_SPLASH_MS);
    return () => clearTimeout(minTimer);
  }, []);

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

  const isReady =
    isHydrated && !(locationLoading && !disabled) && minTimeElapsed;

  useEffect(() => {
    if (isReady && splashVisible) {
      Animated.timing(fadeOut, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setSplashVisible(false));
    }
  }, [isReady]);

  return (
    <>
      {children}
      {splashVisible && (
        <Animated.View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: fadeOut,
          }}
        >
          <SplashScreen />
        </Animated.View>
      )}
    </>
  );
}
