import { useThemeColor } from "@/hooks/use-theme-color";
import { FontAwesome6, Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { ThemedText } from "../ui/Themed";

export const MenuGroup = ({ title, children }: any) => (
  <View style={styles.menuGroup}>
    <ThemedText style={styles.groupTitle}>{title}</ThemedText>
    <View>{children}</View>
  </View>
);

export const MenuItem = ({
  icon,
  family = "Ionicons",
  label,
  subtitle,
  value,
  onPress,
}: any) => {
  const muted = useThemeColor({}, "placeholder");

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress?.();
  };

  const IconComponent = family === "FontAwesome6" ? FontAwesome6 : Ionicons;

  return (
    <TouchableOpacity style={styles.menuItem} onPress={handlePress}>
      <View style={styles.menuContent}>
        <IconComponent
          name={icon}
          size={family === "FontAwesome6" ? 18 : 22}
          color={muted}
          style={{ width: 24, textAlign: "center" }}
        />

        <View style={styles.labelContainer}>
          <ThemedText style={styles.menuLabel} numberOfLines={1}>
            {label}
          </ThemedText>
          {subtitle && (
            <ThemedText style={styles.menuSubtitle} numberOfLines={1}>
              {subtitle}
            </ThemedText>
          )}
        </View>

        {value && (
          <ThemedText style={styles.menuValue} numberOfLines={1}>
            {value}
          </ThemedText>
        )}
      </View>

      <Ionicons name="chevron-forward" size={18} color="#D1D5DB" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  menuGroup: { marginBottom: 28 },
  groupTitle: {
    fontSize: 12,
    fontWeight: "800",
    textTransform: "uppercase",
    opacity: 0.5,
    letterSpacing: 1,
    marginBottom: 12,
    marginLeft: 4,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(0,0,0,0.05)",
  },
  menuContent: {
    flex: 1, // Takes up all space except chevron
    flexDirection: "row",
    alignItems: "center",
  },
  labelContainer: {
    flex: 1, // This is key: it shrinks to allow 'value' to show
    marginHorizontal: 14,
  },
  menuLabel: {
    fontSize: 16,
    fontWeight: "500",
  },
  menuSubtitle: {
    fontSize: 12,
    opacity: 0.5,
    marginTop: 2,
  },
  menuValue: {
    fontSize: 14,
    opacity: 0.6,
    marginRight: 4,
    maxWidth: "40%",
    textAlign: "right",
  },
});
