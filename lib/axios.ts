import { useAuthStore } from "@/stores/auth.store";
import { clearTokens, getAccessToken, getRefreshToken, saveTokens } from "@/stores/auth.tokens";
import { useNetworkStore } from "@/stores/network.store";
import axios, { AxiosError } from "axios";

const API = axios.create({
    baseURL: process.env.EXPO_PUBLIC_API_URL,
    timeout: 15000,
});

let isRefreshing = false;
let refreshQueue: any[] = [];

const processQueue = (token: string | null) => {
    refreshQueue.forEach((prom) => {
        if (token) prom.resolve(token);
        else prom.reject();
    });
    refreshQueue = [];
};

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

        // Network Guard
        const { isConnected, isInternetReachable } = useNetworkStore.getState();
        if (!isConnected || !isInternetReachable) {
            return Promise.reject({ message: "Offline. Cannot refresh session." });
        }

        // Check for Token Expired Error (Status 401, Code 106)
        if (error.response?.status === 401 && !originalRequest._retry) {

            // If the code is specifically "Token Expired"
            if (error.response?.data?.code === 106) {
                if (isRefreshing) {
                    return new Promise((resolve, reject) => {
                        refreshQueue.push({ resolve, reject });
                    })
                        .then((token) => {
                            originalRequest.headers.Authorization = `Bearer ${token}`;
                            return API(originalRequest);
                        })
                        .catch(() => Promise.reject(error));
                }


                originalRequest._retry = true;
                isRefreshing = true;


                try {
                    const refreshToken = await getRefreshToken();
                    if (!refreshToken) throw new Error("No refresh token");

                    const { data } = await axios.post(
                        `${process.env.EXPO_PUBLIC_API_URL}/auth/provider/refresh`,
                        { refresh_token: refreshToken }
                    );

                    const { access_token, refresh_token } = data.data.tokens;

                    await saveTokens({ accessToken: access_token, refreshToken: refresh_token });

                    processQueue(access_token);
                    originalRequest.headers.Authorization = `Bearer ${access_token}`;

                    return API(originalRequest);
                } catch (refreshErr) {
                    processQueue(null);
                    await clearTokens();
                    useAuthStore.getState().logout();
                    return Promise.reject(refreshErr);
                } finally {
                    isRefreshing = false;
                }
            }
        }

        return Promise.reject(error.response?.data || error.message);
    }
);

export default API;