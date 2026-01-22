import { logout } from "@/services/auth.service";
import { useAuthStore } from "@/stores/auth.store";
import { clearTokens } from "@/stores/auth.tokens";
import { useMutation } from "@tanstack/react-query";

export const useLogout = () => {
    const logUserOut = useAuthStore((state) => state.logout);

    return useMutation({
        mutationFn: logout,
        onSuccess: async () => {
            await clearTokens()
            logUserOut();
        },
        onError: async () => {
            await clearTokens()
            logUserOut();
        }
    });
};
