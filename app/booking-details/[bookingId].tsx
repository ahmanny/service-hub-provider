import BookingDetailsScreen from "@/components/screens/BookingDetailsScreen";
import BookingDetailsSkeleton from "@/components/skeletons/BookingDetailsSkeleton";
import { BackButton } from "@/components/ui/BackButton";
import { ErrorState } from "@/components/ui/ErrorState";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useBookingDetails } from "@/hooks/useBooking";
import * as Burnt from "burnt";
import { Stack, useLocalSearchParams } from "expo-router";
import React, { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

export default function BookingPage() {
  const { bookingId, newBooking } = useLocalSearchParams<{
    bookingId: string;
    newBooking: string;
  }>();

  const { data, isLoading, error, refetch, isRefetching } = useBookingDetails({
    bookingId,
  });

  useEffect(() => {
    if (newBooking === "true") {
      Burnt.toast({
        title: "Success!",
        preset: "done",
        message: "Booking request sent",
        haptic: "success",
        duration: 3,
      });
    }
  }, [newBooking]);

  const onRefresh = React.useCallback(() => {
    refetch();
  }, [refetch]);

  // Theme Hooks
  const backgroundColor = useThemeColor({}, "background");

  //  Loading State
  if (isLoading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor }} edges={["top"]}>
        <Stack.Screen
          options={{
            title: "Loading...",
            headerShadowVisible: false,
            headerStyle: { backgroundColor },
            headerLeft: () => <BackButton />,
          }}
        />
        <BookingDetailsSkeleton />
      </SafeAreaView>
    );
  }

  // Error State
  if (error || !data) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor }}>
        <Stack.Screen
          options={{
            title: "Error",
            headerShadowVisible: false,
            headerStyle: { backgroundColor },
            headerLeft: () => <BackButton />,
          }}
        />
        <ErrorState
          message={error?.message || "We couldn't load this booking."}
          onRetry={onRefresh}
        />
      </SafeAreaView>
    );
  }

  // Main Screen
  return (
    <BookingDetailsScreen
      booking={data}
      isRefetching={isRefetching}
      onRefresh={onRefresh}
    />
  );
}
