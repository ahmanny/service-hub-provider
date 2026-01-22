import { useThemeColor } from "@/hooks/use-theme-color";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  ImageSourcePropType,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Avatar } from "react-native-paper";

interface AppAvatarProps {
  source?: ImageSourcePropType | null; // Supports both {uri} and require()
  initials?: string;
  size?: number;
  onEdit?: () => void;
  tint?: string;
  shape?: "square" | "rounded";
  style?: any; // To accept custom styles like shadows
}

export const AppAvatar = ({
  source,
  initials = "U",
  size = 140,
  onEdit,
  tint = useThemeColor({}, "tint"),
  shape = "rounded",
  style,
}: AppAvatarProps) => {
  const borderRadius = shape === "rounded" ? size / 2 : size * 0.2;

  const renderContent = () => {
    // If source is provided (either URL or require asset)
    if (source) {
      return (
        <Avatar.Image
          size={size}
          source={source}
          style={[{ borderRadius, backgroundColor: tint + "10" }]}
        />
      );
    }

    // Fallback to Initials if no source is available
    return (
      <Avatar.Text
        size={size}
        label={initials.substring(0, 2).toUpperCase()}
        color={tint}
        style={{ borderRadius, backgroundColor: tint + "10" }}
        labelStyle={{
          fontWeight: "bold",
          letterSpacing: -0.5,
          fontSize: size * 0.35,
        }}
      />
    );
  };

  return (
    <View style={[{ width: size, height: size }, style]}>
      {renderContent()}

      {onEdit && (
        <TouchableOpacity
          style={[styles.editBadge, { backgroundColor: tint }]}
          onPress={onEdit}
          activeOpacity={0.8}
        >
          <Ionicons name="camera" size={size * 0.13} color="white" />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  editBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: "28%",
    height: "28%",
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "white",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
});
