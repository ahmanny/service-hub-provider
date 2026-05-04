import { ThemedText } from "@/components/ui/Themed";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useToggleAvailability } from "@/hooks/useDashboard";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Switch, View } from "react-native";

interface OnlineStatusCardProps {
  isOnline: boolean;
  isApproved: boolean;
  width?: any;
}

export function OnlineStatusCard({
  isOnline: serverIsOnline,
  isApproved,
  width = "90%",
}: OnlineStatusCardProps) {
  const [localIsOnline, setLocalIsOnline] = useState(serverIsOnline);

  const tint = useThemeColor({}, "tint");
  const border = useThemeColor({}, "border");
  const textSecondary = useThemeColor({}, "placeholder");
  const cardBg = useThemeColor({}, "card");

  const { mutate, isPending } = useToggleAvailability();

  useEffect(() => {
    setLocalIsOnline(serverIsOnline);
  }, [serverIsOnline]);

  const handleToggle = (newValue: boolean) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setLocalIsOnline(newValue);

    mutate(undefined, {
      onError: () => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        setLocalIsOnline(!newValue);
      },
    });
  };

  const getStatusDetails = () => {
    if (!isApproved) {
      return {
        label: "Verification Pending",
        subtext: "Approval required to go online",
        icon: "lock-closed" as const,
        color: "#94A3B8",
        bg: "#F1F5F9",
      };
    }
    if (isPending) {
      return {
        label: "Syncing...",
        subtext: "Updating your status",
        icon: "cloud-upload" as const,
        color: tint,
        bg: `${tint}15`,
      };
    }
    if (localIsOnline) {
      return {
        label: "Online",
        subtext: "Visible to clients",
        icon: "flash" as const,
        color: "#10B981",
        bg: "#10B98115",
      };
    }
    return {
      label: "Offline",
      subtext: "Go online to get jobs",
      icon: "moon" as const,
      color: "#64748B",
      bg: "#F1F5F9",
    };
  };

  const status = getStatusDetails();

  return (
    <View
      style={[
        styles.onlineStatusCard,
        { backgroundColor: cardBg, borderColor: border, width: width },
        (!isApproved || isPending) && { opacity: 0.8 },
      ]}
    >
      <View style={styles.statusInfoRow}>
        <View style={[styles.statusIndicator, { backgroundColor: status.bg }]}>
          {isPending ? (
            <ActivityIndicator size="small" color={tint} />
          ) : (
            <Ionicons name={status.icon} size={14} color={status.color} />
          )}
        </View>
        <View>
          <ThemedText style={[styles.statusLabel, { color: status.color }]}>
            {status.label}
          </ThemedText>
          <ThemedText style={[styles.statusSubtext, { color: textSecondary }]}>
            {status.subtext}
          </ThemedText>
        </View>
      </View>

      <Switch
        value={localIsOnline}
        disabled={!isApproved || isPending}
        trackColor={{ false: "#CBD5E1", true: tint }}
        thumbColor="#FFF"
        ios_backgroundColor="#CBD5E1"
        onValueChange={handleToggle}
        style={{ transform: [{ scaleX: 1.1 }, { scaleY: 1.1 }] }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  onlineStatusCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderRadius: 24,
    borderWidth: 1.5,
    marginTop: 10,
  },
  statusInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  statusIndicator: {
    width: 36,
    height: 36,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  statusLabel: {
    fontWeight: "900",
    fontSize: 15,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  statusSubtext: {
    fontSize: 12,
    marginTop: 1,
  },
});
