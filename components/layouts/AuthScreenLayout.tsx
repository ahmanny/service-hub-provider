import ParallaxScrollView from "@/components/parallax-scroll-view";
import { useThemeColor } from "@/hooks/use-theme-color";
import { Image } from "expo-image";
import { ReactElement } from "react";
import { KeyboardAvoidingView, StyleSheet } from "react-native";

type Props = {
  children: ReactElement;
};

export default function AuthScreenLayout({ children }: Props) {
  const backgroundColor = useThemeColor({}, "background");
  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor }]}
      behavior={"padding"}
    >
      <ParallaxScrollView
        headerImage={
          <Image
            source={require("@/assets/images/partial-react-logo.png")}
            style={styles.logo}
            contentFit="contain"
          />
        }
        headerBackgroundColor={{
          light: "#1E8A4B",
          dark: "#145A32",
        }}
      >
        {children}
      </ParallaxScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  logo: {
    height: 200,
    width: 290,
    position: "absolute",
    bottom: 0,
    left: 0,
  },
});
