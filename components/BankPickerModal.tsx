import { ThemedText } from "@/components/ui/Themed";
import { BankLogos } from "@/constants/BankLogos";
import { BankInterface, NIGERIAN_BANKS } from "@/data/banks";
import { useThemeColor } from "@/hooks/use-theme-color";
import { Ionicons } from "@expo/vector-icons";
import {
  BottomSheetBackdrop,
  BottomSheetFlatList,
  BottomSheetModal,
  BottomSheetTextInput,
} from "@gorhom/bottom-sheet";
import { Image } from "expo-image";
import React, { forwardRef, useCallback, useMemo, useState } from "react";
import { Platform, Pressable, StyleSheet, View } from "react-native";

interface Props {
  onSelect: (bank: BankInterface) => void;
  selectedBankCode?: string;
}

const ListHeader = ({
  searchQuery,
  setSearchQuery,
  cardBg,
  bg,
  border,
  tint,
  textMuted,
}: any) => (
  <View style={{ backgroundColor: cardBg, paddingBottom: 12 }}>
    <View style={styles.headerIndicator} />
    <ThemedText type="defaultSemiBold" style={styles.title}>
      Select Bank
    </ThemedText>
    <View
      style={[
        styles.searchContainer,
        { backgroundColor: bg, borderColor: border },
      ]}
    >
      <Ionicons name="search" size={18} color={textMuted} />
      <BottomSheetTextInput
        placeholder="Search banks..."
        style={[styles.searchInput, { color: tint }]}
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholderTextColor={textMuted}
      />
    </View>
  </View>
);

export const BankPickerModal = forwardRef<BottomSheetModal, Props>(
  ({ onSelect, selectedBankCode }, ref) => {
    const [searchQuery, setSearchQuery] = useState("");

    const tint = useThemeColor({}, "tint");
    const cardBg = useThemeColor({}, "card");
    const textColor = useThemeColor({}, "text");
    const bg = useThemeColor({}, "background");
    const border = useThemeColor({}, "border");
    const textMuted = useThemeColor({}, "placeholder");

    const snapPoints = useMemo(() => ["50%", "90%"], []);

    const filteredBanks = useMemo(() => {
      return NIGERIAN_BANKS.filter((b) =>
        b.name.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }, [searchQuery]);

    const renderBackdrop = useCallback(
      (props: any) => (
        <BottomSheetBackdrop
          {...props}
          disappearsOnIndex={-1}
          appearsOnIndex={0}
          opacity={0.5}
        />
      ),
      [],
    );

    return (
      <BottomSheetModal
        ref={ref}
        index={1}
        snapPoints={snapPoints}
        backdropComponent={renderBackdrop}
        backgroundStyle={{ backgroundColor: cardBg }}
        handleComponent={null}
        onDismiss={() => setSearchQuery("")}
        keyboardBehavior="fillParent"
        keyboardBlurBehavior="none"
      >
        <ListHeader
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          cardBg={cardBg}
          bg={bg}
          border={border}
          tint={tint}
          textMuted={textMuted}
        />
        <BottomSheetFlatList
          data={filteredBanks}
          keyExtractor={(item: BankInterface) => item.code}
          contentContainerStyle={styles.listContent}
          keyboardShouldPersistTaps="handled"
          renderItem={({ item }: { item: BankInterface }) => (
            <Pressable
              style={styles.bankItem}
              onPress={() => {
                onSelect(item);
                // @ts-ignore
                ref.current?.dismiss();
              }}
            >
              <View style={styles.bankInfo}>
                <View
                  style={[styles.logoContainer, { backgroundColor: "#fff" }]}
                >
                  <Image
                    source={BankLogos[item.slug] || BankLogos["default-image"]}
                    style={styles.logo}
                    contentFit="contain"
                    transition={200}
                    cachePolicy="memory-disk"
                  />
                </View>
                <ThemedText
                  style={[
                    styles.bankName,
                    {
                      color: selectedBankCode === item.code ? tint : textColor,
                    },
                  ]}
                >
                  {item.name}
                </ThemedText>
              </View>
              {selectedBankCode === item.code && (
                <Ionicons name="checkmark-circle" size={24} color={tint} />
              )}
            </Pressable>
          )}
        />
      </BottomSheetModal>
    );
  },
);

const styles = StyleSheet.create({
  headerIndicator: {
    width: 40,
    height: 4,
    backgroundColor: "#E0E0E0",
    borderRadius: 2,
    alignSelf: "center",
    marginTop: 8,
  },
  title: { fontSize: 17, textAlign: "center", marginBottom: 16, marginTop: 12 },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    marginHorizontal: 20,
    height: 50,
    borderRadius: 14,
    borderWidth: 1,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    paddingVertical: Platform.OS === "ios" ? 12 : 0,
  },
  listContent: { paddingBottom: 40 },
  bankItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    marginHorizontal: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#EEEEEE",
  },
  bankInfo: { flexDirection: "row", alignItems: "center", gap: 14 },
  logoContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  logo: { width: 28, height: 28 },
  bankName: { fontSize: 16, fontWeight: "500" },
});
