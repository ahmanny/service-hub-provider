import API from "@/lib/axios";
import { UserAddressPayload } from "@/types/address.types";

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
    const { data } = await API.patch("/consumer/update-name", payload);
    return data;
}
export async function updatePhone(payload: { phone: string, otp: string }) {
    const { data } = await API.patch("/consumer/change-phone", payload);
    return data;
}
export async function changeEmail(payload: { email: string }) {
    const { data } = await API.post("/consumer/change-email", payload);
    return data;
}
