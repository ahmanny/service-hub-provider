import { MenuGroup, MenuItem } from "@/components/profile/ProfileHelpers";
import { AppAvatar } from "@/components/ui/AppAvatar";
import { ThemedText } from "@/components/ui/Themed";
import { SERVICE_META } from "@/constants/services";
import { useLogout } from "@/hooks/auth/useLogout";
import { useThemeColor } from "@/hooks/use-theme-color";
import { DAYS_UI } from "@/lib/utils/date.utils";
import { useAuthStore } from "@/stores/auth.store";
import { IAvailabilityDay } from "@/types/provider.types";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileScreen() {
  const router = useRouter();
  const profile = useAuthStore((s) => s.user);

  const tint = useThemeColor({}, "tint");
  const bg = useThemeColor({}, "background");
  const border = useThemeColor({}, "border");
  const success = useThemeColor({}, "success");
  const danger = useThemeColor({}, "danger");
  const warning = useThemeColor({}, "warning");

  const { mutateAsync: logout, isPending: isLoggingOut } = useLogout();

  if (!profile) return null;

  const fullName = `${profile.firstName} ${profile.lastName}`;
  const isApproved = profile.status === "approved";
  const meta = SERVICE_META[profile.serviceType];

  // active days
  const getAvailabilitySubtitle = (availability: IAvailabilityDay[]) => {
    if (!availability || availability.length === 0) return "Not set";

    const activeDays = availability
      .filter((day) => !day.isClosed)
      .map((day) => DAYS_UI[day.dayOfWeek === 0 ? 6 : day.dayOfWeek - 1]); // Adjusting for your DAYS_UI order

    if (activeDays.length === 7) return "Every day";
    if (activeDays.length === 0) return "Closed";
    return activeDays.join(", ");
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: bg }} edges={["top"]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 60 }}
      >
        {/* HEADER SECTION */}
        <View style={styles.header}>
          <AppAvatar
            size={150}
            source={
              profile.profilePicture ? { uri: profile.profilePicture } : null
            }
            initials={`${profile.firstName[0]}${profile.lastName[0]}`}
          />
          <ThemedText type="title" style={styles.userName}>
            {fullName}
          </ThemedText>
          <ThemedText style={styles.serviceType}>{meta.label}</ThemedText>

          <View style={styles.ratingBadge}>
            <Ionicons name="star" size={14} color="#FFCC00" />
            <ThemedText style={styles.ratingText}>
              {profile.rating.toFixed(1)}{" "}
              <ThemedText style={styles.reviewCount}>(128 reviews)</ThemedText>
            </ThemedText>
          </View>

          <View
            style={[
              styles.statusContainer,
              {
                backgroundColor: profile.isAvailable
                  ? `${success}10`
                  : "rgba(0,0,0,0.05)",
                borderColor: profile.isAvailable ? `${success}30` : border,
              },
            ]}
          >
            <View
              style={[
                styles.statusDot,
                { backgroundColor: profile.isAvailable ? success : "#999" },
              ]}
            />
            <View style={{ flex: 1 }}>
              <ThemedText
                style={[
                  styles.statusLabel,
                  { color: profile.isAvailable ? success : undefined },
                ]}
              >
                You are currently {profile.isAvailable ? "Online" : "Offline"}
              </ThemedText>
              <ThemedText style={styles.statusSub}>
                {profile.isAvailable
                  ? "Clients can see you and book your services."
                  : "Your profile is hidden from the marketplace."}
              </ThemedText>
            </View>

            <TouchableOpacity
              onPress={() => router.push("/(tabs)/home")} // Redirect to Home where the actual toggle lives
              style={[
                styles.manageBtn,
                { backgroundColor: profile.isAvailable ? success : "#666" },
              ]}
            >
              <ThemedText style={styles.manageBtnText}>MANAGE</ThemedText>
            </TouchableOpacity>
          </View>
        </View>

        {profile.status !== "approved" && (
          <View
            style={[
              styles.banner,
              {
                backgroundColor:
                  profile.status === "pending" ? `${warning}15` : `${danger}15`,
                borderColor: profile.status === "pending" ? warning : danger,
              },
            ]}
          >
            <Ionicons
              name={
                profile.status === "pending"
                  ? "time-outline"
                  : "alert-circle-outline"
              }
              size={24}
              color={profile.status === "pending" ? warning : danger}
            />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <ThemedText type="defaultSemiBold">
                {profile.status === "pending"
                  ? "Profile Under Review"
                  : "Profile Rejected"}
              </ThemedText>
              <ThemedText style={styles.bannerSubtext}>
                {profile.status === "pending"
                  ? "You can edit details, but you can't accept jobs yet."
                  : profile.rejectionReason ||
                    "Please update your verification details."}
              </ThemedText>
            </View>
          </View>
        )}

        <View style={{ paddingHorizontal: 20 }}>
          {/* BUSINESS GROUP */}
          <MenuGroup title="Business & Services">
            <MenuItem
              icon="person-outline"
              label="Edit Profile"
              subtitle="Name, Email, Phone, Photo, Bio"
              onPress={() => router.push("/(profile-edit)/personal-info")}
            />
            <MenuItem
              family="FontAwesome6"
              icon={meta.icon}
              label="Services & Prices"
              value={`${profile.services?.length || 0} active`}
              onPress={() => router.push("/(profile-edit)/services-prices")}
            />
            <MenuItem
              icon="bicycle-outline"
              label="Delivery Mode"
              subtitle={
                profile.homeServiceAvailable && profile.offersShopVisit
                  ? "Home Service & In-Shop"
                  : profile.homeServiceAvailable
                    ? "Home Service Only"
                    : profile.offersShopVisit
                      ? "In-Shop Only"
                      : "Not set"
              }
              onPress={() => router.push("/(profile-edit)/delivery-mode")}
            />
            <MenuItem
              icon="storefront-outline"
              label="Shop Address"
              subtitle={profile.shopAddress?.address || "Not set"}
              onPress={() => router.push("/(profile-edit)/shop-location")}
            />
            <MenuItem
              icon="map-outline"
              label="Service Area"
              subtitle={profile.serviceArea?.address || "Not set"}
              onPress={() => router.push("/(profile-edit)/service-area")}
            />
            <MenuItem
              icon="calendar-outline"
              label="Availability"
              subtitle={getAvailabilitySubtitle(profile.availability)}
              onPress={() => router.push("/(profile-edit)/availability")}
            />
            <MenuItem
              icon="card-outline"
              label="Payout Details"
              onPress={() => router.push("/(profile-edit)/payout-details")}
            />
          </MenuGroup>

          {/* PERFORMANCE GROUP */}
          <MenuGroup title="Performance">
            <MenuItem
              icon="star-outline"
              label="Reviews & Ratings"
              onPress={() => {}}
            />
            <MenuItem
              icon="bar-chart-outline"
              label="Earnings"
              onPress={() => {}}
            />
            <MenuItem
              icon="time-outline"
              label="Booking History"
              onPress={() =>
                router.push({
                  pathname: "/(tabs)/bookings",
                  params: { tab: "past" },
                })
              }
            />
          </MenuGroup>

          {/* TRUST & SAFETY */}
          <MenuGroup title="Trust & Safety">
            <MenuItem
              icon="id-card-outline"
              label="Identity Verification"
              value={profile.verification ? "Verified" : "Action Required"}
              onPress={() => {}}
            />
            <MenuItem
              icon="document-text-outline"
              label="Terms & Policies"
              onPress={() => {}}
            />
          </MenuGroup>

          {/* SUPPORT */}
          <MenuGroup title="Support">
            <MenuItem
              icon="chatbubble-ellipses-outline"
              label="Contact Support"
              onPress={() => {}}
            />
            <MenuItem
              icon="help-circle-outline"
              label="Help & FAQs"
              onPress={() => {}}
            />
          </MenuGroup>

          {/* LOGOUT */}
          <TouchableOpacity
            style={styles.logoutBtn}
            onPress={() => logout()}
            disabled={isLoggingOut}
          >
            {isLoggingOut ? (
              <ActivityIndicator color={danger} />
            ) : (
              <>
                <Ionicons name="log-out-outline" size={22} color={danger} />
                <ThemedText style={[styles.logoutText, { color: danger }]}>
                  Log out
                </ThemedText>
              </>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: { alignItems: "center", paddingVertical: 30 },
  userName: { fontSize: 24, marginTop: 12 },
  serviceType: { opacity: 0.6, fontSize: 16, marginBottom: 8 },
  ratingBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.05)",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    marginBottom: 20,
  },
  ratingText: { marginLeft: 5, fontWeight: "700", fontSize: 14 },
  reviewCount: { fontWeight: "400", opacity: 0.5 },

  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "90%",
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    marginTop: 10,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  statusLabel: {
    fontWeight: "800",
    fontSize: 14,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  statusSub: {
    fontSize: 12,
    opacity: 0.6,
    marginTop: 2,
  },
  manageBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginLeft: 8,
  },
  manageBtnText: {
    color: "#FFF",
    fontSize: 10,
    fontWeight: "900",
  },
  banner: {
    marginHorizontal: 20,
    marginBottom: 25,
    padding: 16,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
  },
  bannerSubtext: { fontSize: 13, opacity: 0.8, marginTop: 2 },

  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 18,
    marginTop: 10,
    borderRadius: 16,
    backgroundColor: "rgba(255, 59, 48, 0.08)",
  },
  logoutText: { marginLeft: 10, fontWeight: "700", fontSize: 16 },
});
