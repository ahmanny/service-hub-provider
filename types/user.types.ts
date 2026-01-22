import { ServiceType } from "@/constants/services";
import { IAvailabilityDay } from "./provider.types";


export type ProfileStatus = 'pending' | 'approved' | 'rejected';

/**
 * Base Provider Profile interface
 */
export interface ProviderProfile {
    _id: string;
    userId: {
        _id: string;
        phone: string;
        email?: string;
        isEmailVerified: boolean;
        createdAt: string;
    };
    firstName: string;
    lastName: string;
    email: string;
    profilePicture?: string;
    bio?: string;

    isAvailable: boolean;
    availabilityMode: "instant" | "scheduled";
    serviceType: ServiceType;
    basePriceFrom: number;
    services: ProviderService[];

    // Delivery Logic
    homeServiceAvailable: boolean;
    offersShopVisit: boolean;

    serviceArea?: {
        address: string;
        location: GeoJsonPoint;
        radiusKm: number;
    };

    rating: number;
    status: ProfileStatus

    rejectionReason?: string

    verification?: {
        idUri: string;
        selfieUri: string;
    };

    avgServiceTime: number;
    shopAddress?: ProviderShopAddress;
    availability: IAvailabilityDay[];

    // Timestamps (from Mongoose)
    createdAt?: string;
    updatedAt?: string;
}



export interface ProviderService {
    name: string;
    value: string;
    price: number;
}

export interface GeoJsonPoint {
    type: "Point";
    coordinates: [number, number]; // [longitude, latitude]
}

export interface ProviderShopAddress {
    address: string;
    city?: string;
    state?: string;
    location: GeoJsonPoint;
}




export interface IConsumerAddress {
    _id: string;
    label: string; // e.g., "Home", "Work"
    formattedAddress: string;
    location: {
        type: 'Point';
        coordinates: [number, number]; // [longitude, latitude]
    };
    isDefault: boolean;
}


export interface ConsumerProfile {
    _id: string;
    userId: {
        _id: string;
        phone: string;
        email?: string;
        isEmailVerified: boolean;
        createdAt: string;
    };
    isVerified?: boolean
    firstName: string;
    lastName: string;
    fullName?: string;
    avatarUrl?: string;
    addresses?: IConsumerAddress[];
    createdAt?: string;
    updatedAt?: string;
    __v?: number;
}



