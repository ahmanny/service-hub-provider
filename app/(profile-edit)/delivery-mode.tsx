import { ThemedButton, ThemedText, ThemedView } from "@/components/ui/Themed";
import ThemedCard from "@/components/ui/Themed/ThemedCard";
import { spacing } from "@/constants/Layout";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useUpdateServiceDeliveryMode } from "@/hooks/useProfile";
import { useAuthStore } from "@/stores/auth.store";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Stack, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

export default function DeliveryModeScreen() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const { mutateAsync, isPending: saving } = useUpdateServiceDeliveryMode();

  const [homeService, setHomeService] = useState(
    user?.homeServiceAvailable ?? false,
  );
  const [shopVisit, setShopVisit] = useState(user?.offersShopVisit ?? false);

  const tint = useThemeColor({}, "tint");
  const textSecondary = useThemeColor({}, "textSecondary");
  const border = useThemeColor({}, "border");

  const handleSave = async () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      await mutateAsync({
        offersHomeService: homeService,
        offersShopVisit: shopVisit,
      });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.back();
    } catch (err: any) {
      Alert.alert("Error", err.message || "Update failed");
    }
  };

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen
        options={{ title: "Delivery Mode", headerBackTitle: "Back" }}
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ThemedText type="title">How do you work?</ThemedText>
        <ThemedText style={[styles.subtitle, { color: textSecondary }]}>
          Update your service delivery preferences.
        </ThemedText>

        <View style={styles.optionsContainer}>
          {/* Home Service */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setHomeService(!homeService)}
          >
            <ThemedCard
              style={[
                styles.card,
                { borderColor: homeService ? tint : border },
              ]}
            >
              <View style={styles.cardRow}>
                <Ionicons
                  name="bicycle"
                  size={24}
                  color={homeService ? tint : textSecondary}
                />
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <ThemedText type="defaultSemiBold">Home Service</ThemedText>
                  <ThemedText style={{ fontSize: 12, color: textSecondary }}>
                    You travel to the client
                  </ThemedText>
                </View>
                <Ionicons
                  name={homeService ? "checkbox" : "square-outline"}
                  size={22}
                  color={tint}
                />
              </View>
            </ThemedCard>
          </TouchableOpacity>

          {/* Shop Visit */}
          <View>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setShopVisit(!shopVisit)}
            >
              <ThemedCard
                style={[
                  styles.card,
                  { borderColor: shopVisit ? tint : border },
                ]}
              >
                <View style={styles.cardRow}>
                  <MaterialCommunityIcons
                    name="storefront"
                    size={24}
                    color={shopVisit ? tint : textSecondary}
                  />
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <ThemedText type="defaultSemiBold">In-Shop</ThemedText>
                    <ThemedText style={{ fontSize: 12, color: textSecondary }}>
                      Clients come to you
                    </ThemedText>
                  </View>
                  <Ionicons
                    name={shopVisit ? "checkbox" : "square-outline"}
                    size={22}
                    color={tint}
                  />
                </View>

                {shopVisit && (
                  <TouchableOpacity
                    style={[
                      styles.addressPicker,
                      { backgroundColor: `${tint}10` },
                    ]}
                    onPress={() => router.push("/(profile-edit)/shop-location")}
                  >
                    <Ionicons name="location" size={16} color={tint} />
                    <ThemedText numberOfLines={1} style={styles.addressText}>
                      {user?.shopAddress?.address || "Set Shop Location"}
                    </ThemedText>
                    <Ionicons name="chevron-forward" size={14} color={tint} />
                  </TouchableOpacity>
                )}
              </ThemedCard>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <ThemedButton
          title="Save Preferences"
          loading={saving}
          disabled={!homeService && !shopVisit}
          onPress={handleSave}
        />
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: spacing.lg },
  subtitle: { marginBottom: 24, fontSize: 15 },
  optionsContainer: { gap: 16 },
  card: { padding: 16, borderRadius: 16, borderWidth: 2 },
  cardRow: { flexDirection: "row", alignItems: "center" },
  addressPicker: {
    marginTop: 12,
    padding: 12,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  addressText: { flex: 1, fontSize: 13, fontWeight: "600" },
  footer: {
    padding: spacing.lg,
    paddingBottom: Platform.OS === "ios" ? 40 : 20,
  },
});
