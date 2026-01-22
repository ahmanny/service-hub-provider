// components/onboarding/OnboardingHeader.tsx
import { useThemeColor } from "@/hooks/use-theme-color";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ThemedText } from "../ui/Themed";

export function OnboardingHeader({ step }: { step: number }) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const progress = (step / 8) * 100;

  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const tintColor = useThemeColor({}, "tint");
  const tintLight = useThemeColor({}, "tintLight");

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top,
          paddingBottom: 10,
          backgroundColor: backgroundColor,
        },
      ]}
    >
      <View style={styles.content}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={textColor} />
        </TouchableOpacity>

        <View style={styles.progressWrapper}>
          <ThemedText style={[styles.stepText]}>STEP {step} OF 8</ThemedText>
          <View style={[styles.progressBar, { backgroundColor: tintLight }]}>
            <View
              style={[
                styles.progressFill,
                { width: `${progress}%`, backgroundColor: tintColor },
              ]}
            />
          </View>
        </View>

        <View style={{ width: 40 }} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 0,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    height: 56,
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  progressWrapper: {
    alignItems: "center",
    flex: 1,
  },
  stepText: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1.2,
    marginBottom: 4,
  },
  progressBar: {
    height: 7,
    borderRadius: 3,
    width: 100,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 3,
  },
});
