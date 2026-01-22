import { View, Modal } from "react-native";
import { useThemeColor } from "@/hooks/use-theme-color";

type BottomSheetProps = {
  visible: boolean;
  children: React.ReactNode;
};

export function BottomSheet({ visible, children }: BottomSheetProps) {
  const background = useThemeColor({}, "card");

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View
        style={{
          flex: 1,
          justifyContent: "flex-end",
          backgroundColor: "rgba(0,0,0,0.4)",
        }}
      >
        <View
          style={{
            backgroundColor: background,
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            padding: 24,
          }}
        >
          {children}
        </View>
      </View>
    </Modal>
  );
}
