import { changeEmail, completeProfile, fetchBanks, fetchEarningsDashboard, fetchProfile, resolveBankAccount, updateAvailability, updateBio, updateDeliveryMode, updateName, updatePayoutDetails, updatePhone, updateProfilePhoto, updateServiceArea, updateServices, updateShopLocation } from "@/services/profile.service";
import { useAuthStore } from "@/stores/auth.store";
import { SelectedService } from "@/stores/onboarding.store";
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
        // refetchInterval: isPending ? 1000 * 30 : 1000 * 60 * 5,
        refetchInterval: 1000 * 30,
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
            const { profile: result } = data; // result is { hasProfile, profile }

            if (result && result.hasProfile) {
                setUser(result.profile, result.hasProfile);

                queryClient.invalidateQueries({ queryKey: ["profile"] });
            }
        },
    });
};








export const useUpdateName = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateName,
        onSuccess: async () => {
            queryClient.invalidateQueries({ queryKey: ["profile"] });
        },
    });
}
export const useUpdateEmail = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: changeEmail,
        onSuccess: async () => {
            queryClient.invalidateQueries({ queryKey: ["profile"] });
        },
    });
}
export const useUpdatePhone = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updatePhone,
        onSuccess: async () => {
            queryClient.invalidateQueries({ queryKey: ["profile"] });
        },
    });
}

export const useUpdateBio = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateBio,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["profile"] });
        },
    });
};

export const useUpdateServices = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (services: SelectedService[]) => updateServices(services),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["profile"] });
        },
    });
};
export const useUpdateServiceDeliveryMode = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateDeliveryMode,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["profile"] });
        },
    });
};

export const useUpdateShopLocation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateShopLocation,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["profile"] });
        },
    });
};

export const useUpdateServiceArea = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateServiceArea,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["profile"] });
        },
    });
};

export const useUpdateAvailability = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateAvailability,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["profile"] });
        },
    });
};
export const useUpdateProfilePhoto = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateProfilePhoto,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["profile"] });
        },
    });
};

export const useUpdatePayoutDetails = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updatePayoutDetails,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["profile"] });
        },
    });
};

/**
 * Hook to get the list of banks for the picker
 */
export const useBanks = () => {
    return useQuery({
        queryKey: ["banks"],
        queryFn: fetchBanks,
        staleTime: 1000 * 60 * 60 * 24,
    });
};

/**
 * Hook to verify an account number (Mutation is better than Query here 
 * because we don't want to cache results)
 */
export const useResolveBank = () => {
    return useMutation({
        mutationFn: ({ accountNumber, bankCode }: { accountNumber: string; bankCode: string }) =>
            resolveBankAccount(accountNumber, bankCode),
    });
};

export const useEarnings = () => {
    return useQuery({
        queryKey: ["earnings"],
        queryFn: fetchEarningsDashboard,
        staleTime: 1000 * 60 * 5, // 5 minutes
        refetchOnWindowFocus: true,
    });
};