import { useThemeColor } from "@/hooks/use-theme-color";
import { IProviderService } from "@/types/provider.types";
import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { RadioButton } from "react-native-paper";
import { ThemedText } from "../ui/Themed";

interface Props {
  services: IProviderService[];
  selectedId: string;
  onSelect: (value: string) => void;
}

export default function ServiceSelector({
  services,
  selectedId,
  onSelect,
}: Props) {
  const BRAND_GREEN = useThemeColor({}, "tint");

  return (
    <View style={styles.container}>
      <ThemedText style={styles.title}>Services</ThemedText>

      <RadioButton.Group
        onValueChange={(value) => onSelect(value)}
        value={selectedId}
      >
        {services.map((item) => (
          <Pressable
            key={item.value}
            style={[
              styles.row,
              selectedId === item.value && styles.selectedRow,
            ]}
            onPress={() => onSelect(item.value)}
          >
            <View style={styles.left}>
              <RadioButton.Android
                value={item.value}
                color={BRAND_GREEN}
                uncheckedColor="#CCC"
              />
              <ThemedText
                style={[
                  styles.serviceName,
                  selectedId === item.value && {
                    color: BRAND_GREEN,
                    fontWeight: "700",
                  },
                ]}
              >
                {item.name}
              </ThemedText>
            </View>
            <ThemedText style={styles.price}>
              ₦{item.price.toLocaleString()}
            </ThemedText>
          </Pressable>
        ))}
      </RadioButton.Group>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 20 },
  title: { fontSize: 18, fontWeight: "700", marginBottom: 10 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 10,
    marginVertical: 2,
  },
  selectedRow: {
    backgroundColor: "#0BB45E08",
  },
  left: { flexDirection: "row", alignItems: "center", gap: 8 },
  serviceName: { fontSize: 16, fontWeight: "500" },
  price: { fontSize: 16, fontWeight: "800" },
});
