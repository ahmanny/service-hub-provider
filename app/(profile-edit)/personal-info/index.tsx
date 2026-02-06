import PersonalInfoScreen from "@/components/screens/PersonalInfoScreen";
import { useThemeColor } from "@/hooks/use-theme-color";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PersonalInfoPage() {
  const backgroundColor = useThemeColor({}, "background");
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor }} edges={["bottom"]}>
      <PersonalInfoScreen />
    </SafeAreaView>
  );
}
