


import { fetchBookingDetails, fetchBookings, handleBookingAction, sendRequest } from "@/services/booking.service";
import { BookingListItem, fetchBookingsParams } from "@/types/booking.types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

interface FetchBookingsResponce {
    results: BookingListItem[],
}

export const useSendBookingRequest = () => {
    return useMutation({
        mutationFn: sendRequest,
        onSuccess: (data) => {
            console.log("Booking created:", data);
        },
    });
};

export const useFetchBookings = (params: fetchBookingsParams) => {
    return useQuery<FetchBookingsResponce, Error>({
        queryKey: ["bookings", params],
        queryFn: () => fetchBookings(params),
        refetchOnWindowFocus: false,
    });
};

export const useBookingDetails = ({ bookingId }: { bookingId?: string, }) => {
    return useQuery({
        queryKey: ["booking-details", bookingId],
        queryFn: () => fetchBookingDetails({ bookingId: bookingId }),
        enabled: !!bookingId,
        refetchOnWindowFocus: false,
        retry: 3
    });
};


// action 
export const useBookingActions = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: handleBookingAction,
        onSuccess: (data, variables) => {
            console.log(`Booking ${variables.action} successful`);

            // Invalidate relevant queries to refresh the UI
            queryClient.invalidateQueries({ queryKey: ["fetch-bookings"] });
            queryClient.invalidateQueries({ queryKey: ["booking-details", variables.bookingId] });

        },
        onError: (error: any) => {
            console.error("Action failed:", error?.response?.data?.message || error.message);
        }
    });
};