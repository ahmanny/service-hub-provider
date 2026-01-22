import { useNetworkStore } from "@/stores/network.store";
import { StyleSheet, Text, View } from "react-native";

export const OfflineBanner = () => {
  const isConnected = useNetworkStore((s) => s.isConnected);

  if (isConnected) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.text}>No Internet Connection</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    width: "100%",
    backgroundColor: "#dc2626", // red-600 equivalent
    paddingVertical: 8,
    zIndex: 50,
    alignItems: "center",
  },
  text: {
    color: "#ffffff",
    textAlign: "center",
    fontWeight: "500",
  },
});
