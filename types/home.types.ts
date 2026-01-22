export interface HomeData {
    user: {
        firstName: string;
        location?: string;
    };
    upcomingBooking?: {
        serviceName: string;
        scheduledAt: string; // ISO string
        locationType: 'home' | 'provider';
    };
    history: Array<{
        id: string;
        serviceName: string;
        price: number;
        dateText: string;
        locationType: string;
    }>;
}