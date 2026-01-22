import { clearTokens, getAccessToken, getRefreshToken, saveTokens } from "@/stores/auth.tokens";
import { useNetworkStore } from "@/stores/network.store";
import axios, { AxiosError } from "axios";

const API = axios.create({
    baseURL: process.env.EXPO_PUBLIC_API_URL,
    timeout: 15000,
});

// --- MOVE THESE OUTSIDE ---
let isRefreshing = false;
let refreshQueue: ((token: string) => void)[] = [];

const processQueue = (token: string | null) => {
    refreshQueue.forEach((cb) => cb(token!));
    refreshQueue = [];
};
// --------------------------

API.interceptors.request.use(async (config) => {
    const { isConnected, isInternetReachable } = useNetworkStore.getState();
    if (!isConnected || !isInternetReachable) {
        return Promise.reject({
            message: "No internet connection",
            code: "OFFLINE",
        });
    }

    const token = await getAccessToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});



API.interceptors.response.use(
    (response) => response.data,
    async (error: AxiosError<any>) => {
        const originalRequest: any = error.config;

        // 1. Network Guard
        const { isConnected, isInternetReachable } = useNetworkStore.getState();
        if (!isConnected || !isInternetReachable) {
            return Promise.reject({ message: "Offline. Cannot refresh session." });
        }

        // 2. Check for Token Expired Error (Status 401, Code 106)
        if (error.response?.status === 401 && error.response?.data?.code === 106) {

            // If already refreshing, wait in line
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    refreshQueue.push((token: string) => {
                        if (token) {
                            originalRequest.headers.Authorization = `Bearer ${token}`;
                            resolve(API(originalRequest));
                        } else {
                            reject(error);
                        }
                    });
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const refreshToken = await getRefreshToken();
                if (!refreshToken) throw new Error("No refresh token");

                // Note: Use standard axios here to bypass the interceptor for the refresh call
                const { data } = await axios.post(
                    `${process.env.EXPO_PUBLIC_API_URL}/auth/consumer/refresh`,
                    { refresh_token: refreshToken }
                );

                const { access_token, refresh_token } = data.data.tokens;

                // CRITICAL: Wait for SecureStore to finish
                await saveTokens({ accessToken: access_token, refreshToken: refresh_token });

                // Update original request and clear queue
                originalRequest.headers.Authorization = `Bearer ${access_token}`;
                processQueue(access_token);

                return API(originalRequest);
            } catch (refreshError) {
                processQueue(null);
                await clearTokens();
                return Promise.reject({ message: "Session expired", error: refreshError });
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error.response?.data || error.message);
    }
);

export default API;