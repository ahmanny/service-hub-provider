import PastBookings from "@/components/booking/PastBookings";
import PendingBookings from "@/components/booking/PendingBookings";
import UpcomingBookings from "@/components/booking/UpcomingBookings";
import { ThemedText } from "@/components/ui/Themed";
import { useThemeColor } from "@/hooks/use-theme-color";
import { BookingTab } from "@/types/booking.types";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import Animated, {
  SlideInLeft,
  SlideInRight,
  SlideOutLeft,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

export default function BookingListScreen() {
  const params = useLocalSearchParams<{ tab: string }>();

  const [activeTab, setActiveTab] = useState<BookingTab>(
    (params.tab as BookingTab) || "pending"
  );

  const backgroundColor = useThemeColor({}, "background");

  useEffect(() => {
    if (params.tab) {
      setActiveTab(params.tab as BookingTab);
    }
  }, [params.tab]);
  return (
    <SafeAreaView
      edges={["bottom"]}
      style={{ flex: 1, backgroundColor, paddingHorizontal: 8 }}
    >
      <View style={styles.tabsContainer}>
        {/* pending tab */}
        <Pressable
          style={[styles.tab, activeTab === "pending" && styles.activeTab]}
          onPress={() => setActiveTab("pending")}
        >
          <ThemedText
            style={
              activeTab === "pending"
                ? styles.activeTabText
                : { fontWeight: "700" }
            }
          >
            Pending
          </ThemedText>
        </Pressable>
        {/* upcoming tab */}
        <Pressable
          style={[styles.tab, activeTab === "upcoming" && styles.activeTab]}
          onPress={() => setActiveTab("upcoming")}
        >
          <ThemedText
            style={
              activeTab === "upcoming"
                ? styles.activeTabText
                : { fontWeight: "700" }
            }
          >
            Upcoming
          </ThemedText>
        </Pressable>

        {/* past tab */}
        <Pressable
          style={[styles.tab, activeTab === "past" && styles.activeTab]}
          onPress={() => setActiveTab("past")}
        >
          <ThemedText
            style={
              activeTab === "past"
                ? styles.activeTabText
                : { fontWeight: "700" }
            }
          >
            Past
          </ThemedText>
        </Pressable>
      </View>

      {/* Content */}
      {activeTab === "pending" && (
        <Animated.View
          entering={SlideInLeft.duration(250)}
          exiting={SlideOutLeft.duration(200)}
          style={{ flex: 1 }}
        >
          <PendingBookings />
        </Animated.View>
      )}
      {activeTab === "upcoming" && (
        <Animated.View
          entering={SlideInRight.duration(250)}
          exiting={SlideOutLeft.duration(200)}
          style={{ flex: 1 }}
        >
          <UpcomingBookings />
        </Animated.View>
      )}
      {activeTab === "past" && (
        <Animated.View
          entering={SlideInRight.duration(250)}
          exiting={SlideOutLeft.duration(200)}
          style={{ flex: 1 }}
        >
          <PastBookings />
        </Animated.View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  tabsContainer: {
    flexDirection: "row",
    marginVertical: 12,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#0BB45E", // highlight color
  },
  activeTabText: {
    fontWeight: "700",
    color: "#0BB45E",
  },
});
