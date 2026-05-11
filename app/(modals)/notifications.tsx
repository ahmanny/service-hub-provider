import { ThemedText } from "@/components/ui/Themed";
import { useThemeColor } from "@/hooks/use-theme-color";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useCallback, useRef, useState } from "react";
import type { ComponentProps } from "react";
import {
    ActivityIndicator,
    FlatList,
    Pressable,
    RefreshControl,
    StyleSheet,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getNotifications, markAllNotificationsRead, markNotificationRead, NotificationItem } from "@/services/notification.service";

type IoniconName = ComponentProps<typeof Ionicons>["name"];

const getNotificationIcon = (type: string): IoniconName => {
    switch (type) {
        case "welcome":
            return "sparkles-outline";
        case "booking":
            return "calendar-outline";
        case "payment":
            return "card-outline";
        case "withdrawal":
            return "wallet-outline";
        case "approval":
            return "checkmark-circle-outline";
        case "rejection":
            return "close-circle-outline";
        default:
            return "notifications-outline";
    }
};

const normalizeNotification = (item: Partial<NotificationItem>): NotificationItem | null => {
    if (!item || typeof item !== "object") return null;

    const id = typeof item._id === "string" ? item._id : String(item._id ?? "");
    if (!id) return null;

    return {
        _id: id,
        userId: typeof item.userId === "string" ? item.userId : String(item.userId ?? ""),
        role: item.role === "consumer" ? "consumer" : "provider",
        title: typeof item.title === "string" ? item.title : "Notification",
        body: typeof item.body === "string" ? item.body : "",
        type: typeof item.type === "string" ? item.type as NotificationItem["type"] : "system",
        data: item.data && typeof item.data === "object" ? item.data : {},
        isRead: Boolean(item.isRead),
        createdAt: typeof item.createdAt === "string" ? item.createdAt : new Date().toISOString(),
        readAt: typeof item.readAt === "string" ? item.readAt : undefined,
    };
};

const getTimeAgo = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return "";

    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
};

