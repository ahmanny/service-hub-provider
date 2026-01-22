import { fontSize, spacing } from "@/constants/Layout";
import { useThemeColor } from "@/hooks/use-theme-color";
import { Ionicons } from "@expo/vector-icons";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import React, { forwardRef, useMemo } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { ThemedText } from "../ui/Themed";

type Props = {
  label: string;
  address: string;
  onEdit: () => void;
  onDelete: () => void;
  isDeleting?: boolean;
};

export const AddressOptionsSheet = forwardRef<BottomSheetModal, Props>(
  ({ label, address, onEdit, onDelete, isDeleting }, ref) => {
    const bg = useThemeColor({}, "card");
    const textColor = useThemeColor({}, "text");
    const errorColor = useThemeColor({}, "danger");
    const iconBackground = useThemeColor({}, "background");
    const subtextColor = useThemeColor({}, "placeholder");

    const snapPoints = useMemo(() => ["35%"], []);

    const renderBackdrop = (props: any) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        opacity={0.5}
      />
    );

    const handleClose = () => {
      // @ts-ignore
      ref?.current?.dismiss();
    };

    return (
      <BottomSheetModal
        ref={ref}
        index={0}
        snapPoints={snapPoints}
        backdropComponent={renderBackdrop}
        backgroundStyle={{ backgroundColor: bg }}
        handleIndicatorStyle={{ backgroundColor: iconBackground }}
      >
        <BottomSheetView style={styles.content}>
          {/* Header Row: Label + Close Button */}
          <View style={styles.headerRow}>
            <ThemedText type="subtitle" style={styles.label}>
              {label || "Address"}
            </ThemedText>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <Ionicons name="close" size={20} color={textColor} />
            </TouchableOpacity>
          </View>

          {/* Formatted Address Display */}
          <View style={styles.addressContainer}>
            <ThemedText style={[styles.addressText, { color: subtextColor }]}>
              {address || "No address provided"}
            </ThemedText>
          </View>

          <View style={styles.separator} />

          {/* Actions */}
          <View style={styles.optionsContainer}>
            <TouchableOpacity
              style={styles.option}
              onPress={onEdit}
              disabled={isDeleting}
            >
              <View
                style={[
                  styles.iconWrapper,
                  { backgroundColor: iconBackground },
                ]}
              >
                <Ionicons name="location-outline" size={20} color={textColor} />
              </View>
              <ThemedText style={styles.optionText}>Edit Address</ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.option}
              onPress={onDelete}
              disabled={isDeleting}
            >
              <View
                style={[
                  styles.iconWrapper,
                  { backgroundColor: iconBackground },
                ]}
              >
                {isDeleting ? (
                  <ActivityIndicator size="small" color={errorColor} />
                ) : (
                  <Ionicons name="trash-outline" size={20} color={errorColor} />
                )}
              </View>
              <ThemedText style={[styles.optionText, { color: errorColor }]}>
                {isDeleting ? "Deleting..." : "Delete Address"}
              </ThemedText>
            </TouchableOpacity>
          </View>
        </BottomSheetView>
      </BottomSheetModal>
    );
  }
);

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: spacing.xs,
  },
  label: {
    fontSize: fontSize.xl,
    fontWeight: "700",
  },
  closeButton: {
    padding: 4,
  },
  addressContainer: {
    marginTop: spacing.xs,
    marginBottom: spacing.sm,
  },
  addressText: {
    fontSize: fontSize.md,
    lineHeight: 20,
  },
  separator: {
    height: 1,
    backgroundColor: "rgba(150,150,150,0.1)",
    marginVertical: spacing.xs,
  },
  optionsContainer: {
    marginTop: spacing.sm,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.sm,
    gap: spacing.md,
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  optionText: {
    fontSize: 16,
    fontWeight: "500",
  },
});
