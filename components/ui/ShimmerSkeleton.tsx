import { useThemeColor } from "@/hooks/use-theme-color";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  DimensionValue,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";

type Props = {
  width: DimensionValue;
  height: DimensionValue;
  borderRadius?: number;
  style?: ViewStyle;
};

export function ShimmerSkeleton({
  width,
  height,
  borderRadius = 8,
  style,
}: Props) {
  const translateX = useRef(new Animated.Value(0)).current;

  const baseColor = useThemeColor({}, "border");
  const highlightColor = useThemeColor({}, "placeholder");

  useEffect(() => {
    Animated.loop(
      Animated.timing(translateX, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const shimmerTranslate = translateX.interpolate({
    inputRange: [0, 1],
    outputRange: [-150, 150],
  });

  return (
    <View
      style={[
        styles.container,
        {
          width,
          height,
          borderRadius,
          backgroundColor: baseColor,
        },
        style,
      ]}
    >
      <Animated.View
        style={[
          styles.shimmer,
          {
            backgroundColor: highlightColor,
            transform: [{ translateX: shimmerTranslate }],
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
  },
  shimmer: {
    width: "40%",
    height: "100%",
    opacity: 0.6,
    transform: [{ skewX: "-20deg" }],
  },
});
