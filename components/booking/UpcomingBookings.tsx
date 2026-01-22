import { useFetchBookings } from "@/hooks/useBooking";
import React from "react";
import { BookingSectionListSkeleton } from "../skeletons/BookingSectionListSkeleton";
import { BookingSectionList } from "./BookingSectionList";

export default function UpcomingBookings() {
  const { data, isLoading, isRefetching, isError, refetch } = useFetchBookings({
    tab: "upcoming",
  });

  if (isLoading) {
    return <BookingSectionListSkeleton />;
  }

  //  API failures
  if (isError) {
    return (
      <BookingSectionList
        bookings={[]}
        type="upcoming"
        isError={isError}
        isRefetching={isRefetching}
        refetch={refetch}
      />
    );
  }

  return (
    <BookingSectionList
      bookings={data?.results ?? []}
      type="upcoming"
      isRefetching={isRefetching}
      refetch={refetch}
    />
  );
}