export default function NotificationsModal() {
    const router = useRouter();
    const bg = useThemeColor({}, "background");
    const cardBg = useThemeColor({}, "card");
    const tint = useThemeColor({}, "tint");
    const textColor = useThemeColor({}, "text");
    const mutedColor = useThemeColor({}, "textSecondary");

    const [notifications, setNotifications] = useState<NotificationItem[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const fetchingRef = useRef(false);

    const fetchNotifications = useCallback(async (pageNum: number = 1, isRefresh: boolean = false) => {
        if (fetchingRef.current) return;
        fetchingRef.current = true;

        try {
            if (isRefresh) setRefreshing(true);
            else if (pageNum === 1) setLoading(true);
            else setLoadingMore(true);
            
            const result = await getNotifications(pageNum, 20);
            const nextNotifications = Array.isArray(result?.notifications)
                ? result.notifications
                    .map(normalizeNotification)
                    .filter((item): item is NotificationItem => Boolean(item))
                : [];
            const pagination = result?.pagination ?? { page: pageNum, pages: 1 };
            
            if (isRefresh || pageNum === 1) {
                setNotifications(nextNotifications);
            } else {
                setNotifications(prev => {
                    const existingIds = new Set(prev.map(item => item._id));
                    const uniqueNext = nextNotifications.filter(item => !existingIds.has(item._id));
                    return [...prev, ...uniqueNext];
                });
            }
            
            setUnreadCount(Number(result?.unreadCount ?? 0));
            setHasMore(Number(pagination.page ?? pageNum) < Number(pagination.pages ?? 1));
            setPage(pageNum);
        } catch (error) {
            console.error("Failed to fetch notifications:", error);
        } finally {
            fetchingRef.current = false;
            setLoading(false);
            setLoadingMore(false);
            setRefreshing(false);
        }
    }, []);

    React.useEffect(() => {
        fetchNotifications(1);
    }, [fetchNotifications]);

    const handleRefresh = () => {
        fetchNotifications(1, true);
    };

    const handleLoadMore = () => {
        if (hasMore && !loading && !refreshing && !loadingMore && notifications.length >= 20) {
            fetchNotifications(page + 1);
        }
    };

    const handleNotificationPress = async (notification: NotificationItem) => {
        // Mark as read
        if (!notification.isRead) {
            await markNotificationRead(notification._id);
            setNotifications(prev =>
                prev.map(n =>
                    n._id === notification._id ? { ...n, isRead: true } : n
                )
            );
            setUnreadCount(prev => Math.max(0, prev - 1));
        }

        // Navigate based on notification type
        const data = notification.data;
        if (data?.bookingId) {
            router.push({
                pathname: "/booking-details/[bookingId]",
                params: { bookingId: data.bookingId },
            });
        } else if (data?.screen === "Withdraw") {
            router.push("/(modals)/withdraw");
        }
    };

    const handleMarkAllRead = async () => {
        try {
            await markAllNotificationsRead();
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
            setUnreadCount(0);
        } catch (error) {
            console.error("Failed to mark all as read:", error);
        }
    };

    const renderNotification = ({ item }: { item: NotificationItem }) => (
        <Pressable
            onPress={() => handleNotificationPress(item)}
            style={[
                styles.notificationItem,
                { backgroundColor: cardBg },
                !item.isRead && { borderLeftWidth: 3, borderLeftColor: tint },
            ]} 
        >
            <View style={styles.iconContainer}>
                <Ionicons name={getNotificationIcon(item.type)} size={24} color={tint} />
            </View>
            <View style={styles.contentContainer}>
                <View style={styles.headerRow}>
                    <ThemedText
                        style={[styles.title, !item.isRead && { fontWeight: "700" }]}
                        numberOfLines={1}
                    >
                        {item.title}
                    </ThemedText>
                    <ThemedText style={[styles.time, { color: mutedColor }]}>
                        {getTimeAgo(item.createdAt)}
                    </ThemedText>
                </View>
                <ThemedText
                    style={[styles.body, { color: mutedColor }]}
                    numberOfLines={2}
                >
                    {item.body}
                </ThemedText>
            </View>
            {!item.isRead && (
                <View style={[styles.unreadDot, { backgroundColor: tint }]} />
            )}
        </Pressable>
    );

    const renderEmpty = () => (
        <View style={styles.emptyContainer}>
            <Ionicons name="notifications-outline" size={64} color={mutedColor} />
            <ThemedText style={[styles.emptyText, { color: mutedColor }]}>
                No notifications yet update
            </ThemedText>
            <ThemedText style={[styles.emptySubtext, { color: mutedColor }]}>
                You'll see updates about your jobs and earnings here
            </ThemedText>
        </View>
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: bg }]} edges={["top", "bottom"]}>
            {/* Header */}
            <View style={styles.header}>
                <Pressable onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={24} color={textColor} />
                </Pressable>
                <ThemedText type="title" style={styles.headerTitle}>
                    Notifications
                </ThemedText>
                {unreadCount > 0 && (
                    <Pressable onPress={handleMarkAllRead} style={styles.markAllButton}>
                        <ThemedText style={{ color: tint, fontSize: 14 }}>
                            Mark all read
                        </ThemedText>
                    </Pressable>
                )}
            </View>

            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={tint} />
                </View>
            ) : (
                <FlatList
                    data={notifications}
                    renderItem={renderNotification}
                    keyExtractor={(item, index) => item._id || `notification-${index}`}
                    contentContainerStyle={styles.listContent}
                    ListEmptyComponent={renderEmpty}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={handleRefresh}
                            tintColor={tint}
                        />
                    }
                    onEndReached={handleLoadMore}
                    onEndReachedThreshold={0.5}
                    showsVerticalScrollIndicator={false}
                    ListFooterComponent={
                        loadingMore ? (
                            <ActivityIndicator style={styles.footerLoader} color={tint} />
                        ) : null
                    }
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: "rgba(0,0,0,0.1)",
    },
    backButton: {
        padding: 4,
    },
    headerTitle: {
        flex: 1,
        marginLeft: 8,
    },
    markAllButton: {
        paddingHorizontal: 8,
        paddingVertical: 4,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    listContent: {
        padding: 16,
        gap: 12,
    },
    notificationItem: {
        flexDirection: "row",
        alignItems: "flex-start",
        padding: 14,
        borderRadius: 16,
    },
    iconContainer: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
    },
    contentContainer: {
        flex: 1,
    },
    headerRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: 4,
    },
    title: {
        fontSize: 15,
        flex: 1,
        marginRight: 8,
    },
    time: {
        fontSize: 12,
    },
    body: {
        fontSize: 13,
        lineHeight: 18,
    },
    footerLoader: {
        marginVertical: 16,
    },
    unreadDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginLeft: 8,
        marginTop: 4,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingTop: 100,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: "600",
        marginTop: 16,
    },
    emptySubtext: {
        fontSize: 14,
        marginTop: 8,
        textAlign: "center",
        paddingHorizontal: 40,
    },
});
