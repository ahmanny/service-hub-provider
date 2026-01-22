import { changeEmail, completeProfile, fetchProfile, updateName, updatePhone } from "@/services/consumer.service";
import { useAuthStore } from "@/stores/auth.store";
import { ProviderProfile } from "@/types/user.types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";



export const useProfile = (enabled: boolean, user: ProviderProfile | null) => {
    const userId = user?._id;
    const isPending = user?.status === "pending";

    return useQuery({
        queryKey: ["profile", userId],
        queryFn: fetchProfile,
        enabled: enabled && !!userId,
        staleTime: 1000 * 60 * 2,
        refetchInterval: isPending ? 1000 * 30 : 1000 * 60 * 5,
        refetchIntervalInBackground: false,
        refetchOnWindowFocus: true,
    });
};

export const useCompleteProfile = () => {
    const queryClient = useQueryClient();
    const setUser = useAuthStore((state) => state.login);
    return useMutation({
        mutationFn: completeProfile,
        onSuccess: async (data) => {
            const { profile: user } = data
            const hasProfile = Boolean(user)
            setUser(user, hasProfile);
            queryClient.invalidateQueries({ queryKey: ["profile"] });

            console.log(data)
        },
    });
};








export const useUpdateName = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateName,
        onSuccess: async (data) => {
            queryClient.invalidateQueries({ queryKey: ["profile"] });
        },
    });
}
export const useUpdateEmail = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: changeEmail,
        onSuccess: async (data) => {
            queryClient.invalidateQueries({ queryKey: ["profile"] });
        },
    });
}
export const useUpdatePhone = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updatePhone,
        onSuccess: async (data) => {
            queryClient.invalidateQueries({ queryKey: ["profile"] });
        },
    });
}