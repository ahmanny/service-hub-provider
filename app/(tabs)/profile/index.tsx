import ProfileScreen from "@/components/screens/ProfileScreen";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";

export default function Profile() {
  return (
    <BottomSheetModalProvider>
      <ProfileScreen />
    </BottomSheetModalProvider>
  );
}
