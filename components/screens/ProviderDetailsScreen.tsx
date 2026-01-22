import * as Haptics from "expo-haptics";
import React, { useRef, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

// Components
import AvailabilityInfo from "@/components/provider-detail/AvailabilityInfo";
import DetailHeader from "@/components/provider-detail/DetailHeader";
import ProviderBio from "@/components/provider-detail/ProviderBio";
import ServiceModeInfo from "@/components/provider-detail/ServiceModeInfo";
import ServiceSelector from "@/components/provider-detail/ServiceSelector";
import StickyBookingBar from "@/components/provider-detail/StickyBookingBar";
import TrustBadges from "@/components/provider-detail/TrustBadges";
import { ThemedView } from "@/components/ui/Themed";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useSendBookingRequest } from "@/hooks/useBooking";
import { IProviderProfile } from "@/types/provider.types";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { RefreshControl } from "react-native-gesture-handler";

export default function ProviderDetailsScreen({
  data,
  isRefetching,
  onRefresh,
}: {
  data: IProviderProfile;
  isRefetching: boolean;
  onRefresh: () => void;
}) {
  const { mutateAsync: sendBooking, isPending } = useSendBookingRequest();
  const sheetRef = useRef<BottomSheetModal>(null);

  const divider = useThemeColor({}, "border");
  const tint = useThemeColor({}, "tint");

  const [selectedServiceValue, setSelectedServiceValue] = useState(
    data.services[0]?.value || ""
  );

  const selectedService = data.services.find(
    (s) => s.value === selectedServiceValue
  );

  const currentPrice = selectedService?.price ?? data.basePriceFrom ?? 0;

  const handleServiceSelect = (value: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedServiceValue(value);
  };

  const handleBookingTrigger = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    sheetRef.current?.present();
    console.log(
      `Booking provider ${data.firstName} for service: ${selectedService?.name} (${selectedServiceValue}) at ₦${currentPrice}`
    );
  };
  return (
    <ThemedView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollBody}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={onRefresh}
            tintColor={tint}
            colors={[tint]}
          />
        }
      >
        <DetailHeader data={data} />

        <View style={[styles.sectionDivider, { backgroundColor: divider }]} />

        <ServiceSelector
          services={data.services}
          selectedId={selectedServiceValue}
          onSelect={handleServiceSelect}
        />

        <View style={[styles.sectionDivider, { backgroundColor: divider }]} />

        <AvailabilityInfo availability={data.availability} />

        <View style={[styles.sectionDivider, { backgroundColor: divider }]} />

        <ServiceModeInfo data={data} />

        <View style={[styles.sectionDivider, { backgroundColor: divider }]} />

        <ProviderBio bio="John is a professional barber with over 6 years of experience, specializing in modern and classic cuts. He is known for his punctuality and attention to detail." />

        <TrustBadges />
      </ScrollView>
      <StickyBookingBar price={currentPrice} onBook={handleBookingTrigger} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollBody: { paddingBottom: 120 },
  sectionDivider: {
    height: 1,
    marginVertical: 10,
    marginHorizontal: 20,
  },
});
