import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addAddress, updateAddress, deleteAddress } from "@/services/consumer.service"; // Adjust path as needed
import { UserAddressPayload } from "@/types/address.types";

export function useAddressActions() {
  const queryClient = useQueryClient();

  // Helper to refresh all profile-related data
  const invalidateProfile = () => {
    queryClient.invalidateQueries({ queryKey: ["consumer-profile"] });
  };

  //  Add Address Mutation
  const addMutation = useMutation({
    mutationFn: (payload: UserAddressPayload) => addAddress(payload),
    onSuccess: invalidateProfile,
  });

  //  Update Address Mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<UserAddressPayload> }) =>
      updateAddress(id, payload),
    onSuccess: invalidateProfile,
  });

  // Delete Address Mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteAddress(id),
    onSuccess: invalidateProfile,
  });

  return {
    // Actions
    addAddress: addMutation.mutateAsync,
    updateAddress: updateMutation.mutateAsync,
    deleteAddress: deleteMutation.mutateAsync,

    // Loading States
    isAdding: addMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    
    // Global loading state (optional utility)
    isAnyAddressActionPending: 
      addMutation.isPending || 
      updateMutation.isPending || 
      deleteMutation.isPending,
  };
}