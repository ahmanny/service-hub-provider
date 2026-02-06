import { useProfile } from "@/hooks/useProfile";
import { useAuthStore } from "@/stores/auth.store";
import { useEffect } from "react";

export function GlobalProfileSync() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);
  const login = useAuthStore((s) => s.login);

  // Background fetch only if logged in
  const { data } = useProfile(isAuthenticated, user);

  useEffect(() => {
    if (data?.profile) {
      const serverProfile = data.profile;

      const serverTime = serverProfile.updatedAt
        ? new Date(serverProfile.updatedAt).getTime()
        : 0;
      const localTime = user?.updatedAt
        ? new Date(user.updatedAt).getTime()
        : 0;

      const hasStatusChanged = serverProfile.status !== user?.status;

      const isDataDifferent =
        serverTime === localTime &&
        JSON.stringify(serverProfile) !== JSON.stringify(user);

      if (serverTime > localTime || hasStatusChanged || isDataDifferent) {
        console.log(
          `[Sync] Updating Zustand. Reason: ${
            serverTime > localTime
              ? "Newer Timestamp"
              : hasStatusChanged
                ? "Status Change"
                : "Data Mismatch"
          }`,
        );

        login(serverProfile, data.hasProfile);
      }
    }
  }, [data, user?.updatedAt, user?.status, login]);

  return null;
}
