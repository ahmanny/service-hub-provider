import {
  fetchDashboardData,
  toggleAvailability,
} from "@/services/dashboard.service";
import { DashboardData } from "@/types/dashboard";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetDashboardData = () => {
  return useQuery<DashboardData, Error>({
    queryKey: ["dashboard"],
    queryFn: () => fetchDashboardData(),
  });
};

// mutations
export const useToggleAvailability = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: toggleAvailability,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },

    onError: (error) => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
};
