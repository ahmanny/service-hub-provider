import { useThemeColor } from "@/hooks/use-theme-color";
import React from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ThemedModal } from "../ui/Themed";

interface Props {
  setService: React.Dispatch<React.SetStateAction<string | null>>;
  service: string | null;
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  services: {
    value: string;
    name: string;
  }[];
}

export default function SelectServiceModal({
  showModal,
  setShowModal,
  service,
  setService,
  services,
}: Props) {
  const text = useThemeColor({}, "text");
  const muted = useThemeColor({}, "placeholder");
  const border = useThemeColor({}, "border");

  return (
    <ThemedModal visible={showModal} onClose={() => setShowModal(false)}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: text }]}>Select a service</Text>
        <Text style={[styles.subtitle, { color: muted }]}>
          Choose what you want to book
        </Text>
      </View>

      {/* Services */}
      <FlatList
        data={services}
        keyExtractor={(item) => item.value}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => {
          const active = service === item.value;

          return (
            <TouchableOpacity
              activeOpacity={0.8}
              style={[
                styles.item,
                { borderColor: border },
                active && styles.itemActive,
              ]}
              onPress={() => {
                setService(item.value);
                setShowModal(false);
              }}
            >
              <Text
                style={[
                  styles.itemText,
                  { color: text },
                  active && styles.itemTextActive,
                ]}
              >
                {item.name}
              </Text>

              {active && <Text style={styles.check}>✓</Text>}
            </TouchableOpacity>
          );
        }}
      />

      {/* Footer */}
      <TouchableOpacity
        style={styles.cancel}
        onPress={() => setShowModal(false)}
      >
        <Text style={styles.cancelText}>Cancel</Text>
      </TouchableOpacity>
    </ThemedModal>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: 16,
  },

  title: {
    fontSize: 20,
    fontWeight: "700",
  },

  subtitle: {
    marginTop: 4,
    fontSize: 14,
  },

  list: {
    paddingVertical: 4,
  },

  item: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 10,
  },

  itemActive: {
    backgroundColor: "#E8F8F0",
    borderColor: "#0BB45E",
  },

  itemText: {
    fontSize: 16,
    fontWeight: "600",
  },

  itemTextActive: {
    color: "#0BB45E",
  },

  check: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0BB45E",
  },

  cancel: {
    marginTop: 8,
    paddingVertical: 14,
    alignItems: "center",
  },

  cancelText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#FF3B30",
  },
});
