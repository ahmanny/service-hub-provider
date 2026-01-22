import { useFetchBookings } from "@/hooks/useBooking";
import React from "react";
import { BookingSectionListSkeleton } from "../skeletons/BookingSectionListSkeleton";
import { BookingSectionList } from "./BookingSectionList";

export default function PastBookings() {
  const { data, isLoading, isRefetching, isError, refetch } = useFetchBookings({
    tab: "past",
  });

  if (isLoading) {
    return <BookingSectionListSkeleton />;
  }

  //  API failures
  if (isError) {
    return (
      <BookingSectionList
        bookings={[]}
        type="past"
        isError={isError}
        isRefetching={isRefetching}
        refetch={refetch}
      />
    );
  }

  return (
    <BookingSectionList
      bookings={data?.results ?? []}
      type="past"
      isRefetching={isRefetching}
      refetch={refetch}
    />
  );
}
