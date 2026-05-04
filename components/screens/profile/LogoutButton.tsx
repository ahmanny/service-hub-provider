import { ThemedText } from "@/components/ui/Themed";
import { useLogout } from "@/hooks/auth/useLogout";
import { useThemeColor } from "@/hooks/use-theme-color";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { ActivityIndicator, StyleSheet, TouchableOpacity } from "react-native";


export function LogoutButton() {
  const { mutateAsync: logout, isPending: isLoggingOut } = useLogout();

  const danger = useThemeColor({}, "danger");

  const onLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };
  return (
    <TouchableOpacity
      style={[styles.btn, { backgroundColor: `${danger}10` }]}
      onPress={onLogout}
      disabled={isLoggingOut}
    >
      {isLoggingOut ? (
        <ActivityIndicator color={danger} />
      ) : (
        <>
          <Ionicons name="log-out-outline" size={22} color={danger} />
          <ThemedText style={[styles.text, { color: danger }]}>Log out</ThemedText>
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 18,
    marginTop: 20,
    borderRadius: 16,
  },
  text: { marginLeft: 10, fontWeight: "700", fontSize: 16 },
});
