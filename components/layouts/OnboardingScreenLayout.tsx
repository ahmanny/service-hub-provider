import { useThemeColor } from "@/hooks/use-theme-color";
import { PropsWithChildren } from "react";
import { KeyboardAvoidingView, ScrollView, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Props = PropsWithChildren<{
  contentPaddingBottom?: number;
}>;

export default function OnboardingScreenLayout({
  children,
  contentPaddingBottom = 20,
}: Props) {
  const insets = useSafeAreaInsets();
  const backgroundColor = useThemeColor({}, "background");

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor }]}
      behavior={"padding"}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingBottom: contentPaddingBottom,
          flexGrow: 1,
        }}
        keyboardShouldPersistTaps="handled"
      >
        {children}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
