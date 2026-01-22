import { ThemedText } from "@/components/ui/Themed";
import { useLogout } from "@/hooks/auth/useLogout";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useAddressActions } from "@/hooks/useAddressActions";
import { useAuthStore } from "@/stores/auth.store";
import { Ionicons } from "@expo/vector-icons";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { router } from "expo-router";
import React, { useRef, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Switch,
  TouchableOpacity,
  View,
} from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { AddressOptionsSheet } from "../BottomSheets/AddressOptionsSheet";
import { AppAvatar } from "../ui/AppAvatar";

// 1. DEFINE TYPES
interface ProfileData {
  user: {
    firstName: string;
    lastName: string;
    email: string;
    rating: number;
    totalBookings: number;
    isVerified: boolean;
    avatarUrl?: string;
    location?: any;
  };
}

// 2. MOCK DATA OBJECT
const MOCK_DATA: ProfileData = {
  user: {
    firstName: "Solomon",
    lastName: "Ahman",
    email: "solomon@email.com",
    rating: 4.8,
    totalBookings: 12,
    isVerified: false,
    avatarUrl: undefined, // Using initials for now
  },
};

const mockRating = 4.5;
const mockTotalBookings = 12;

export default function ProfileScreen() {
  const [selectedAddress, setSelectedAddress] = useState<any>(null);
  const profile = useAuthStore((s) => s.user);
  const tint = useThemeColor({}, "tint");
  const bg = useThemeColor({}, "background");
  const muted = useThemeColor({}, "placeholder");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const bottomSheetRef = useRef<BottomSheetModal>(null);

  if (!profile) return null;

  const fullName = `${profile.firstName} ${profile.lastName}`;

  const { mutateAsync, isPending } = useLogout();

  const handleAddressPress = (address: any) => {
    setSelectedAddress(address);
    setTimeout(() => {
      bottomSheetRef.current?.present();
    }, 100);
  };
  const handleEditAddress = () => {
    bottomSheetRef.current?.dismiss();
    if (!selectedAddress) return;

    console.log(selectedAddress);
    router.push({
      pathname: "/(tabs)/profile/set-location-modal",
      params: {
        addressId: selectedAddress._id,
        label: selectedAddress.label,
        initialLat: selectedAddress.location.coordinates[1],
        initialLng: selectedAddress.location.coordinates[0],
        edit: "true",
      },
    });
  };

  const { deleteAddress, isDeleting } = useAddressActions();
  const handleDelete = async () => {
    if (!selectedAddress?._id) return;

    try {
      await deleteAddress(selectedAddress._id);
      bottomSheetRef.current?.dismiss();
      // Reset selection after successful delete
      setSelectedAddress(null);
    } catch (error) {
      console.error("Failed to delete address:", error);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: bg }} edges={["top"]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 60 }}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <AppAvatar
            shape="square"
            source={{ uri: profile.avatarUrl }}
            initials={`${profile.firstName[0]}${profile.lastName[0]}`}
            onEdit={() => {}}
          />

          <ThemedText type="defaultSemiBold" style={styles.userName}>
            {fullName}
          </ThemedText>

          <View style={styles.ratingRow}>
            <Ionicons name="star" size={16} color="#FFCC00" />
            <ThemedText style={styles.ratingText}>
              {mockRating} rating{" "}
              <ThemedText style={{ opacity: 0.5 }}>
                ({mockTotalBookings} bookings)
              </ThemedText>
            </ThemedText>
          </View>
        </View>

        {/*VERIFICATION BANNER*/}
        {!profile.isVerified && (
          <TouchableOpacity
            activeOpacity={0.9}
            style={[
              styles.banner,
              { backgroundColor: tint + "15", borderColor: tint + "30" },
            ]}
          >
            <View style={[styles.bannerIcon, { backgroundColor: tint }]}>
              <Ionicons name="shield-checkmark" size={20} color="white" />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <ThemedText type="defaultSemiBold" style={{ fontSize: 14 }}>
                Complete Verification
              </ThemedText>
              <ThemedText style={{ fontSize: 12, opacity: 0.7 }}>
                Get a smoother experience and higher trust.
              </ThemedText>
            </View>
            <Ionicons name="chevron-forward" size={18} color={tint} />
          </TouchableOpacity>
        )}

        {/*MENU GROUPS*/}
        <View style={{ paddingHorizontal: 20 }}>
          <MenuGroup title="Account">
            <MenuItem
              icon="person-outline"
              label="Personal info"
              onPress={() =>
                router.push({
                  pathname: "/(tabs)/profile/personal-info",
                })
              }
            />
            {/* <MenuItem icon="card-outline" label="Payments" /> */}
            <MenuItem
              icon="receipt-outline"
              label="Booking history"
              onPress={() =>
                router.push({
                  pathname: "/(tabs)/bookings",
                  params: { tab: "past" },
                })
              }
            />
          </MenuGroup>

          <MenuGroup title="Saved places">
            {profile.addresses && profile.addresses.length > 0 ? (
              profile.addresses.map((item) => (
                <MenuItem
                  key={item._id}
                  icon={
                    item.label === "Home"
                      ? "home-outline"
                      : item.label === "Work"
                      ? "briefcase-outline"
                      : "location-outline"
                  }
                  label={`${item.label} Address`}
                  subtitle={item.formattedAddress}
                  onPress={() => handleAddressPress(item)}
                />
              ))
            ) : (
              <TouchableOpacity
                style={styles.addPlaceBtn}
                activeOpacity={0.6}
                onPress={() =>
                  router.push({
                    pathname: "/(tabs)/profile/set-location-modal",
                    params: { edit: "false", label: "Home" }, // Defaulting to home for new
                  })
                }
              >
                <Ionicons name="add" size={20} color={tint} />
                <ThemedText
                  style={{ color: tint, fontWeight: "600", marginLeft: 4 }}
                >
                  Set Home Address
                </ThemedText>
              </TouchableOpacity>
            )}

            {/* Only render sheet if we have a selection to avoid the "Text strings" error */}
            {selectedAddress && (
              <AddressOptionsSheet
                ref={bottomSheetRef}
                label={selectedAddress.label}
                address={selectedAddress.formattedAddress}
                onEdit={handleEditAddress}
                onDelete={handleDelete}
                isDeleting={isDeleting}
              />
            )}
          </MenuGroup>

          <MenuGroup title="Preferences">
            <MenuItem icon="notifications-outline" label="Notifications" />
            <View style={styles.menuItem}>
              <View style={styles.menuLeft}>
                <Ionicons name="moon-outline" size={22} color={muted} />
                <ThemedText style={[styles.menuLabel, { marginLeft: 28 }]}>
                  Dark mode
                </ThemedText>
              </View>
              <Switch
                value={isDarkMode}
                onValueChange={setIsDarkMode}
                trackColor={{ false: "#D1D5DB", true: tint }}
              />
            </View>
            <MenuItem icon="globe-outline" label="Language" value="English" />
          </MenuGroup>

          <MenuGroup title="Support">
            <MenuItem icon="help-circle-outline" label="Help center" />
            <MenuItem
              icon="chatbubble-ellipses-outline"
              label="Contact support"
            />
            <MenuItem icon="shield-outline" label="Safety" />
          </MenuGroup>

          <MenuGroup title="Legal">
            <MenuItem icon="document-text-outline" label="Terms & conditions" />
            <MenuItem icon="lock-closed-outline" label="Privacy policy" />
          </MenuGroup>

          <TouchableOpacity
            style={[styles.logoutBtn, isPending && { opacity: 0.6 }]}
            activeOpacity={0.7}
            disabled={isPending}
            onPress={() =>
              mutateAsync(
                void {
                  onSuccess: () => {
                    router.push("/(auth)");
                  },
                }
              )
            }
          >
            {isPending ? (
              <ActivityIndicator size="small" color="#FF3B30" />
            ) : (
              <>
                <Ionicons name="log-out-outline" size={22} color="#FF3B30" />
                <ThemedText style={styles.logoutText}>Log out</ThemedText>
              </>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Internal Helper Components

const MenuGroup = ({ title, children }: any) => (
  <View style={styles.menuGroup}>
    <ThemedText style={styles.groupTitle}>{title}</ThemedText>
    <View>{children}</View>
  </View>
);

const MenuItem = ({ icon, label, subtitle, value, onPress }: any) => {
  const muted = useThemeColor({}, "placeholder");

  return (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <View style={styles.menuLeft}>
        <Ionicons name={icon} size={22} color={muted} />
        <View style={{ marginLeft: 14, flex: 1, paddingRight: 8 }}>
          <ThemedText
            style={[styles.menuLabel, subtitle && { marginLeft: 0 }]}
            numberOfLines={1}
          >
            {label}
          </ThemedText>

          {subtitle && (
            <ThemedText
              style={{ fontSize: 13, opacity: 0.5, marginTop: 2 }}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {subtitle}
            </ThemedText>
          )}
        </View>
      </View>

      <View style={styles.menuRight}>
        {value && <ThemedText style={styles.menuValue}>{value}</ThemedText>}
        <Ionicons name="chevron-forward" size={18} color="#D1D5DB" />
      </View>
    </TouchableOpacity>
  );
};

// Styles

const styles = StyleSheet.create({
  header: {
    alignItems: "center",
    paddingVertical: 40,
  },

  userName: { fontSize: 22, marginBottom: 4, marginTop: 16 },
  userEmail: { opacity: 0.5, fontSize: 14 },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.05)",
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  ratingText: { marginLeft: 6, fontSize: 13, fontWeight: "600" },

  banner: {
    marginHorizontal: 20,
    marginBottom: 30,
    padding: 16,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
  },
  bannerIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },

  menuGroup: { marginBottom: 28 },
  groupTitle: {
    fontSize: 12,
    fontWeight: "800",
    textTransform: "uppercase",
    opacity: 0.5,
    letterSpacing: 1,
    marginBottom: 12,
    marginLeft: 4,
  },
  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(0,0,0,0.05)",
  },
  menuLeft: { flexDirection: "row", alignItems: "center" },
  menuLabel: { marginLeft: 14, fontSize: 16 },
  menuRight: { flexDirection: "row", alignItems: "center" },
  menuValue: { marginRight: 8, opacity: 0.5, fontSize: 14 },

  addPlaceBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    marginTop: 4,
  },

  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    marginTop: 10,
    borderRadius: 16,
    backgroundColor: "rgba(255, 59, 48, 0.1)",
  },
  logoutText: {
    marginLeft: 8,
    color: "#FF3B30",
    fontWeight: "700",
    fontSize: 16,
  },
});
