import * as SecureStore from "expo-secure-store";

const ACCESS_KEY = "access-token";
const REFRESH_KEY = "refresh-token";

export const saveTokens = async (
    {
        accessToken,
        refreshToken
    }: {
        accessToken: string,
        refreshToken: string
    }
) => {
    await SecureStore.setItemAsync(ACCESS_KEY, accessToken);
    await SecureStore.setItemAsync(REFRESH_KEY, refreshToken);
};

export const getAccessToken = async () => {
    return SecureStore.getItemAsync(ACCESS_KEY);
};

export const getRefreshToken = async () => {
    return SecureStore.getItemAsync(REFRESH_KEY);
};

export const clearTokens = async () => {
    await SecureStore.deleteItemAsync(ACCESS_KEY);
    await SecureStore.deleteItemAsync(REFRESH_KEY);
};
