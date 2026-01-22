import { TabType } from "@/components/home/CategoryTabs";
import { ServiceType } from "@/constants/services";

export interface IAvailabilityDay {
  dayOfWeek: number; // 0 (Sun) to 6 (Sat)
  slots: { start: string; end: string }[]; // "09:00" to "17:00"
  isClosed: boolean;
}
export interface IBookedSlot {
  date: string; // "YYYY-MM-DD"
  startTime: string; // 14:00
}

export interface IProviderService {
  name: string;
  value: string;
  price: number;
}

export interface IProviderShopAddress {
  address: string;
  city?: string;
  state?: string;
  location: {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
  };
}

export type IProviderAvailaibility = "instant" | "schedule" | "offline";

export interface IProviderProfile {
  _id: string;
  userId: string;
  firstName: string;
  lastName?: string;
  profilePicture?: string | null;
  isAvailable: boolean;
  availabilityMode: IProviderAvailaibility;
  serviceType: ServiceType;
  basePriceFrom: number;
  homeServiceAvailable: boolean;
  services: IProviderService[];
  rating: number;
  isVerified: boolean;
  shopAddress?: IProviderShopAddress;
  availability: IAvailabilityDay[];
  bookedSlots?: IBookedSlot[];

  yearsOfExperience?: number;
  reviewCount?: number;
  distance?: number;
}
export interface ProviderListItem {
  _id: string;
  firstName: string;
  serviceType: ServiceType;
  availabilityMode: IProviderAvailaibility
  basePrice: number;
  rating: number;
  profilePicture?: string | null;
  distance: number | null;               // in meters
  duration: number | null;               // in seconds
  isClosest: boolean;
}












export interface ProviderProfile {
  _id: string;
  firstName: string;
  lastName: string;
  service: string;
  price: number;
  rating: number;
  location: {
    latitude: number;
    longitude: number;
  };
  profilePicture?: string | null; // optional, can be null
}

export interface ProviderWithRoute extends ProviderProfile {
  distance: number | null;               // in meters
  duration: number | null;               // in seconds
  directionCoordinates: any | null;      // geometry coordinates from directions API
  isCloser: boolean;                     // true for the nearest provider
}




export interface ProviderSearchResult {
  _id: string;
  firstName: string;
  serviceType: ServiceType;
  availabilityMode: "instant" | "schedule" | "offline";
  price: number;
  homeServiceFee?: number | null
  serviceName: string;
  rating: number;
  profilePicture?: string | null;
  distance: number | null;               // in meters
  duration: number | null;               // in seconds
  directionCoordinates: any | null;      // geometry coordinates from directions API
  isClosest: boolean;
}

export type ProvidersDashboardData = Record<ServiceType, ProviderListItem[]>;


export interface SearchProvidersParams {
  serviceType: TabType;
  lat: number;
  lng: number;
}

export interface BookingSetupInfo {
  service: string;
  locationType: "shop" | "home" | string | null;
  bookingDateTime: string;
  locationSource?: "manual" | "current" | null;
  addressText?: string | null;
  note?: string | null;
}