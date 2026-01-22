import { ServiceType } from "@/constants/services";
import { BookingStatus } from "./booking.types";



export interface BookingRequest {
    _id: string
    serviceName: string,
    price: number
    scheduledAt: string
    deadlineAt: string
    type: 'home' | 'shop';
    status: BookingStatus
    serviceType: ServiceType,
    distance?: string | number
    consumer: {
        firstName: string,
        profilePicture: string
    }
}



export interface DashboardData {
    todayStats: {
        earnings: number;
        completedJobs: number;
    };
    upcomingBookings: {
        total: number,
        list: Array<{
            id: string;
            title: string;
            time: string;
        }>;
    },

    pendingBooking: {
        total: number,
        list: BookingRequest[]
    }

}