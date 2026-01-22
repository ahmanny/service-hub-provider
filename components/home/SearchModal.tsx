import { useThemeColor } from "@/hooks/use-theme-color";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedText } from "../ui/Themed";

export const SearchModal = ({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) => {
  const bg = useThemeColor({}, "background");
  const tint = useThemeColor({}, "tint");
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (visible) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [visible]);

  return (
    <Modal visible={visible} animationType="fade" transparent={false}>
      <SafeAreaView style={[styles.container, { backgroundColor: bg }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color={tint} />
          </TouchableOpacity>
          <View style={styles.inputWrapper}>
            <TextInput
              ref={inputRef}
              placeholder="Search services or providers..."
              style={styles.input}
              placeholderTextColor="#999"
            />
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
            Recent Searches
          </ThemedText>
          {["Barber", "Plumbing"].map((item) => (
            <TouchableOpacity key={item} style={styles.recentItem}>
              <Ionicons name="time-outline" size={18} color="#999" />
              <ThemedText style={styles.recentText}>{item}</ThemedText>
            </TouchableOpacity>
          ))}

          <ThemedText
            type="defaultSemiBold"
            style={[styles.sectionTitle, { marginTop: 30 }]}
          >
            Popular Services
          </ThemedText>
          <View style={styles.chipContainer}>
            {["Haircut", "AC Repair", "Cleaning", "Massage"].map((chip) => (
              <TouchableOpacity key={chip} style={styles.chip}>
                <ThemedText style={styles.chipText}>{chip}</ThemedText>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(0,0,0,0.1)",
  },
  backBtn: { padding: 8 },
  inputWrapper: { flex: 1, marginLeft: 8 },
  input: { fontSize: 17, height: 40 },
  content: { padding: 20 },
  sectionTitle: {
    fontSize: 14,
    opacity: 0.6,
    textTransform: "uppercase",
    marginBottom: 15,
  },
  recentItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  recentText: { marginLeft: 15, fontSize: 16 },
  chipContainer: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.05)",
  },
  chipText: { fontSize: 14 },
});
