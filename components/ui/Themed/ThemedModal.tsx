import { useThemeColor } from "@/hooks/use-theme-color";
import { Pressable, Modal as RNModal } from "react-native";

type ModalProps = {
  visible: boolean;
  onClose?: () => void;
  children: React.ReactNode;
  animationType?: "none" | "fade" | "slide" | undefined;
};

export function ThemedModal({
  visible,
  onClose,
  children,
  animationType = "fade",
}: ModalProps) {
  const background = useThemeColor({}, "background");

  return (
    <RNModal
      transparent
      visible={visible}
      animationType={animationType}
      onRequestClose={onClose} // Android back button
    >
      <Pressable
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.5)",
          justifyContent: "center",
          alignItems: "center",
        }}
        onPress={onClose} // tap outside to close
      >
        <Pressable
          style={{
            width: "90%",
            backgroundColor: background,
            borderRadius: 20,
            padding: 24,
          }}
          onPress={() => {}}
        >
          {children}
        </Pressable>
      </Pressable>
    </RNModal>
  );
}
