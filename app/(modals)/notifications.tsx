import { ThemedText } from "@/components/ui/Themed";
import { useThemeColor } from "@/hooks/use-theme-color";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Pressable,
    RefreshControl,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getNotifications, markAllNotificationsRead, markNotificationRead, NotificationItem } from "@/services/notification.service";

const getNotificationIcon = (type: string) => {
    switch (type) {
        case "welcome":
            return "🎉";
        case "booking":
            return "📅";
        case "payment":
            return "💰";
        case "withdrawal":
            return "💸";
        case "approval":
            return "✅";
        case "rejection":
            return "❌";
        default:
            return "🔔";
    }
};

const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
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
    const [refreshing, setRefreshing] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const fetchNotifications = useCallback(async (pageNum: number = 1, isRefresh: boolean = false) => {
        try {
            if (isRefresh) setRefreshing(true);
            else if (pageNum === 1) setLoading(true);
            
            const result = await getNotifications(pageNum, 20);
            
            if (isRefresh || pageNum === 1) {
                setNotifications(result.notifications);
            } else {
                setNotifications(prev => [...prev, ...result.notifications]);
            }
            
            setUnreadCount(result.unreadCount);
            setHasMore(result.pagination.page < result.pagination.pages);
            setPage(pageNum);
        } catch (error) {
            console.error("Failed to fetch notifications:", error);
        } finally {
            setLoading(false);
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
        if (hasMore && !loading) {
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
                <Text style={styles.icon}>{getNotificationIcon(item.type)}</Text>
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
                No notifications yet
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
                    keyExtractor={(item) => item._id}
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
    icon: {
        fontSize: 24,
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