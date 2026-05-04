import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

interface Props {
  color: string;
}

export function PulseDot({ color }: Props) {
  const pulse = useSharedValue(0);

  useEffect(() => {
    // Loop the pulse from 0 to 1 every 1000ms
    pulse.value = withRepeat(
      withTiming(1, { duration: 1000 }),
      -1, // Infinite loop
      false, // Do not reverse, just restart
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: interpolate(pulse.value, [0, 1], [1, 2.5]) }],
      opacity: interpolate(pulse.value, [0, 1], [0.6, 0]),
    };
  });

  return (
    <View style={styles.container}>
      {/* The Animated Ring */}
      <Animated.View
        style={[styles.ring, { backgroundColor: color }, animatedStyle]}
      />
      {/* The Solid Center Dot */}
      <View style={[styles.dot, { backgroundColor: color }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    width: 14,
    height: 14,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  ring: {
    position: "absolute",
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
