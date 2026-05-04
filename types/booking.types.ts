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

export enum BookingStatus {
    PENDING = 'pending',
    ACCEPTED = 'accepted',
    DECLINED = 'declined',
    IN_PROGRESS = 'in_progress',
    COMPLETION_PENDING = 'completion_pending',
    COMPLETED = 'completed',
    DISPUTED = 'disputed',
    CANCELLED = 'cancelled',
    EXPIRED = 'expired',
    CANCELLED_REFUNDED = 'cancelled_refunded',
}

export enum PaymentStatus {
    PENDING = 'pending',
    AUTHORIZED = 'authorized',
    HELD = 'held',
    RELEASED = 'released',
    REFUNDED = 'refunded',
    FAILED = 'failed',
}

export enum PayoutStatus {
    PENDING = 'pending',
    FROZEN = 'frozen',
    AVAILABLE = 'available',
    PROCESSING = 'processing',
    COMPLETED = 'completed',
}

interface Participant {
    _id: string;
    firstName: string;
    rating: number;
    profilePicture: string | null;
}

export interface IPrice {
    service: number;
    homeServiceFee: number | null;
    platformFee: number | 0;
    total: number;
}

type BookingBase = {
    _id: string;
    serviceName: string;
    serviceType: ServiceType;
    status: BookingStatus;
    paymentStatus: PaymentStatus;
    payoutStatus: PayoutStatus;

    // Logic Helpers from Backend
    disputeDeadline?: string;
    canDispute: boolean;
    canComplete: boolean;
    isDisputed: boolean;
    disputeId?: string;
    autoStarted: boolean

    // Time Tracking (All ISO Strings)
    scheduledAt: string;
    deadlineAt?: string;
    createdAt: string;
    updatedAt: string;
    acceptedAt?: string;
    actualStartTime?: string;
    completionPendingAt?: string;
    completedAt?: string;
    cancelledAt?: string;
    declinedAt?: string;
    rescheduledAt?: string;

    __v?: number;
};

export type BookingDetails = BookingBase & {
    consumer: Participant;
    location: {
        type: "home" | "shop";
        geoAddress?: GeoAddress;
        textAddress?: string;
    }
    price: IPrice;

    isRated: boolean
    rating?: {
        score: number;
        comment?: string;
        createdAt?: string;
    };

    note?: string;
    declineReason?: string;
    expiredMessage?: string;
    cancelMessage?: string;
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

export enum DisputeReason {
    NO_SHOW = 'no_show',
    POOR_QUALITY = 'poor_quality',
    INCOMPLETE = 'incomplete',
    DAMAGED_PROPERTY = 'damaged_property',
    OTHER = 'other',
}

export enum DisputeResolution {
    PENDING = 'pending',
    REJECTED = 'rejected',           // Provider gets paid
    FULL_REFUND = 'full_refund',     // Consumer gets money back
    PARTIAL_REFUND = 'partial_refund',
}



export type BookingActionPayload = {
    bookingId: string;
    action: "accept" | "decline" | "start" | "complete"
    reason?: string;
};