import { FontAwesome6 } from "@expo/vector-icons";

export type ServiceDefinition = {
    name: string;
    value: string;
    minPrice: number;
    maxPrice: number;
};

export type ServiceType =
    | "barber"
    | "hair_stylist"
    | "electrician"
    | "plumber"
    | "house_cleaning";

export const homeBasedServices = ["plumber", "electrician", "house_cleaning"];


export type ServiceMeta = {
    label: string;
    description: string;
    icon: keyof typeof FontAwesome6.glyphMap;
};

export const SERVICE_META: Record<ServiceType, ServiceMeta> = {
    barber: {
        label: "Barber",
        description: "Haircuts and grooming",
        icon: "scissors",
    },
    electrician: {
        label: "Electrician",
        description: "Wiring, lighting, power issues",
        icon: "bolt-lightning",
    },
    house_cleaning: {
        label: "House Cleaner",
        description: "Home and office cleaning",
        icon: "broom",
    },
    hair_stylist: {
        label: "Hair Stylist",
        description: "Styling, braids, treatments",
        icon: "wand-sparkles",
    },
    plumber: {
        label: "Plumber",
        description: "Pipes, leaks, installations",
        icon: "wrench",
    },
};

export const AVAILABLE_SERVICES = Object.keys(SERVICE_META);



export const BARBER_SERVICES: ServiceDefinition[] = [
    { name: "Basic Haircut", value: "basic_haircut", minPrice: 2000, maxPrice: 10000 },
    { name: "Carving", value: "carving", minPrice: 1000, maxPrice: 5000 },
    { name: "Haircut + Beard Trim", value: "haircut_beard", minPrice: 3500, maxPrice: 15000 },
    { name: "Grooming Service", value: "home_grooming", minPrice: 5000, maxPrice: 25000 },
    { name: "Premium Full Grooming", value: "premium_grooming", minPrice: 10000, maxPrice: 50000 },
];

export const HAIR_STYLIST_SERVICES: ServiceDefinition[] = [
    { name: "Hair Coloring", value: "hair_coloring", minPrice: 5000, maxPrice: 40000 },
    { name: "Blow Dry", value: "blow_dry", minPrice: 2000, maxPrice: 10000 },
    { name: "Hair Styling", value: "hair_styling", minPrice: 4000, maxPrice: 30000 },
    { name: "Hair Treatment", value: "hair_treatment", minPrice: 7000, maxPrice: 50000 },
    { name: "Braiding", value: "braiding", minPrice: 5000, maxPrice: 60000 },
];

export const ELECTRICIAN_SERVICES: ServiceDefinition[] = [
    { name: "Wiring & Rewiring", value: "wiring_rewiring", minPrice: 10000, maxPrice: 200000 },
    { name: "Light Fixture Installation", value: "light_fixture", minPrice: 2000, maxPrice: 15000 },
    { name: "Socket & Switch Repair", value: "socket_switch", minPrice: 1500, maxPrice: 10000 },
    { name: "Appliance Repair", value: "appliance_repair", minPrice: 5000, maxPrice: 50000 },
    { name: "Circuit Breaker Installation", value: "circuit_breaker", minPrice: 8000, maxPrice: 40000 },
];

export const PLUMBER_SERVICES: ServiceDefinition[] = [
    { name: "Pipe Installation/Repair", value: "pipe_repair", minPrice: 5000, maxPrice: 100000 },
    { name: "Drain Cleaning", value: "drain_cleaning", minPrice: 3000, maxPrice: 25000 },
    { name: "Leak Fixing", value: "leak_fixing", minPrice: 2000, maxPrice: 20000 },
    { name: "Toilet & Sink Repair", value: "toilet_sink", minPrice: 4000, maxPrice: 35000 },
    { name: "Water Heater Installation", value: "water_heater", minPrice: 10000, maxPrice: 60000 },
];

export const HOUSE_CLEANING_SERVICES: ServiceDefinition[] = [
    { name: "Full House Cleaning", value: "full_house", minPrice: 15000, maxPrice: 150000 },
    { name: "Kitchen Cleaning", value: "kitchen", minPrice: 5000, maxPrice: 30000 },
    { name: "Bathroom Cleaning", value: "bathroom", minPrice: 4000, maxPrice: 25000 },
    { name: "Carpet & Upholstery Cleaning", value: "carpet_upholstery", minPrice: 8000, maxPrice: 50000 },
    { name: "Window Cleaning", value: "window", minPrice: 3000, maxPrice: 20000 },
];

export function getServicesForType(type: ServiceType) {
    switch (type) {
        case "barber":
            return BARBER_SERVICES;
        case "hair_stylist":
            return HAIR_STYLIST_SERVICES;
        case "electrician":
            return ELECTRICIAN_SERVICES;
        case "house_cleaning":
            return HOUSE_CLEANING_SERVICES;
        case "plumber":
            return PLUMBER_SERVICES;
        default:
            return [];
    }
}

export function getService(type: ServiceType) {
    switch (type) {
        case "barber":
            return BARBER_SERVICES;
        case "hair_stylist":
            return HAIR_STYLIST_SERVICES;
        case "electrician":
            return ELECTRICIAN_SERVICES;
        case "house_cleaning":
            return HOUSE_CLEANING_SERVICES;
        case "plumber":
            return PLUMBER_SERVICES;
        default:
            return [];
    }
}

/**
 * Returns true if the service requires choosing between shop or home service.
 */
export function requiresLocationChoice(type: ServiceType): boolean {
    switch (type) {
        case "barber":
        case "hair_stylist":
            return true; // need to ask if it's in-shop or home service
        case "electrician":
        case "plumber":
        case "house_cleaning":
            return false; // usually service is at customer's location
        default:
            return false;
    }
}