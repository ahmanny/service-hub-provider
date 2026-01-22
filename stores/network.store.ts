import NetInfo from "@react-native-community/netinfo";
import { create } from "zustand";

type NetworkState = {
    isConnected: boolean;
    isInternetReachable: boolean;
    type: string | null;
};

export const useNetworkStore = create<NetworkState>(() => ({
    isConnected: true,
    isInternetReachable: true,
    type: null,
}));

// Start listening once (app bootstrap)
export const initNetworkListener = () => {
    return NetInfo.addEventListener((state) => {
        useNetworkStore.setState({
            isConnected: Boolean(state.isConnected),
            isInternetReachable: Boolean(state.isInternetReachable),
            type: state.type,
        });
    });
};