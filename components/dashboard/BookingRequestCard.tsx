// @/components/dashboard/BookingRequestCard.tsx
import { useCountdown } from "@/hooks/use-countdown";
import { useThemeColor } from "@/hooks/use-theme-color";
import { formatBookingDate } from "@/lib/utils/date";
import { BookingRequest } from "@/types/dashboard";
import { Ionicons } from "@expo/vector-icons";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import { router } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";
import { AcceptButton, DeclineButton } from "../booking/BookingActions";
import { ThemedText } from "../ui/Themed";
import ThemedCard from "../ui/Themed/ThemedCard";

dayjs.extend(duration);

export const BookingRequestCard = ({
  request,
}: {
  request: BookingRequest;
}) => {
  const tint = useThemeColor({}, "tint");
  const textSecondary = useThemeColor({}, "textSecondary");
  const borderColor = useThemeColor({}, "border");
  const danger = useThemeColor({}, "danger");
  const buttonSecondary = useThemeColor({}, "buttonSecondary");

  const { timeLeft, isExpired } = useCountdown(request.deadlineAt);

  const handleCardPress = () => {
    router.push(`/booking-details/${request._id}`);
  };

  return (
    <ThemedCard style={[styles.card, { borderColor: borderColor }]}>
      <Pressable
        onPress={handleCardPress}
        style={({ pressed }) => [{ opacity: pressed ? 0.9 : 1 }]}
      >
        <View style={styles.deadlineRow}>
          <View
            style={[
              styles.timerBadge,
              { backgroundColor: isExpired ? `${danger}15` : `${tint}15` },
            ]}
          >
            <Ionicons
              name="timer-outline"
              size={14}
              color={isExpired ? danger : tint}
            />
            <ThemedText
              style={[styles.timerText, { color: isExpired ? danger : tint }]}
            >
              {isExpired ? "Expired" : `Expires in ${timeLeft}`}
            </ThemedText>
          </View>
        </View>

        <View style={styles.topRow}>
          <View>
            <ThemedText style={styles.serviceName}>
              {request.serviceName}
            </ThemedText>
            <ThemedText style={[styles.price, { color: textSecondary }]}>
              ₦{request.price.toLocaleString()}
            </ThemedText>
          </View>

          <View
            style={[styles.typeBadge, { backgroundColor: buttonSecondary }]}
          >
            <Ionicons
              name={request.type === "home" ? "home" : "business"}
              size={12}
              color={tint}
            />
            <ThemedText style={[styles.typeBadgeText, { color: tint }]}>
              {request.type === "home" ? "Home" : "Shop"}
            </ThemedText>
          </View>
        </View>

        <View style={styles.infoRow}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
            <Ionicons name="calendar-outline" size={14} color={textSecondary} />
            <ThemedText style={[styles.infoText, { color: textSecondary }]}>
              {formatBookingDate(request.scheduledAt)}
            </ThemedText>
          </View>
          {request.distance && (
            <>
              <View style={[styles.dot, { backgroundColor: borderColor }]} />

              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 12 }}
              >
                <Ionicons
                  name="navigate-outline"
                  size={14}
                  color={textSecondary}
                />
                <ThemedText style={[styles.infoText, { color: textSecondary }]}>
                  {request.distance}
                </ThemedText>
              </View>
            </>
          )}
        </View>

        <View style={styles.actions}>
          <AcceptButton
            bookingId={request._id}
            disabled={timeLeft === "Expired"}
            label="ACCEPT"
            style={{ height: 44, borderRadius: 12 }}
          />

          <DeclineButton
            bookingId={request._id}
            disabled={timeLeft === "Expired"}
            label="DECLINE"
            style={{ height: 44, borderRadius: 12 }}
          />
        </View>
      </Pressable>
    </ThemedCard>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 24,
    borderWidth: 1,
  },
  deadlineRow: { marginBottom: 12 },
  timerBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  timerText: { fontSize: 12, fontWeight: "700" },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  serviceName: { fontSize: 16, fontWeight: "800" },
  price: { fontSize: 16, fontWeight: "600", marginTop: 2 },
  typeBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  typeBadgeText: { fontSize: 11, fontWeight: "700" },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 6,
    marginTop: 12,
  },
  infoText: { fontSize: 13 },
  dot: { width: 3, height: 3, borderRadius: 2 },
  actions: { flexDirection: "row", gap: 10, marginTop: 18 },
  btn: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  acceptText: { color: "#fff", fontWeight: "800", fontSize: 12 },
  declineBtn: { borderWidth: 1 },
  declineText: { fontWeight: "800", fontSize: 12 },
});
