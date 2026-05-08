import API from "@/lib/axios";

export interface NotificationItem {
    _id: string;
    userId: string;
    role: "consumer" | "provider";
    title: string;
    body: string;
    type: "welcome" | "booking" | "payment" | "withdrawal" | "approval" | "system";
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

export const getNotifications = async (page: number = 1, limit: number = 20): Promise<NotificationsResponse> => {
    const { data } = await API.get("/provider/notifications", {
        params: { page, limit },
    });
    return data.data;
};

export const getUnreadCount = async (): Promise<{ unreadCount: number }> => {
    const { data } = await API.get("/provider/notifications/unread-count");
    return data.data;
};

export const markNotificationRead = async (notificationId: string) => {
    const { data } = await API.patch(`/provider/notifications/${notificationId}/read`);
    return data.data;
};

export const markAllNotificationsRead = async () => {
    const { data } = await API.patch("/provider/notifications/read-all");
    return data.data;
};