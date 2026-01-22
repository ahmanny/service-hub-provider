import { getotpcooldown, resendotp, sendotp, verifyotp } from "@/services/auth.service";
import { useAuthStore } from "@/stores/auth.store";
import { saveTokens } from "@/stores/auth.tokens";
import { useMutation } from "@tanstack/react-query";

export const useSendOtp = () => {
    return useMutation({
        mutationFn: sendotp,
        onSuccess: async (data) => {
            console.log(data)
        },
    });
};
export const useResendOtp = () => {
    return useMutation({
        mutationFn: resendotp,
        onSuccess: async (data) => {
            console.log(data)
        },
    });
};
export const useGetOtpCooldown = () => {
    return useMutation({
        mutationFn: getotpcooldown,
        onSuccess: async (data) => {
            console.log(data)
        },
    });
};


export const useVerifyOtp = () => {
    const setAuthenticated = useAuthStore((state) => state.login);
    return useMutation({
        mutationFn: verifyotp,
        onSuccess: async (data) => {
            const { tokens, hasProfile, profile: user } = data
            const { access_token, refresh_token } = tokens;
            await saveTokens({
                accessToken: access_token,
                refreshToken: refresh_token,
            });
            setAuthenticated(user, hasProfile);
            console.log(data)
        },
    });
};