import { MenuGroup, MenuItem } from "@/components/profile/ProfileHelpers";
import { SERVICE_META } from "@/constants/services";
import { DAYS_UI } from "@/lib/utils/date.utils";
import { IAvailabilityDay, ProviderProfile } from "@/types/user.types";
import { useRouter } from "expo-router";
import React from "react";
import { View } from "react-native";

interface Props {
  profile: ProviderProfile;
}

export function ProfileTabMenuGroups({ profile }: Props) {
  const router = useRouter();

  const serviceMetaIcon =
    SERVICE_META[profile.serviceType]?.icon || "briefcase-outline";

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
          icon={serviceMetaIcon}
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
          onPress={() => {}} // TODO: Add Review management
        />
        <MenuItem
          icon="bar-chart-outline"
          label="Earnings"
          onPress={() => {}} // TODO: Add Earnings screen
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
    </View>
  );
}
