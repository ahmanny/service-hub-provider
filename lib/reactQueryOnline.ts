import { onlineManager } from "@tanstack/react-query";
import NetInfo from "@react-native-community/netinfo";

export const initReactQueryOnlineManager = () => {
    return onlineManager.setEventListener((setOnline) => {
        return NetInfo.addEventListener((state) => {
            setOnline(
                Boolean(state.isConnected && state.isInternetReachable)
            );
        });
    });
};
