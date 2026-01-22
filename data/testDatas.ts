import { BookingDetails } from "@/types/booking.types";




export const MOCK_BOOKING_DATA: BookingDetails = {
    _id: "695a88a8eded7569b5363d26",
    serviceName: "Basic Haircut",
    serviceType: "barber",
    status: "pending",
    scheduledAt: "2026-03-12T09:30:00.000Z",
    deadlineAt: "2026-01-20T09:10:00Z",
    createdAt: "2026-01-05T10:00:00.000Z",
    updatedAt: "2026-01-05T10:05:00.000Z",
    consumer: {
        _id: "prov_9921",
        firstName: "Solomon",
        rating: 4.9,
        profilePicture: "https://i.pravatar.cc/150?img=2",
    },
    location: {
        type: "home",
        textAddress: "Block 4, Flat 12, Jakande Estate, Lekki, Lagos",
        geoAddress: {
            type: "Point",
            coordinates: [3.4756, 6.4474]
        }
    },
    price: {
        service: 3500,
        homeServiceFee: 2000,
        total: 5500
    }
};


