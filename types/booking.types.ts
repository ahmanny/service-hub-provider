import { ServiceType } from "@/constants/services";


export type BookingSection = {
    title: string;
    data: BookingListItem[];
};

export type BookingTab = "pending" | "upcoming" | "past";

export type GeoAddress = {
    type: "Point";
    coordinates: [number, number]; // lng, lat
};

export interface BookingRequestPayload {
    providerId: string;
    service: string;
    serviceName: string;
    scheduledAt: string;
    locationType: "shop" | "home";
    price?: {
        service: number
        homeServiceFee: number | null
        total: number
    }
    geoAddress?: GeoAddress | null;
    textAddress?: string | null;
    note?: string | null;
}

export type BookingStatus =
    | "pending"
    | "accepted"
    | "declined"
    | "completed"
    | "cancelled"
    | "in_progress"
    | "expired";
;

type BookingBase = {
    _id: string;
    serviceName: string;
    serviceType: ServiceType;
    status: BookingStatus;
    scheduledAt: string;
    deadlineAt: string
    createdAt: string;
    updatedAt?: string;
    actualStartTime?: string
    autoStarted?: boolean,
    isDisputed?: boolean,
    _v?: number;
};
export type BookingDetails = BookingBase & {
    consumer: {
        _id: string;
        firstName: string;
        rating: number;
        profilePicture?: string | null;
    }
    location: {
        type: "home" | "shop";
        geoAddress?: GeoAddress;
        textAddress?: string;
    }
    price: {
        service: number
        homeServiceFee: number | null
        total: number
    }

    note?: string;
    declineReason?: string;
    expiredMessage?: string;

    cancelledAt?: Date;
    declinedAt?: Date;
    acceptedAt?: Date;
    rescheduledAt?: Date;
    completedAt?: Date
}

export type BookingListItem = BookingBase & {
    price: number;
    locationLabel: string;
    distance?: string | number
    consumer: {
        firstName: string,
        profilePicture: string
    }
};



export interface fetchBookingsParams {
    tab?: "upcoming" | "past" | "pending" | "all";
    status?: BookingStatus;
    lat?: number
    lng?: number
}



export type BookingActionPayload = {
    bookingId: string;
    action: "accept" | "decline" | "start" | "complete"
    reason?: string;
};