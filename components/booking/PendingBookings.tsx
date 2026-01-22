import { useFetchBookings } from "@/hooks/useBooking";
import { useAuthStore } from "@/stores/auth.store";
import React from "react";
import { BookingSectionListSkeleton } from "../skeletons/BookingSectionListSkeleton";
import { BookingSectionList } from "./BookingSectionList";

export default function PendingBookings() {
  const userLocation = useAuthStore((s) => s.userLocation);
  const { data, isLoading, isRefetching, isError, refetch } = useFetchBookings({
    tab: "pending",
    // lat: userLocation ? userLocation[1] : undefined,
    // lng: userLocation ? userLocation[0] : undefined,
  });

  if (isLoading) {
    return <BookingSectionListSkeleton />;
  }

  //  API failures
  if (isError) {
    return (
      <BookingSectionList
        bookings={[]}
        type="pending"
        isError={isError}
        isRefetching={isRefetching}
        refetch={refetch}
      />
    );
  }
  return (
    <BookingSectionList
      bookings={data?.results ?? []}
      type="pending"
      isRefetching={isRefetching}
      refetch={refetch}
    />
  );
}
