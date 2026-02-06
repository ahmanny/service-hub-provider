import API from "@/lib/axios";
import { SelectedService } from "@/stores/onboarding.store";
import { UserAddressPayload } from "@/types/address.types";
import { IAvailabilityDay } from "@/types/provider.types";
import { IPayoutDetails } from "@/types/user.types";

export const completeProfile = async (payload: FormData) => {
    const { data } = await API.patch("/provider/complete-profile", payload, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return data
};


export async function fetchProfile() {
    const { data } = await API.get("/provider/me");
    return data; // expected { hasProfile: boolean, profile: object | null }
}


export async function addAddress(payload: UserAddressPayload) {
    const { data } = await API.post("/consumer/address", payload);
    return data;
}
export async function updateAddress(addressId: string, payload: Partial<UserAddressPayload>) {
    console.log("payload", payload)
    const { data } = await API.patch(`/consumer/address/${addressId}`, payload);
    return data;
}
export async function deleteAddress(addressId: string) {
    const { data } = await API.delete(`/consumer/address/${addressId}`);
    return data;
}



export async function updateName(payload: { firstName?: string, lastName?: string }) {
    const { data } = await API.patch("/provider/update-name", payload);
    return data;
}
export async function updatePhone(payload: { phone: string, otp: string }) {
    const { data } = await API.patch("/provider/change-phone", payload);
    return data;
}
export async function changeEmail(payload: { email: string }) {
    const { data } = await API.patch("/provider/change-email", payload);
    return data;
}

export async function updateBio(payload: { bio: string }) {
    const { data } = await API.patch("/provider/update-bio", payload);
    return data;
}

export async function updateServices(payload: SelectedService[]) {
    const { data } = await API.patch("/provider/update-services", payload);
    return data;
}

export async function updateDeliveryMode(payload: {
    offersHomeService: boolean;
    offersShopVisit: boolean;
}) {
    const { data } = await API.patch("/provider/update-delivery-mode", payload);
    return data;
}

export async function updateShopLocation(payload: {
    shopAddress: {
        label: string;
        formattedAddress: string;
        city?: string;
        state?: string;
        latitude: number;
        longitude: number;
    };
    offersShopVisit?: boolean;
}) {
    const { data } = await API.patch("/provider/update-shop-location", payload);
    return data;
}

export async function updateServiceArea(payload: {
    serviceArea: {
        formattedAddress: string;
        center: { latitude: number; longitude: number };
    };
    radiusKm: number;
}) {
    const { data } = await API.patch("/provider/update-service-area", payload);
    return data;
}

export async function updateAvailability(payload: {
    availability: IAvailabilityDay[],
    avgServiceTime: number
}) {
    const { data } = await API.patch("/provider/update-availability", payload);
    return data;
}

export async function updatePayoutDetails(payload: IPayoutDetails) {
    const { data } = await API.patch("/provider/update-payout-details", payload);
    return data;
}




export async function updateProfilePhoto(payload: FormData) {
    const { data } = await API.patch("/provider/update-profile-photo", payload, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return data;
}

export async function fetchBanks() {
    const { data } = await API.get("/provider/banks");
    return data.data;
}

/**
 * Verifies account number via your backend (which calls Paystack)
 */
export async function resolveBankAccount(accountNumber: string, bankCode: string) {
    const { data } = await API.get("/provider/resolve-bank", {
        params: { accountNumber, bankCode },
    });
    console.log("resolveBankAccount data", data);
    return data; // returns { accountName, accountNumber }
}

/**
 * Fetches earnings data including chart points and recent transactions
 */
export async function fetchEarningsDashboard() {
    const { data } = await API.get("/provider/earnings-dashboard");

    // console.log("fetchEarningsDashboard data", data);
    return data;
}