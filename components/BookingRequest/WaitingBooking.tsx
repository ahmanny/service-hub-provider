import { useThemeColor } from "@/hooks/use-theme-color";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";
import { ThemedText } from "../ui/Themed";

type Props = {
  bookingId?: string;
  providerFirstName: string;
  onClose?: () => void;
};

export function WaitingBooking({
  bookingId,
  providerFirstName,
  onClose,
}: Props) {
  const muted = useThemeColor({}, "placeholder");

  return (
    <View style={styles.container}>
      <View style={styles.iconWrap}>
        <Ionicons name="time-outline" size={45} color={muted} />
      </View>

      <ThemedText type="defaultSemiBold" style={styles.title}>
        Booking request sent
      </ThemedText>

      <ThemedText style={[styles.subtitle, { color: muted }]}>
        Waiting for {providerFirstName} to respond…
      </ThemedText>

      <Pressable
        style={styles.viewBtn}
        onPress={() => {
          onClose?.();
          router.push(`/bookings/${bookingId}`);
        }}
      >
        <ThemedText type="defaultSemiBold">View</ThemedText>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 12,
    alignItems: "center",
    gap: 10,
  },

  iconWrap: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "rgba(0,0,0,0.05)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },

  title: {
    fontSize: 18,
  },

  subtitle: {
    fontSize: 14,
    textAlign: "center",
  },

  viewBtn: {
    marginTop: 16,
    paddingVertical: 10,
    paddingHorizontal: 28,
    borderRadius: 999,
    backgroundColor: "rgba(0,0,0,0.08)",
  },
});
