import { ThemedButton, ThemedText, ThemedView } from "@/components/ui/Themed";
import ThemedInput from "@/components/ui/Themed/ThemedInput";
import { spacing } from "@/constants/Layout";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useOnboardingStore } from "@/stores/onboarding.store";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

export default function BasicProfile() {
  const router = useRouter();
  const { updateFields, firstName, lastName, email, bio, profilePicture } =
    useOnboardingStore();
  const [image, setImage] = useState<string | null>(profilePicture || null);

  // Theme Colors
  const tint = useThemeColor({}, "tint");
  const textSecondary = useThemeColor({}, "textSecondary");
  const border = useThemeColor({}, "border");
  const iconBg = useThemeColor({}, "iconBg");

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      firstName: firstName || "",
      lastName: lastName || "",
      email: email || "",
      bio: bio || "",
    },
  });

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
      updateFields({ profilePicture: result.assets[0].uri });
    }
  };

  const onNext = (data: any) => {
    // Extra safety check
    if (!image) return;

    updateFields(data);
    router.push("/(onboarding)/service-category");
  };

  const isButtonDisabled = !isValid || !image;

  return (
    <ThemedView style={[styles.container]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <ThemedText type="title" style={styles.title}>
          Basic Details
        </ThemedText>

        <View style={styles.avatarSection}>
          <TouchableOpacity
            onPress={pickImage}
            style={[
              styles.avatarCircle,
              { backgroundColor: iconBg, borderColor: image ? tint : border },
            ]}
          >
            {image ? (
              <Image source={{ uri: image }} style={styles.avatarImage} />
            ) : (
              <Ionicons name="camera" size={32} color={tint} />
            )}
            <View style={[styles.plusIcon, { backgroundColor: tint }]}>
              <Ionicons name="add" size={16} color="#fff" />
            </View>
          </TouchableOpacity>
          <ThemedText
            style={[
              styles.avatarLabel,
              { color: image ? textSecondary : tint },
            ]}
          >
            {image ? "Photo uploaded!" : "Upload a professional photo"}
          </ThemedText>

          {!image && (
            <View style={styles.errorContainer}>
              <Ionicons name="alert-circle" size={16} color="#EF4444" />
              <ThemedText type="error" style={styles.errorText}>
                Profile picture is required
              </ThemedText>
            </View>
          )}
        </View>

        <View style={styles.form}>
          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <Controller
                control={control}
                name="firstName"
                rules={{ required: "Required" }}
                render={({ field: { onChange, value } }) => (
                  <ThemedInput
                    label="First Name"
                    placeholder="John"
                    value={value}
                    onChangeText={onChange}
                    error={errors.firstName?.message}
                  />
                )}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Controller
                control={control}
                name="lastName"
                rules={{ required: "Required" }}
                render={({ field: { onChange, value } }) => (
                  <ThemedInput
                    label="Last Name"
                    placeholder="Doe"
                    value={value}
                    onChangeText={onChange}
                    error={errors.lastName?.message}
                  />
                )}
              />
            </View>
          </View>

          <Controller
            control={control}
            name="email"
            rules={{
              required: "Email is required",
              pattern: { value: /^\S+@\S+$/i, message: "Invalid email" },
            }}
            render={({ field: { onChange, value } }) => (
              <ThemedInput
                label="Email Address"
                placeholder="john@example.com"
                value={value}
                onChangeText={onChange}
                keyboardType="email-address"
                autoCapitalize="none"
                error={errors.email?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="bio"
            render={({ field: { onChange, value } }) => (
              <ThemedInput
                label="Short Bio (Optional)"
                placeholder="Briefly describe your expertise..."
                value={value}
                onChangeText={onChange}
                multiline
                style={styles.bioInput}
              />
            )}
          />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <ThemedButton
          title="CONTINUE"
          onPress={handleSubmit(onNext)}
          disabled={isButtonDisabled}
        />
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: spacing.md },
  scrollContent: { paddingTop: 10 },
  title: {
    marginBottom: 40,
  },
  avatarSection: { alignItems: "center", marginBottom: 32 },
  avatarCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    position: "relative",
  },
  avatarImage: { width: 110, height: 110, borderRadius: 55 },
  plusIcon: {
    position: "absolute",
    bottom: 4,
    right: 4,
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#fff",
  },
  avatarLabel: {
    marginTop: 12,
    fontSize: 14,
    fontWeight: "700",
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 3,
    gap: 4,
  },
  errorText: {
    fontSize: 12,
    fontWeight: "600",
  },
  form: { gap: 8 },
  row: { flexDirection: "row", gap: 12 },
  bioInput: { height: 120, textAlignVertical: "top" },
  footer: { paddingBottom: 40, paddingTop: 10 },
});
