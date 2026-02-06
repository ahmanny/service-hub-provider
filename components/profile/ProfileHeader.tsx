import { useThemeColor } from "@/hooks/use-theme-color";
import { useUpdateProfilePhoto } from "@/hooks/useProfile";
import * as ImagePicker from "expo-image-picker";
import React from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { AppAvatar } from "../ui/AppAvatar";
import { ThemedText } from "../ui/Themed";

interface ProfileHeaderProps {
  profile: {
    firstName: string;
    lastName: string;
    profilePicture?: string | null;
  };
}

export const ProfileHeader = ({ profile }: ProfileHeaderProps) => {
  const { mutateAsync: updatePhoto, isPending: isUploading } =
    useUpdateProfilePhoto();
  const handleEditPhoto = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") return Alert.alert("Permission Denied", "...");

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.6,
    });

    if (!result.canceled) {
      try {
        const formData = new FormData();
        formData.append("profilePicture", {
          uri: result.assets[0].uri,
          name: "profile.jpg",
          type: "image/jpeg",
        } as any);
        await updatePhoto(formData);
      } catch (e) {
        Alert.alert("Upload Failed", "Try again later");
      }
    }
  };

  return (
    <View style={styles.avatarSection}>
      <View style={styles.avatarContainer}>
        <AppAvatar
          shape="square"
          source={
            profile.profilePicture ? { uri: profile.profilePicture } : null
          }
          initials={`${profile.firstName[0]}${profile.lastName[0]}`}
          onEdit={handleEditPhoto}
        />

        {isUploading && (
          <View style={styles.loaderOverlay}>
            <ActivityIndicator color="#fff" size="large" />
          </View>
        )}
      </View>

      <TouchableOpacity onPress={handleEditPhoto} disabled={isUploading}>
        <ThemedText
          style={[
            styles.changePhotoText,
            { color: useThemeColor({}, "tint") },
            isUploading && { opacity: 0.5 },
          ]}
        >
          {isUploading
            ? "Uploading..."
            : profile.profilePicture
              ? "Change Profile Photo"
              : "Add Profile Photo"}
        </ThemedText>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  avatarSection: {
    alignItems: "center",
    marginVertical: 30,
  },
  avatarContainer: {
    position: "relative",
  },
  loaderOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.4)",
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  changePhotoText: {
    marginTop: 20,
    fontSize: 14,
    fontWeight: "600",
  },
});
