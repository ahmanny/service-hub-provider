import { useThemeColor } from "@/hooks/use-theme-color";
import { useEffect, useRef } from "react";
import { Animated, Easing, Image, StyleSheet, View } from "react-native";

export default function SplashScreen() {
  const logoScale = useRef(new Animated.Value(0.82)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const lineWidth = useRef(new Animated.Value(0)).current;

  const bg = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const lineColor = useThemeColor({}, "tint");
  const lineTrack = useThemeColor({}, "border");

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 500,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(logoScale, {
          toValue: 1,
          duration: 600,
          easing: Easing.out(Easing.back(1.4)),
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(textOpacity, {
        toValue: 1,
        duration: 400,
        easing: Easing.out(Easing.ease),
        useNativeDriver: false,
      }),
    ]).start();

    Animated.timing(lineWidth, {
      toValue: 1,
      duration: 2200,
      easing: Easing.inOut(Easing.quad),
      useNativeDriver: false,
    }).start();
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: bg }]}>
      <View style={styles.center}>
        <Animated.View
          style={{ opacity: logoOpacity, transform: [{ scale: logoScale }] }}
        >
          <Image
            source={require("@/assets/images/splash-icon.png")}
            style={styles.logo}
            resizeMode="contain"
          />
        </Animated.View>

        <Animated.Text
          style={[styles.brand, { color: textColor, opacity: textOpacity }]}
        >
          PROXXI PRO
        </Animated.Text>
      </View>

      <View style={[styles.lineTrack, { backgroundColor: lineTrack }]}>
        <Animated.View
          style={[
            styles.line,
            {
              backgroundColor: lineColor,
              width: lineWidth.interpolate({
                inputRange: [0, 1],
                outputRange: ["0%", "100%"],
              }),
            },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
  logo: {
    width: 140,
    height: 140,
  },
  brand: {
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 10,
  },
  lineTrack: {
    width: "100%",
    height: 3,
  },
  line: {
    height: 3,
  },
});
