import API from "@/lib/axios";
import { registerForPushNotificationsAsync } from "@/lib/utils/notifications";
import { useAuthStore } from "@/stores/auth.store";
import * as Notifications from "expo-notifications";
import { useRouter } from "expo-router";
import { useEffect, useRef } from "react";


Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
    }),
});
export const useNotifications = () => {
    const router = useRouter();
    const { isAuthenticated, user } = useAuthStore();

    const notificationListener = useRef<Notifications.EventSubscription | null>(null);
    const responseListener = useRef<Notifications.EventSubscription | null>(null);

    useEffect(() => {
        if (!isAuthenticated || !user) return;

        // Register & Save Token
        registerForPushNotificationsAsync().then((token: string | null) => {
            if (token) {
                API.patch("/provider/save-token", { pushToken: token })
                    .catch(err => console.error("Failed to sync push token", err));
            }
        });

        // Foreground Listener
        notificationListener.current = Notifications.addNotificationReceivedListener(
            (notification) => {
                console.log("Foreground notification data:", notification.request.content.data);
            }
        );

        // Tap/Response Listener
        responseListener.current = Notifications.addNotificationResponseReceivedListener(
            (response) => {
                const data = response.notification.request.content.data as { bookingId?: string, url?: string };

                if (data?.bookingId) {
                    router.push({
                        pathname: "/booking-details/[bookingId]",
                        params: { bookingId: data.bookingId },
                    });
                }
            }
        );

        return () => {
            if (notificationListener.current) {
                notificationListener.current.remove();
            }
            if (responseListener.current) {
                responseListener.current.remove();
            }
        };
    }, [isAuthenticated, user?._id]);
};