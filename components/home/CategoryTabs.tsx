import {
  AVAILABLE_SERVICES,
  SERVICE_META,
  ServiceType,
} from "@/constants/services";
import { useThemeColor } from "@/hooks/use-theme-color";
import * as Haptics from "expo-haptics";
import React, { useEffect, useRef, useState } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { ThemedText } from "../ui/Themed";

export type TabType = ServiceType | "all";

export default function CategoryTabs({
  active,
  onSelect,
}: {
  active: TabType;
  onSelect: (val: TabType) => void;
}) {
  const tint = useThemeColor({}, "tint");
  const scrollRef = useRef<ScrollView>(null);

  const [tabLayouts, setTabLayouts] = useState<Record<string, number>>({});

  const tabs: TabType[] = ["all", ...(AVAILABLE_SERVICES as ServiceType[])];

  useEffect(() => {
    const timeout = setTimeout(() => {
      const xPos = tabLayouts[active];
      if (xPos !== undefined && scrollRef.current) {
        scrollRef.current.scrollTo({
          x: Math.max(0, xPos - 20),
          animated: true,
        });
      }
    }, 100);

    return () => clearTimeout(timeout);
  }, [active, tabLayouts]);

  const handlePress = (cat: TabType) => {
    if (Platform.OS !== "web") {
      Haptics.selectionAsync();
    }
    onSelect(cat);
  };

  return (
    <ScrollView
      ref={scrollRef}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {tabs.map((cat) => {
        const isActive = active === cat;
        const label = cat === "all" ? "All" : SERVICE_META[cat].label;

        return (
          <TouchableOpacity
            key={cat}
            onPress={() => handlePress(cat)}
            onLayout={(event) => {
              const { x } = event.nativeEvent.layout;
              setTabLayouts((prev) => ({ ...prev, [cat]: x }));
            }}
            style={[styles.tab, isActive && { backgroundColor: tint }]}
          >
            <ThemedText
              style={[
                styles.tabText,
                isActive && { color: "white", fontWeight: "700" },
              ]}
            >
              {label}
            </ThemedText>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 10,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.05)",
  },
  tabText: {
    fontSize: 14,
    textTransform: "capitalize",
  },
});
