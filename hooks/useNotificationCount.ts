import { useState, useEffect, useCallback } from "react";
import { getUnreadCount } from "@/services/notification.service";

export const useNotificationCount = () => {
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(true);

    const fetchCount = useCallback(async () => {
        try {
            const result = await getUnreadCount();
            setUnreadCount(result.unreadCount);
        } catch (error) {
            console.error("Failed to fetch notification count:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCount();
    }, [fetchCount]);

    const refresh = useCallback(() => {
        setLoading(true);
        fetchCount();
    }, [fetchCount]);

    return { unreadCount, loading, refresh };
};