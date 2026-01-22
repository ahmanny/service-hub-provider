import { useThemeColor } from "@/hooks/use-theme-color";
import React, { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { ThemedText } from "../ui/Themed";

interface Props {
  bio: string;
}

export default function ProviderBio({ bio }: Props) {
  const [isExpanded, setIsExpanded] = useState(false);
  const tint = useThemeColor({}, "tint");

  const isLongBio = bio.length > 150;
  const displayBio = isExpanded || !isLongBio ? bio : `${bio.slice(0, 150)}...`;

  return (
    <View style={styles.container}>
      <ThemedText style={styles.title}>About</ThemedText>

      <ThemedText style={styles.bioText}>{displayBio}</ThemedText>

      {isLongBio && (
        <Pressable
          onPress={() => setIsExpanded(!isExpanded)}
          style={styles.readMoreBtn}
        >
          <ThemedText style={[styles.readMoreText, { color: tint }]}>
            {isExpanded ? "Show Less" : "Read More"}
          </ThemedText>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginVertical: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8,
  },
  bioText: {
    fontSize: 15,
    lineHeight: 22,
    opacity: 0.7,
  },
  readMoreBtn: {
    marginTop: 6,
  },
  readMoreText: {
    fontWeight: "800",
    fontSize: 14,
  },
});
