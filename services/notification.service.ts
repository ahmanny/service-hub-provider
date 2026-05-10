import API from "@/lib/axios";

type ApiEnvelope<T> = {
    data?: T;
    message?: string;
};

export interface NotificationItem {
    _id: string;
    userId: string;
    role: "consumer" | "provider";
    title: string;
    body: string;
    type: "welcome" | "booking" | "payment" | "withdrawal" | "approval" | "rejection" | "system";
    data?: Record<string, any>;
    isRead: boolean;
    createdAt: string;
    readAt?: string;
}

export interface NotificationsResponse {
    notifications: NotificationItem[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
    };
    unreadCount: number;
}

const unwrapApiData = <T>(response: T | ApiEnvelope<T>): T => {
    if (response && typeof response === "object" && "data" in response) {
        return (response as ApiEnvelope<T>).data as T;
    }

    return response as T;
};

export const getNotifications = async (page: number = 1, limit: number = 20): Promise<NotificationsResponse> => {
    const response = await API.get("/provider/notifications", {
        params: { page, limit },
    });
    return unwrapApiData<NotificationsResponse>(response);
};

export const getUnreadCount = async (): Promise<{ unreadCount: number }> => {
    const response = await API.get("/provider/notifications/unread-count");
    return unwrapApiData<{ unreadCount: number }>(response);
};

export const markNotificationRead = async (notificationId: string) => {
    const response = await API.patch(`/provider/notifications/${notificationId}/read`);
    return unwrapApiData(response);
};

export const markAllNotificationsRead = async () => {
    const response = await API.patch("/provider/notifications/read-all");
    return unwrapApiData(response);
};
