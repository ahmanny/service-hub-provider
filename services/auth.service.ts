import API from "@/lib/axios";
import { getRefreshToken } from "@/stores/auth.tokens";

// email
export const sendotp = async (payload: { phone: string }) => {
    const { data } = await API.post("/auth/provider/send-otp", payload);
    return data
};
export const resendotp = async (payload: { phone: string }) => {
    const { data } = await API.post("/auth/provider/resend-otp", payload);
    return data
};
export const verifyotp = async (payload: { phone: string, otp: string }) => {
    console.log(payload)
    const { data } = await API.post("/auth/provider/verify-otp", payload);
    return data
};
export const getotpcooldown = async (payload: { phone: string }) => {
    const { data } = await API.post("/auth/provider/get-otp-cooldown", payload);
    return data
};



export const logout = async () => {
    const refresh_token = await getRefreshToken()
    console.log("refresh_token:", refresh_token)
    const { data } = await API.post("/auth/provider/logout", { refresh_token });
    return data
};
