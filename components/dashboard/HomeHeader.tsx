import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Href, useRouter } from "expo-router";
import { ThemedText } from "../ui/Themed";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useNotificationCount } from "@/hooks/useNotificationCount";
import { OnlineStatusCard } from "./OnlineStatusCard";

interface Props {
  firstName: string;
  greeting: string;
  isApproved: boolean;
  isOnline: boolean;
}

function NotificationBell() {
  const router = useRouter();
  const { unreadCount } = useNotificationCount();
  const tint = useThemeColor({}, "tint");
  const bg = useThemeColor({}, "background");
  const notificationsRoute = "/(modals)/notifications" as Href;

  return (
    <Pressable
      onPress={() => router.push(notificationsRoute)}
      style={[styles.bellButton, { backgroundColor: bg }]}
    >
      <Ionicons name="notifications-outline" size={24} color={tint} />
      {unreadCount > 0 && (
        <View style={[styles.badge, { backgroundColor: "#ef4444" }]}>
          <Ionicons name="notifications" size={10} color="#fff" />
        </View>
      )}
    </Pressable>
  );
}

export function HomeHeader({
  firstName,
  greeting,
  isApproved,
  isOnline,
}: Props) {
  const bg = useThemeColor({}, "background");

  return (
    <View style={styles.header}>
      <View style={styles.headerTop}>
        <View style={styles.greetingContainer}>
          <ThemedText type="title" style={styles.greeting}>
            {greeting}, {firstName}
          </ThemedText>
        </View>
        <NotificationBell />
      </View>

      <OnlineStatusCard
        isApproved={isApproved}
        isOnline={isOnline}
        width={"100%"}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: { marginBottom: 24 },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  greetingContainer: {
    flex: 1,
  },
  greeting: { fontSize: 23, fontWeight: "900", marginBottom: 20 },
  bellButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  badge: {
    position: "absolute",
    top: 6,
    right: 6,
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: "center",
    alignItems: "center",
  },
});
