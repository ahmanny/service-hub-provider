import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";

interface MapPinProps {
  tint: string;
  isDragging?: boolean;
}

export const MapPin = ({ tint, isDragging }: MapPinProps) => {
  const liftAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(liftAnim, {
      toValue: isDragging ? -18 : 0,
      useNativeDriver: true,
      friction: 6,
      tension: 40,
    }).start();
  }, [isDragging]);

  return (
    <View style={styles.forceVisible}>
      <Animated.View
        style={[
          styles.shadow,
          {
            opacity: isDragging ? 0.3 : 1,
            transform: [{ scale: isDragging ? 0.6 : 1 }],
          },
        ]}
      />

      <Animated.View
        style={{
          alignItems: "center",
          transform: [{ translateY: liftAnim }],
        }}
      >
        <View style={[styles.pinHead, { backgroundColor: tint }]}>
          <View style={styles.innerDot} />
        </View>
        <View style={[styles.stem, { backgroundColor: tint }]} />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  forceVisible: {
    width: 40,
    height: 60,
    alignItems: "center",
    justifyContent: "flex-end",
    backgroundColor: "transparent",
  },
  pinHead: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 3,
    borderColor: "white",
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  innerDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "white",
  },
  stem: {
    width: 4,
    height: 10,
    marginTop: -2,
    borderBottomLeftRadius: 2,
    borderBottomRightRadius: 2,
  },
  shadow: {
    position: "absolute",
    bottom: 2,
    width: 12,
    height: 4,
    backgroundColor: "rgba(0,0,0,0.2)",
    borderRadius: 5,
  },
});
