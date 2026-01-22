import { ThemedButton, ThemedText, ThemedView } from "@/components/ui/Themed";
import ThemedCard from "@/components/ui/Themed/ThemedCard";
import { spacing } from "@/constants/Layout";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useOnboardingStore } from "@/stores/onboarding.store";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

export default function Verification() {
  const router = useRouter();
  const { updateFields, firstName, verification } = useOnboardingStore();

  const [idImage, setIdImage] = useState<string | null>(
    verification?.idUrl || null
  );
  const [selfieImage, setSelfieImage] = useState<string | null>(
    verification?.selfieUrl || null
  );

  const tint = useThemeColor({}, "tint");
  const textSecondary = useThemeColor({}, "textSecondary");
  const border = useThemeColor({}, "border");
  const cardBg = useThemeColor({}, "card");

  // ID Picker (Library is fine for docs)
  const pickIdImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [16, 10],
      quality: 0.8,
    });

    if (!result.canceled) {
      setIdImage(result.assets[0].uri);
    }
  };

  // LIVE Selfie Capture (Using launchCameraAsync to force live action)
  const takeLiveSelfie = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Denied",
        "We need camera access to verify your identity."
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
      cameraType: ImagePicker.CameraType.front,
    });

    if (!result.canceled) {
      setSelfieImage(result.assets[0].uri);
    }
  };

  const captureIdImage = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Denied",
        "Camera access is needed to snap your ID."
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [16, 10],
      quality: 0.8,
    });

    if (!result.canceled) {
      setIdImage(result.assets[0].uri);
    }
  };

  const handleIdPress = () => {
    Alert.alert(
      "Government ID",
      "Choose a method to upload your ID document",
      [
        {
          text: "Take Photo",
          onPress: () => captureIdImage(),
        },
        {
          text: "Choose from Gallery",
          onPress: () => pickIdImage(),
        },
        {
          text: "Cancel",
          style: "cancel",
        },
      ],
      { cancelable: true }
    );
  };

  const onContinue = () => {
    if (!idImage || !selfieImage) return;

    updateFields({
      verification: {
        idUrl: idImage,
        selfieUrl: selfieImage,
      },
    });
    router.push("/(onboarding)/summary");
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <ThemedText type="title">Verification</ThemedText>
          <ThemedText style={[styles.subtitle, { color: textSecondary }]}>
            Verify your identity to unlock booking features and build trust with
            your future clients.
          </ThemedText>
        </View>

        {/*  LIVE SELFIE SECTION - Custom Design */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionLabel}>
            STEP 1: LIVE SELFIE
          </ThemedText>

          {selfieImage ? (
            <View style={styles.selfiePreviewContainer}>
              <Image
                source={{ uri: selfieImage }}
                style={styles.selfieCircle}
              />
              <TouchableOpacity
                style={styles.retakeBadge}
                onPress={takeLiveSelfie}
              >
                <Ionicons name="refresh" size={14} color="#fff" />
                <ThemedText style={styles.retakeText}>RETAKE</ThemedText>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={takeLiveSelfie}
              style={[
                styles.liveCameraCard,
                { backgroundColor: tint + "08", borderColor: tint },
              ]}
            >
              <View
                style={[styles.cameraIconCircle, { backgroundColor: tint }]}
              >
                <Ionicons name="camera" size={32} color="#fff" />
              </View>
              <ThemedText style={[styles.uploadTitle, { color: tint }]}>
                Take Live Selfie
              </ThemedText>
              <ThemedText style={[styles.uploadSub, { color: textSecondary }]}>
                Face the camera directly in a well-lit area
              </ThemedText>
            </TouchableOpacity>
          )}
        </View>

        {/* GOVERNMENT ID UPLOAD */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionLabel}>
            STEP 2: GOVERNMENT ID
          </ThemedText>
          <TouchableOpacity
            onPress={handleIdPress} // Trigger the choice menu
            activeOpacity={0.7}
            style={[
              styles.idUploadCard,
              { borderColor: border, backgroundColor: cardBg },
              idImage && { borderStyle: "solid", borderColor: tint },
            ]}
          >
            {idImage ? (
              <View style={styles.imageWrapper}>
                <Image
                  source={{ uri: idImage }}
                  style={styles.previewImage}
                  resizeMode="cover"
                />
                <TouchableOpacity
                  style={styles.removeBtn}
                  onPress={() => setIdImage(null)}
                >
                  <Ionicons name="close-circle" size={24} color="#ff4444" />
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.uploadPlaceholder}>
                <View
                  style={[
                    styles.iconCircle,
                    { backgroundColor: textSecondary + "10" },
                  ]}
                >
                  <Ionicons
                    name="cloud-upload-outline"
                    size={32}
                    color={textSecondary}
                  />
                </View>
                <ThemedText style={styles.uploadTitle}>
                  Add ID Document
                </ThemedText>
                <ThemedText
                  style={[styles.uploadSub, { color: textSecondary }]}
                >
                  Snap a photo or upload from your library
                </ThemedText>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <ThemedCard style={styles.infoBox}>
          <Ionicons name="shield-checkmark" size={20} color="#4CAF50" />
          <ThemedText style={styles.infoText}>
            {firstName}, your privacy is our priority. These photos are
            encrypted and used strictly for identity verification.
          </ThemedText>
        </ThemedCard>
      </ScrollView>

      <View style={styles.footer}>
        <ThemedButton
          title="COMPLETE VERIFICATION"
          onPress={onContinue}
          disabled={!idImage || !selfieImage}
        />
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: spacing.lg },
  header: { marginTop: 10, marginBottom: 32 },
  subtitle: { fontSize: 15, marginTop: 8, lineHeight: 22, opacity: 0.8 },

  section: { marginBottom: 32 },
  sectionLabel: {
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1.5,
    marginBottom: 16,
    opacity: 0.5,
  },

  // Live Selfie Specific Styles
  liveCameraCard: {
    height: 160,
    borderRadius: 24,
    borderWidth: 2,
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  cameraIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
    // Soft shadow for depth
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  selfiePreviewContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  selfieCircle: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 4,
    borderColor: "#4CAF50",
  },
  retakeBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#333",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: -20, // Overlap the image
  },
  retakeText: { color: "#fff", fontSize: 10, fontWeight: "800" },

  // ID Styles
  idUploadCard: {
    height: 180,
    borderRadius: 24,
    borderWidth: 2,
    borderStyle: "dashed",
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  uploadPlaceholder: { alignItems: "center" },
  uploadTitle: { fontSize: 16, fontWeight: "800", marginBottom: 4 },
  uploadSub: { fontSize: 13, textAlign: "center", paddingHorizontal: 20 },

  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },

  imageWrapper: { width: "100%", height: "100%" },
  previewImage: { width: "100%", height: "100%" },
  removeBtn: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "#fff",
    borderRadius: 12,
  },

  infoBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 16,
    borderRadius: 20,
    marginTop: 8,
  },
  infoText: { flex: 1, fontSize: 12, opacity: 0.7, lineHeight: 18 },

  footer: { paddingBottom: 40, paddingTop: 20 },
});
