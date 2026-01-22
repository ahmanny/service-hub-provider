import { ThemedText } from "@/components/ui/Themed";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useToggleAvailability } from "@/hooks/useDashboard";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Switch, View } from "react-native";

interface OnlineStatusCardProps {
  isOnline: boolean;
  isApproved: boolean;
}

export function OnlineStatusCard({
  isOnline: serverIsOnline,
  isApproved,
}: OnlineStatusCardProps) {
  const [localIsOnline, setLocalIsOnline] = useState(serverIsOnline);

  const tint = useThemeColor({}, "tint");
  const border = useThemeColor({}, "border");
  const textSecondary = useThemeColor({}, "textSecondary");
  const iconBg = useThemeColor({}, "iconBg");

  const { mutate, isPending } = useToggleAvailability();

  useEffect(() => {
    setLocalIsOnline(serverIsOnline);
  }, [serverIsOnline]);

  const handleToggle = (newValue: boolean) => {
    setLocalIsOnline(newValue);

    mutate(undefined, {
      onError: (error) => {
        setLocalIsOnline(!newValue);
      },
    });
  };

  const getStatusDetails = () => {
    if (!isApproved) {
      return {
        label: "Verification Pending",
        subtext: "Account must be approved to go online",
        icon: "lock-closed" as const,
        color: "#94A3B8",
      };
    }
    if (isPending) {
      return {
        label: "Updating...",
        subtext: "Syncing with server",
        icon: "cloud-upload" as const,
        color: tint,
      };
    }
    if (localIsOnline) {
      return {
        label: "Available",
        subtext: "Visible to clients",
        icon: "flash" as const,
        color: "#10B981",
      };
    }
    return {
      label: "Offline",
      subtext: "Go online to get jobs",
      icon: "moon" as const,
      color: "#94A3B8",
    };
  };

  const status = getStatusDetails();

  return (
    <View
      style={[
        styles.onlineStatusCard,
        { backgroundColor: iconBg, borderColor: border },
        (!isApproved || isPending) && { opacity: 0.7 },
      ]}
    >
      <View style={styles.statusInfoRow}>
        <View
          style={[styles.statusIndicator, { backgroundColor: status.color }]}
        >
          {isPending ? (
            <ActivityIndicator size="small" color="#FFF" />
          ) : (
            <Ionicons name={status.icon} size={12} color="#FFF" />
          )}
        </View>
        <View>
          <ThemedText style={styles.statusLabel}>{status.label}</ThemedText>
          <ThemedText style={[styles.statusSubtext, { color: textSecondary }]}>
            {status.subtext}
          </ThemedText>
        </View>
      </View>

      <View style={styles.switchContainer}>
        <Switch
          value={localIsOnline}
          disabled={!isApproved || isPending}
          trackColor={{ false: "#CBD5E1", true: tint }}
          thumbColor="#FFF"
          ios_backgroundColor="#CBD5E1"
          onValueChange={handleToggle}
          style={{ transform: [{ scaleX: 1.35 }, { scaleY: 1.35 }] }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  onlineStatusCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 18,
    borderRadius: 24,
    borderWidth: 1,
  },
  statusInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  statusIndicator: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  statusLabel: {
    fontWeight: "800",
    fontSize: 16,
  },
  statusSubtext: {
    fontSize: 12,
  },
  switchContainer: {
    minWidth: 50,
    alignItems: "center",
    justifyContent: "center",
  },
});
