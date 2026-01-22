import API from "@/lib/axios";
import { BookingActionPayload, BookingDetails, BookingRequestPayload, fetchBookingsParams } from "@/types/booking.types";


const BOOKINGS_ENDPOINT = "/bookings";

export const sendRequest = async (payload: BookingRequestPayload) => {
    console.log(payload)
    const { data } = await API.post(`${BOOKINGS_ENDPOINT}/request`, payload);
    return data
};

/**
 *  fetch for bookings
 */
export const fetchBookings = async ({ status, tab, lat, lng }: fetchBookingsParams) => {
    const params = new URLSearchParams();

    if (status) params.append("status", status);
    if (tab) params.append("tab", tab);

    if (lat) params.append("lat", lat.toString());
    if (lng) params.append("lng", lng.toString());

    const { data } = await API.get(`${BOOKINGS_ENDPOINT}?${params.toString()}`);
    return data;
};


/**
 * Fetch specific booking details by ID
 */
export async function fetchBookingDetails({ bookingId }: { bookingId?: string }) {
    const { data } = await API
        .get(`${BOOKINGS_ENDPOINT}/${bookingId}`);
    return data as BookingDetails;
}



/**
 * Handle Accept/Decline/Complete/Reschedule/Cancel and other actions
 * Endpoint: PATCH /bookings/:bookingId/action
 */
export const handleBookingAction = async (payload: BookingActionPayload) => {
    const { bookingId, ...body } = payload;
    const { data } = await API.patch(`${BOOKINGS_ENDPOINT}/${bookingId}/action`, body);
    return data;
};
