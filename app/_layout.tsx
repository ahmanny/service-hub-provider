import { QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as React from "react";
import { useColorScheme } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { MD3LightTheme, PaperProvider } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { AppInitializer } from "@/components/guards/AppInitializer";
import { GlobalProfileSync } from "@/components/guards/GlobalProfileSync";
import { OfflineBanner } from "@/components/OfflineBanner";
import { queryClient } from "@/lib/queryClient";
import { initReactQueryOnlineManager } from "@/lib/reactQueryOnline";
import { useAuthStore } from "@/stores/auth.store";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";

import { useNotifications } from "@/hooks/useNotifications";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import relativeTime from "dayjs/plugin/relativeTime";
import { RootSiblingParent } from "react-native-root-siblings";

dayjs.extend(relativeTime);
dayjs.extend(duration);

export default function RootLayout() {
  useNotifications();
  const colorScheme = useColorScheme();

  React.useEffect(() => initReactQueryOnlineManager(), []);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const hasProfile = useAuthStore((s) => s.hasProfile);

  const theme = {
    ...MD3LightTheme,
    colors: {
      ...MD3LightTheme.colors,
      primary: "#006D5B", // Teal Green
      secondaryContainer: "#E6F4FE",
    },
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <RootSiblingParent>
          <QueryClientProvider client={queryClient}>
            <SafeAreaProvider>
              <PaperProvider theme={theme}>
                <ThemeProvider
                  value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
                >
                  <OfflineBanner />
                  <StatusBar style="auto" />

                  <AppInitializer disabled={!isAuthenticated}>
                    <GlobalProfileSync />
                    <Stack screenOptions={{ headerShown: false }}>
                      {/* must be logged in screens */}
                      <Stack.Protected guard={isAuthenticated}>
                        <Stack.Protected guard={hasProfile}>
                          <Stack.Screen name="(tabs)" />

                          <Stack.Screen
                            name="booking-details/[bookingId]"
                            options={{
                              headerShown: true,
                              animation: "slide_from_right",
                              presentation: "card",
                            }}
                          />
                        </Stack.Protected>
                        <Stack.Protected guard={!hasProfile}>
                          <Stack.Screen name="(onboarding)" />
                        </Stack.Protected>
                      </Stack.Protected>
                      {/* not must be logged in */}
                      <Stack.Protected guard={!isAuthenticated}>
                        <Stack.Screen
                          name="(auth)"
                          options={{ animation: "slide_from_right" }}
                        />
                      </Stack.Protected>

                      {/* modals to be used anywhere */}
                      <Stack.Screen
                        name="modal"
                        options={{ presentation: "modal" }}
                      />
                    </Stack>
                  </AppInitializer>
                </ThemeProvider>
              </PaperProvider>
            </SafeAreaProvider>
          </QueryClientProvider>
        </RootSiblingParent>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}
